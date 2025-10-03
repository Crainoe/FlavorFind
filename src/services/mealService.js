// TheMealDB API Service - Free Tier
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const mealService = {
  // Get random meals
  async getRandomMeals(count = 6) {
    try {
      const meals = [];
      for (let i = 0; i < count; i++) {
        const response = await fetch(`${BASE_URL}/random.php`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.meals && data.meals[0]) {
          meals.push(data.meals[0]);
        }
      }
      return meals;
    } catch (error) {
      console.error("Error fetching random meals:", error);
      throw error;
    }
  },

  // Search meals by name
  async searchMeals(query) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals:", error);
      throw error;
    }
  },

  // Search meals by first letter
  async searchMealsByLetter(letter) {
    try {
      const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals by letter:", error);
      throw error;
    }
  },

  // Get meal details by ID
  async getMealById(id) {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching meal by ID:", error);
      throw error;
    }
  },

  // Get meals by category
  async getMealsByCategory(category) {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by category:", error);
      throw error;
    }
  },

  // Get meals by area/cuisine
  async getMealsByArea(area) {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by area:", error);
      throw error;
    }
  },

  // Get all categories
  async getCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get all areas/cuisines
  async getAreas() {
    try {
      const response = await fetch(`${BASE_URL}/list.php?a=list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching areas:", error);
      throw error;
    }
  },

  // Get all ingredients
  async getIngredients() {
    try {
      const response = await fetch(`${BASE_URL}/list.php?i=list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      throw error;
    }
  },
};

export default mealService;
