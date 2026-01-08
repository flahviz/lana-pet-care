-- Move variantes de "Visita Rápida" para o serviço "Pet Sitter"
-- Isso agrupa todos os serviços de cuidado em casa sob Pet Sitter

-- Primeiro, obter o ID do serviço Pet Sitter
DO $$
DECLARE
  pet_sitter_id uuid;
  visita_rapida_id uuid;
BEGIN
  -- Buscar IDs dos serviços
  SELECT id INTO pet_sitter_id FROM public.services WHERE slug = 'pet-sitter';
  SELECT id INTO visita_rapida_id FROM public.services WHERE slug = 'visita-rapida';
  
  -- Mover todas as variantes de Visita Rápida para Pet Sitter
  IF pet_sitter_id IS NOT NULL AND visita_rapida_id IS NOT NULL THEN
    UPDATE public.service_variants
    SET service_id = pet_sitter_id
    WHERE service_id = visita_rapida_id;
    
    -- Desativar o serviço Visita Rápida (não deletar para manter histórico)
    UPDATE public.services
    SET is_active = false
    WHERE id = visita_rapida_id;
    
    RAISE NOTICE 'Variantes de Visita Rápida movidas para Pet Sitter com sucesso';
  ELSE
    RAISE NOTICE 'Serviços não encontrados';
  END IF;
END $$;
