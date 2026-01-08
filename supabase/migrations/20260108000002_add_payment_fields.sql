-- Adicionar campos de pagamento à tabela bookings
-- Sistema de pagamento PIX manual (sem taxas)

-- Adicionar colunas de pagamento se não existirem
DO $$ 
BEGIN
  -- payment_method: método escolhido pelo cliente
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_method text CHECK (payment_method IN ('pix', 'cash', 'pending'));
  END IF;

  -- payment_proof_url: URL do comprovante de pagamento enviado pelo cliente
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_proof_url'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_proof_url text;
  END IF;

  -- payment_confirmed_at: quando o admin confirmou o pagamento
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_confirmed_at'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_confirmed_at timestamp with time zone;
  END IF;

  -- payment_confirmed_by: qual admin confirmou o pagamento
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_confirmed_by'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_confirmed_by uuid REFERENCES auth.users(id);
  END IF;

END $$;

-- Inserir chave PIX nas configurações (value é JSON)
INSERT INTO public.settings (key, value, description)
VALUES ('pix_key', '""'::jsonb, 'Chave PIX para recebimento de pagamentos')
ON CONFLICT (key) DO NOTHING;

-- Atualizar bookings existentes para ter payment_status = 'pending' se ainda não tiver
UPDATE public.bookings 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Comentários para documentação
COMMENT ON COLUMN public.bookings.payment_method IS 'Método de pagamento escolhido: pix, cash, ou pending';
COMMENT ON COLUMN public.bookings.payment_proof_url IS 'URL do comprovante de pagamento PIX enviado pelo cliente';
COMMENT ON COLUMN public.bookings.payment_confirmed_at IS 'Data/hora em que o admin confirmou o pagamento';
COMMENT ON COLUMN public.bookings.payment_confirmed_by IS 'ID do admin que confirmou o pagamento';
