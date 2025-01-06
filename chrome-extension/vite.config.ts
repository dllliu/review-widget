import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/manifest.json', dest: '.' },
      ],
    }),
  ],
  build: {
    outDir: 'build', // Define the build directory
    rollupOptions: {
      input: {
        home: './src/Home.html',
        background: './src/helpers/background.ts',
      },
      output: {
        // Ensure these are placed in the right directory for the extension
        dir: 'build',
        entryFileNames: '[name].js', // Output JS file names based on the input names
      },
    },
  },
  server: {
    proxy: {
      '/src': 'src',
    },
  },
});
