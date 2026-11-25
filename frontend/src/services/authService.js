import { supabase } from "../config/supabase.js";

class AuthService {
  // Auth methods
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).href,
        },
      });

      if (error) throw error;
      return { url: data.url };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  }

  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error("Error getting current session:", error);
      throw error;
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }

}

export default new AuthService();

