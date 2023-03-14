import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
const xxx = {
  output: {
    entryFileNames: `assets/[name].js`,
    chunkFileNames: `assets/[name].js`,
    assetFileNames: `assets/[name].[ext]`,
  },
  input: {
    translate: path.resolve(__dirname, "./src/translate.html"),
    explain: path.resolve(__dirname, "./src/explain.html"),
    library: path.resolve(__dirname, "./src/library.html"),
  },
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        translate: path.resolve(__dirname, "./src/translate.html"),
        explain: path.resolve(__dirname, "./src/explain.html"),
        library: path.resolve(__dirname, "./src/library.html"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'index';
          } else if (!(id.includes('.html') || id.includes('.css') || id.includes('.tsx'))) {
            return 'index';
          }
        }
      }
    }
  },
});
