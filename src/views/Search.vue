<template>
  <div class="search-page">
    <div class="search-header">
      <h1>Search Recipes</h1>
      <p>
        Find your perfect recipe by ingredients, cuisine, or dietary preferences
      </p>
    </div>

    <!-- Search Bar -->
    <SearchBar />

    <!-- Filter Panel -->
    <FilterPanel />

    <!-- Search Results -->
    <div class="search-results">
      <div class="results-header">
        <h2 v-if="searchQuery">
          Search Results for "{{ searchQuery }}"
          <span class="results-count">({{ searchResults.length }} found)</span>
        </h2>
        <h2 v-else-if="hasActiveFilters">
          Filtered Results
          <span class="results-count">({{ searchResults.length }} found)</span>
        </h2>
        <h2 v-else>All Recipes</h2>

        <div v-if="hasActiveFilters || searchQuery" class="results-actions">
          <button @click="clearAllSearch" class="clear-all-btn">
            Clear All Filters & Search
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="loading-state">
        <div class="loading-spinner">🔍</div>
        <p>Searching for delicious recipes...</p>
      </div>

      <!-- No Results -->
      <div
        v-else-if="
          searchResults.length === 0 && (searchQuery || hasActiveFilters)
        "
        class="no-results"
      >
        <div class="no-results-icon">😔</div>
        <h3>No recipes found</h3>
        <p>Try adjusting your search terms or filters to find more recipes.</p>
        <div class="suggestions">
          <h4>Suggestions:</h4>
          <ul>
            <li>Remove some filters</li>
            <li>Try broader search terms</li>
            <li>Check for typos in your search</li>
            <li>Browse by cuisine type</li>
          </ul>
        </div>
      </div>

      <!-- Results Grid -->
      <div v-else class="results-grid">
        <RecipeCard
          v-for="recipe in displayedRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <!-- Load More Button (if showing all recipes) -->
      <div
        v-if="
          !searchQuery &&
          !hasActiveFilters &&
          allRecipes.length > displayedRecipesCount
        "
        class="load-more"
      >
        <button @click="loadMoreRecipes" class="load-more-btn">
          Load More Recipes
        </button>
      </div>
    </div>

    <!-- Search Tips -->
    <div v-if="!searchQuery && !hasActiveFilters" class="search-tips">
      <h3>Search Tips</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon">🥗</div>
          <h4>By Ingredients</h4>
          <p>
            Search for "chicken" or "tomatoes" to find recipes using those
            ingredients
          </p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">🌍</div>
          <h4>By Cuisine</h4>
          <p>
            Use filters to explore Italian, Japanese, or Mediterranean cuisines
          </p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">⏰</div>
          <h4>By Time</h4>
          <p>Filter by cooking time to find quick meals or weekend projects</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">🥬</div>
          <h4>By Diet</h4>
          <p>
            Find vegetarian, vegan, or gluten-free recipes that suit your needs
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SearchBar from "@/components/SearchBar.vue";
import FilterPanel from "@/components/FilterPanel.vue";
import RecipeCard from "@/components/RecipeCard.vue";

export default {
  name: "Search",
  components: {
    SearchBar,
    FilterPanel,
    RecipeCard,
  },
  data() {
    return {
      displayedRecipesCount: 12,
    };
  },
  computed: {
    ...mapGetters("search", [
      "searchQuery",
      "searchResults",
      "hasActiveFilters",
      "isSearching",
    ]),
    ...mapGetters("recipes", ["allRecipes"]),

    displayedRecipes() {
      if (this.searchQuery || this.hasActiveFilters) {
        return this.searchResults;
      }
      // Show all recipes when no search/filters
      return this.allRecipes.slice(0, this.displayedRecipesCount);
    },
  },
  methods: {
    ...mapActions("search", ["clearSearch", "clearFilters", "performSearch"]),

    clearAllSearch() {
      this.clearSearch();
      this.clearFilters();
    },

    loadMoreRecipes() {
      this.displayedRecipesCount += 12;
    },
  },
  mounted() {
    // Check for query parameters and set initial search/filters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("cuisine")) {
      this.$store.dispatch("search/updateFilter", {
        filterType: "cuisine",
        value: urlParams.get("cuisine"),
      });
    }

    // If there's an active search query or filters, perform search
    if (this.searchQuery || this.hasActiveFilters) {
      this.performSearch();
    }
  },
};
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 12px;
}

.search-header p {
  font-size: 1.1rem;
  color: #718096;
}

.search-results {
  margin-top: 40px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.results-header h2 {
  color: #2d3748;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-count {
  color: #718096;
  font-weight: normal;
  font-size: 1rem;
}

.clear-all-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.clear-all-btn:hover {
  background: #c53030;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.loading-spinner {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: bounce 1s infinite;
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

.no-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.no-results h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.no-results p {
  color: #718096;
  margin-bottom: 24px;
}

.suggestions {
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.suggestions h4 {
  color: #4a5568;
  margin-bottom: 12px;
}

.suggestions ul {
  color: #718096;
  padding-left: 20px;
}

.suggestions li {
  margin-bottom: 4px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.load-more {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.search-tips {
  margin-top: 60px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-tips h3 {
  text-align: center;
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 32px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.tip-card {
  text-align: center;
  padding: 24px;
  background: #f7fafc;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-2px);
}

.tip-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.tip-card h4 {
  color: #2d3748;
  margin-bottom: 8px;
}

.tip-card p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .search-header h1 {
    font-size: 2rem;
  }

  .results-header {
    flex-direction: column;
    align-items: stretch;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }

  .search-tips {
    padding: 24px;
  }
}
</style>
