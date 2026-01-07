-- Fix user_roles table: require authentication for SELECT
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix settings table: restrict access to admins only
DROP POLICY IF EXISTS "Authenticated users can view settings" ON public.settings;

CREATE POLICY "Only admins can view settings"
ON public.settings
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Upgrade has_role function to PL/pgSQL for better security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  role_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  ) INTO role_exists;
  
  RETURN role_exists;
END;
$$;

-- Add database constraints for input validation
ALTER TABLE public.pets DROP CONSTRAINT IF EXISTS pet_name_length;
ALTER TABLE public.pets ADD CONSTRAINT pet_name_length CHECK (length(name) <= 100);

ALTER TABLE public.pets DROP CONSTRAINT IF EXISTS pet_breed_length;
ALTER TABLE public.pets ADD CONSTRAINT pet_breed_length CHECK (breed IS NULL OR length(breed) <= 100);

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS booking_notes_length;
ALTER TABLE public.bookings ADD CONSTRAINT booking_notes_length CHECK (notes IS NULL OR length(notes) <= 1000);

ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS address_street_length;
ALTER TABLE public.addresses ADD CONSTRAINT address_street_length CHECK (length(street) <= 200);

ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS address_instructions_length;
ALTER TABLE public.addresses ADD CONSTRAINT address_instructions_length CHECK (instructions IS NULL OR length(instructions) <= 500);

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS review_comment_length;
ALTER TABLE public.reviews ADD CONSTRAINT review_comment_length CHECK (comment IS NULL OR length(comment) <= 1000);

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS review_response_length;
ALTER TABLE public.reviews ADD CONSTRAINT review_response_length CHECK (admin_response IS NULL OR length(admin_response) <= 1000);