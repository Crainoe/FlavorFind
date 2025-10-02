<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3>Filters</h3>
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="clear-filters-btn"
      >
        Clear All
      </button>
    </div>

    <div class="filters-grid">
      <div class="filter-group">
        <label for="cuisine-filter">Cuisine</label>
        <select
          id="cuisine-filter"
          v-model="localFilters.cuisine"
          @change="updateFilter('cuisine', $event.target.value)"
          class="filter-select"
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Mexican">Mexican</option>
          <option value="Indian">Indian</option>
          <option value="American">American</option>
          <option value="French">French</option>
          <option value="Thai">Thai</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="dietary-filter">Dietary</label>
        <select
          id="dietary-filter"
          v-model="localFilters.dietary"
          @change="updateFilter('dietary', $event.target.value)"
          class="filter-select"
        >
          <option value="">All Diets</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Dairy-Free">Dairy-Free</option>
          <option value="Keto">Keto</option>
          <option value="Paleo">Paleo</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="difficulty-filter">Difficulty</label>
        <select
          id="difficulty-filter"
          v-model="localFilters.difficulty"
          @change="updateFilter('difficulty', $event.target.value)"
          class="filter-select"
        >
          <option value="">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="time-filter">Max Cook Time</label>
        <select
          id="time-filter"
          v-model="localFilters.maxCookTime"
          @change="
            updateFilter(
              'maxCookTime',
              $event.target.value ? parseInt($event.target.value) : null
            )
          "
          class="filter-select"
        >
          <option value="">Any Time</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
        </select>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="active-filters">
      <h4>Active Filters:</h4>
      <div class="filter-tags">
        <span
          v-if="localFilters.cuisine"
          class="filter-tag"
          @click="removeFilter('cuisine')"
        >
          {{ localFilters.cuisine }} ✕
        </span>
        <span
          v-if="localFilters.dietary"
          class="filter-tag"
          @click="removeFilter('dietary')"
        >
          {{ localFilters.dietary }} ✕
        </span>
        <span
          v-if="localFilters.difficulty"
          class="filter-tag"
          @click="removeFilter('difficulty')"
        >
          {{ localFilters.difficulty }} ✕
        </span>
        <span
          v-if="localFilters.maxCookTime"
          class="filter-tag"
          @click="removeFilter('maxCookTime')"
        >
          ≤ {{ localFilters.maxCookTime }}m ✕
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FilterPanel",
  data() {
    return {
      localFilters: {
        cuisine: "",
        dietary: "",
        difficulty: "",
        maxCookTime: null,
      },
    };
  },
  computed: {
    ...mapGetters("search", ["filters", "hasActiveFilters"]),
  },
  mounted() {
    this.localFilters = { ...this.filters };
  },
  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters };
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("search", ["updateFilter", "clearFilters"]),

    updateFilter(filterType, value) {
      this.updateFilter({ filterType, value });
    },

    removeFilter(filterType) {
      this.localFilters[filterType] = filterType === "maxCookTime" ? null : "";
      this.updateFilter({ filterType, value: this.localFilters[filterType] });
    },

    clearAllFilters() {
      this.localFilters = {
        cuisine: "",
        dietary: "",
        difficulty: "",
        maxCookTime: null,
      };
      this.clearFilters();
    },
  },
};
</script>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h3 {
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 600;
}

.clear-filters-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.3s ease;
}

.clear-filters-btn:hover {
  background: #c53030;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #4a5568;
  font-size: 0.95rem;
}

.filter-select {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.filter-select:hover {
  border-color: #cbd5e0;
}

.active-filters {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.active-filters h4 {
  color: #4a5568;
  font-size: 1rem;
  margin-bottom: 12px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .filter-panel {
    padding: 20px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filter-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .clear-filters-btn {
    width: 100%;
  }
}
</style>
