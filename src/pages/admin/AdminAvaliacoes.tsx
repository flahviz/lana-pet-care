import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, MessageSquare, Star, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReviewStatus = "pending" | "approved" | "rejected";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  admin_response: string | null;
  created_at: string;
  punctuality: boolean;
  care: boolean;
  communication: boolean;
  profiles: { full_name: string } | null;
  bookings: { 
    service_variants: { 
      name: string; 
      services: { name: string } | null 
    } | null 
  } | null;
}

const AdminAvaliacoes = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          status,
          admin_response,
          created_at,
          punctuality,
          care,
          communication,
          profiles!reviews_user_id_fkey(full_name),
          bookings(service_variants(name, services(name)))
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as ReviewStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data as unknown as Review[]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Erro ao carregar avaliações");
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: string, newStatus: ReviewStatus) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: newStatus })
        .eq("id", reviewId);

      if (error) throw error;

      toast.success(
        newStatus === "approved" ? "Avaliação aprovada" : "Avaliação rejeitada"
      );
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Erro ao atualizar avaliação");
    }
  };

  const submitResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      toast.error("Digite uma resposta");
      return;
    }

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          admin_response: responseText,
          responded_at: new Date().toISOString(),
        })
        .eq("id", selectedReview.id);

      if (error) throw error;

      toast.success("Resposta enviada");
      setResponseDialogOpen(false);
      setSelectedReview(null);
      setResponseText("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Erro ao enviar resposta");
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Aprovada", className: "bg-green-100 text-green-800" },
    rejected: { label: "Rejeitada", className: "bg-red-100 text-red-800" },
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
        <h1 className="text-3xl font-bold text-foreground">Avaliações</h1>
        <p className="text-muted-foreground">Modere as avaliações dos clientes</p>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reviews.length} avaliação{reviews.length !== 1 ? "ões" : ""} encontrada{reviews.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma avaliação encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-foreground">
                          {review.profiles?.full_name || "Cliente"}
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[review.status]?.className}`}>
                          {statusConfig[review.status]?.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-accent fill-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {review.bookings?.service_variants?.services?.name} - {review.bookings?.service_variants?.name}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-foreground mb-3 italic">"{review.comment}"</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-2">
                        {review.punctuality && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            Pontualidade
                          </span>
                        )}
                        {review.care && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            Cuidado
                          </span>
                        )}
                        {review.communication && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            Comunicação
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>

                      {review.admin_response && (
                        <div className="mt-3 p-3 bg-secondary rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">Sua resposta:</p>
                          <p className="text-sm text-muted-foreground">{review.admin_response}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {review.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateReviewStatus(review.id, "approved")}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReviewStatus(review.id, "rejected")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                      {review.status === "approved" && !review.admin_response && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReview(review);
                            setResponseDialogOpen(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Responder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder Avaliação</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedReview && (
              <div className="mb-4 p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground italic">
                  "{selectedReview.comment}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  - {selectedReview.profiles?.full_name}
                </p>
              </div>
            )}
            <Textarea
              placeholder="Digite sua resposta..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submitResponse}>Enviar Resposta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAvaliacoes;
