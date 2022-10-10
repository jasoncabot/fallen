import { defineConfig, type Plugin } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';
import path from 'path';

// Loads .bin files as Uint8Array, matching the esbuild `loader: { ".bin": "binary" }` behaviour
function binaryPlugin(): Plugin {
  return {
    name: 'binary-files',
    load(id) {
      if (!id.endsWith('.bin')) return null;
      const data = readFileSync(id.replace(/\?.*$/, ''));
      const bytes = Array.from(new Uint8Array(data));
      return `export default new Uint8Array([${bytes.join(',')}]);`;
    }
  };
}

export default defineConfig({
  plugins: [cloudflare(), react(), tailwindcss(), binaryPlugin()],
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, 'client')
    }
  },
  // Phaser accesses globals that Vite may tree-shake; exclude from pre-bundling
  optimizeDeps: {
    exclude: ['phaser']
  }
});
