import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/style.scss",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
