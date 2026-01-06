import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Check } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface ServiceVariant {
  id: string;
  service_id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Availability {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const Agenda = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [variants, setVariants] = useState<ServiceVariant[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [servicesRes, variantsRes, extrasRes, availabilityRes] = await Promise.all([
      supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("service_variants").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("service_extras").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("availability").select("*").eq("is_active", true).order("day_of_week"),
    ]);

    if (servicesRes.data) setServices(servicesRes.data);
    if (variantsRes.data) setVariants(variantsRes.data);
    if (extrasRes.data) setExtras(extrasRes.data);
    if (availabilityRes.data) setAvailability(availabilityRes.data);
    
    setIsLoading(false);
  };

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const formatTime = (time: string) => time.slice(0, 5);
  const formatPrice = (price: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availability.filter(a => a.day_of_week === dayOfWeek);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container-section py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Agenda e Valores</h1>
              <p className="text-muted-foreground">Confira disponibilidade e precos</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Availability */}
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Disponibilidade Semanal</h2>
              </div>

              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const slots = getAvailabilityForDay(day);
                  const isAvailable = slots.length > 0;
                  
                  return (
                    <div 
                      key={day} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isAvailable ? "bg-primary/5" : "bg-muted"
                      }`}
                    >
                      <span className={`font-medium ${isAvailable ? "text-foreground" : "text-muted-foreground"}`}>
                        {dayNames[day]}
                      </span>
                      {isAvailable ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          {slots.map((slot, i) => (
                            <span key={i} className="text-foreground">
                              {formatTime(slot.start_time)}-{formatTime(slot.end_time)}
                              {i < slots.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Indisponivel</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prices */}
            <div className="space-y-6">
              {services.map((service) => {
                const serviceVariants = variants.filter(v => v.service_id === service.id);
                
                return (
                  <div key={service.id} className="card-elevated p-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">{service.name}</h2>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    
                    <div className="space-y-2">
                      {serviceVariants.map((variant) => (
                        <div 
                          key={variant.id} 
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <div>
                            <span className="font-medium text-foreground">{variant.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({variant.duration_minutes} min)
                            </span>
                          </div>
                          <span className="font-bold text-primary">{formatPrice(variant.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Extras */}
              <div className="card-elevated p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Servicos Adicionais</h2>
                <div className="space-y-2">
                  {extras.map((extra) => (
                    <div 
                      key={extra.id} 
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-foreground">{extra.name}</span>
                        {extra.description && (
                          <p className="text-xs text-muted-foreground">{extra.description}</p>
                        )}
                      </div>
                      <span className="font-bold text-accent">+{formatPrice(extra.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link to="/novo-pedido">
                <Check className="w-4 h-4 mr-2" />
                Agendar agora
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Agenda;
