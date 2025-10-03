<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover Amazing Recipes</h1>
        <p class="hero-subtitle">
          Explore thousands of delicious recipes from around the world. Save
          your favorites and find your next culinary adventure.
        </p>
        <router-link to="/search" class="hero-cta">
          Start Exploring
        </router-link>
      </div>
    </section>

    <!-- Featured Recipes Section -->
    <section class="featured-section">
      <div class="section-header">
        <h2>Featured Recipes</h2>
        <p>Popular recipes loved by our community</p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner">Loading delicious recipes...</div>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadRecipes" class="retry-btn">Try Again</button>
      </div>

      <div v-else class="recipes-grid">
        <RecipeCard
          v-for="recipe in featuredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </section>

    <!-- Quick Actions Section -->
    <section class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <div class="action-card">
          <div class="action-icon">🔍</div>
          <h3>Search Recipes</h3>
          <p>Find recipes by ingredients, cuisine, or dietary preferences</p>
          <router-link to="/search" class="action-btn">Search Now</router-link>
        </div>

        <div class="action-card">
          <div class="action-icon">❤️</div>
          <h3>My Favorites</h3>
          <p>Access your saved recipes anytime, anywhere</p>
          <router-link to="/favorites" class="action-btn">
            View Favorites
            <span v-if="favoritesCount > 0" class="count-badge">
              {{ favoritesCount }}
            </span>
          </router-link>
        </div>

        <div class="action-card">
          <div class="action-icon">🍽️</div>
          <h3>Browse by Cuisine</h3>
          <p>Explore recipes from different cultures and regions</p>
          <router-link to="/search?cuisine=Italian" class="action-btn"
            >Browse Cuisines</router-link
          >
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ recipesCount }}</div>
          <div class="stat-label">Recipes Available</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ favoritesCount }}</div>
          <div class="stat-label">Your Favorites</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ cuisinesCount }}</div>
          <div class="stat-label">Different Cuisines</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import RecipeCard from "@/components/RecipeCard.vue";

export default {
  name: "Home",
  components: {
    RecipeCard,
  },
  computed: {
    ...mapGetters("recipes", ["allRecipes", "isLoading", "error"]),
    ...mapGetters("favorites", ["favoritesCount"]),

    featuredRecipes() {
      // Show first 6 recipes as featured
      return this.allRecipes.slice(0, 6);
    },

    recipesCount() {
      return this.allRecipes.length;
    },

    cuisinesCount() {
      const cuisines = new Set(this.allRecipes.map((recipe) => recipe.cuisine));
      return cuisines.size;
    },
  },
  methods: {
    ...mapActions("recipes", ["fetchRecipes"]),

    loadRecipes() {
      this.fetchRecipes();
    },
  },
  created() {
    // Fetch recipes if not already loaded
    if (this.allRecipes.length === 0) {
      this.fetchRecipes();
    }
  },
};
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  background: var(--primary-gradient);
  color: white;
  text-align: center;
  padding: 80px 20px;
  border-radius: var(--radius-xl);
  margin-bottom: 60px;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-cta {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 16px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Featured Section */
.featured-section {
  margin-bottom: 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.loading-spinner {
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  margin-top: 16px;
  transition: background var(--transition-normal);
}

.retry-btn:hover {
  background: var(--primary-dark);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 60px;
}

.quick-actions h2 {
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 40px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.action-card {
  background: var(--bg-primary);
  padding: 32px 24px;
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: 1px solid var(--border-light);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.action-card p {
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-gradient);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.count-badge {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
  min-width: 20px;
}

/* Stats Section */
.stats-section {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 40px 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-header h2,
  .quick-actions h2 {
    font-size: 2rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
