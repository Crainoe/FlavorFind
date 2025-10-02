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
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
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
}

.search-input::placeholder {
  color: #a0aec0;
}

.search-button {
  padding: 16px 20px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
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
  border: 2px solid #e2e8f0;
  background: white;
  color: #718096;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-button:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
  color: #4a5568;
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
