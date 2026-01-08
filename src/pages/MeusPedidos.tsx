import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard
} from "lucide-react";
import { PaymentModal } from "@/components/payment/PaymentModal";

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  total_price: number;
  created_at: string;
  payment_status: string | null;
  payment_method: string | null;
  payment_proof_url: string | null;
  service_variants: {
    name: string;
    services: {
      name: string;
    };
  };
  addresses: {
    street: string;
    number: string;
    neighborhood: string;
  };
}

const MeusPedidos = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pixKey, setPixKey] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchPixKey();
    }
  }, [user]);

  const fetchPixKey = async () => {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "pix_key")
      .single();
    
    if (data?.value) {
      setPixKey(String(data.value).replace(/"/g, ''));
    }
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        scheduled_date,
        scheduled_time,
        status,
        total_price,
        created_at,
        payment_status,
        payment_method,
        payment_proof_url,
        service_variants (
          name,
          services (
            name
          )
        ),
        addresses (
          street,
          number,
          neighborhood
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookings(data as unknown as Booking[]);
    }
    setIsLoading(false);
  };

  const handleOpenPayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setPaymentModalOpen(true);
  };

  const handleClosePayment = () => {
    setPaymentModalOpen(false);
    setSelectedBooking(null);
    fetchBookings();
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
    pending: { label: "Pendente", icon: AlertCircle, className: "bg-warning/10 text-warning" },
    confirmed: { label: "Confirmado", icon: CheckCircle2, className: "bg-success/10 text-success" },
    in_progress: { label: "Em andamento", icon: Clock, className: "bg-primary/10 text-primary" },
    completed: { label: "Concluido", icon: CheckCircle2, className: "bg-success/10 text-success" },
    cancelled: { label: "Cancelado", icon: XCircle, className: "bg-destructive/10 text-destructive" },
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
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Meus Pedidos</h1>
              <p className="text-muted-foreground">Acompanhe seus agendamentos</p>
            </div>
            <Button asChild>
              <Link to="/novo-pedido">Novo pedido</Link>
            </Button>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Nenhum pedido ainda
              </h2>
              <p className="text-muted-foreground mb-6">
                Faca seu primeiro agendamento
              </p>
              <Button asChild>
                <Link to="/novo-pedido">Agendar servico</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                
                return (
                  <div key={booking.id} className="card-elevated p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {booking.service_variants?.services?.name} - {booking.service_variants?.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(booking.scheduled_date)} as {booking.scheduled_time.slice(0, 5)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.addresses?.street}, {booking.addresses?.number} - {booking.addresses?.neighborhood}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(booking.total_price)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pedido #{booking.id.slice(0, 8)}
                        </p>
                        {booking.status === "confirmed" && booking.payment_status !== "paid" && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenPayment(booking)}
                            className="w-full"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            {booking.payment_proof_url ? "Comprovante enviado" : "Pagar via PIX"}
                          </Button>
                        )}
                        {booking.payment_status === "paid" && (
                          <p className="text-xs text-success font-medium">
                            ✓ Pagamento confirmado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedBooking && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={handleClosePayment}
          bookingId={selectedBooking.id}
          totalPrice={selectedBooking.total_price}
          pixKey={pixKey}
        />
      )}
    </div>
  );
};

export default MeusPedidos;
