<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input
        v-model="localQuery"
        @input="handleInput"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="Search recipes, ingredients, or cuisines..."
        class="search-input"
      />
      <button
        @click="handleSearch"
        class="search-button"
        :disabled="isSearching"
      >
        <span v-if="!isSearching">🔍</span>
        <span v-else class="loading-spinner">⏳</span>
      </button>
    </div>

    <button v-if="showClearButton" @click="clearSearch" class="clear-button">
      Clear
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SearchBar",
  data() {
    return {
      localQuery: "",
    };
  },
  computed: {
    ...mapGetters("search", ["searchQuery", "isSearching"]),
    showClearButton() {
      return this.localQuery.length > 0;
    },
  },
  mounted() {
    this.localQuery = this.searchQuery;
  },
  watch: {
    searchQuery(newQuery) {
      this.localQuery = newQuery;
    },
  },
  methods: {
    ...mapActions("search", [
      "updateSearchQuery",
      "performSearch",
      "clearSearch",
    ]),

    handleInput() {
      this.updateSearchQuery(this.localQuery);
      // Debounced search - search after user stops typing for 500ms
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (this.localQuery.trim()) {
          this.handleSearch();
        }
      }, 500);
    },

    handleSearch() {
      if (this.localQuery.trim()) {
        this.updateSearchQuery(this.localQuery);
        this.performSearch();
      }
    },

    clearSearch() {
      this.localQuery = "";
      this.clearSearch();
    },
  },

  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.search-input-container {
  flex: 1;
  display: flex;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow var(--transition-normal);
  border: 1px solid var(--border-light);
}

.search-input-container:focus-within {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-button {
  padding: 16px 20px;
  border: none;
  background: var(--primary-gradient);
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.search-button:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.clear-button {
  padding: 12px 20px;
  border: 2px solid var(--border-default);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.clear-button:hover {
  border-color: var(--border-dark);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 8px;
  }

  .clear-button {
    width: 100%;
  }

  .search-input {
    padding: 14px 16px;
  }

  .search-button {
    padding: 14px 16px;
  }
}
</style>
