import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RecipeDetail from "@/views/RecipeDetail.vue";
import Favorites from "@/views/Favorites.vue";
import Search from "@/views/Search.vue";
import Recipes from "@/views/Recipes.vue";
import RecipeForm from "@/components/RecipeForm.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Flavor Find - Discover Delicious Recipes",
    },
  },
  {
    path: "/recipe/:id",
    name: "RecipeDetail",
    component: RecipeDetail,
    meta: {
      title: "Recipe Details - Recipe Explorer",
    },
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: Favorites,
    meta: {
      title: "Your Favorites - Recipe Explorer",
    },
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    meta: {
      title: "Search Recipes - Recipe Explorer",
    },
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: Recipes,
    meta: {
      title: "Community Recipes - FlavorFind",
    },
  },
  {
    path: "/recipes/new",
    name: "RecipeNew",
    component: RecipeForm,
    meta: {
      title: "Create Recipe - FlavorFind",
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Recipe Explorer";

  if (to.meta.requiresAuth && !store.getters["auth/isAuthenticated"]) {
    next({ path: "/", query: { auth: "required", redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
