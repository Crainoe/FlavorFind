import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://dxnwpkdxwcbeaknjvslx.supabase.co";
const supabaseKey = "sb_publishable_cPO4vSyFiPy8k0YRIbR8UA_M7IqIhLe";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export configuration for other modules
export { supabaseUrl, supabaseKey };
