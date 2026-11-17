import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === "production" ? "/FlavorFind/" : "/",
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
