import { createStore } from "vuex";
import recipes from "./modules/recipes";
import favorites from "./modules/favorites";
import search from "./modules/search";

export default createStore({
  modules: {
    recipes,
    favorites,
    search,
  },
  strict: process.env.NODE_ENV !== "production",
});
