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
};

const actions = {
  updateSearchQuery({ commit }, query) {
    commit("SET_SEARCH_QUERY", query);
  },

  async performSearch({ commit, state, rootGetters }) {
    commit("SET_IS_SEARCHING", true);

    try {
      // Get all recipes from the recipes module
      const allRecipes = rootGetters["recipes/allRecipes"];

      let filteredRecipes = allRecipes;

      // Apply text search
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(query)
            )
        );
      }

      // Apply filters
      if (state.filters.cuisine) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.cuisine.toLowerCase() === state.filters.cuisine.toLowerCase()
        );
      }

      if (state.filters.dietary) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.dietary.some(
            (d) => d.toLowerCase() === state.filters.dietary.toLowerCase()
          )
        );
      }

      if (state.filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.difficulty.toLowerCase() ===
            state.filters.difficulty.toLowerCase()
        );
      }

      if (state.filters.maxCookTime) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.cookTime <= state.filters.maxCookTime
        );
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      commit("SET_SEARCH_RESULTS", filteredRecipes);
    } catch (error) {
      console.error("Search error:", error);
      commit("SET_SEARCH_RESULTS", []);
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
  },
};

const getters = {
  searchQuery: (state) => state.searchQuery,
  searchResults: (state) => state.searchResults,
  filters: (state) => state.filters,
  isSearching: (state) => state.isSearching,
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
