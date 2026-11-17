import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "Flavor Find - Discover Delicious Recipes",
    },
  },
  {
    path: "/recipe/:id",
    name: "RecipeDetail",
    component: () => import("@/views/RecipeDetail.vue"),
    meta: {
      title: "Recipe Details - Recipe Explorer",
    },
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: () => import("@/views/Favorites.vue"),
    meta: {
      title: "Your Favorites - Recipe Explorer",
    },
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/views/Search.vue"),
    meta: {
      title: "Search Recipes - Recipe Explorer",
    },
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () => import("@/views/Recipes.vue"),
    meta: {
      title: "Community Recipes - FlavorFind",
    },
  },
  {
    path: "/recipes/new",
    name: "RecipeNew",
    component: () => import("@/components/RecipeForm.vue"),
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

const authReady = store.dispatch("auth/initializeAuth");

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || "Recipe Explorer";

  if (to.meta.requiresAuth) await authReady;

  if (to.meta.requiresAuth && !store.getters["auth/isAuthenticated"]) {
    next({ path: "/", query: { auth: "required", redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
