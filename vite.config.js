import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Never expose source maps in production — they reveal original source code
    sourcemap: false,
    // Ensure minification strips dead code, comments and debug traces
    minify: "esbuild",
    // Warn if a chunk exceeds 500 kB (encourages code-splitting review)
    chunkSizeWarningLimit: 500,
  },
  // Block the dev server from accidentally serving files outside /src
  server: {
    fs: {
      strict: true,
    },
  },
});
