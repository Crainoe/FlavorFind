<template>
  <header class="app-header">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand"> 🍳 Flavor Find </router-link>

        <div class="nav-menu" :class="{ 'nav-menu-active': isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu"
            >Home</router-link
          >
          <router-link to="/search" class="nav-link" @click="closeMenu"
            >Search</router-link
          >
          <router-link to="/favorites" class="nav-link" @click="closeMenu">
            Favorites
            <span v-if="favoritesCount > 0" class="favorites-badge">
              {{ favoritesCount }}
            </span>
          </router-link>
        </div>

        <div class="nav-actions">
          <ThemeToggle />
          <button
            class="nav-toggle"
            @click="toggleMenu"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import ThemeToggle from "@/components/ThemeToggle.vue";

export default {
  name: "AppHeader",
  components: {
    ThemeToggle,
  },
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    ...mapGetters("favorites", ["favoritesCount"]),
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
};
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #9241f0 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.favorites-badge {
  background-color: #ff6b6b;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #9241f0 100%);
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
    padding: 20px 0;
    gap: 15px;
  }

  .nav-menu-active {
    left: 0;
  }

  .nav-link {
    padding: 12px 20px;
    width: 90%;
    margin: 0 auto;
  }
}
</style>
