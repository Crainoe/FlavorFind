import supabaseService from "../../services/supabaseService.js";

const state = {
  user: null,
  session: null,
  loading: false,
  error: null,
  initialized: false,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },

  SET_SESSION(state, session) {
    state.session = session;
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_INITIALIZED(state, initialized) {
    state.initialized = initialized;
  },

  CLEAR_AUTH(state) {
    state.user = null;
    state.session = null;
    state.error = null;
  },
};

const actions = {
  async initializeAuth({ commit, dispatch }) {
    try {
      commit("SET_LOADING", true);

      // Get current session
      const session = await supabaseService.getCurrentSession();

      if (session) {
        commit("SET_SESSION", session);
        commit("SET_USER", session.user);

        // Migrate favorites from localStorage if they exist
        await dispatch("favorites/migrateFavoritesToSupabase", null, {
          root: true,
        });

        // Load user's favorites
        await dispatch("favorites/loadFavorites", null, { root: true });
      }

      // Listen to auth changes
      supabaseService.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN") {
          commit("SET_SESSION", session);
          commit("SET_USER", session.user);
          commit("SET_ERROR", null);

          // Migrate and load favorites when user signs in
          await dispatch("favorites/migrateFavoritesToSupabase", null, {
            root: true,
          });
          await dispatch("favorites/loadFavorites", null, { root: true });
        } else if (event === "SIGNED_OUT") {
          commit("CLEAR_AUTH");

          // Load favorites from localStorage for guest users
          await dispatch("favorites/loadFavorites", null, { root: true });
        }
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
      commit("SET_INITIALIZED", true);
    }
  },

  async signUp({ commit }, { email, password, userData = {} }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const { user, session } = await supabaseService.signUp(
        email,
        password,
        userData
      );

      if (session) {
        commit("SET_SESSION", session);
        commit("SET_USER", user);
      }

      return { user, session };
    } catch (error) {
      console.error("Error signing up:", error);
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async signIn({ commit, dispatch }, { email, password }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const { user, session } = await supabaseService.signIn(email, password);

      commit("SET_SESSION", session);
      commit("SET_USER", user);

      // Migrate favorites from localStorage and load from Supabase
      await dispatch("favorites/migrateFavoritesToSupabase", null, {
        root: true,
      });
      await dispatch("favorites/loadFavorites", null, { root: true });

      return { user, session };
    } catch (error) {
      console.error("Error signing in:", error);
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async signOut({ commit, dispatch }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      await supabaseService.signOut();
      commit("CLEAR_AUTH");

      // Load favorites from localStorage for guest users
      await dispatch("favorites/loadFavorites", null, { root: true });

      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async updateProfile({ commit }, updates) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const user = await supabaseService.getCurrentUser();
      if (!user) {
        throw new Error("No user logged in");
      }

      const profile = await supabaseService.updateUserProfile(user.id, updates);

      // Update user object with new data
      const updatedUser = { ...user, ...updates };
      commit("SET_USER", updatedUser);

      return profile;
    } catch (error) {
      console.error("Error updating profile:", error);
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  clearError({ commit }) {
    commit("SET_ERROR", null);
  },
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  user: (state) => state.user,
  session: (state) => state.session,
  loading: (state) => state.loading,
  error: (state) => state.error,
  initialized: (state) => state.initialized,
  userEmail: (state) => state.user?.email || null,
  userId: (state) => state.user?.id || null,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
