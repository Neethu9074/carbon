/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
    emitAssets: true,
    ssrEmitAssets: true,
    rollupOptions: {
      output: {
        assetFileNames: `errorPages/css/[name].[ext]`
      }
    }
  }
});
