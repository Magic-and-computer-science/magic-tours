import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "/magic-tours/",
  build: {
    outDir: "dist/app",
  },
});
