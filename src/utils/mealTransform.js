// Utility functions to transform TheMealDB data to our app's format

// Helper function to extract ingredients from TheMealDB format
function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        amount: measure ? measure.trim() : "",
        combined: measure
          ? `${measure.trim()} ${ingredient.trim()}`
          : ingredient.trim(),
      });
    }
  }
  return ingredients;
}

// Helper function to extract dietary tags
function extractDietaryTags(meal) {
  const tags = [];

  // Check category for dietary information
  const category = meal.strCategory?.toLowerCase() || "";
  if (category.includes("vegetarian")) tags.push("Vegetarian");
  if (category.includes("vegan")) tags.push("Vegan");
  if (category.includes("seafood")) tags.push("Pescatarian");

  // Check tags field
  const mealTags = meal.strTags
    ? meal.strTags.split(",").map((tag) => tag.trim())
    : [];
  mealTags.forEach((tag) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes("vegetarian")) tags.push("Vegetarian");
    if (lowerTag.includes("vegan")) tags.push("Vegan");
    if (lowerTag.includes("gluten")) tags.push("Gluten-Free");
    if (lowerTag.includes("dairy") && lowerTag.includes("free"))
      tags.push("Dairy-Free");
  });

  // Remove duplicates
  return [...new Set(tags)];
}

// Helper function to estimate difficulty based on ingredient count and instructions
function estimateDifficulty(meal) {
  const ingredients = extractIngredients(meal);
  const instructions = meal.strInstructions || "";
  const steps = instructions
    .split(".")
    .filter((step) => step.trim().length > 10);

  if (ingredients.length <= 5 && steps.length <= 5) return "Easy";
  if (ingredients.length <= 10 && steps.length <= 10) return "Medium";
  return "Hard";
}

// Helper function to estimate cooking time
function estimateCookTime(meal) {
  const instructions = meal.strInstructions?.toLowerCase() || "";

  // Look for time indicators in instructions
  const timePatterns = [
    /(\d+)\s*hours?/g,
    /(\d+)\s*minutes?/g,
    /(\d+)\s*mins?/g,
    /(\d+)\s*h/g,
    /(\d+)\s*m/g,
  ];

  let totalMinutes = 0;
  let foundTime = false;

  timePatterns.forEach((pattern) => {
    const matches = [...instructions.matchAll(pattern)];
    matches.forEach((match) => {
      const time = parseInt(match[1]);
      if (pattern.source.includes("hour")) {
        totalMinutes += time * 60;
      } else {
        totalMinutes += time;
      }
      foundTime = true;
    });
  });

  // If no time found, estimate based on difficulty
  if (!foundTime) {
    const difficulty = estimateDifficulty(meal);
    switch (difficulty) {
      case "Easy":
        return 20;
      case "Medium":
        return 35;
      case "Hard":
        return 60;
      default:
        return 30;
    }
  }

  return totalMinutes || 30;
}

// Helper function to estimate servings
function estimateServings(meal) {
  const instructions = meal.strInstructions?.toLowerCase() || "";

  // Look for serving indicators
  const servingPatterns = [
    /serves?\s*(\d+)/g,
    /(\d+)\s*servings?/g,
    /(\d+)\s*people/g,
    /(\d+)\s*portions?/g,
  ];

  for (const pattern of servingPatterns) {
    const match = instructions.match(pattern);
    if (match) {
      const servings = parseInt(match[1]);
      if (servings >= 1 && servings <= 12) {
        return servings;
      }
    }
  }

  // Default estimate based on ingredient quantities
  const ingredients = extractIngredients(meal);
  if (ingredients.length <= 5) return 2;
  if (ingredients.length <= 10) return 4;
  return 6;
}

// Main transformation function
export function transformMealData(meal) {
  if (!meal) return null;

  const ingredients = extractIngredients(meal);
  const dietary = extractDietaryTags(meal);

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 150) +
        (meal.strInstructions.length > 150 ? "..." : "")
      : "Delicious recipe from TheMealDB",
    image: meal.strMealThumb,
    cuisine: meal.strArea || "International",
    category: meal.strCategory || "Main Course",
    cookTime: estimateCookTime(meal),
    servings: estimateServings(meal),
    difficulty: estimateDifficulty(meal),
    dietary: dietary,
    ingredients: ingredients,
    instructions: meal.strInstructions || "",
    source: meal.strSource || "",
    youtube: meal.strYoutube || "",
    tags: meal.strTags ? meal.strTags.split(",").map((tag) => tag.trim()) : [],
    // Additional TheMealDB specific data
    originalData: {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strDrinkAlternate: meal.strDrinkAlternate,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strTags: meal.strTags,
      strYoutube: meal.strYoutube,
      strSource: meal.strSource,
      strImageSource: meal.strImageSource,
      strCreativeCommonsConfirmed: meal.strCreativeCommonsConfirmed,
      dateModified: meal.dateModified,
    },
  };
}

// Transform multiple meals
export function transformMealsData(meals) {
  if (!Array.isArray(meals)) return [];
  return meals.map(transformMealData).filter((meal) => meal !== null);
}

// Helper function to create a short description from instructions
export function createShortDescription(instructions) {
  if (!instructions) return "Delicious recipe";

  // Get first sentence or first 150 characters
  const sentences = instructions.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();

  if (firstSentence && firstSentence.length <= 150) {
    return firstSentence;
  }

  return (
    instructions.substring(0, 150) + (instructions.length > 150 ? "..." : "")
  );
}

export default {
  transformMealData,
  transformMealsData,
  extractIngredients,
  extractDietaryTags,
  estimateDifficulty,
  estimateCookTime,
  estimateServings,
  createShortDescription,
};
