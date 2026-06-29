<template>
  <div class="recipe-form-page">
    <div class="form-container">
      <header class="form-header">
        <h1>Create a Recipe</h1>
        <p>Save your own recipe and choose whether to share it with the world.</p>
      </header>

      <form
        class="recipe-form"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="error"
          class="alert alert-error"
        >
          {{ error }}
        </div>

        <!-- Title -->
        <div class="form-group">
          <label for="title">Title <span class="required">*</span></label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            maxlength="120"
            class="form-control"
            placeholder="e.g. Grandma's Apple Pie"
          >
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Short Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="2"
            maxlength="300"
            class="form-control"
            placeholder="A short, tasty summary (optional)"
          />
        </div>

        <!-- Cuisine + Category -->
        <div class="form-row">
          <div class="form-group">
            <label for="cuisine">Cuisine</label>
            <input
              id="cuisine"
              v-model="form.cuisine"
              type="text"
              class="form-control"
              placeholder="e.g. Italian"
            >
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <input
              id="category"
              v-model="form.category"
              type="text"
              class="form-control"
              placeholder="e.g. Dessert"
            >
          </div>
        </div>

        <!-- Cook time + Servings -->
        <div class="form-row">
          <div class="form-group">
            <label for="cookTime">Cook time (minutes)</label>
            <input
              id="cookTime"
              v-model.number="form.cookTime"
              type="number"
              min="0"
              class="form-control"
              placeholder="30"
            >
          </div>
          <div class="form-group">
            <label for="servings">Servings</label>
            <input
              id="servings"
              v-model.number="form.servings"
              type="number"
              min="1"
              class="form-control"
              placeholder="4"
            >
          </div>
        </div>

        <!-- Ingredients -->
        <div class="form-group">
          <label>Ingredients <span class="required">*</span></label>
          <div
            v-for="(ing, index) in form.ingredients"
            :key="index"
            class="ingredient-row"
          >
            <input
              v-model="ing.amount"
              type="text"
              class="form-control ing-amount"
              placeholder="Amount (e.g. 2 cups)"
            >
            <input
              v-model="ing.name"
              type="text"
              required
              class="form-control ing-name"
              placeholder="Ingredient"
            >
            <button
              type="button"
              class="btn-remove"
              :disabled="form.ingredients.length === 1"
              aria-label="Remove ingredient"
              @click="removeIngredient(index)"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            class="btn-add-row"
            @click="addIngredient"
          >
            + Add ingredient
          </button>
        </div>

        <!-- Instructions -->
        <div class="form-group">
          <label for="instructions">Instructions <span class="required">*</span></label>
          <p class="form-hint">
            One step per line. Blank lines are ignored.
          </p>
          <textarea
            id="instructions"
            v-model="form.instructionsText"
            required
            rows="8"
            class="form-control"
            placeholder="Preheat the oven to 350°F...&#10;Mix the flour and sugar...&#10;Bake for 45 minutes..."
          />
        </div>

        <!-- Image upload -->
        <div class="form-group">
          <label>Image</label>
          <div class="image-uploader">
            <div
              class="image-preview"
              :class="{ 'has-image': imagePreview }"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Recipe preview"
              >
              <span
                v-else
                class="image-placeholder"
              >📷</span>
            </div>
            <div class="image-actions">
              <label class="btn btn-secondary">
                {{ imageFile ? "Change image" : "Choose image" }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden-input"
                  @change="onFileChange"
                >
              </label>
              <button
                v-if="imageFile"
                type="button"
                class="btn btn-text"
                @click="clearImage"
              >
                Remove
              </button>
            </div>
            <p class="form-hint">
              JPG, PNG, or WebP. Max ~5MB.
            </p>
          </div>
        </div>

        <!-- Public / Private toggle -->
        <div class="form-group visibility-group">
          <label class="visibility-label">
            <input
              v-model="form.isPublic"
              type="checkbox"
              class="visibility-checkbox"
            >
            <span class="visibility-text">
              <strong>Share with the world</strong>
              <small>
                {{
                  form.isPublic
                    ? "Anyone can find and view this recipe."
                    : "Only you can see this recipe."
                }}
              </small>
            </span>
          </label>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-outline"
            @click="$router.back()"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || uploading"
            class="btn btn-primary"
          >
            <span
              v-if="loading || uploading"
              class="spinner"
            />
            {{
              uploading
                ? "Uploading image..."
                : loading
                  ? "Saving..."
                  : "Save Recipe"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "RecipeForm",
  data() {
    return {
      form: {
        title: "",
        description: "",
        cuisine: "",
        category: "",
        cookTime: null,
        servings: null,
        ingredients: [{ amount: "", name: "" }],
        instructionsText: "",
        isPublic: false,
      },
      imageFile: null,
      imagePreview: null,
    };
  },
  computed: {
    ...mapGetters("userRecipes", ["loading", "uploading", "error"]),
  },
  beforeUnmount() {
    this.clearError();
  },
  methods: {
    ...mapActions("userRecipes", ["createRecipe", "clearError"]),

    addIngredient() {
      this.form.ingredients.push({ amount: "", name: "" });
    },
    removeIngredient(index) {
      if (this.form.ingredients.length > 1) {
        this.form.ingredients.splice(index, 1);
      }
    },
    onFileChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please choose an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
      }
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    clearImage() {
      this.imageFile = null;
      this.imagePreview = null;
    },
    buildIngredients() {
      return this.form.ingredients
        .filter((i) => i.name && i.name.trim())
        .map((i) => ({
          name: i.name.trim(),
          amount: i.amount ? i.amount.trim() : "",
          combined: i.amount
            ? `${i.amount.trim()} ${i.name.trim()}`
            : i.name.trim(),
        }));
    },
    buildInstructions() {
      return this.form.instructionsText
        .split(/\r?\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    },
    async handleSubmit() {
      this.clearError();
      const ingredients = this.buildIngredients();
      const instructions = this.buildInstructions();

      if (ingredients.length === 0) {
        alert("Please add at least one ingredient.");
        return;
      }
      if (instructions.length === 0) {
        alert("Please add at least one instruction step.");
        return;
      }

      try {
        const created = await this.createRecipe({
          recipe: {
            title: this.form.title.trim(),
            description: this.form.description.trim(),
            cuisine: this.form.cuisine.trim(),
            category: this.form.category.trim(),
            cookTime: this.form.cookTime,
            servings: this.form.servings,
            ingredients,
            instructions,
            isPublic: this.form.isPublic,
          },
          imageFile: this.imageFile,
        });
        this.$router.push(`/recipe/${created.id}`);
      } catch (err) {
        // Error shown via getter
      }
    },
  },
};
</script>

<style scoped>
.recipe-form-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-header p {
  color: var(--text-secondary);
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.required {
  color: var(--danger-color);
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 6px 0 0;
}

/* Ingredients */
.ingredient-row {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.btn-remove {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--danger-color);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
}

.btn-remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-add-row {
  background: transparent;
  border: 1px dashed var(--border-color);
  color: var(--primary-color);
  padding: 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  margin-top: 4px;
  font-weight: 500;
}

.btn-add-row:hover {
  background: var(--bg-secondary);
}

/* Image uploader */
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-preview {
  width: 100%;
  max-width: 320px;
  height: 200px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview.has-image {
  border-style: solid;
  border-color: var(--border-light);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  font-size: 3rem;
  opacity: 0.5;
}

.image-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.hidden-input {
  display: none;
}

/* Visibility toggle */
.visibility-group {
  background: var(--bg-secondary);
  padding: 16px;
  border-radius: var(--radius-md);
}

.visibility-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  margin: 0;
}

.visibility-checkbox {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.visibility-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.visibility-text strong {
  color: var(--text-primary);
}

.visibility-text small {
  color: var(--text-secondary);
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-text {
  background: transparent;
  color: var(--danger-color);
  padding: 4px 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* Alert */
.alert {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.alert-error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

[data-theme="dark"] .alert-error {
  background: #dc262620;
  color: #f87171;
  border-color: #dc262630;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .form-container {
    padding: 24px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .ingredient-row {
    grid-template-columns: 1fr auto;
  }
  .ing-amount {
    grid-column: 1 / -1;
  }
  .ing-name {
    grid-column: 1 / 2;
  }
}
</style>
