import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      //when i write /api it will prefix it
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
