import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Check, X, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: BookingStatus;
  total_price: number;
  notes: string | null;
  created_at: string;
  profiles: { full_name: string; phone: string | null } | null;
  service_variants: { name: string; services: { name: string } | null } | null;
  addresses: { street: string; number: string; neighborhood: string } | null;
}

const AdminPedidos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("bookings")
        .select(`
          id,
          scheduled_date,
          scheduled_time,
          status,
          total_price,
          notes,
          created_at,
          user_id,
          profiles!inner(full_name, phone),
          service_variants(name, services(name)),
          addresses(street, number, neighborhood)
        `)
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as BookingStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data as unknown as Booking[]);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus, reason?: string) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus === "cancelled") {
        updateData.cancelled_at = new Date().toISOString();
        updateData.cancellation_reason = reason;
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId);

      if (error) throw error;

      toast.success(`Status atualizado para ${statusConfig[newStatus].label}`);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, "cancelled", cancelReason);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      setCancelReason("");
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-800" },
    in_progress: { label: "Em andamento", className: "bg-purple-100 text-purple-800" },
    completed: { label: "Concluído", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
  };

  const filteredBookings = bookings.filter((booking) => {
    const clientName = booking.profiles?.full_name?.toLowerCase() || "";
    const serviceName = booking.service_variants?.services?.name?.toLowerCase() || "";
    return clientName.includes(searchTerm.toLowerCase()) || serviceName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground">Gerencie todos os agendamentos</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setSearchParams(value === "all" ? {} : { status: value });
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredBookings.length} pedido{filteredBookings.length !== 1 ? "s" : ""} encontrado{filteredBookings.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum pedido encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-foreground">
                          {booking.profiles?.full_name || "Cliente"}
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[booking.status]?.className}`}>
                          {statusConfig[booking.status]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-1">
                        {booking.service_variants?.services?.name} - {booking.service_variants?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.scheduled_date), "EEEE, dd 'de' MMMM", { locale: ptBR })} às {booking.scheduled_time.slice(0, 5)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.addresses?.street}, {booking.addresses?.number} - {booking.addresses?.neighborhood}
                      </p>
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          Obs: {booking.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg text-foreground">
                        R$ {booking.total_price.toFixed(2).replace(".", ",")}
                      </p>
                      
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setCancelDialogOpen(true);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateBookingStatus(booking.id, "in_progress")}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        {booking.status === "in_progress" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateBookingStatus(booking.id, "completed")}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Pedido</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Motivo do cancelamento (opcional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPedidos;
