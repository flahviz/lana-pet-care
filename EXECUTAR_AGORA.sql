-- ========================================
-- EXECUTAR ESTE SQL NO SUPABASE AGORA
-- ========================================
-- Acesse: https://supabase.com/dashboard/project/kdwpwbpyfvspzupgmebh/sql/new
-- Cole este código e clique em RUN

DO $$ 
BEGIN
  -- Adicionar payment_method
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_method text CHECK (payment_method IN ('pix', 'cash', 'pending'));
  END IF;

  -- Adicionar payment_proof_url
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_proof_url'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_proof_url text;
  END IF;

  -- Adicionar payment_confirmed_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_confirmed_at'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_confirmed_at timestamp with time zone;
  END IF;

  -- Adicionar payment_confirmed_by
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_confirmed_by'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_confirmed_by uuid REFERENCES auth.users(id);
  END IF;
END $$;
