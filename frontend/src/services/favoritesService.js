import { supabase } from "../config/supabase.js";

class FavoritesService {
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
      const recipeId = String(recipe.id ?? recipe.idMeal ?? "");
      if (!recipeId) throw new Error("Recipe is missing an ID");
      // Check if already exists
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("recipe_id", recipeId)
        .single();

      if (existing) {
        return { message: "Recipe already in favorites" };
      }

      const { data, error } = await supabase
        .from("favorites")
        .insert([
          {
            user_id: userId,
            recipe_id: recipeId,
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
}

export default new FavoritesService();

