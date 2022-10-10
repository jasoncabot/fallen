import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        // Worker tests run inside the real workerd runtime via miniflare
        test: {
          name: 'worker',
          include: ['src/**/*.{spec,test}.ts'],
          pool: '@cloudflare/vitest-pool-workers',
          poolOptions: {
            workers: {
              wrangler: { configPath: './wrangler.jsonc' }
            }
          }
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
