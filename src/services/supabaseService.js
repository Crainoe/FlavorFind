import { supabase } from "../config/supabase.js";

/**
 * Supabase service for handling database operations
 */
class SupabaseService {
  // Auth methods
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  }

  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error("Error getting current session:", error);
      throw error;
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Favorites methods
  async getFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  }

  async addToFavorites(userId, recipe) {
    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("recipe_id", recipe.idMeal)
        .single();

      if (existing) {
        return { message: "Recipe already in favorites" };
      }

      const { data, error } = await supabase
        .from("favorites")
        .insert([
          {
            user_id: userId,
            recipe_id: recipe.idMeal,
            recipe_data: recipe,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  }

  async removeFromFavorites(userId, recipeId) {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  }

  async clearFavorites(userId) {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error clearing favorites:", error);
      throw error;
    }
  }

  // User profile methods
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  // User recipes methods
  async createRecipe(userId, recipe) {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .insert([
          {
            user_id: userId,
            title: recipe.title,
            description: recipe.description || null,
            cuisine: recipe.cuisine || null,
            category: recipe.category || null,
            cook_time: recipe.cookTime || null,
            servings: recipe.servings || null,
            ingredients: recipe.ingredients || [],
            instructions: recipe.instructions || [],
            image_url: recipe.imageUrl || null,
            is_public: recipe.isPublic || false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  }

  async updateRecipe(userId, recipeId, updates) {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", recipeId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  }

  async deleteRecipe(userId, recipeId) {
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId)
        .eq("user_id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  }

  async getRecipeById(recipeId, userId = null) {
    try {
      let query = supabase.from("recipes").select("*").eq("id", recipeId);

      if (userId) {
        // Owners can see their own private recipes
        query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
      } else {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    } catch (error) {
      console.error("Error fetching recipe:", error);
      throw error;
    }
  }

  async getUserRecipes(userId) {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      throw error;
    }
  }

  async getPublicRecipes() {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching public recipes:", error);
      throw error;
    }
  }

  async searchPublicRecipes(query) {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("is_public", true)
        .or(
          `title.ilike.%${query}%,description.ilike.%${query}%,cuisine.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw error;
    }
  }

  async uploadRecipeImage(userId, file) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("recipe-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async deleteRecipeImage(imageUrl) {
    try {
      // Extract path from URL: .../storage/v1/object/public/recipe-images/{userId}/{fileName}
      const match = imageUrl.match(/recipe-images\/(.+)$/);
      if (!match) return;

      const filePath = match[1];
      const { error } = await supabase.storage
        .from("recipe-images")
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      // Don't throw - image deletion failure shouldn't block recipe deletion
      return false;
    }
  }
}

// Export a singleton instance
export default new SupabaseService();
