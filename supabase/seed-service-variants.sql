-- Script para inserir variantes de serviço
-- Execute este script no SQL Editor do Supabase

-- Inserir variantes de serviço
INSERT INTO service_variants (service_id, name, price, duration_minutes, is_active, sort_order)
SELECT 
  s.id,
  v.name,
  v.price,
  v.duration,
  true,
  v.sort_order
FROM services s
CROSS JOIN (
  VALUES 
    ('dog-walker', '30 minutos', 50.00, 30, 1),
    ('dog-walker', '1 hora', 80.00, 60, 2),
    ('pet-sitter', 'Meio período (4h)', 120.00, 240, 1),
    ('pet-sitter', 'Período integral (8h)', 200.00, 480, 2),
    ('pet-sitter', 'Pernoite', 300.00, 720, 3),
    ('visita-rapida', '20 minutos', 35.00, 20, 1),
    ('visita-rapida', '40 minutos', 60.00, 40, 2)
) AS v(slug, name, price, duration, sort_order)
WHERE s.slug = v.slug;

-- Verificar serviços e variantes inseridos
SELECT 
  s.name as servico, 
  v.name as variante, 
  v.price as preco,
  v.duration_minutes as duracao_minutos,
  v.is_active as ativo
FROM services s
LEFT JOIN service_variants v ON s.id = v.service_id
ORDER BY s.sort_order, v.sort_order;
