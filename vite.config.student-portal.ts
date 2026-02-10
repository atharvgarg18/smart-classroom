import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: "./student-portal",
  publicDir: "../public",
  server: {
    host: "::",
    port: 3001,
  },
  build: {
    outDir: "../dist/student",
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./student-portal"),
    },
  },
});
