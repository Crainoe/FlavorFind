// Convert a Supabase recipe row to the shape shared by recipe views and search.
export function transformUserRecipe(row, { includeDetails = true } = {}) {
  return {
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
    ...(includeDetails && {
      ingredients: row.ingredients || [],
      instructions: row.instructions || [],
    }),
    isPublic: row.is_public,
    isUserRecipe: true,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

export function transformUserRecipeForSearch(row) {
  return {
    ...transformUserRecipe(row, { includeDetails: false }),
    difficulty: null,
    dietary: [],
  };
}
