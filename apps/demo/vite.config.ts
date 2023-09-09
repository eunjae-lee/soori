import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { soori } from 'soori/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), soori()],
});
