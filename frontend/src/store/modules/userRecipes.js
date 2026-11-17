import supabaseService from "../../services/supabaseService.js";

const state = {
  userRecipes: [],
  publicRecipes: [],
  currentUserRecipe: null,
  loading: false,
  uploading: false,
  error: null,
};

const mutations = {
  SET_USER_RECIPES(state, recipes) {
    state.userRecipes = recipes;
  },
  SET_PUBLIC_RECIPES(state, recipes) {
    state.publicRecipes = recipes;
  },
  SET_CURRENT_USER_RECIPE(state, recipe) {
    state.currentUserRecipe = recipe;
  },
  ADD_USER_RECIPE(state, recipe) {
    state.userRecipes.unshift(recipe);
  },
  REMOVE_USER_RECIPE(state, recipeId) {
    state.userRecipes = state.userRecipes.filter((r) => r.id !== recipeId);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_UPLOADING(state, uploading) {
    state.uploading = uploading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const transformRecipe = (row) => ({
  id: row.id,
  strMeal: row.title,
  title: row.title,
  strMealThumb: row.image_url,
  image: row.image_url,
  strArea: row.cuisine,
  cuisine: row.cuisine,
  strCategory: row.category,
  category: row.category,
  description: row.description,
  cookTime: row.cook_time,
  servings: row.servings,
  ingredients: row.ingredients || [],
  instructions: row.instructions || [],
  isPublic: row.is_public,
  isUserRecipe: true,
  userId: row.user_id,
  createdAt: row.created_at,
});

const actions = {
  async fetchUserRecipes({ commit, rootGetters }) {
    const user = rootGetters["auth/user"];
    if (!user) return [];

    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const recipes = await supabaseService.getUserRecipes(user.id);
      const transformed = recipes.map(transformRecipe);
      commit("SET_USER_RECIPES", transformed);
      return transformed;
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      commit("SET_ERROR", error.message);
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchPublicRecipes({ commit, state }) {
    if (state.publicRecipes.length > 0) return state.publicRecipes;

    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const recipes = await supabaseService.getPublicRecipes();
      const transformed = recipes.map(transformRecipe);
      commit("SET_PUBLIC_RECIPES", transformed);
      return transformed;
    } catch (error) {
      console.error("Error fetching public recipes:", error);
      commit("SET_ERROR", error.message);
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchUserRecipeById({ commit, rootGetters }, recipeId) {
    const user = rootGetters["auth/user"];
    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const recipe = await supabaseService.getRecipeById(
        recipeId,
        user?.id || null
      );
      const transformed = recipe ? transformRecipe(recipe) : null;
      commit("SET_CURRENT_USER_RECIPE", transformed);
      return transformed;
    } catch (error) {
      console.error("Error fetching recipe:", error);
      commit("SET_ERROR", error.message);
      return null;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createRecipe({ commit, rootGetters }, { recipe, imageFile }) {
    const user = rootGetters["auth/user"];
    if (!user) throw new Error("You must be signed in to create a recipe.");

    commit("SET_LOADING", true);
    commit("SET_UPLOADING", !!imageFile);
    commit("CLEAR_ERROR");

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await supabaseService.uploadRecipeImage(user.id, imageFile);
        commit("SET_UPLOADING", false);
      }

      const created = await supabaseService.createRecipe(user.id, {
        ...recipe,
        imageUrl,
      });

      const transformed = transformRecipe(created);
      commit("ADD_USER_RECIPE", transformed);
      if (transformed.isPublic) {
        commit("SET_PUBLIC_RECIPES", [transformed, ...state.publicRecipes]);
      }
      return transformed;
    } catch (error) {
      console.error("Error creating recipe:", error);
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
      commit("SET_UPLOADING", false);
    }
  },

  async deleteRecipe({ commit, rootGetters, state }, recipeId) {
    const user = rootGetters["auth/user"];
    if (!user) throw new Error("You must be signed in.");

    commit("CLEAR_ERROR");

    try {
      const recipe = state.userRecipes.find((r) => r.id === recipeId);
      if (recipe?.image) {
        await supabaseService.deleteRecipeImage(recipe.image);
      }
      await supabaseService.deleteRecipe(user.id, recipeId);
      commit("REMOVE_USER_RECIPE", recipeId);
      commit(
        "SET_PUBLIC_RECIPES",
        state.publicRecipes.filter((r) => r.id !== recipeId)
      );
      return true;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      commit("SET_ERROR", error.message);
      throw error;
    }
  },

  clearCurrentUserRecipe({ commit }) {
    commit("SET_CURRENT_USER_RECIPE", null);
  },

  clearError({ commit }) {
    commit("CLEAR_ERROR");
  },
};

const getters = {
  userRecipes: (state) => state.userRecipes,
  publicRecipes: (state) => state.publicRecipes,
  currentUserRecipe: (state) => state.currentUserRecipe,
  loading: (state) => state.loading,
  uploading: (state) => state.uploading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
