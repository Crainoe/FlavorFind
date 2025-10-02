const state = {
  favoriteRecipes: JSON.parse(localStorage.getItem("favoriteRecipes") || "[]"),
};

const mutations = {
  ADD_FAVORITE(state, recipe) {
    const exists = state.favoriteRecipes.find((r) => r.id === recipe.id);
    if (!exists) {
      state.favoriteRecipes.push(recipe);
      localStorage.setItem(
        "favoriteRecipes",
        JSON.stringify(state.favoriteRecipes)
      );
    }
  },

  REMOVE_FAVORITE(state, recipeId) {
    state.favoriteRecipes = state.favoriteRecipes.filter(
      (r) => r.id !== recipeId
    );
    localStorage.setItem(
      "favoriteRecipes",
      JSON.stringify(state.favoriteRecipes)
    );
  },

  CLEAR_FAVORITES(state) {
    state.favoriteRecipes = [];
    localStorage.removeItem("favoriteRecipes");
  },
};

const actions = {
  addToFavorites({ commit }, recipe) {
    commit("ADD_FAVORITE", recipe);
  },

  removeFromFavorites({ commit }, recipeId) {
    commit("REMOVE_FAVORITE", recipeId);
  },

  clearFavorites({ commit }) {
    commit("CLEAR_FAVORITES");
  },
};

const getters = {
  favoriteRecipes: (state) => state.favoriteRecipes,
  favoritesCount: (state) => state.favoriteRecipes.length,
  isFavorite: (state) => (recipeId) => {
    return state.favoriteRecipes.some((recipe) => recipe.id === recipeId);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
