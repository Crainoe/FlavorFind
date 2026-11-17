// Theme management module for Vuex
const state = {
  isDark: false,
};

const getters = {
  isDark: (state) => state.isDark,
  currentTheme: (state) => (state.isDark ? "dark" : "light"),
};

const mutations = {
  SET_THEME(state, isDark) {
    state.isDark = isDark;
  },
};

const actions = {
  // Initialize theme from localStorage or system preference
  initializeTheme({ commit }) {
    // Check localStorage first
    const savedTheme = localStorage.getItem("flavor-find-theme");

    if (savedTheme) {
      // Use saved preference
      const isDark = savedTheme === "dark";
      commit("SET_THEME", isDark);
      applyThemeToDOM(isDark);
    } else {
      // Check system preference
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      commit("SET_THEME", prefersDark);
      applyThemeToDOM(prefersDark);
      // Save the initial preference
      localStorage.setItem("flavor-find-theme", prefersDark ? "dark" : "light");
    }
  },

  // Toggle between light and dark themes
  toggleTheme({ commit, state }) {
    const newIsDark = !state.isDark;
    commit("SET_THEME", newIsDark);

    // Save to localStorage
    localStorage.setItem("flavor-find-theme", newIsDark ? "dark" : "light");

    // Apply to DOM
    applyThemeToDOM(newIsDark);
  },

  // Set specific theme
  setTheme({ commit }, isDark) {
    commit("SET_THEME", isDark);
    localStorage.setItem("flavor-find-theme", isDark ? "dark" : "light");
    applyThemeToDOM(isDark);
  },
};

// Helper function to apply theme to DOM
function applyThemeToDOM(isDark) {
  const rootElement = document.documentElement;
  if (isDark) {
    rootElement.setAttribute("data-theme", "dark");
  } else {
    rootElement.removeAttribute("data-theme");
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
