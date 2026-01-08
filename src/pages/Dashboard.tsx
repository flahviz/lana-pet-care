import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  PlusCircle, 
  PawPrint, 
  Calendar, 
  ClipboardList, 
  Star, 
  User,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  service_variants: {
    name: string;
    services: {
      name: string;
    } | null;
  } | null;
}

const Dashboard = () => {
  const { user, isLoading, userRole } = useAuth();
  const navigate = useNavigate();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    // Redirect admin to admin panel
    if (!isLoading && userRole === "admin") {
      navigate("/admin");
    }
  }, [user, isLoading, userRole, navigate]);

  useEffect(() => {
    if (user) {
      fetchUpcomingBookings();
    }
  }, [user]);

  const fetchUpcomingBookings = async () => {
    const today = new Date().toISOString().split("T")[0];
    
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        scheduled_date,
        scheduled_time,
        status,
        service_variants(
          name,
          services(name)
        )
      `)
      .eq("user_id", user?.id)
      .in("status", ["confirmed", "in_progress"])
      .gte("scheduled_date", today)
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true })
      .limit(3);

    if (!error && data) {
      setUpcomingBookings(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      icon: PlusCircle,
      title: "Novo Pedido",
      description: "Agendar passeio ou hospedagem",
      href: "/novo-pedido",
      variant: "accent" as const,
    },
    {
      icon: PawPrint,
      title: "Meus Pets",
      description: "Cadastrar ou editar pets",
      href: "/meus-pets",
      variant: "default" as const,
    },
    {
      icon: Calendar,
      title: "Agenda e Valores",
      description: "Ver disponibilidade e precos",
      href: "/agenda",
      variant: "default" as const,
    },
    {
      icon: ClipboardList,
      title: "Meus Pedidos",
      description: "Acompanhar agendamentos",
      href: "/meus-pedidos",
      variant: "default" as const,
    },
    {
      icon: Star,
      title: "Minhas Avaliacoes",
      description: "Ver e criar avaliacoes",
      href: "/minhas-avaliacoes",
      variant: "default" as const,
    },
    {
      icon: User,
      title: "Meu Perfil",
      description: "Dados e seguranca",
      href: "/perfil",
      variant: "default" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container-section py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Ola, {user.user_metadata?.full_name?.split(" ")[0] || "Cliente"}!
            </h1>
            <p className="text-muted-foreground">
              O que voce gostaria de fazer hoje?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className={`card-interactive p-6 flex items-start gap-4 ${
                  action.variant === "accent" ? "bg-accent text-accent-foreground" : "bg-card"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  action.variant === "accent" 
                    ? "bg-accent-foreground/20" 
                    : "bg-primary/10"
                }`}>
                  <action.icon className={`w-6 h-6 ${
                    action.variant === "accent" 
                      ? "text-accent-foreground" 
                      : "text-primary"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    action.variant === "accent" 
                      ? "text-accent-foreground" 
                      : "text-foreground"
                  }`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${
                    action.variant === "accent" 
                      ? "text-accent-foreground/80" 
                      : "text-muted-foreground"
                  }`}>
                    {action.description}
                  </p>
                </div>
                <ArrowRight className={`w-5 h-5 ${
                  action.variant === "accent" 
                    ? "text-accent-foreground" 
                    : "text-muted-foreground"
                }`} />
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Proximos Agendamentos
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/meus-pedidos">Ver todos</Link>
              </Button>
            </div>
            {upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Voce ainda nao tem agendamentos confirmados
                </p>
                <Button asChild>
                  <Link to="/novo-pedido">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Fazer primeiro agendamento
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <h3 className="font-semibold text-foreground">
                            {booking.service_variants?.services?.name} - {booking.service_variants?.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.scheduled_date), "EEEE, dd 'de' MMMM", { locale: ptBR })} às {booking.scheduled_time.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
