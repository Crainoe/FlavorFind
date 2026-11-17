import { describe, expect, it } from "vitest";
import {
  createShortDescription,
  transformMealData,
  transformMealsData,
} from "../src/utils/mealTransform.js";

const meal = {
  idMeal: "42",
  strMeal: "Vegetable Curry",
  strArea: "Indian",
  strCategory: "Vegetarian",
  strInstructions: "Serves 4. Cook for 25 minutes. Add the vegetables and simmer.",
  strMealThumb: "https://example.com/curry.jpg",
  strIngredient1: " Carrot ",
  strMeasure1: "2",
  strIngredient2: "Onion",
  strMeasure2: "1",
  strTags: "Vegan,Gluten Free",
};

describe("meal transformations", () => {
  it("normalizes a TheMealDB meal", () => {
    const result = transformMealData(meal);

    expect(result).toMatchObject({
      id: "42",
      title: "Vegetable Curry",
      cuisine: "Indian",
      servings: 4,
      cookTime: 25,
      difficulty: "Easy",
    });
    expect(result.ingredients).toEqual([
      { name: "Carrot", amount: "2", combined: "2 Carrot" },
      { name: "Onion", amount: "1", combined: "1 Onion" },
    ]);
    expect(result.dietary).toEqual(
      expect.arrayContaining(["Vegetarian", "Vegan", "Gluten-Free"]),
    );
  });

  it("handles empty and invalid collections safely", () => {
    expect(transformMealData(null)).toBeNull();
    expect(transformMealsData(null)).toEqual([]);
    expect(transformMealsData([meal, null])).toHaveLength(1);
  });

  it("creates a concise description", () => {
    expect(createShortDescription("Mix everything. Then bake it.")).toBe(
      "Mix everything",
    );
    expect(createShortDescription("")).toBe("Delicious recipe");
  });
});
