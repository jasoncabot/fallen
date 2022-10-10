import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { type HonoEnv } from './middleware/auth';
import { games } from './routes/games';

const app = new Hono<HonoEnv>();

app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowed = ['http://localhost:5173', 'https://fallen.jasoncabot.me'];
      return allowed.includes(origin) ? origin : allowed[0];
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    maxAge: 3600
  })
);

app.get('/api/version', (c) => c.json({ version: '0.1.0' }));
app.route('/api/games', games);

// All non-API requests fall through to static assets. For browser navigations
// to client routes (e.g. /games/:id), fall back to index.html.
app.all('*', async (c) => {
  const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
  const isGet = c.req.method === 'GET';
  const acceptsHtml = c.req.header('accept')?.includes('text/html') ?? false;
  if (!isGet || !acceptsHtml) return assetResponse;

  // If static asset resolution fails (404) or redirects (307/308), serve the SPA shell.
  if (![404, 307, 308].includes(assetResponse.status)) return assetResponse;

  const rootUrl = new URL('/', c.req.url);
  return c.env.ASSETS.fetch(new Request(rootUrl.toString(), c.req.raw));
});

export { Game } from './durable-objects';
export default app;
