-- Fix relationship between bookings and profiles
-- Both tables have user_id that references auth.users(id)
-- We need to ensure Supabase can join them correctly

-- First, verify the foreign keys exist
-- bookings.user_id -> auth.users.id (already exists as bookings_user_id_fkey)
-- profiles.user_id -> auth.users.id (should exist as profiles_user_id_fkey)

-- Check if profiles has the FK to auth.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_user_id_fkey' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles
            ADD CONSTRAINT profiles_user_id_fkey 
            FOREIGN KEY (user_id) 
            REFERENCES auth.users(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- Ensure profiles.user_id is unique so it can be used for joins
-- This is important because bookings.user_id should match profiles.user_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_user_id_key'
    ) THEN
        ALTER TABLE public.profiles
            ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
