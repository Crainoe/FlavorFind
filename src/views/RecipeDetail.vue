<template>
  <div class="recipe-detail">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner">🍳</div>
      <p>Loading recipe details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">😞</div>
      <h2>Recipe Not Found</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="back-btn">Back to Home</router-link>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="currentRecipe" class="recipe-content">
      <!-- Back Navigation -->
      <button @click="goBack" class="back-button">← Back</button>

      <!-- Recipe Header -->
      <div class="recipe-header">
        <div class="recipe-image-section">
          <img
            :src="currentRecipe.image"
            :alt="currentRecipe.title"
            class="recipe-image"
            @error="handleImageError"
          />
          <button
            class="favorite-toggle"
            :class="{ 'is-favorite': isFavorite }"
            @click="toggleFavorite"
            :aria-label="
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            "
          >
            <span class="heart-icon">❤️</span>
            {{ isFavorite ? "Remove from Favorites" : "Add to Favorites" }}
          </button>
        </div>

        <div class="recipe-info">
          <div class="recipe-badges">
            <span class="badge cuisine-badge">{{ currentRecipe.cuisine }}</span>
            <span
              v-for="dietary in currentRecipe.dietary"
              :key="dietary"
              class="badge dietary-badge"
            >
              {{ dietary }}
            </span>
          </div>

          <h1 class="recipe-title">{{ currentRecipe.title }}</h1>
          <p class="recipe-description">{{ currentRecipe.description }}</p>

          <div class="recipe-meta">
            <div class="meta-group">
              <div class="meta-item">
                <span class="meta-icon">⏱️</span>
                <div>
                  <div class="meta-label">Cook Time</div>
                  <div class="meta-value">
                    {{ currentRecipe.cookTime }} minutes
                  </div>
                </div>
              </div>

              <div class="meta-item">
                <span class="meta-icon">👥</span>
                <div>
                  <div class="meta-label">Servings</div>
                  <div class="meta-value">
                    {{ currentRecipe.servings }} people
                  </div>
                </div>
              </div>

              <div class="meta-item">
                <span class="meta-icon">📊</span>
                <div>
                  <div class="meta-label">Difficulty</div>
                  <div class="meta-value">{{ currentRecipe.difficulty }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Details -->
      <div class="recipe-details">
        <div class="ingredients-section">
          <h2>Ingredients</h2>
          <ul class="ingredients-list">
            <li
              v-for="(ingredient, index) in currentRecipe.ingredients"
              :key="index"
              class="ingredient-item"
            >
              <span class="ingredient-text">{{
                ingredient.combined || ingredient
              }}</span>
            </li>
          </ul>
        </div>

        <div class="instructions-section">
          <h2>Instructions</h2>
          <ol class="instructions-list">
            <li
              v-for="(instruction, index) in currentRecipe.instructions"
              :key="index"
              class="instruction-item"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-text">{{ instruction }}</div>
            </li>
          </ol>
        </div>
      </div>

      <!-- Recipe Actions -->
      <div class="recipe-actions">
        <button class="action-btn secondary" @click="printRecipe">
          🖨️ Print Recipe
        </button>
        <button class="action-btn secondary" @click="shareRecipe">
          📤 Share Recipe
        </button>
        <router-link to="/search" class="action-btn primary">
          🔍 Find More Recipes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RecipeDetail",
  computed: {
    ...mapGetters("recipes", ["currentRecipe", "isLoading", "error"]),
    ...mapGetters("favorites", ["isFavorite"]),

    isFavorite() {
      return this.currentRecipe
        ? this.$store.getters["favorites/isFavorite"](this.currentRecipe.id)
        : false;
    },
  },
  methods: {
    ...mapActions("recipes", ["fetchRecipeById", "clearCurrentRecipe"]),
    ...mapActions("favorites", ["addToFavorites", "removeFromFavorites"]),

    async loadRecipe() {
      const recipeId = this.$route.params.id;
      await this.fetchRecipeById(recipeId);
    },

    toggleFavorite() {
      if (this.currentRecipe) {
        if (this.isFavorite) {
          this.removeFromFavorites(this.currentRecipe.id);
        } else {
          this.addToFavorites(this.currentRecipe);
        }
      }
    },

    goBack() {
      this.$router.back();
    },

    handleImageError(event) {
      event.target.src =
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
    },

    printRecipe() {
      window.print();
    },

    shareRecipe() {
      if (navigator.share && this.currentRecipe) {
        navigator.share({
          title: this.currentRecipe.title,
          text: this.currentRecipe.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert("Recipe URL copied to clipboard!");
      }
    },
  },

  async created() {
    await this.loadRecipe();
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== from.params.id) {
      await this.loadRecipe();
    }
    next();
  },

  beforeUnmount() {
    this.clearCurrentRecipe();
  },
};
</script>

<style scoped>
.recipe-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.loading-spinner,
.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.error-state h2 {
  color: #2d3748;
  margin-bottom: 12px;
}

.back-btn,
.back-button {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.back-btn:hover,
.back-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.recipe-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.recipe-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.recipe-image-section {
  position: relative;
}

.recipe-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.favorite-toggle {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(4px);
}

.favorite-toggle:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

.favorite-toggle.is-favorite {
  background: #ff6b6b;
  color: white;
}

.heart-icon {
  font-size: 1.2rem;
}

.recipe-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.recipe-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.cuisine-badge {
  background: #667eea;
  color: white;
}

.dietary-badge {
  background: #48bb78;
  color: white;
}

.recipe-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 16px;
  line-height: 1.2;
}

.recipe-description {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 32px;
}

.recipe-meta .meta-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.meta-label {
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 500;
}

.meta-value {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.recipe-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 40px 40px;
}

.ingredients-section h2,
.instructions-section h2 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredient-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.ingredient-item:before {
  content: "•";
  color: #667eea;
  font-size: 1.5rem;
  margin-right: 12px;
}

.ingredient-text {
  color: #4a5568;
  line-height: 1.5;
}

.instructions-list {
  list-style: none;
  padding: 0;
  counter-reset: step-counter;
}

.instruction-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  counter-increment: step-counter;
}

.step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 4px;
}

.step-text {
  color: #4a5568;
  line-height: 1.6;
  flex: 1;
}

.recipe-actions {
  display: flex;
  gap: 16px;
  padding: 24px 40px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  border: none;
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
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .recipe-header {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }

  .recipe-image {
    height: 250px;
  }

  .recipe-title {
    font-size: 2rem;
  }

  .recipe-details {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 24px 24px;
  }

  .recipe-actions {
    padding: 20px 24px;
    flex-direction: column;
  }

  .meta-group {
    flex-direction: row !important;
    justify-content: space-between;
  }
}

@media print {
  .back-button,
  .favorite-toggle,
  .recipe-actions {
    display: none;
  }

  .recipe-content {
    box-shadow: none;
  }
}
</style>
