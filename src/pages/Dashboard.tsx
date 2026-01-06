import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  PawPrint, 
  Calendar, 
  ClipboardList, 
  Star, 
  User,
  ArrowRight,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const { user, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    // Redirect admin to admin panel
    if (!isLoading && userRole === "admin") {
      navigate("/admin");
    }
  }, [user, isLoading, userRole, navigate]);

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

          {/* Recent Activity Placeholder */}
          <div className="card-elevated p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Proximos Agendamentos
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Voce ainda nao tem agendamentos
              </p>
              <Button asChild>
                <Link to="/novo-pedido">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Fazer primeiro agendamento
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
