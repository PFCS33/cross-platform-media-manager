import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// element-plus-auto-import
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/cross-platform-media-manager/",

  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/abstracts/_vars" as *;
        @use '@/assets/styles/abstracts/_mixins' as *;`,
      },
    },
  },
});
