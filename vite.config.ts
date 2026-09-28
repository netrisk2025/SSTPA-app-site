import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Host often exhausts inotify max_user_instances (Cursor, Discord, other Vite).
// usePolling avoids EMFILE on watch; ignore heavy static trees we never HMR.
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/public/docs/screenshots/**',
        '**/public/files/**',
      ],
    },
  },
});
