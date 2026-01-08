-- Criar função para auto-atribuir admin para emails específicos
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atribuir role admin apenas para emails específicos
  IF NEW.email IN ('flah.costta@gmail.com', 'elianecosta2@gmail.com') THEN
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger que executa após inserção de novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin_role();

-- Atualizar usuários existentes com esses emails para admin (se já existirem)
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('flah.costta@gmail.com', 'elianecosta2@gmail.com')
);