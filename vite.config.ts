import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), glsl()],
  build: {
    outDir: 'docs',
    // minify: "esbuild",
    write: true,
    emptyOutDir: true,
  },
});
