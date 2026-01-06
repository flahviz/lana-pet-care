-- Add RESTRICTIVE policies requiring authentication for addresses table
CREATE POLICY "Require authentication for addresses"
ON public.addresses
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);

-- Add RESTRICTIVE policies requiring authentication for profiles table
CREATE POLICY "Require authentication for profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);

-- Also add admin view policy for profiles (was missing)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));