import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        // Worker tests run inside the real workerd runtime via miniflare
        plugins: [cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })],
        test: {
          name: 'worker',
          include: ['src/**/*.{spec,test}.ts'],
        }
      },
      {
        // Client tests run in a browser-like environment
        test: {
          name: 'client',
          include: ['client/**/*.{spec,test}.{ts,tsx}'],
          environment: 'happy-dom'
        }
      },
      {
        // Shared tests run in plain Node (no DOM, no Workers)
        test: {
          name: 'shared',
          include: ['shared/**/*.{spec,test}.ts'],
          environment: 'node'
        }
      }
    ]
  }
});
