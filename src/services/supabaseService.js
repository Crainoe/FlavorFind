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
}

// Export a singleton instance
export default new SupabaseService();
