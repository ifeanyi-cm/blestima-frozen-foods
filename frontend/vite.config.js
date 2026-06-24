import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    allowedHosts: [
      "mullets-yahoo-excretion.ngrok-free.dev",
    ],

    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});