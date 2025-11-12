import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://lkenacxddywafqoojwpd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZW5hY3hkZHl3YWZxb29qd3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjM1MjQsImV4cCI6MjA3NzczOTUyNH0.sl9V53FNth7KyIcdBF7hsUn2p1MH7QwZwRdakLeEn4I";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export configuration for other modules
export { supabaseUrl, supabaseKey };
