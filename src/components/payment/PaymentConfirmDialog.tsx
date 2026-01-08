import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface PaymentConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  proofUrl: string;
  totalPrice: number;
}

export const PaymentConfirmDialog = ({ 
  open, 
  onClose, 
  bookingId, 
  proofUrl, 
  totalPrice 
}: PaymentConfirmDialogProps) => {
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          payment_confirmed_at: new Date().toISOString(),
          payment_confirmed_by: user?.id
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Pagamento confirmado!");
      onClose();
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Erro ao confirmar pagamento");
    } finally {
      setConfirming(false);
    }
  };

  const handleRejectPayment = async () => {
    setRejecting(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "pending",
          payment_proof_url: null,
          payment_method: null
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Comprovante rejeitado. Cliente será notificado.");
      onClose();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("Erro ao rejeitar pagamento");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Valor */}
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Valor do pedido</p>
            <p className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalPrice)}
            </p>
          </div>

          {/* Comprovante */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Comprovante enviado pelo cliente
            </p>
            <a
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400 truncate">
                Ver comprovante
              </span>
            </a>
          </div>

          {/* Instruções */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Atenção:</strong> Verifique se o valor e os dados do comprovante estão corretos antes de confirmar.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRejectPayment}
            disabled={confirming || rejecting}
            className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {rejecting ? "Rejeitando..." : "Rejeitar"}
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={confirming || rejecting}
            className="w-full sm:w-auto bg-success hover:bg-success/90"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {confirming ? "Confirmando..." : "Confirmar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
