import { supabase } from "../config/supabase.js";

class RecipeImageService {
  async uploadRecipeImage(userId, file) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("recipe-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async deleteRecipeImage(imageUrl) {
    try {
      // Extract path from URL: .../storage/v1/object/public/recipe-images/{userId}/{fileName}
      const match = imageUrl.match(/recipe-images\/(.+)$/);
      if (!match) return;

      const filePath = match[1];
      const { error } = await supabase.storage
        .from("recipe-images")
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      // Don't throw - image deletion failure shouldn't block recipe deletion
      return false;
    }
  }
}

export default new RecipeImageService();

