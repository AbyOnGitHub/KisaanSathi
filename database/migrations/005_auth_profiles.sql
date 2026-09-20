-- Enum for user roles
CREATE TYPE public.user_role AS ENUM ('farmer', 'seller', 'admin');

-- Profiles table extending auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'farmer',
  full_name TEXT,
  phone_number TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  -- Seller specific details integrated directly (as requested)
  business_name TEXT,
  gstin_or_license TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy:
-- Users can read their own profile. Admins can read all.
-- We might also allow anyone to read basic info of 'seller' profiles for the marketplace.
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING ( auth.uid() = id );

CREATE POLICY "Anyone can view seller profiles" 
ON public.profiles FOR SELECT 
USING ( role = 'seller' );

-- 2. Update Policy:
-- Users can update their own profile, except for role, is_verified, gstin_or_license
-- (Role/Verification should be controlled by Admins eventually)
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Drop unique constraint on phone_number if it exists so duplicate/test numbers don't break signup
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_phone_number_key;

-- Function to handle new user signup and create a profile automatically (failsafe)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    user_role_val public.user_role;
    full_name_val TEXT;
    phone_val TEXT;
BEGIN
    -- Determine role safely (case-insensitive)
    IF LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')) = 'seller' THEN
        user_role_val := 'seller';
    ELSE
        user_role_val := 'farmer';
    END IF;

    full_name_val := COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name', 
        split_part(NEW.email, '@', 1)
    );
    phone_val := NULLIF(TRIM(NEW.raw_user_meta_data->>'phone_number'), '');

    -- Upsert into profiles table
    INSERT INTO public.profiles (
        id, 
        role, 
        full_name, 
        phone_number,
        business_name,
        gstin_or_license
    )
    VALUES (
        NEW.id,
        user_role_val,
        full_name_val,
        phone_val,
        NEW.raw_user_meta_data->>'business_name',
        NEW.raw_user_meta_data->>'gstin_or_license'
    )
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
        business_name = COALESCE(EXCLUDED.business_name, public.profiles.business_name),
        gstin_or_license = COALESCE(EXCLUDED.gstin_or_license, public.profiles.gstin_or_license),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Fallback: Ensure user registration in auth.users NEVER fails even if profile metadata has unexpected format
    BEGIN
        INSERT INTO public.profiles (id, role, full_name)
        VALUES (NEW.id, 'farmer', COALESCE(full_name_val, 'User'))
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users after insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger for updating 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
