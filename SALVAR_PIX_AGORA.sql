-- =========================================
-- EXECUTAR ESTE SQL NO SUPABASE AGORA
-- =========================================
-- Acesse: https://supabase.com/dashboard/project/kdwpwbpyfvspzupgmebh/sql/new
-- Cole este código e clique em RUN

-- Deletar chave PIX existente (se houver)
DELETE FROM public.settings WHERE key = 'pix_key';

-- Inserir nova chave PIX
INSERT INTO public.settings (key, value, description)
VALUES ('pix_key', '"05535232955"', 'Business setting: pix_key');

-- Verificar se foi salvo
SELECT * FROM public.settings WHERE key = 'pix_key';
