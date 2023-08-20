import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vite } from 'soori';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vite()],
});
