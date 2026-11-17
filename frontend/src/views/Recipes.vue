<template>
  <div class="recipes-page">
    <div class="recipes-header">
      <div>
        <h1>Community Recipes</h1>
        <p>Recipes shared by the FlavorFind community.</p>
      </div>
      <router-link
        v-if="isAuthenticated"
        to="/recipes/new"
        class="add-recipe-btn"
      >
        + Add Recipe
      </router-link>
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      <div class="loading-spinner" />
      <p>Loading recipes...</p>
    </div>

    <div
      v-else-if="error"
      class="error-state"
    >
      <div class="error-icon">
        ⚠️
      </div>
      <h2>Could not load recipes</h2>
      <p>{{ error }}</p>
      <button
        class="retry-btn"
        @click="loadRecipes"
      >
        Try Again
      </button>
    </div>

    <div
      v-else-if="publicRecipes.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        📖
      </div>
      <h2>No public recipes yet</h2>
      <p>Be the first to share a recipe with the community.</p>
      <router-link
        v-if="isAuthenticated"
        to="/recipes/new"
        class="add-recipe-btn"
      >
        Share your recipe
      </router-link>
      <button
        v-else
        class="add-recipe-btn"
        @click="promptSignIn"
      >
        Sign in to share
      </button>
    </div>

    <div
      v-else
      class="recipes-grid"
    >
      <UserRecipeCard
        v-for="recipe in publicRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserRecipeCard from "@/components/UserRecipeCard.vue";

export default {
  name: "Recipes",
  components: { UserRecipeCard },
  computed: {
    ...mapGetters("userRecipes", ["publicRecipes", "loading", "error"]),
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  async mounted() {
    await this.loadRecipes();
  },
  methods: {
    ...mapActions("userRecipes", ["fetchPublicRecipes"]),
    async loadRecipes() {
      await this.fetchPublicRecipes();
    },
    promptSignIn() {
      // Just navigate home; user can use the auth widget in the header
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.recipes-page {
  max-width: 1200px;
  margin: 0 auto;
}

.recipes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.recipes-header h1 {
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.recipes-header p {
  color: var(--text-secondary);
}

.add-recipe-btn {
  background: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  display: inline-block;
}

.add-recipe-btn:hover {
  background: var(--primary-dark);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.empty-state {
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon,
.error-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h2,
.error-state h2 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state p,
.error-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .recipes-header h1 {
    font-size: 1.8rem;
  }
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
