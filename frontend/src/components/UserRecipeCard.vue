<template>
  <div
    class="recipe-card"
    @click="viewRecipe"
  >
    <div class="recipe-image-container">
      <img
        :src="recipe.strMealThumb || recipe.image || defaultImage"
        :alt="recipe.strMeal || recipe.title"
        class="recipe-image"
        @error="handleImageError"
      >
      <span
        v-if="!recipe.isPublic"
        class="private-badge"
        title="Private recipe"
      >
        🔒 Private
      </span>
      <button
        v-if="canDelete"
        class="delete-btn"
        :aria-label="'Delete recipe'"
        @click.stop="confirmDelete"
      >
        🗑
      </button>
    </div>

    <div class="recipe-content">
      <h3 class="recipe-title">
        {{ recipe.strMeal || recipe.title }}
      </h3>
      <p class="recipe-description">
        {{ truncatedDescription }}
      </p>

      <div class="recipe-meta">
        <div
          v-if="recipe.cookTime"
          class="meta-item"
        >
          <span class="meta-icon">⏱️</span>
          <span>{{ recipe.cookTime }} min</span>
        </div>
        <div
          v-if="recipe.servings"
          class="meta-item"
        >
          <span class="meta-icon">👥</span>
          <span>{{ recipe.servings }} servings</span>
        </div>
      </div>

      <div class="recipe-tags">
        <span
          v-if="recipe.strArea || recipe.cuisine"
          class="tag cuisine-tag"
        >
          {{ recipe.strArea || recipe.cuisine }}
        </span>
        <span
          v-if="recipe.strCategory || recipe.category"
          class="tag dietary-tag"
        >
          {{ recipe.strCategory || recipe.category }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UserRecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultImage:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    };
  },
  computed: {
    ...mapGetters("auth", ["userId"]),
    canDelete() {
      return this.showDelete && this.userId === this.recipe.userId;
    },
    truncatedDescription() {
      const text = this.recipe.description || "";
      return text.length > 100 ? text.substring(0, 100) + "..." : text;
    },
  },
  methods: {
    ...mapActions("userRecipes", ["deleteRecipe"]),
    viewRecipe() {
      this.$router.push(`/recipe/${this.recipe.id}`);
    },
    async confirmDelete() {
      if (!confirm(`Delete "${this.recipe.title}"? This cannot be undone.`)) {
        return;
      }
      try {
        await this.deleteRecipe(this.recipe.id);
      } catch (err) {
        alert("Could not delete recipe: " + err.message);
      }
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
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
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-light);
  position: relative;
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
  transition: transform 0.2s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.private-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.delete-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}

.delete-btn:hover {
  background: var(--danger-color);
  color: white;
}

.recipe-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recipe-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
  line-height: 1.3;
}

.recipe-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
  flex: 1;
}

.recipe-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.cuisine-tag {
  background: var(--primary-color);
  color: white;
}

.dietary-tag {
  background: var(--accent-color);
  color: white;
}
</style>
