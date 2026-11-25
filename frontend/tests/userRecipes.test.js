import { beforeEach, describe, expect, it, vi } from "vitest";
import module from "../src/store/modules/userRecipes.js";
import recipeService from "../src/services/recipeService.js";
import recipeImageService from "../src/services/recipeImageService.js";

vi.mock("../src/services/recipeService.js", () => ({
  default: { deleteRecipe: vi.fn(), getUserRecipes: vi.fn() },
}));
vi.mock("../src/services/recipeImageService.js", () => ({
  default: { deleteRecipeImage: vi.fn() },
}));

function harness() {
  const state = structuredClone(module.state);
  let user = { id: "owner" };
  const context = {
    state,
    commit: (name, payload) => module.mutations[name](state, payload),
    rootGetters: { get "auth/user"() { return user; } },
  };
  return { context, setUser: (nextUser) => { user = nextUser; } };
}

describe("private recipe state", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not delete an image if recipe deletion fails", async () => {
    const { context } = harness();
    context.state.userRecipes = [{ id: "one", image: "https://example.com/one.jpg" }];
    recipeService.deleteRecipe.mockRejectedValue(new Error("database unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(module.actions.deleteRecipe(context, "one")).rejects.toThrow("database unavailable");
    expect(recipeImageService.deleteRecipeImage).not.toHaveBeenCalled();
    expect(context.state.userRecipes).toHaveLength(1);
    log.mockRestore();
  });

  it("discards an older account's recipe response after reset", async () => {
    const { context, setUser } = harness();
    let finishRequest;
    recipeService.getUserRecipes.mockImplementation(() => new Promise((resolve) => { finishRequest = resolve; }));

    const pending = module.actions.fetchUserRecipes(context);
    module.actions.clearCachedRecipes(context);
    setUser({ id: "other" });
    finishRequest([{ id: "private", title: "Secret" }]);
    await pending;

    expect(context.state.userRecipes).toEqual([]);
  });
});
