import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/services/favoritesService.js", () => ({
  default: {
    addToFavorites: vi.fn(),
    getFavorites: vi.fn(),
  },
}));
vi.mock("../src/services/recipeService.js", () => ({
  default: { getRecipeById: vi.fn() },
}));

import favorites from "../src/store/modules/favorites.js";
import favoritesService from "../src/services/favoritesService.js";

const storage = new Map();
const localStorageMock = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

function context(user = null) {
  const state = { favoriteRecipes: [], loading: false, error: null };
  return {
    state,
    rootGetters: { "auth/user": user },
    commit(type, payload) {
      favorites.mutations[type](state, payload);
    },
  };
}

describe("favorites", () => {
  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", localStorageMock);
  });

  it("saves a transformed recipe for a guest only once", async () => {
    const ctx = context();
    const recipe = { id: "42", title: "Curry" };

    await favorites.actions.addToFavorites(ctx, recipe);
    await favorites.actions.addToFavorites(ctx, recipe);

    expect(ctx.state.favoriteRecipes).toHaveLength(1);
    expect(ctx.state.favoriteRecipes[0].recipe_id).toBe("42");
    expect(JSON.parse(storage.get("favoriteRecipes"))).toEqual([recipe]);
    expect(favorites.getters.isFavorite(ctx.state)(42)).toBe(true);
  });

  it("keeps guest favorites when cloud migration fails", async () => {
    const recipe = { id: "42", title: "Curry" };
    storage.set("favoriteRecipes", JSON.stringify([recipe]));
    favoritesService.addToFavorites.mockRejectedValueOnce(new Error("offline"));
    favoritesService.getFavorites.mockResolvedValueOnce([]);

    await favorites.actions.migrateFavoritesToSupabase(
      context({ id: "user-1" }),
    );

    expect(JSON.parse(storage.get("favoriteRecipes"))).toEqual([recipe]);
  });
});
