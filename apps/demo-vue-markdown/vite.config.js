import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vite as soori } from 'soori';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), soori()],
});
