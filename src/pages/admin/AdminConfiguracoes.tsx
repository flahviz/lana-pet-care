import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Mail, Phone, MapPin, User, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AdminConfiguracoes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [businessSettings, setBusinessSettings] = useState({
    business_name: "Lana Pet Care",
    business_email: "elianepetcare@gmail.com",
    business_phone: "(48) 99663-9483",
    business_address: "Grande Florianópolis, SC",
    whatsapp_number: "5548996639483",
    pix_key: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
        });
      }

      const { data: settingsData } = await supabase
        .from("settings")
        .select("*")
        .in("key", ["business_name", "business_email", "business_phone", "business_address", "whatsapp_number", "pix_key"]);

      if (settingsData) {
        const settingsMap: Record<string, string> = {};
        settingsData.forEach((s) => {
          try {
            // Tentar fazer parse do JSON
            const parsed = JSON.parse(String(s.value));
            settingsMap[s.key] = String(parsed);
          } catch {
            // Se falhar, usar o valor direto removendo aspas
            settingsMap[s.key] = String(s.value).replace(/['"\\]/g, "");
          }
        });
        setBusinessSettings((prev) => ({
          ...prev,
          ...settingsMap,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Perfil atualizado");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const saveBusinessSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(businessSettings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        description: `Business setting: ${key}`,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("settings")
          .upsert(update, { onConflict: "key" });
        
        if (error) throw error;
      }

      toast.success("Configurações salvas");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas configurações pessoais e do negócio</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Meu Perfil
            </CardTitle>
            <CardDescription>Suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome completo</Label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input
                value={profile.email}
                disabled
                className="mt-1 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                O e-mail não pode ser alterado
              </p>
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(48) 99999-9999"
                className="mt-1"
              />
            </div>
            <Button onClick={saveProfile} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Salvar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Dados do Negócio
            </CardTitle>
            <CardDescription>Informações exibidas para os clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do negócio</Label>
              <Input
                value={businessSettings.business_name}
                onChange={(e) => setBusinessSettings({ ...businessSettings, business_name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>E-mail de contato</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={businessSettings.business_email}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, business_email: e.target.value })}
                  className="mt-1 pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Telefone comercial</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={businessSettings.business_phone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, business_phone: e.target.value })}
                  placeholder="(48) 99999-9999"
                  className="mt-1 pl-10"
                />
              </div>
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input
                value={businessSettings.whatsapp_number}
                onChange={(e) => setBusinessSettings({ ...businessSettings, whatsapp_number: e.target.value })}
                placeholder="5548999999999"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formato: 55 + DDD + número (sem espaços)
              </p>
            </div>
            <div>
              <Label>Endereço / Região</Label>
              <Textarea
                value={businessSettings.business_address}
                onChange={(e) => setBusinessSettings({ ...businessSettings, business_address: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Chave PIX</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={businessSettings.pix_key}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, pix_key: e.target.value })}
                  placeholder="CPF, telefone, e-mail ou chave aleatória"
                  className="mt-1 pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Chave PIX para receber pagamentos dos clientes
              </p>
            </div>
            <Button onClick={saveBusinessSettings} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
