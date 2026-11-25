import mealService from "@/services/mealService";
import recipeService from "@/services/recipeService";
import { transformMealsData } from "@/utils/mealTransform";
import { transformUserRecipeForSearch } from "@/utils/userRecipeTransform";

let latestSearchId = 0;
const PUBLIC_PAGE_SIZE = 24;

const state = {
  searchQuery: "",
  searchResults: [],
  hasLoadedResults: false,
  publicPage: 0,
  hasMorePublicResults: false,
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
    state.hasLoadedResults = true;
  },
  RESET_SEARCH_RESULTS(state) {
    state.searchResults = [];
    state.hasLoadedResults = false;
    state.hasMorePublicResults = false;
  },
  SET_PUBLIC_PAGE(state, page) {
    state.publicPage = page;
  },
  SET_HAS_MORE_PUBLIC_RESULTS(state, hasMore) {
    state.hasMorePublicResults = hasMore;
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
  updateSearchQuery({ commit, state }, query) {
    if (state.searchQuery !== query) {
      ++latestSearchId;
      commit("SET_IS_SEARCHING", false);
    }
    commit("SET_SEARCH_QUERY", query);
  },

  async performSearch({ commit, state, rootGetters }) {
    const searchId = ++latestSearchId;
    const query = state.searchQuery.trim();
    const cuisine = state.filters.cuisine;
    const maxCookTime = state.filters.maxCookTime;
    const includeCommunity = !state.filters.dietary && !state.filters.difficulty;
    commit("SET_IS_SEARCHING", true);
    commit("CLEAR_ERROR");

    try {
      let searchResults = [];
      let publicError = false;
      const publicOptions = { pageSize: PUBLIC_PAGE_SIZE, cuisine, maxCookTime };
      const publicRequest = (includeCommunity
        ? query
          ? recipeService.searchPublicRecipes(query, publicOptions)
          : recipeService.getPublicRecipes(publicOptions)
        : Promise.resolve([])
      ).catch((error) => {
        console.warn("Could not load user recipes for search:", error);
        publicError = true;
        return [];
      });

      // If there's a text search query, use API search
      if (query) {
        const rawMeals = await mealService.searchMeals(query);
        searchResults = transformMealsData(rawMeals);
      } else {
        // If no text query but filters are applied, get recipes by category/area
        if (cuisine) {
          const rawMeals = await mealService.getMealsByArea(cuisine);
          // The area filter endpoint returns summary rows without strArea.
          searchResults = transformMealsData(rawMeals).map((recipe) => ({ ...recipe, cuisine }));
        } else {
          // No search query and no cuisine filter - get cached recipes from store
          searchResults = rootGetters["recipes/allRecipes"];
        }
      }

      const userRecipes = await publicRequest;
      if (userRecipes.length > 0) {
        const existingIds = new Set(searchResults.map((recipe) => recipe.id));
        const toAdd = userRecipes
          .map(transformUserRecipeForSearch)
          .filter((recipe) => !existingIds.has(recipe.id));
        searchResults = [...toAdd, ...searchResults];
      }

      if (searchId === latestSearchId) {
        if (publicError) commit("SET_ERROR", "Community recipes could not be loaded. Showing available results.");
        commit("SET_SEARCH_RESULTS", searchResults);
        commit("SET_PUBLIC_PAGE", 0);
        commit("SET_HAS_MORE_PUBLIC_RESULTS", includeCommunity && userRecipes.length === PUBLIC_PAGE_SIZE);
      }
    } catch (error) {
      if (searchId === latestSearchId) {
        console.error("Search error:", error);
        commit("SET_ERROR", "Failed to search recipes. Please try again.");
        commit("SET_SEARCH_RESULTS", []);
        commit("SET_HAS_MORE_PUBLIC_RESULTS", false);
      }
    } finally {
      if (searchId === latestSearchId) commit("SET_IS_SEARCHING", false);
    }
  },

  async loadMorePublicResults({ commit, state }) {
    if (state.isSearching || !state.hasMorePublicResults || state.filters.dietary || state.filters.difficulty) return [];
    const searchId = latestSearchId;
    const query = state.searchQuery.trim();
    const { cuisine, maxCookTime } = state.filters;
    const nextPage = state.publicPage + 1;
    commit("SET_IS_SEARCHING", true);
    try {
      const rows = query
        ? await recipeService.searchPublicRecipes(query, { page: nextPage, pageSize: PUBLIC_PAGE_SIZE, cuisine, maxCookTime })
        : await recipeService.getPublicRecipes({ page: nextPage, pageSize: PUBLIC_PAGE_SIZE, cuisine, maxCookTime });
      if (searchId !== latestSearchId) return [];
      const existingIds = new Set(state.searchResults.map((recipe) => recipe.id));
      const toAdd = rows.map(transformUserRecipeForSearch).filter((recipe) => !existingIds.has(recipe.id));
      commit("SET_SEARCH_RESULTS", [...state.searchResults, ...toAdd]);
      commit("SET_PUBLIC_PAGE", nextPage);
      commit("SET_HAS_MORE_PUBLIC_RESULTS", rows.length === PUBLIC_PAGE_SIZE);
      return toAdd;
    } catch {
      if (searchId === latestSearchId) commit("SET_ERROR", "Failed to load more recipes.");
      return [];
    } finally {
      if (searchId === latestSearchId) commit("SET_IS_SEARCHING", false);
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
      const transformedRecipes = transformMealsData(rawMeals).map((recipe) => ({ ...recipe, cuisine }));
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

  updateFilter({ commit, dispatch, state }, { filterType, value }) {
    const sourceChanged = ["cuisine", "maxCookTime"].includes(filterType) && state.filters[filterType] !== value;
    const communityWasExcluded = !!state.filters.dietary || !!state.filters.difficulty;
    commit("SET_FILTER", { filterType, value });
    const communityIsExcluded = !!state.filters.dietary || !!state.filters.difficulty;
    const hasFilters = Object.values(state.filters).some((filter) => filter !== "" && filter !== null);
    if (!state.searchQuery.trim() && !hasFilters) {
      ++latestSearchId;
      commit("RESET_SEARCH_RESULTS");
      commit("SET_IS_SEARCHING", false);
      return;
    }
    if (sourceChanged || (communityWasExcluded && !communityIsExcluded) || !state.hasLoadedResults) {
      return dispatch("performSearch");
    }
  },

  clearFilters({ commit, dispatch, state }) {
    const hadSourceFilter = !!state.filters.cuisine || state.filters.maxCookTime != null;
    commit("CLEAR_FILTERS");
    if (hadSourceFilter && state.searchQuery.trim()) {
      return dispatch("performSearch");
    }
    if (hadSourceFilter && !state.searchQuery.trim()) {
      ++latestSearchId;
      commit("RESET_SEARCH_RESULTS");
      commit("SET_IS_SEARCHING", false);
    }
  },

  resetSearch({ commit }) {
    ++latestSearchId;
    commit("SET_SEARCH_QUERY", "");
    commit("CLEAR_FILTERS");
    commit("RESET_SEARCH_RESULTS");
    commit("SET_IS_SEARCHING", false);
    commit("CLEAR_ERROR");
  },

  clearSearch({ commit, dispatch, state }) {
    ++latestSearchId;
    commit("SET_SEARCH_QUERY", "");
    commit("RESET_SEARCH_RESULTS");
    commit("SET_IS_SEARCHING", false);
    commit("CLEAR_ERROR");
    if (Object.values(state.filters).some((value) => value !== "" && value !== null)) {
      return dispatch("performSearch");
    }
  },

  clearError({ commit }) {
    commit("CLEAR_ERROR");
  },
};

const getters = {
  searchQuery: (state) => state.searchQuery,
  searchResults: (state) => {
    const { cuisine, dietary, difficulty, maxCookTime } = state.filters;
    return state.searchResults.filter((recipe) =>
      (!cuisine || recipe.cuisine?.toLowerCase() === cuisine.toLowerCase()) &&
      (!dietary || recipe.dietary?.some((tag) => tag.toLowerCase() === dietary.toLowerCase())) &&
      (!difficulty || recipe.difficulty?.toLowerCase() === difficulty.toLowerCase()) &&
      (!maxCookTime || (recipe.cookTime != null && recipe.cookTime <= maxCookTime))
    );
  },
  filters: (state) => state.filters,
  isSearching: (state) => state.isSearching,
  hasMorePublicResults: (state) => state.hasMorePublicResults && !state.filters.dietary && !state.filters.difficulty,
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
