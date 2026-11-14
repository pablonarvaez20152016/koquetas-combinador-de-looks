import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || (command === 'serve' ? '/' : '/koquetas-combinador-de-looks/');
  return { plugins: [react()], base: base.endsWith('/') ? base : `${base}/` };
});
