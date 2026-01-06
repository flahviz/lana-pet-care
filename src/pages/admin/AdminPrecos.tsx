import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  base_duration_minutes: number;
  is_active: boolean;
  sort_order: number;
}

interface ServiceVariant {
  id: string;
  service_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  sort_order: number;
}

interface ServiceExtra {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  sort_order: number;
}

interface Settings {
  additional_pet_fee: number;
}

const AdminPrecos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [variants, setVariants] = useState<ServiceVariant[]>([]);
  const [extras, setExtras] = useState<ServiceExtra[]>([]);
  const [settings, setSettings] = useState<Settings>({ additional_pet_fee: 15 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [extraDialogOpen, setExtraDialogOpen] = useState(false);
  const [editingExtra, setEditingExtra] = useState<ServiceExtra | null>(null);
  const [extraForm, setExtraForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, variantsRes, extrasRes, settingsRes] = await Promise.all([
        supabase.from("services").select("*").order("sort_order"),
        supabase.from("service_variants").select("*").order("sort_order"),
        supabase.from("service_extras").select("*").order("sort_order"),
        supabase.from("settings").select("*").eq("key", "additional_pet_fee").single(),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (variantsRes.data) setVariants(variantsRes.data);
      if (extrasRes.data) setExtras(extrasRes.data);
      if (settingsRes.data) {
        setSettings({ additional_pet_fee: Number(settingsRes.data.value) || 15 });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const updateVariantPrice = async (variantId: string, price: number) => {
    try {
      const { error } = await supabase
        .from("service_variants")
        .update({ price })
        .eq("id", variantId);

      if (error) throw error;

      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, price } : v))
      );
      toast.success("Preço atualizado");
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Erro ao atualizar preço");
    }
  };

  const toggleVariantActive = async (variantId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("service_variants")
        .update({ is_active: isActive })
        .eq("id", variantId);

      if (error) throw error;

      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, is_active: isActive } : v))
      );
      toast.success(isActive ? "Variante ativada" : "Variante desativada");
    } catch (error) {
      console.error("Error toggling variant:", error);
      toast.error("Erro ao atualizar");
    }
  };

  const saveExtra = async () => {
    if (!extraForm.name || !extraForm.price) {
      toast.error("Preencha nome e preço");
      return;
    }

    setSaving(true);
    try {
      if (editingExtra) {
        const { error } = await supabase
          .from("service_extras")
          .update({
            name: extraForm.name,
            description: extraForm.description || null,
            price: parseFloat(extraForm.price),
          })
          .eq("id", editingExtra.id);

        if (error) throw error;
        toast.success("Extra atualizado");
      } else {
        const { error } = await supabase.from("service_extras").insert({
          name: extraForm.name,
          description: extraForm.description || null,
          price: parseFloat(extraForm.price),
          sort_order: extras.length,
        });

        if (error) throw error;
        toast.success("Extra adicionado");
      }

      setExtraDialogOpen(false);
      setEditingExtra(null);
      setExtraForm({ name: "", description: "", price: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving extra:", error);
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const toggleExtraActive = async (extraId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("service_extras")
        .update({ is_active: isActive })
        .eq("id", extraId);

      if (error) throw error;

      setExtras((prev) =>
        prev.map((e) => (e.id === extraId ? { ...e, is_active: isActive } : e))
      );
      toast.success(isActive ? "Extra ativado" : "Extra desativado");
    } catch (error) {
      console.error("Error toggling extra:", error);
      toast.error("Erro ao atualizar");
    }
  };

  const updateAdditionalPetFee = async (fee: number) => {
    try {
      const { error } = await supabase
        .from("settings")
        .update({ value: fee })
        .eq("key", "additional_pet_fee");

      if (error) throw error;

      setSettings({ additional_pet_fee: fee });
      toast.success("Taxa atualizada");
    } catch (error) {
      console.error("Error updating fee:", error);
      toast.error("Erro ao atualizar taxa");
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
        <h1 className="text-3xl font-bold text-foreground">Preços</h1>
        <p className="text-muted-foreground">Gerencie sua tabela de preços</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Services and Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços</CardTitle>
            <CardDescription>Configure os preços de cada serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {services.map((service) => (
                <AccordionItem key={service.id} value={service.id}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <span className="font-semibold">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-muted-foreground font-normal">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {variants
                        .filter((v) => v.service_id === service.id)
                        .map((variant) => (
                          <div
                            key={variant.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              variant.is_active ? "border-border" : "border-muted bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={variant.is_active}
                                onCheckedChange={(checked) =>
                                  toggleVariantActive(variant.id, checked)
                                }
                              />
                              <div>
                                <p className={variant.is_active ? "text-foreground" : "text-muted-foreground"}>
                                  {variant.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {variant.duration_minutes} minutos
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">R$</span>
                              <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                  setVariants((prev) =>
                                    prev.map((v) =>
                                      v.id === variant.id ? { ...v, price: parseFloat(e.target.value) || 0 } : v
                                    )
                                  )
                                }
                                onBlur={(e) =>
                                  updateVariantPrice(variant.id, parseFloat(e.target.value) || 0)
                                }
                                className="w-24"
                                disabled={!variant.is_active}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Extras and Settings */}
        <div className="space-y-6">
          {/* Extras */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Extras</CardTitle>
                <CardDescription>Serviços adicionais</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingExtra(null);
                  setExtraForm({ name: "", description: "", price: "" });
                  setExtraDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              {extras.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum extra cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {extras.map((extra) => (
                    <div
                      key={extra.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        extra.is_active ? "border-border" : "border-muted bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={extra.is_active}
                          onCheckedChange={(checked) => toggleExtraActive(extra.id, checked)}
                        />
                        <div>
                          <p className={extra.is_active ? "text-foreground" : "text-muted-foreground"}>
                            {extra.name}
                          </p>
                          {extra.description && (
                            <p className="text-xs text-muted-foreground">{extra.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          R$ {extra.price.toFixed(2).replace(".", ",")}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingExtra(extra);
                            setExtraForm({
                              name: extra.name,
                              description: extra.description || "",
                              price: extra.price.toString(),
                            });
                            setExtraDialogOpen(true);
                          }}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Preço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Taxa por pet adicional</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">R$</span>
                    <Input
                      type="number"
                      value={settings.additional_pet_fee}
                      onChange={(e) =>
                        setSettings({ additional_pet_fee: parseFloat(e.target.value) || 0 })
                      }
                      onBlur={(e) => updateAdditionalPetFee(parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">por pet adicional</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Extra Dialog */}
      <Dialog open={extraDialogOpen} onOpenChange={setExtraDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExtra ? "Editar Extra" : "Novo Extra"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={extraForm.name}
                onChange={(e) => setExtraForm({ ...extraForm, name: e.target.value })}
                placeholder="Ex: Banho seco"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Descrição (opcional)</Label>
              <Textarea
                value={extraForm.description}
                onChange={(e) => setExtraForm({ ...extraForm, description: e.target.value })}
                placeholder="Descrição do serviço extra"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Preço</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground">R$</span>
                <Input
                  type="number"
                  value={extraForm.price}
                  onChange={(e) => setExtraForm({ ...extraForm, price: e.target.value })}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtraDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveExtra} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPrecos;
