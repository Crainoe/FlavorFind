import { createStore } from "vuex";
import recipes from "./modules/recipes";
import favorites from "./modules/favorites";
import search from "./modules/search";
import theme from "./modules/theme";
import auth from "./modules/auth";

export default createStore({
  modules: {
    recipes,
    favorites,
    search,
    theme,
    auth,
  },
  strict: process.env.NODE_ENV !== "production",
});
