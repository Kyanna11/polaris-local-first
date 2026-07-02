import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

function resolveManualChunk(id: string) {
  if (!id.includes('node_modules')) return undefined;
  if (
    id.includes('/react/')
    || id.includes('/react-dom/')
    || id.includes('/scheduler/')
    || id.includes('/zustand/')
  ) {
    return 'react-core';
  }
  if (id.includes('/@capacitor/')) {
    return 'capacitor';
  }
  if (id.includes('/jszip/')) {
    return 'zip';
  }
  if (
    id.includes('/qrcode/')
    || id.includes('/jsqr/')
  ) {
    return 'capture';
  }
  return undefined;
}

export default defineConfig(({ mode }) => {
  // 留空，让应用完全使用界面里的配置（中转站地址 + API Key）
  const apiOrigin = '';

  return {
    plugins: [react()],
    server: apiOrigin
      ? {
        proxy: {
          '/api': {
            target: apiOrigin,
            changeOrigin: true
          }
        }
      }
      : undefined,
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          chatboxConverter: resolve(__dirname, 'chatbox-converter.html')
        },
        output: {
          manualChunks: resolveManualChunk
        }
      }
    }
  };
});
