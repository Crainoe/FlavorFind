<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <div class="toggle-icon">
      <!-- Sun Icon -->
      <svg
        v-if="!isDark"
        class="sun-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>

      <!-- Moon Icon -->
      <svg
        v-else
        class="moon-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  </button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ThemeToggle",
  computed: {
    ...mapGetters("theme", ["isDark"]),
  },
  methods: {
    toggleTheme() {
      this.$store.dispatch("theme/toggleTheme");
    },
  },
};
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.theme-toggle:hover {
  background-color: var(--bg-muted);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.theme-toggle:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.theme-toggle:hover .toggle-icon {
  transform: rotate(180deg);
}

.sun-icon,
.moon-icon {
  transition: all var(--transition-fast);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-toggle {
    width: 36px;
    height: 36px;
  }

  .sun-icon,
  .moon-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
