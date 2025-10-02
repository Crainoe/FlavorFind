// Sample recipes data - replace with API integration later
const sampleRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    description:
      "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Italian",
    dietary: ["Vegetarian"],
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella",
      "Fresh basil leaves",
      "Olive oil",
      "Salt",
    ],
    instructions: [
      "Preheat oven to 475°F",
      "Roll out pizza dough",
      "Spread tomato sauce evenly",
      "Add mozzarella cheese",
      "Bake for 12-15 minutes",
      "Add fresh basil and serve",
    ],
  },
  {
    id: 2,
    title: "Chicken Teriyaki Bowl",
    description:
      "Delicious Japanese-inspired chicken bowl with steamed vegetables",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    cookTime: 30,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Japanese",
    dietary: ["Gluten-Free"],
    ingredients: [
      "Chicken breast",
      "Teriyaki sauce",
      "White rice",
      "Broccoli",
      "Carrots",
      "Sesame seeds",
    ],
    instructions: [
      "Cook rice according to package directions",
      "Cut chicken into strips",
      "Cook chicken in teriyaki sauce",
      "Steam vegetables",
      "Serve over rice with sesame seeds",
    ],
  },
  {
    id: 3,
    title: "Mediterranean Quinoa Salad",
    description: "Fresh and healthy quinoa salad with Mediterranean flavors",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    ingredients: [
      "Quinoa",
      "Cherry tomatoes",
      "Cucumber",
      "Red onion",
      "Feta cheese",
      "Olive oil",
      "Lemon juice",
      "Fresh herbs",
    ],
    instructions: [
      "Cook quinoa and let cool",
      "Dice vegetables",
      "Mix quinoa with vegetables",
      "Add feta and herbs",
      "Dress with olive oil and lemon",
      "Season and serve",
    ],
  },
];

const state = {
  allRecipes: sampleRecipes,
  currentRecipe: null,
  loading: false,
  error: null,
};

const mutations = {
  SET_RECIPES(state, recipes) {
    state.allRecipes = recipes;
  },
  SET_CURRENT_RECIPE(state, recipe) {
    state.currentRecipe = recipe;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_RECIPE(state, recipe) {
    state.allRecipes.push({
      ...recipe,
      id: Math.max(...state.allRecipes.map((r) => r.id)) + 1,
    });
  },
};

const actions = {
  async fetchRecipes({ commit }) {
    commit("SET_LOADING", true);
    try {
      // TODO: Replace with actual API call
      // For now, use sample data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      commit("SET_RECIPES", sampleRecipes);
      commit("SET_ERROR", null);
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchRecipeById({ commit, state }, id) {
    commit("SET_LOADING", true);
    try {
      // TODO: Replace with actual API call
      const recipe = state.allRecipes.find((r) => r.id === parseInt(id));
      if (recipe) {
        commit("SET_CURRENT_RECIPE", recipe);
        commit("SET_ERROR", null);
      } else {
        throw new Error("Recipe not found");
      }
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  clearCurrentRecipe({ commit }) {
    commit("SET_CURRENT_RECIPE", null);
  },
};

const getters = {
  allRecipes: (state) => state.allRecipes,
  currentRecipe: (state) => state.currentRecipe,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  recipesByDietary: (state) => (dietary) => {
    return state.allRecipes.filter((recipe) =>
      recipe.dietary.some((d) => d.toLowerCase() === dietary.toLowerCase())
    );
  },
  recipesByCuisine: (state) => (cuisine) => {
    return state.allRecipes.filter(
      (recipe) => recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
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
