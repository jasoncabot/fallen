import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { requireUser, type HonoEnv } from '../middleware/auth';
import {
  buildGameListId,
  createGameAction,
  createTokenGameAction,
  joinGameAction,
  listGameAction,
  openSocketGameAction,
  showGameAction,
  submitCommandGameAction,
  queryEventsGameAction,
  type CreateRequest,
  type JoinRequest
} from '../durable-objects/game';
import type { CommandEnvelope } from '../../shared/commands';

const games = new Hono<HonoEnv>();

games.use('*', requireUser);

// List games for the current user
games.get('/', async (c) => {
  const userId = c.get('userId');
  const obj = c.env.GAME.get(c.env.GAME.idFromName(buildGameListId(userId)));
  const list = await obj.fetch(listGameAction(userId)).then((r) => r.json());
  return c.json(list);
});

// Create a new game
games.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<CreateRequest>();
  const gameId = uuidv4();
  const obj = c.env.GAME.get(c.env.GAME.idFromName(gameId));
  const created = await obj
    .fetch(createGameAction(gameId, userId), { method: 'POST', body: JSON.stringify(body) })
    .then((r) => r.json());
  return c.json(created, 201);
});

// Get a specific game (filtered to what this player can see)
games.get('/:id', async (c) => {
  const userId = c.get('userId');
  const gameId = c.req.param('id');
  const obj = c.env.GAME.get(c.env.GAME.idFromName(gameId));
  return obj.fetch(showGameAction(gameId, userId));
});

// Join a game as a second player
games.post('/:id/player', async (c) => {
  const userId = c.get('userId');
  const gameId = c.req.param('id');
  const body = await c.req.json<JoinRequest>();
  const obj = c.env.GAME.get(c.env.GAME.idFromName(gameId));
  return obj.fetch(joinGameAction(gameId, userId), { method: 'POST', body: JSON.stringify(body) });
});

// Mint a short-lived WebSocket token (WS upgrade can't send auth headers)
games.post('/:id/ws', async (c) => {
  const userId = c.get('userId');
  const gameId = c.req.param('id');
  const tokenObj = c.env.GAME.get(c.env.GAME.idFromName('tokens'));
  return tokenObj.fetch(createTokenGameAction(gameId, userId, uuidv4()));
});

// Upgrade to WebSocket using a previously minted token
games.get('/:id/ws', async (c) => {
  const gameId = c.req.param('id');
  const token = c.req.query('token');
  if (!token) return c.json({ error: 'missing token' }, 400);
  const tokenObj = c.env.GAME.get(c.env.GAME.idFromName('tokens'));
  return tokenObj.fetch(openSocketGameAction(gameId, token), { headers: { Upgrade: 'websocket' } });
});

// Submit a game command (strategic or tactical)
games.post('/:id/commands', async (c) => {
  const userId = c.get('userId');
  const gameId = c.req.param('id');
  const envelope = await c.req.json<CommandEnvelope>();

  // Verify the command is from the authenticated user
  if (envelope.actorPlayerId !== userId) {
    return c.json({ error: 'not authorized' }, 403);
  }

  const gameObj = c.env.GAME.get(c.env.GAME.idFromName(gameId));
  const result = (await gameObj
    .fetch(submitCommandGameAction(gameId), { method: 'POST', body: JSON.stringify(envelope) })
    .then((r) => r.json())) as { accepted: boolean; reason?: string; sequence?: number };

  return c.json(result, result.accepted ? 200 : 400);
});

// Query game event log (for polling or replay)
games.get('/:id/events', async (c) => {
  const gameId = c.req.param('id');
  const fromSequence = c.req.query('from') ? parseInt(c.req.query('from')!, 10) : 0;
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!, 10) : 100;

  const gameObj = c.env.GAME.get(c.env.GAME.idFromName(gameId));
  const events = await gameObj
    .fetch(queryEventsGameAction(gameId, fromSequence, limit))
    .then((r) => r.json());

  return c.json(events);
});

export { games };
