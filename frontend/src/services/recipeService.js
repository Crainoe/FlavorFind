import { supabase } from "../config/supabase.js";

class RecipeService {
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

  async getPublicRecipes({ page = 0, pageSize = 24, cuisine = "", maxCookTime = null } = {}) {
    try {
      let query = supabase
        .from("recipes")
        .select("id,user_id,title,description,cuisine,category,cook_time,servings,image_url,is_public,created_at")
        .eq("is_public", true);
      if (cuisine) query = query.ilike("cuisine", cuisine);
      if (maxCookTime != null) query = query.lte("cook_time", maxCookTime);
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching public recipes:", error);
      throw error;
    }
  }

  async searchPublicRecipes(query, { page = 0, pageSize = 24, cuisine = "", maxCookTime = null } = {}) {
    try {
      let request = supabase
        .from("recipes")
        .select("id,user_id,title,description,cuisine,category,cook_time,servings,image_url,is_public,created_at")
        .eq("is_public", true)
        .or(
          `title.ilike.%${query}%,description.ilike.%${query}%,cuisine.ilike.%${query}%`
        );
      if (cuisine) request = request.ilike("cuisine", cuisine);
      if (maxCookTime != null) request = request.lte("cook_time", maxCookTime);
      const { data, error } = await request
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw error;
    }
  }
}

export default new RecipeService();

