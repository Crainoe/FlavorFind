<template>
  <div class="favorites-page">
    <div class="favorites-header">
      <h1>My Favorite Recipes</h1>
      <p v-if="favoriteRecipes.length > 0">
        You have {{ favoriteRecipes.length }} favorite recipe{{
          favoriteRecipes.length !== 1 ? "s" : ""
        }}
      </p>
      <p v-else>Start building your personal recipe collection</p>
    </div>

    <!-- Empty State -->
    <div v-if="favoriteRecipes.length === 0" class="empty-state">
      <div class="empty-icon">💔</div>
      <h2>No favorites yet</h2>
      <p>
        Discover amazing recipes and save your favorites for easy access later.
      </p>

      <div class="empty-actions">
        <router-link to="/" class="action-btn primary">
          🏠 Browse Recipes
        </router-link>
        <router-link to="/search" class="action-btn secondary">
          🔍 Search Recipes
        </router-link>
      </div>

      <div class="favorites-tips">
        <h3>How to save favorites:</h3>
        <ol>
          <li>Browse or search for recipes</li>
          <li>Click the ❤️ heart icon on any recipe card</li>
          <li>Find all your saved recipes here</li>
        </ol>
      </div>
    </div>

    <!-- Favorites Grid -->
    <div v-else class="favorites-content">
      <div class="favorites-controls">
        <div class="view-options">
          <label>
            <input
              type="checkbox"
              v-model="showOnlyNew"
              @change="filterFavorites"
            />
            Recently Added
          </label>
        </div>

        <div class="bulk-actions">
          <button
            @click="clearAllFavorites"
            class="clear-all-btn"
            :disabled="favoriteRecipes.length === 0"
          >
            🗑️ Clear All Favorites
          </button>
        </div>
      </div>

      <div class="favorites-stats">
        <div class="stat-card">
          <div class="stat-number">{{ favoriteRecipes.length }}</div>
          <div class="stat-label">Total Favorites</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ uniqueCuisines }}</div>
          <div class="stat-label">Different Cuisines</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ averageCookTime }}</div>
          <div class="stat-label">Avg. Cook Time</div>
        </div>
      </div>

      <div class="recipes-grid">
        <RecipeCard
          v-for="recipe in filteredFavorites"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <div class="action-card">
            <div class="action-icon">📧</div>
            <h4>Export Favorites</h4>
            <p>Download your favorite recipes as a PDF or share via email</p>
            <button @click="exportFavorites" class="card-btn">
              Export List
            </button>
          </div>

          <div class="action-card">
            <div class="action-icon">🛒</div>
            <h4>Shopping List</h4>
            <p>Generate a shopping list from your favorite recipes</p>
            <button @click="generateShoppingList" class="card-btn">
              Create List
            </button>
          </div>

          <div class="action-card">
            <div class="action-icon">🔍</div>
            <h4>Find Similar</h4>
            <p>Discover new recipes based on your favorites</p>
            <router-link to="/search" class="card-btn"> Find More </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import RecipeCard from "@/components/RecipeCard.vue";

export default {
  name: "Favorites",
  components: {
    RecipeCard,
  },
  data() {
    return {
      showOnlyNew: false,
      filteredFavorites: [],
    };
  },
  computed: {
    ...mapGetters("favorites", ["favoriteRecipes"]),

    uniqueCuisines() {
      const cuisines = new Set(
        this.favoriteRecipes.map((recipe) => recipe.cuisine)
      );
      return cuisines.size;
    },

    averageCookTime() {
      if (this.favoriteRecipes.length === 0) return 0;
      const total = this.favoriteRecipes.reduce(
        (sum, recipe) => sum + recipe.cookTime,
        0
      );
      return Math.round(total / this.favoriteRecipes.length) + "m";
    },
  },
  methods: {
    ...mapActions("favorites", ["clearFavorites"]),

    filterFavorites() {
      if (this.showOnlyNew) {
        // Show recipes added in the last 7 days (simulated)
        // In a real app, you'd track when recipes were added to favorites
        this.filteredFavorites = this.favoriteRecipes.slice(-3);
      } else {
        this.filteredFavorites = [...this.favoriteRecipes];
      }
    },

    async clearAllFavorites() {
      if (
        confirm(
          "Are you sure you want to remove all favorite recipes? This action cannot be undone."
        )
      ) {
        await this.clearFavorites();
        this.filterFavorites();
      }
    },

    exportFavorites() {
      // Create a simple text export of favorites
      const favoritesList = this.favoriteRecipes
        .map(
          (recipe) =>
            `${recipe.title}\n${recipe.description}\nCook Time: ${recipe.cookTime} min\nCuisine: ${recipe.cuisine}\n`
        )
        .join("\n---\n\n");

      const blob = new Blob([favoritesList], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-favorite-recipes.txt";
      a.click();
      URL.revokeObjectURL(url);
    },

    generateShoppingList() {
      // Collect all ingredients from favorite recipes
      const allIngredients = this.favoriteRecipes.flatMap(
        (recipe) => recipe.ingredients
      );
      const uniqueIngredients = [...new Set(allIngredients)].sort();

      const shoppingList = uniqueIngredients.join("\n");
      const blob = new Blob([shoppingList], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shopping-list.txt";
      a.click();
      URL.revokeObjectURL(url);
    },
  },

  mounted() {
    this.filterFavorites();
  },

  watch: {
    favoriteRecipes: {
      handler() {
        this.filterFavorites();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
}

.favorites-header {
  text-align: center;
  margin-bottom: 40px;
}

.favorites-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 12px;
}

.favorites-header p {
  font-size: 1.1rem;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.empty-state h2 {
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 16px;
}

.empty-state p {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 32px;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 14px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.favorites-tips {
  background: #f7fafc;
  padding: 24px;
  border-radius: 12px;
  text-align: left;
}

.favorites-tips h3 {
  color: #4a5568;
  margin-bottom: 16px;
}

.favorites-tips ol {
  color: #718096;
  padding-left: 20px;
}

.favorites-tips li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.favorites-content {
  space-y: 32px;
}

.favorites-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.view-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
}

.view-options input[type="checkbox"] {
  transform: scale(1.2);
}

.clear-all-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-all-btn:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-1px);
}

.clear-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorites-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #718096;
  font-weight: 500;
  font-size: 0.9rem;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.quick-actions {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.quick-actions h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 24px;
  text-align: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.action-card {
  background: #f7fafc;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.action-card h4 {
  color: #2d3748;
  margin-bottom: 8px;
}

.action-card p {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.card-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .favorites-header h1 {
    font-size: 2rem;
  }

  .empty-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .favorites-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .clear-all-btn {
    justify-content: center;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    padding: 24px;
  }
}
</style>
