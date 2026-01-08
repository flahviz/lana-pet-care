import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface BlockedSlot {
  id: string;
  blocked_date: string;
  start_time: string | null;
  end_time: string | null;
  is_full_day: boolean;
  reason: string | null;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

const AdminAgenda = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [blockFullDay, setBlockFullDay] = useState(true);
  const [blockStartTime, setBlockStartTime] = useState("08:00");
  const [blockEndTime, setBlockEndTime] = useState("18:00");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [availRes, blockedRes] = await Promise.all([
        supabase.from("availability").select("*").order("day_of_week"),
        supabase.from("blocked_slots").select("*").gte("blocked_date", new Date().toISOString().split('T')[0]).order("blocked_date"),
      ]);

      if (availRes.data) setAvailability(availRes.data);
      if (blockedRes.data) setBlockedSlots(blockedRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const createAvailability = async (dayOfWeek: number) => {
    try {
      const { data, error } = await supabase
        .from("availability")
        .insert({
          day_of_week: dayOfWeek,
          start_time: "08:00",
          end_time: "18:00",
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      
      setAvailability((prev) => [...prev, data]);
      toast.success("Disponibilidade criada");
    } catch (error) {
      console.error("Error creating availability:", error);
      toast.error("Erro ao criar disponibilidade");
    }
  };

  const updateAvailability = async (id: string, updates: Partial<Availability>) => {
    try {
      const { error } = await supabase
        .from("availability")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setAvailability((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      toast.success("Disponibilidade atualizada");
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Erro ao atualizar");
    }
  };

  const addBlockedSlot = async () => {
    if (!selectedDate) {
      toast.error("Selecione uma data");
      return;
    }

    try {
      const { error } = await supabase.from("blocked_slots").insert({
        blocked_date: format(selectedDate, "yyyy-MM-dd"),
        is_full_day: blockFullDay,
        start_time: blockFullDay ? null : blockStartTime,
        end_time: blockFullDay ? null : blockEndTime,
        reason: blockReason || null,
      });

      if (error) throw error;

      toast.success("Bloqueio adicionado");
      setBlockDialogOpen(false);
      setSelectedDate(undefined);
      setBlockReason("");
      setBlockFullDay(true);
      fetchData();
    } catch (error) {
      console.error("Error adding blocked slot:", error);
      toast.error("Erro ao adicionar bloqueio");
    }
  };

  const removeBlockedSlot = async (id: string) => {
    try {
      const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
      if (error) throw error;
      
      setBlockedSlots((prev) => prev.filter((slot) => slot.id !== id));
      toast.success("Bloqueio removido");
    } catch (error) {
      console.error("Error removing blocked slot:", error);
      toast.error("Erro ao remover bloqueio");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
        <p className="text-muted-foreground">Gerencie sua disponibilidade e bloqueios</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidade Semanal</CardTitle>
            <CardDescription>Defina os horários de atendimento para cada dia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const dayAvail = availability.find((a) => a.day_of_week === day.value);
              return (
                <div
                  key={day.value}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    dayAvail?.is_active ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={dayAvail?.is_active ?? false}
                      onCheckedChange={(checked) => {
                        if (dayAvail) {
                          updateAvailability(dayAvail.id, { is_active: checked });
                        } else if (checked) {
                          createAvailability(day.value);
                        }
                      }}
                    />
                    <span className={`font-medium ${dayAvail?.is_active ? "text-foreground" : "text-muted-foreground"}`}>
                      {day.label}
                    </span>
                  </div>
                  {dayAvail?.is_active && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={dayAvail.start_time.slice(0, 5)}
                        onChange={(e) =>
                          updateAvailability(dayAvail.id, { start_time: e.target.value })
                        }
                        className="w-28"
                      />
                      <span className="text-muted-foreground">às</span>
                      <Input
                        type="time"
                        value={dayAvail.end_time.slice(0, 5)}
                        onChange={(e) =>
                          updateAvailability(dayAvail.id, { end_time: e.target.value })
                        }
                        className="w-28"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Blocked Slots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bloqueios</CardTitle>
              <CardDescription>Datas ou horários indisponíveis</CardDescription>
            </div>
            <Button onClick={() => setBlockDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            {blockedSlots.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum bloqueio agendado
              </p>
            ) : (
              <div className="space-y-3">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {format(new Date(slot.blocked_date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {slot.is_full_day
                          ? "Dia inteiro"
                          : `${slot.start_time?.slice(0, 5)} - ${slot.end_time?.slice(0, 5)}`}
                      </p>
                      {slot.reason && (
                        <p className="text-sm text-muted-foreground italic">{slot.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlockedSlot(slot.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Bloqueio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-1">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedDate
                      ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={blockFullDay} onCheckedChange={setBlockFullDay} />
              <Label>Dia inteiro</Label>
            </div>

            {!blockFullDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Início</Label>
                  <Input
                    type="time"
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Fim</Label>
                  <Input
                    type="time"
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label>Motivo (opcional)</Label>
              <Textarea
                placeholder="Ex: Consulta médica, viagem..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addBlockedSlot}>Adicionar Bloqueio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAgenda;
