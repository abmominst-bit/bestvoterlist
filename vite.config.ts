import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      compression({
        verbose: true,
        disable: false,
        threshold: 1024,
        algorithm: 'gzip',
        ext: '.gz',
      })
    ],
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react'],
            'supabase-vendor': ['@supabase/supabase-js'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
