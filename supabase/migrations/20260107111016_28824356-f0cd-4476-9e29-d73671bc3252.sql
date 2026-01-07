-- Ensure unauthenticated users can never read profiles (PII)
-- Add a RESTRICTIVE policy that requires an authenticated JWT for SELECT.
-- This does NOT grant access by itself; it only further constrains existing PERMISSIVE policies.

DROP POLICY IF EXISTS "Require auth for profiles SELECT" ON public.profiles;

CREATE POLICY "Require auth for profiles SELECT"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);