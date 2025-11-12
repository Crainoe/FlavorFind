import supabaseService from "../../services/supabaseService.js";

const state = {
  favoriteRecipes: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_FAVORITES(state, favorites) {
    state.favoriteRecipes = favorites;
  },

  ADD_FAVORITE(state, favorite) {
    const exists = state.favoriteRecipes.find(
      (r) => r.recipe_id === favorite.recipe_id
    );
    if (!exists) {
      state.favoriteRecipes.unshift(favorite);
    }
  },

  REMOVE_FAVORITE(state, recipeId) {
    state.favoriteRecipes = state.favoriteRecipes.filter(
      (r) => r.recipe_id !== recipeId
    );
  },

  CLEAR_FAVORITES(state) {
    state.favoriteRecipes = [];
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async loadFavorites({ commit, rootGetters }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const user = rootGetters["auth/user"];
      if (!user) {
        // If no user, try to load from localStorage for backward compatibility
        const localFavorites = JSON.parse(
          localStorage.getItem("favoriteRecipes") || "[]"
        );
        commit(
          "SET_FAVORITES",
          localFavorites.map((recipe) => ({
            recipe_id: recipe.id || recipe.idMeal,
            recipe_data: recipe,
          }))
        );
        return;
      }

      const favorites = await supabaseService.getFavorites(user.id);
      commit("SET_FAVORITES", favorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      commit("SET_ERROR", error.message);
      // Fallback to localStorage
      const localFavorites = JSON.parse(
        localStorage.getItem("favoriteRecipes") || "[]"
      );
      commit(
        "SET_FAVORITES",
        localFavorites.map((recipe) => ({
          recipe_id: recipe.id || recipe.idMeal,
          recipe_data: recipe,
        }))
      );
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async addToFavorites({ commit, rootGetters }, recipe) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const user = rootGetters["auth/user"];
      if (!user) {
        // Fallback to localStorage if no user
        const localFavorites = JSON.parse(
          localStorage.getItem("favoriteRecipes") || "[]"
        );
        const exists = localFavorites.find(
          (r) => (r.id || r.idMeal) === recipe.idMeal
        );
        if (!exists) {
          localFavorites.push(recipe);
          localStorage.setItem(
            "favoriteRecipes",
            JSON.stringify(localFavorites)
          );
          commit("ADD_FAVORITE", {
            recipe_id: recipe.idMeal,
            recipe_data: recipe,
          });
        }
        return;
      }

      const favorite = await supabaseService.addToFavorites(user.id, recipe);
      if (favorite && favorite.recipe_id) {
        commit("ADD_FAVORITE", favorite);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async removeFromFavorites({ commit, rootGetters }, recipeId) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const user = rootGetters["auth/user"];
      if (!user) {
        // Fallback to localStorage if no user
        const localFavorites = JSON.parse(
          localStorage.getItem("favoriteRecipes") || "[]"
        );
        const updatedFavorites = localFavorites.filter(
          (r) => (r.id || r.idMeal) !== recipeId
        );
        localStorage.setItem(
          "favoriteRecipes",
          JSON.stringify(updatedFavorites)
        );
        commit("REMOVE_FAVORITE", recipeId);
        return;
      }

      await supabaseService.removeFromFavorites(user.id, recipeId);
      commit("REMOVE_FAVORITE", recipeId);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async clearFavorites({ commit, rootGetters }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const user = rootGetters["auth/user"];
      if (!user) {
        // Fallback to localStorage if no user
        localStorage.removeItem("favoriteRecipes");
        commit("CLEAR_FAVORITES");
        return;
      }

      await supabaseService.clearFavorites(user.id);
      commit("CLEAR_FAVORITES");
    } catch (error) {
      console.error("Error clearing favorites:", error);
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Migration helper - move localStorage data to Supabase when user logs in
  async migrateFavoritesToSupabase({ commit, rootGetters }) {
    try {
      const user = rootGetters["auth/user"];
      if (!user) return;

      const localFavorites = JSON.parse(
        localStorage.getItem("favoriteRecipes") || "[]"
      );
      if (localFavorites.length === 0) return;

      commit("SET_LOADING", true);

      // Add each local favorite to Supabase
      for (const recipe of localFavorites) {
        try {
          await supabaseService.addToFavorites(user.id, recipe);
        } catch (error) {
          console.warn(
            "Failed to migrate recipe:",
            recipe.strMeal || recipe.name,
            error
          );
        }
      }

      // Clear localStorage after migration
      localStorage.removeItem("favoriteRecipes");

      // Reload favorites from Supabase
      const favorites = await supabaseService.getFavorites(user.id);
      commit("SET_FAVORITES", favorites);
    } catch (error) {
      console.error("Error migrating favorites:", error);
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  favoriteRecipes: (state) => state.favoriteRecipes,
  favoritesCount: (state) => state.favoriteRecipes.length,
  loading: (state) => state.loading,
  error: (state) => state.error,
  isFavorite: (state) => (recipeId) => {
    return state.favoriteRecipes.some(
      (favorite) => favorite.recipe_id === recipeId
    );
  },
  // Get actual recipe data for display
  favoriteRecipeData: (state) => {
    return state.favoriteRecipes.map((favorite) => favorite.recipe_data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
