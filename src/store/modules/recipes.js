import mealService from "@/services/mealService";
import { transformMealsData } from "@/utils/mealTransform";

const state = {
  allRecipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  categories: [],
  areas: [],
};

const mutations = {
  SET_LOADING(state, loading) {
    state.isLoading = loading;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_RECIPES(state, recipes) {
    state.allRecipes = recipes;
    state.lastUpdated = new Date().toISOString();
  },

  SET_CURRENT_RECIPE(state, recipe) {
    state.currentRecipe = recipe;
  },

  CLEAR_CURRENT_RECIPE(state) {
    state.currentRecipe = null;
  },

  ADD_RECIPES(state, recipes) {
    const existingIds = new Set(state.allRecipes.map((r) => r.id));
    const newRecipes = recipes.filter((r) => !existingIds.has(r.id));
    state.allRecipes.push(...newRecipes);
    state.lastUpdated = new Date().toISOString();
  },

  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },

  SET_AREAS(state, areas) {
    state.areas = areas;
  },

  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchRecipes({ commit, state }) {
    if (state.allRecipes.length > 0 && state.lastUpdated) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const lastUpdate = new Date(state.lastUpdated);
      if (lastUpdate > oneHourAgo) {
        return state.allRecipes;
      }
    }

    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeals = await mealService.getRandomMeals(12);
      const transformedRecipes = transformMealsData(rawMeals);

      commit("SET_RECIPES", transformedRecipes);
      return transformedRecipes;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      commit("SET_ERROR", "Failed to load recipes. Please try again later.");
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchMoreRecipes({ commit }, count = 6) {
    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeals = await mealService.getRandomMeals(count);
      const transformedRecipes = transformMealsData(rawMeals);

      commit("ADD_RECIPES", transformedRecipes);
      return transformedRecipes;
    } catch (error) {
      console.error("Error fetching more recipes:", error);
      commit("SET_ERROR", "Failed to load more recipes.");
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchRecipeById({ commit }, id) {
    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeal = await mealService.getMealById(id);
      if (rawMeal) {
        const transformedRecipe = transformMealsData([rawMeal])[0];
        commit("SET_CURRENT_RECIPE", transformedRecipe);
        return transformedRecipe;
      } else {
        commit("SET_ERROR", "Recipe not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
      commit("SET_ERROR", "Failed to load recipe details.");
      return null;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchRecipesByCategory({ commit }, category) {
    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeals = await mealService.getMealsByCategory(category);
      const transformedRecipes = transformMealsData(rawMeals);
      return transformedRecipes;
    } catch (error) {
      console.error("Error fetching recipes by category:", error);
      commit("SET_ERROR", "Failed to load recipes by category.");
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchRecipesByArea({ commit }, area) {
    commit("SET_LOADING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeals = await mealService.getMealsByArea(area);
      const transformedRecipes = transformMealsData(rawMeals);
      return transformedRecipes;
    } catch (error) {
      console.error("Error fetching recipes by area:", error);
      commit("SET_ERROR", "Failed to load recipes by cuisine.");
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchCategories({ commit }) {
    try {
      const categories = await mealService.getCategories();
      commit("SET_CATEGORIES", categories);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async fetchAreas({ commit }) {
    try {
      const areas = await mealService.getAreas();
      commit("SET_AREAS", areas);
      return areas;
    } catch (error) {
      console.error("Error fetching areas:", error);
      return [];
    }
  },

  clearError({ commit }) {
    commit("CLEAR_ERROR");
  },

  clearCurrentRecipe({ commit }) {
    commit("CLEAR_CURRENT_RECIPE");
  },
};

const getters = {
  allRecipes: (state) => state.allRecipes,
  currentRecipe: (state) => state.currentRecipe,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  lastUpdated: (state) => state.lastUpdated,
  categories: (state) => state.categories,
  areas: (state) => state.areas,

  getRecipeById: (state) => (id) => {
    return state.allRecipes.find(
      (recipe) => recipe.id === id || recipe.id === parseInt(id)
    );
  },

  getRecipesByCategory: (state) => (category) => {
    return state.allRecipes.filter(
      (recipe) => recipe.category?.toLowerCase() === category.toLowerCase()
    );
  },

  getRecipesByCuisine: (state) => (cuisine) => {
    return state.allRecipes.filter(
      (recipe) => recipe.cuisine?.toLowerCase() === cuisine.toLowerCase()
    );
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
