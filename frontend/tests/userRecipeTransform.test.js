import { describe, expect, it } from "vitest";
import {
  transformUserRecipe,
  transformUserRecipeForSearch,
} from "../src/utils/userRecipeTransform.js";

describe("user recipe transformations", () => {
  it("keeps stored values and does not invent missing search metadata", () => {
    const row = {
      id: "recipe-1",
      title: "Soup",
      image_url: "https://example.com/soup.jpg",
      cook_time: null,
      servings: null,
      ingredients: ["Carrot"],
      instructions: ["Simmer"],
      is_public: true,
    };

    expect(transformUserRecipe(row)).toMatchObject({
      id: "recipe-1",
      title: "Soup",
      cookTime: null,
      servings: null,
      ingredients: ["Carrot"],
      instructions: ["Simmer"],
      isPublic: true,
    });
    expect(transformUserRecipeForSearch(row)).toMatchObject({
      id: "recipe-1",
      cookTime: null,
      servings: null,
      difficulty: null,
      dietary: [],
    });
    expect(transformUserRecipeForSearch(row)).not.toHaveProperty("ingredients");
    expect(transformUserRecipeForSearch(row)).not.toHaveProperty("instructions");
  });
});
