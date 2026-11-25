import { supabase } from "../config/supabase.js";

class ProfileService {
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
}

export default new ProfileService();
