import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Check, Upload, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  totalPrice: number;
  pixKey: string;
}

export const PaymentModal = ({ open, onClose, bookingId, totalPrice, pixKey }: PaymentModalProps) => {
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Gerar código PIX Copia e Cola no formato EMV (padrão Banco Central)
  const pixCode = useMemo(() => {
    if (!pixKey) return "";
    
    try {
      // Função auxiliar para formatar campos EMV
      const formatEMV = (id: string, value: string) => {
        const length = value.length.toString().padStart(2, '0');
        return `${id}${length}${value}`;
      };

      // Função para calcular CRC16 CCITT
      const crc16 = (str: string) => {
        let crc = 0xFFFF;
        for (let i = 0; i < str.length; i++) {
          crc ^= str.charCodeAt(i) << 8;
          for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
          }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
      };

      // Construir payload PIX EMV
      const payloadFormat = formatEMV('00', '01'); // Payload Format Indicator
      const merchantAccount = formatEMV('26', 
        formatEMV('00', 'BR.GOV.BCB.PIX') + 
        formatEMV('01', pixKey)
      );
      const merchantCategory = formatEMV('52', '0000'); // Merchant Category Code
      const currency = formatEMV('53', '986'); // BRL
      const amount = formatEMV('54', totalPrice.toFixed(2));
      const country = formatEMV('58', 'BR');
      const merchantName = formatEMV('59', 'Lana Pet Care');
      const merchantCity = formatEMV('60', 'Florianopolis');
      const txid = formatEMV('05', bookingId.slice(0, 25));
      const additionalData = formatEMV('62', txid);

      // Montar payload sem CRC
      const payloadWithoutCRC = payloadFormat + merchantAccount + merchantCategory + 
                                currency + amount + country + merchantName + 
                                merchantCity + additionalData + '6304';

      // Calcular e adicionar CRC
      const checksum = crc16(payloadWithoutCRC);
      const payload = payloadWithoutCRC + checksum;

      console.log("PIX Code generated:", payload);
      return payload;
    } catch (error) {
      console.error("Error generating PIX code:", error);
      return "";
    }
  }, [pixKey, totalPrice, bookingId]);

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPixCode = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível");
      return;
    }
    navigator.clipboard.writeText(pixCode);
    setCopiedCode(true);
    toast.success("Código PIX Copia e Cola copiado!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmitProof = async () => {
    if (!proofUrl.trim()) {
      toast.error("Por favor, cole o link do comprovante");
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_method: "pix",
          payment_proof_url: proofUrl,
          payment_status: "pending"
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Comprovante enviado! Aguarde a confirmação do pagamento.");
      onClose();
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast.error("Erro ao enviar comprovante");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Valor */}
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
            <p className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalPrice)}
            </p>
          </div>

          {/* Chave PIX */}
          {pixKey ? (
            <div className="space-y-3">
              {/* QR Code */}
              {showQRCode ? (
                <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                  <QRCodeSVG value={pixCode || pixKey} size={200} level="H" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Escaneie o QR Code com o app do seu banco
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQRCode(false)}
                    className="mt-2"
                  >
                    Voltar
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Chave PIX (CPF)</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQRCode(true)}
                      className="text-xs"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      Ver QR Code
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={pixKey}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyPixKey}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* PIX Copia e Cola */}
                  {pixCode && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">PIX Copia e Cola</p>
                      <div className="flex gap-2">
                        <Input
                          value={pixCode}
                          readOnly
                          className="flex-1 text-xs"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyPixCode}
                        >
                          {copiedCode ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cole este código no seu app de pagamento
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>⚠️ Chave PIX não configurada</strong>
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                Entre em contato com o administrador para obter a chave PIX para pagamento.
              </p>
            </div>
          )}

          {/* Instruções */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Como pagar:</strong>
            </p>
            <ol className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-decimal list-inside">
              <li>Copie a chave PIX acima</li>
              <li>Abra o app do seu banco</li>
              <li>Faça o pagamento via PIX</li>
              <li>Tire um print do comprovante</li>
              <li>Envie o link do comprovante abaixo</li>
            </ol>
          </div>

          {/* Upload do comprovante */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Link do comprovante
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              Cole o link do print do comprovante (ex: do Google Drive, Imgur, etc)
            </p>
            <Input
              placeholder="https://..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitProof}
            disabled={uploading || !proofUrl.trim()}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Enviando..." : "Enviar Comprovante"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
