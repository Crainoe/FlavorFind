<template>
  <div class="recipe-card" @click="viewRecipe">
    <div class="recipe-image-container">
      <img
        :src="recipe.image"
        :alt="recipe.title"
        class="recipe-image"
        @error="handleImageError"
      />
      <button
        class="favorite-btn"
        :class="{ 'is-favorite': isFavorite }"
        @click.stop="toggleFavorite"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        ❤️
      </button>
    </div>

    <div class="recipe-content">
      <h3 class="recipe-title">{{ recipe.title }}</h3>
      <p class="recipe-description">{{ recipe.description }}</p>

      <div class="recipe-meta">
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <span>{{ recipe.cookTime }} min</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">👥</span>
          <span>{{ recipe.servings }} servings</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">📊</span>
          <span>{{ recipe.difficulty }}</span>
        </div>
      </div>

      <div class="recipe-tags">
        <span class="tag cuisine-tag">{{ recipe.cuisine }}</span>
        <span
          v-for="dietary in recipe.dietary"
          :key="dietary"
          class="tag dietary-tag"
        >
          {{ dietary }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("favorites", ["isFavorite"]),
    isFavorite() {
      return this.$store.getters["favorites/isFavorite"](this.recipe.id);
    },
  },
  methods: {
    ...mapActions("favorites", ["addToFavorites", "removeFromFavorites"]),

    viewRecipe() {
      this.$router.push(`/recipe/${this.recipe.id}`);
    },

    toggleFavorite() {
      if (this.isFavorite) {
        this.removeFromFavorites(this.recipe.id);
      } else {
        this.addToFavorites(this.recipe);
      }
    },

    handleImageError(event) {
      event.target.src =
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
    },
  },
};
</script>

<style scoped>
.recipe-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-light);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.recipe-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all var(--transition-normal);
  backdrop-filter: blur(4px);
}

.favorite-btn:hover {
  background: var(--bg-secondary);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.favorite-btn.is-favorite {
  background: var(--danger-color);
  color: white;
  border-color: var(--danger-color);
}

.recipe-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recipe-title {
  font-size: 1.3rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 8px;
  color: var(--text-primary);
  line-height: 1.3;
}

.recipe-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 16px;
  line-height: 1.5;
  flex: 1;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.meta-icon {
  font-size: 1rem;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
}

.cuisine-tag {
  background-color: var(--primary-color);
  color: white;
}

.dietary-tag {
  background-color: var(--accent-color);
  color: white;
}

@media (max-width: 480px) {
  .recipe-content {
    padding: 16px;
  }

  .recipe-title {
    font-size: 1.2rem;
  }

  .recipe-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
