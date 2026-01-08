# 🔧 Como Executar a Migration de Pagamento PIX

## ⚠️ IMPORTANTE: Execute este SQL no Supabase SQL Editor

Acesse: https://supabase.com/dashboard/project/kdwpwbpyfvspzupgmebh/sql/new

Cole e execute o SQL abaixo:

```sql
-- Adicionar campos de pagamento à tabela bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_method text CHECK (payment_method IN ('pix', 'cash', 'pending'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_proof_url'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_proof_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_confirmed_at'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_confirmed_at timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_confirmed_by'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_confirmed_by uuid REFERENCES auth.users(id);
  END IF;
END $$;
```

## ✅ Após executar, você terá:

- ✅ `payment_method` - Método de pagamento (pix/cash/pending)
- ✅ `payment_proof_url` - URL do comprovante
- ✅ `payment_confirmed_at` - Data da confirmação
- ✅ `payment_confirmed_by` - Admin que confirmou

## 📝 Configurar Chave PIX

Depois, configure sua chave PIX em:
**Admin → Configurações → Chave PIX**
