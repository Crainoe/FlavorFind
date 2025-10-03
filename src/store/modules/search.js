import mealService from "@/services/mealService";
import { transformMealsData } from "@/utils/mealTransform";

const state = {
  searchQuery: "",
  searchResults: [],
  filters: {
    cuisine: "",
    dietary: "",
    difficulty: "",
    maxCookTime: null,
  },
  isSearching: false,
  error: null,
};

const mutations = {
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  },

  SET_SEARCH_RESULTS(state, results) {
    state.searchResults = results;
  },

  SET_FILTER(state, { filterType, value }) {
    state.filters[filterType] = value;
  },

  CLEAR_FILTERS(state) {
    state.filters = {
      cuisine: "",
      dietary: "",
      difficulty: "",
      maxCookTime: null,
    };
  },

  SET_IS_SEARCHING(state, isSearching) {
    state.isSearching = isSearching;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  updateSearchQuery({ commit }, query) {
    commit("SET_SEARCH_QUERY", query);
  },

  async performSearch({ commit, state, rootGetters }) {
    commit("SET_IS_SEARCHING", true);
    commit("CLEAR_ERROR");

    try {
      let searchResults = [];

      // If there's a text search query, use API search
      if (state.searchQuery.trim()) {
        const rawMeals = await mealService.searchMeals(state.searchQuery);
        searchResults = transformMealsData(rawMeals);
      } else {
        // If no text query but filters are applied, get recipes by category/area
        if (state.filters.cuisine) {
          const rawMeals = await mealService.getMealsByArea(
            state.filters.cuisine
          );
          searchResults = transformMealsData(rawMeals);
        } else {
          // No search query and no cuisine filter - get cached recipes from store
          searchResults = rootGetters["recipes/allRecipes"];
        }
      }

      // Apply local filters to the API results
      let filteredRecipes = searchResults;

      // Apply dietary filter (this needs to be done locally as API doesn't support it)
      if (state.filters.dietary) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.dietary.some(
            (d) => d.toLowerCase() === state.filters.dietary.toLowerCase()
          )
        );
      }

      // Apply difficulty filter
      if (state.filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.difficulty.toLowerCase() ===
            state.filters.difficulty.toLowerCase()
        );
      }

      // Apply max cook time filter
      if (state.filters.maxCookTime) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.cookTime <= state.filters.maxCookTime
        );
      }

      commit("SET_SEARCH_RESULTS", filteredRecipes);
    } catch (error) {
      console.error("Search error:", error);
      commit("SET_ERROR", "Failed to search recipes. Please try again.");
      commit("SET_SEARCH_RESULTS", []);
    } finally {
      commit("SET_IS_SEARCHING", false);
    }
  },

  async searchByCategory({ commit }, category) {
    commit("SET_IS_SEARCHING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeals = await mealService.getMealsByCategory(category);
      const transformedRecipes = transformMealsData(rawMeals);
      commit("SET_SEARCH_RESULTS", transformedRecipes);
      commit("SET_FILTER", { filterType: "cuisine", value: "" }); // Clear cuisine filter
      return transformedRecipes;
    } catch (error) {
      console.error("Category search error:", error);
      commit("SET_ERROR", "Failed to search by category.");
      commit("SET_SEARCH_RESULTS", []);
      return [];
    } finally {
      commit("SET_IS_SEARCHING", false);
    }
  },

  async searchByCuisine({ commit }, cuisine) {
    commit("SET_IS_SEARCHING", true);
    commit("CLEAR_ERROR");

    try {
      const rawMeals = await mealService.getMealsByArea(cuisine);
      const transformedRecipes = transformMealsData(rawMeals);
      commit("SET_SEARCH_RESULTS", transformedRecipes);
      commit("SET_FILTER", { filterType: "cuisine", value: cuisine });
      return transformedRecipes;
    } catch (error) {
      console.error("Cuisine search error:", error);
      commit("SET_ERROR", "Failed to search by cuisine.");
      commit("SET_SEARCH_RESULTS", []);
      return [];
    } finally {
      commit("SET_IS_SEARCHING", false);
    }
  },

  updateFilter({ commit, dispatch }, { filterType, value }) {
    commit("SET_FILTER", { filterType, value });
    dispatch("performSearch");
  },

  clearFilters({ commit, dispatch }) {
    commit("CLEAR_FILTERS");
    dispatch("performSearch");
  },

  clearSearch({ commit }) {
    commit("SET_SEARCH_QUERY", "");
    commit("SET_SEARCH_RESULTS", []);
    commit("CLEAR_ERROR");
  },

  clearError({ commit }) {
    commit("CLEAR_ERROR");
  },
};

const getters = {
  searchQuery: (state) => state.searchQuery,
  searchResults: (state) => state.searchResults,
  filters: (state) => state.filters,
  isSearching: (state) => state.isSearching,
  error: (state) => state.error,
  hasActiveFilters: (state) => {
    return Object.values(state.filters).some(
      (value) => value !== "" && value !== null
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
