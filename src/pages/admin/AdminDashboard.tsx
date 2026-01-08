import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  pendingBookings: number;
  confirmedToday: number;
  completedThisMonth: number;
  pendingReviews: number;
}

interface RecentBooking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  total_price: number;
  user_id: string;
  service_variants: { name: string; services: { name: string } | null } | null;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    pendingBookings: 0,
    confirmedToday: 0,
    completedThisMonth: 0,
    pendingReviews: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      const [pendingRes, confirmedRes, completedRes, reviewsRes, bookingsRes] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("bookings").select("id", { count: "exact" }).in("status", ["confirmed", "in_progress"]).eq("scheduled_date", today),
        supabase.from("bookings").select("id", { count: "exact" }).eq("status", "completed").gte("scheduled_date", startOfMonth),
        supabase.from("reviews").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("bookings")
          .select(`
            id,
            scheduled_date,
            scheduled_time,
            status,
            total_price,
            user_id,
            service_variants(name, services(name))
          `)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        pendingBookings: pendingRes.count || 0,
        confirmedToday: confirmedRes.count || 0,
        completedThisMonth: completedRes.count || 0,
        pendingReviews: reviewsRes.count || 0,
      });

      if (bookingsRes.data) {
        setRecentBookings(bookingsRes.data as unknown as RecentBooking[]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-800" },
    in_progress: { label: "Em andamento", className: "bg-purple-100 text-purple-800" },
    completed: { label: "Concluído", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground">
          Bem-vinda de volta! Aqui está o resumo do seu negócio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos Pendentes
            </CardTitle>
            <Clock className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.pendingBookings}</p>
            <Link to="/admin/pedidos?status=pending" className="text-sm text-primary hover:underline">
              Ver todos →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmados Hoje
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.confirmedToday}</p>
            <Link to="/admin/pedidos?status=confirmed" className="text-sm text-primary hover:underline">
              Ver agenda →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concluídos no Mês
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.completedThisMonth}</p>
            <span className="text-sm text-muted-foreground">Este mês</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avaliações Pendentes
            </CardTitle>
            <Star className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.pendingReviews}</p>
            <Link to="/admin/avaliacoes" className="text-sm text-primary hover:underline">
              Moderar →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pedidos Recentes</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/pedidos">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum pedido encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-foreground">
                        Pedido #{booking.id.slice(0, 8)}
                      </p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[booking.status]?.className || ""}`}>
                        {statusConfig[booking.status]?.label || booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.service_variants?.services?.name} - {booking.service_variants?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.scheduled_date), "dd 'de' MMMM", { locale: ptBR })} às {booking.scheduled_time.slice(0, 5)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      R$ {booking.total_price.toFixed(2).replace(".", ",")}
                    </p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/pedidos`}>
                        Detalhes
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
