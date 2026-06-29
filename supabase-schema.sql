-- Supabase Database Schema for FlavorFind App
-- Run these SQL commands in your Supabase SQL editor

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipe_id TEXT NOT NULL, -- TheMealDB idMeal
    recipe_data JSONB NOT NULL, -- Store the complete recipe object from TheMealDB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can't favorite the same recipe twice
    UNIQUE(user_id, recipe_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON public.favorites(recipe_id);
CREATE INDEX IF NOT EXISTS favorites_created_at_idx ON public.favorites(created_at);

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.favorites TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Optional: Create a view for favorite recipes with counts
CREATE OR REPLACE VIEW user_favorite_stats AS
SELECT 
    user_id,
    COUNT(*) as total_favorites,
    COUNT(DISTINCT recipe_data->>'strArea') as unique_cuisines,
    MIN(created_at) as first_favorite,
    MAX(created_at) as last_favorite
FROM public.favorites
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON user_favorite_stats TO authenticated;

-- Test queries to verify everything is working:
-- SELECT * FROM public.profiles WHERE id = auth.uid();
-- SELECT * FROM public.favorites WHERE user_id = auth.uid();
-- SELECT * FROM user_favorite_stats WHERE user_id = auth.uid();

-- 7. Create recipes table (user-created recipes)
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cuisine TEXT,
    category TEXT,
    cook_time INTEGER,
    servings INTEGER,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read public recipes, owners can read their own (public or private)
CREATE POLICY "Anyone can view public recipes" ON public.recipes
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own recipes" ON public.recipes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON public.recipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON public.recipes
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON public.recipes
    FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger for recipes
DROP TRIGGER IF EXISTS update_recipes_updated_at ON public.recipes;
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for recipes
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_is_public_idx ON public.recipes(is_public);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON public.recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS recipes_title_idx ON public.recipes(title);

-- Grant permissions for recipes
GRANT ALL ON public.recipes TO authenticated;

-- 8. Storage bucket policies for recipe images
-- NOTE: Create the bucket "recipe-images" as PUBLIC in Supabase Dashboard
-- (Storage > New bucket > name: "recipe-images" > Public bucket: ON)
-- Then run these policies:

-- Public read access for recipe images
CREATE POLICY "Public read access for recipe images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'recipe-images');

-- Authenticated users can upload to their own folder
-- Files should be stored as: {user_id}/{filename}
CREATE POLICY "Users can upload own recipe images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'recipe-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can update their own images
CREATE POLICY "Users can update own recipe images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'recipe-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
        bucket_id = 'recipe-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can delete their own images
CREATE POLICY "Users can delete own recipe images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'recipe-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );