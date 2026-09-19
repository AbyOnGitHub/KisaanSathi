-- Enum for user roles
CREATE TYPE public.user_role AS ENUM ('farmer', 'seller', 'admin');

-- Profiles table extending auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'farmer',
  full_name TEXT,
  phone_number TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  -- Seller specific details integrated directly
  business_name TEXT,
  gstin_or_license TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy:
-- Users can read their own profile.
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING ( auth.uid() = id );

CREATE POLICY "Anyone can view seller profiles" 
ON public.profiles FOR SELECT 
USING ( role = 'seller' );

-- 2. Update Policy:
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Function to handle new user signup and create a profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    user_role_val public.user_role;
BEGIN
    IF NEW.raw_user_meta_data->>'role' = 'seller' THEN
        user_role_val := 'seller';
    ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
        user_role_val := 'farmer';
    ELSE
        user_role_val := 'farmer';
    END IF;

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
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone_number',
        NEW.raw_user_meta_data->>'business_name',
        NEW.raw_user_meta_data->>'gstin_or_license'
    );
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
