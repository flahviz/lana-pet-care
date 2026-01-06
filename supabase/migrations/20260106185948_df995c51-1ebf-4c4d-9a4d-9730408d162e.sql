-- Remove the overly permissive authentication policy on profiles
-- The existing user-specific and admin policies are sufficient
DROP POLICY "Require authentication for profiles" ON public.profiles;