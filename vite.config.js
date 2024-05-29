import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
// 按需自动引入导入element plus。
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createHtmlPlugin } from "vite-plugin-html";
import  viteCompression  from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer({
      open: true,
      filename: "visualizer.html", //分析图生成的文件名
    }),
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/style.scss",
      },
    }),
    createHtmlPlugin({
      minify: true,
      entry: "src/main.js",
      template: "index.html",
    }), // 压缩 html
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  optimizeDeps: {
    include: [
      "vuetify",
      "vue3-tour",
      "vue-router",
      "vite-plugin-vuetify",
      "lodash",
      "element-plus",
      "axios",
      "pinia",
    ],
  },
  output: {
    // 最小化拆分包
    manualChunks(id) {
      if (id.includes("node_modules")) {
        return id.toString().split("node_modules/")[1].split("/")[0].toString();
      }
    },
  },
  build: {
    reportCompressedSize: false,
    sourcemap: false,
    // rollup 配置
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
