import recipeService from "../../services/recipeService.js";
import recipeImageService from "../../services/recipeImageService.js";
import { transformUserRecipe } from "../../utils/userRecipeTransform.js";

const PUBLIC_PAGE_SIZE = 24;

const state = {
  userRecipes: [],
  publicRecipes: [],
  publicRecipesLoaded: false,
  publicPage: 0,
  hasMorePublicRecipes: true,
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
  SET_PUBLIC_RECIPES_LOADED(state, loaded) {
    state.publicRecipesLoaded = loaded;
  },
  SET_PUBLIC_PAGE(state, page) {
    state.publicPage = page;
  },
  SET_HAS_MORE_PUBLIC_RECIPES(state, hasMore) {
    state.hasMorePublicRecipes = hasMore;
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

const actions = {
  async fetchUserRecipes({ commit, rootGetters }) {
    const user = rootGetters["auth/user"];
    if (!user) return [];

    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const recipes = await recipeService.getUserRecipes(user.id);
      const transformed = recipes.map(transformUserRecipe);
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
    if (state.publicRecipesLoaded) return state.publicRecipes;

    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const recipes = await recipeService.getPublicRecipes({ pageSize: PUBLIC_PAGE_SIZE });
      const transformed = recipes.map(transformUserRecipe);
      commit("SET_PUBLIC_RECIPES", transformed);
      commit("SET_PUBLIC_RECIPES_LOADED", true);
      commit("SET_PUBLIC_PAGE", 0);
      commit("SET_HAS_MORE_PUBLIC_RECIPES", recipes.length === PUBLIC_PAGE_SIZE);
      return transformed;
    } catch (error) {
      console.error("Error fetching public recipes:", error);
      commit("SET_ERROR", error.message);
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchMorePublicRecipes({ commit, state }) {
    if (state.loading || !state.hasMorePublicRecipes) return [];
    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");
    try {
      const nextPage = state.publicPage + 1;
      const recipes = await recipeService.getPublicRecipes({
        page: nextPage,
        pageSize: PUBLIC_PAGE_SIZE,
      });
      const transformed = recipes.map(transformUserRecipe);
      const existingIds = new Set(state.publicRecipes.map((recipe) => recipe.id));
      commit("SET_PUBLIC_RECIPES", [
        ...state.publicRecipes,
        ...transformed.filter((recipe) => !existingIds.has(recipe.id)),
      ]);
      commit("SET_PUBLIC_PAGE", nextPage);
      commit("SET_HAS_MORE_PUBLIC_RECIPES", recipes.length === PUBLIC_PAGE_SIZE);
      return transformed;
    } catch (error) {
      console.error("Error fetching more public recipes:", error);
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
      const recipe = await recipeService.getRecipeById(
        recipeId,
        user?.id || null
      );
      const transformed = recipe ? transformUserRecipe(recipe) : null;
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

  async createRecipe({ commit, rootGetters, state }, { recipe, imageFile }) {
    const user = rootGetters["auth/user"];
    if (!user) throw new Error("You must be signed in to create a recipe.");

    commit("SET_LOADING", true);
    commit("SET_UPLOADING", !!imageFile);
    commit("CLEAR_ERROR");

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await recipeImageService.uploadRecipeImage(user.id, imageFile);
        commit("SET_UPLOADING", false);
      }

      const created = await recipeService.createRecipe(user.id, {
        ...recipe,
        imageUrl,
      });

      const transformed = transformUserRecipe(created);
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
        await recipeImageService.deleteRecipeImage(recipe.image);
      }
      await recipeService.deleteRecipe(user.id, recipeId);
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
  hasMorePublicRecipes: (state) => state.hasMorePublicRecipes,
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
