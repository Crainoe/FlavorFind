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
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  background: #ff6b6b;
  color: white;
}

.recipe-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recipe-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  line-height: 1.3;
}

.recipe-description {
  color: #718096;
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
  color: #4a5568;
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
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.cuisine-tag {
  background-color: #667eea;
  color: white;
}

.dietary-tag {
  background-color: #48bb78;
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
