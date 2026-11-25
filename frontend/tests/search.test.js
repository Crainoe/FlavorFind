import { beforeEach, describe, expect, it, vi } from "vitest";
import searchModule from "../src/store/modules/search.js";
import mealService from "../src/services/mealService.js";
import recipeService from "../src/services/recipeService.js";

vi.mock("../src/services/mealService.js", () => ({
  default: { searchMeals: vi.fn(), getMealsByArea: vi.fn() },
}));
vi.mock("../src/services/recipeService.js", () => ({
  default: { searchPublicRecipes: vi.fn(), getPublicRecipes: vi.fn() },
}));

function harness() {
  const state = structuredClone(searchModule.state);
  const commit = (name, payload) => searchModule.mutations[name](state, payload);
  const context = {
    state,
    commit,
    rootGetters: { "recipes/allRecipes": [] },
    dispatch: (name, payload) => searchModule.actions[name](context, payload),
  };
  return context;
}

describe("search requests and filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    recipeService.searchPublicRecipes.mockResolvedValue([]);
    recipeService.getPublicRecipes.mockResolvedValue([]);
  });

  it("applies local filters without repeating network searches", async () => {
    const context = harness();
    context.commit("SET_SEARCH_QUERY", "curry");
    mealService.searchMeals.mockResolvedValue([{
      idMeal: "1",
      strMeal: "Curry",
      strCategory: "Vegetarian",
      strInstructions: "Cook for 25 minutes.",
    }]);

    await searchModule.actions.performSearch(context);
    await searchModule.actions.updateFilter(context, { filterType: "dietary", value: "Vegetarian" });
    await searchModule.actions.updateFilter(context, { filterType: "maxCookTime", value: 30 });

    expect(mealService.searchMeals).toHaveBeenCalledTimes(1);
    expect(recipeService.searchPublicRecipes).toHaveBeenCalledTimes(1);
    expect(searchModule.getters.searchResults(context.state)).toHaveLength(1);

    await searchModule.actions.updateFilter(context, { filterType: "maxCookTime", value: 15 });
    expect(searchModule.getters.searchResults(context.state)).toHaveLength(0);
  });

  it("keeps the latest search when an older request finishes last", async () => {
    const context = harness();
    let finishOldSearch;
    mealService.searchMeals
      .mockImplementationOnce(() => new Promise((resolve) => { finishOldSearch = resolve; }))
      .mockResolvedValueOnce([{ idMeal: "2", strMeal: "New result" }]);

    context.commit("SET_SEARCH_QUERY", "old");
    const oldRequest = searchModule.actions.performSearch(context);
    context.commit("SET_SEARCH_QUERY", "new");
    await searchModule.actions.performSearch(context);
    finishOldSearch([{ idMeal: "1", strMeal: "Old result" }]);
    await oldRequest;

    expect(context.state.searchResults.map((recipe) => recipe.id)).toEqual(["2"]);
    expect(context.state.isSearching).toBe(false);
  });
});
