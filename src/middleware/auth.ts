import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const CERTS_URL = 'https://jasoncabot.cloudflareaccess.com/cdn-cgi/access/certs';
const AUDIENCE = '4020d7da2260214f3972a347977866c2795d9a264a718a055a131d935f5a42c9';

// Cached JWKS — jose reuses the fetched key set across requests
const jwks = createRemoteJWKSet(new URL(CERTS_URL));

export type HonoEnv = {
  Bindings: Env;
  Variables: { userId: string };
};

export const requireUser = createMiddleware<HonoEnv>(async (c, next) => {
  // Production path: Cloudflare Access injects this header after the user logs in
  const jwt = c.req.header('CF-Access-Jwt-Assertion');
  if (jwt) {
    try {
      const { payload } = await jwtVerify(jwt, jwks, { audience: AUDIENCE });
      if (!payload.sub) throw new Error('missing sub claim');
      c.set('userId', payload.sub);
      return next();
    } catch {
      throw new HTTPException(401, { message: 'Invalid access token' });
    }
  }

  // Dev path: DEV=true in .dev.vars enables a simple Bearer token fallback
  // so you can use a UUID from localStorage without a real CF Access login
  if (c.env.DEV === 'true') {
    const bearer = c.req.header('Authorization')?.replace('Bearer ', '');
    if (bearer) {
      c.set('userId', bearer);
      return next();
    }

    // Deterministic fallback for local dev when no bearer header is present.
    c.set('userId', 'dev-user-local');
    return next();
  }

  throw new HTTPException(401, { message: 'Unauthorized' });
});
