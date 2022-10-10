import { generateGame } from '../service/initialise';
import { removeUnknown } from '../service/information';
import type { GameState } from '../../shared/game';
import type { CommandEnvelope } from '../../shared/commands';
import type { EventEnvelope } from '../../shared/events';

// --- Internal action routing helpers ---
// Durable Objects communicate via HTTP internally; we encode the action in the URL.

type GameAction = 'create' | 'show' | 'list' | 'modify-list' | 'join' | 'create-token' | 'open-ws' | 'submit-command' | 'events';

const action = (type: GameAction, params: Record<string, string> = {}) => {
  const qs = new URLSearchParams({ action: type, ...params });
  return `https://game?${qs}`;
};

export const buildGameListId = (_userId: string) => 'users'; // single shared list for now
export const createGameAction = (gameId: string, userId: string) => action('create', { id: gameId, userId });
export const showGameAction = (gameId: string, userId: string) => action('show', { id: gameId, userId });
export const listGameAction = (userId: string) => action('list', { userId });
export const modifyListGameAction = (userId: string) => action('modify-list', { userId });
export const joinGameAction = (gameId: string, userId: string) => action('join', { id: gameId, userId });
export const createTokenGameAction = (gameId: string, userId: string, token: string) =>
  action('create-token', { id: gameId, userId, token });
export const openSocketGameAction = (gameId: string, token: string) => action('open-ws', { id: gameId, token });
export const submitCommandGameAction = (gameId: string) => action('submit-command', { gameId });
export const queryEventsGameAction = (gameId: string, fromSequence?: number, limit?: number) =>
  action('events', { gameId, ...(fromSequence !== undefined && { from: String(fromSequence) }), ...(limit && { limit: String(limit) }) });

// --- Request / response shapes ---

export interface CreateRequest {
  name: string;
  race: number;
  difficulty: number;
  campaign: number;
}

export interface JoinRequest {
  name: string;
  race: number;
}

interface GameListEntry {
  id: string;
  state: number;
}

export interface ModifyListRequest {
  action: 'ADD' | 'REMOVE' | 'UPDATE_STATE';
  game: GameListEntry;
}

interface TokenEntry {
  userId: string;
  gameId: string;
}

interface Connection {
  socket: WebSocket;
  quitting: boolean;
  userId: string;
}

// --- Durable Object ---

const RUNTIME_STATE_KEY = (gameId: string) => `runtime:${gameId}`;
const EVENT_LOG_KEY = (gameId: string) => `events:${gameId}`;
const ACTIVE_BATTLE_KEY = (gameId: string, provinceId: string) => `battle:${gameId}:${provinceId}`;

export class Game implements DurableObject {
  private connections: Record<string, Connection> = {};

  constructor(private readonly state: DurableObjectState, private readonly env: Env) {}

  async fetch(request: Request): Promise<Response> {
    const params = new URLSearchParams(new URL(request.url).search);
    const type = params.get('action') as GameAction;

    switch (type) {
      case 'create': {
        const req = (await request.json()) as CreateRequest;
        const id = params.get('id')!;
        const userId = params.get('userId')!;

        const game = generateGame(userId, req.name, req.race, req.difficulty, req.campaign);
        // Canonicalize the game identifier to the DO name so create/show use the same id.
        game.id = id;
        console.log('🎮 Game DO: Creating game', { id, userId, game: game.id });
        await this.state.storage.put<GameState>('game', game);

        const listId = this.env.GAME.idFromName(buildGameListId(userId));
        await this.env.GAME.get(listId).fetch(modifyListGameAction(userId), {
          method: 'POST',
          body: JSON.stringify({ action: 'ADD', game: { id, state: 0 } } as ModifyListRequest)
        });

        // Return the filtered view (what the player can see), not the full game
        return Response.json(removeUnknown(game, userId), { status: 201 });
      }

      case 'show': {
        const gameId = params.get('id')!;
        const userId = params.get('userId')!;
        if (!gameId) return Response.json({ error: 'No identifier' }, { status: 400 });

        const game = await this.state.storage.get<GameState>('game');
        if (!game) return Response.json({ error: 'Game not found' }, { status: 404 });

        // In dev, identity can drift between sessions; fall back to the first side
        // to keep deep-linked games loadable while local auth is evolving.
        let viewerUserId = userId;
        if (!game.sides[viewerUserId]) {
          if (this.env.DEV === 'true') {
            const fallback = Object.keys(game.sides)[0];
            if (!fallback) return Response.json({ error: 'Game has no players' }, { status: 500 });
            console.warn('⚠️ Game DO: user not in game sides, using dev fallback viewer', {
              requestedUserId: userId,
              fallbackUserId: fallback,
              gameId
            });
            viewerUserId = fallback;
          } else {
            return Response.json({ error: 'Not a player in this game' }, { status: 403 });
          }
        }

        return Response.json(removeUnknown(game, viewerUserId));
      }

      case 'list': {
        const userId = params.get('userId')!;
        const games = (await this.state.storage.get<GameListEntry[]>(userId)) ?? [];
        return Response.json(games);
      }

      case 'modify-list': {
        const userId = params.get('userId')!;
        const games = (await this.state.storage.get<GameListEntry[]>(userId)) ?? [];
        const req = (await request.json()) as ModifyListRequest;

        switch (req.action) {
          case 'ADD':
            games.push(req.game);
            break;
          case 'REMOVE':
            games.splice(games.findIndex((g) => g.id === req.game.id), 1);
            break;
          case 'UPDATE_STATE': {
            const found = games.find((g) => g.id === req.game.id);
            if (found) found.state = req.game.state;
            break;
          }
          default:
            ((_: never) => { throw new Error('Unhandled action'); })(req.action);
        }

        await this.state.storage.put<GameListEntry[]>(userId, games);
        return Response.json(games);
      }

      case 'join': {
        // TODO: look up game, add userId to sides, update game list entries
        return Response.json([]);
      }

      case 'create-token': {
        const gameId = params.get('id')!;
        const token = params.get('token')!;
        const userId = params.get('userId')!;
        await this.state.storage.put<TokenEntry>(token, { userId, gameId });
        return new Response(token, { status: 201 });
      }

      case 'open-ws': {
        const token = params.get('token')!;
        if (!token) return Response.json({ error: 'expected token' }, { status: 400 });

        const entry = await this.state.storage.get<TokenEntry>(token);
        if (!entry?.userId) return Response.json({ error: 'invalid token' }, { status: 401 });

        await this.state.storage.delete(token);

        const [client, server] = Object.values(new WebSocketPair());
        this.handleSession(server, entry.userId);

        return new Response(null, { status: 101, webSocket: client });
      }

      case 'submit-command': {
        const gameId = params.get('gameId')!;
        if (!gameId) return Response.json({ error: 'No gameId' }, { status: 400 });

        const envelope = (await request.json()) as CommandEnvelope;
        const result = await this.handleCommand(gameId, envelope);

        return Response.json(result);
      }

      case 'events': {
        const gameId = params.get('gameId')!;
        const fromSequence = params.get('from') ? parseInt(params.get('from')!, 10) : 0;
        const limit = params.get('limit') ? parseInt(params.get('limit')!, 10) : 100;

        if (!gameId) return Response.json({ error: 'No gameId' }, { status: 400 });

        const events = await this.getEventLog(gameId, fromSequence, limit);
        return Response.json(events);
      }

      default:
        ((_: never) => { throw new Error('Unknown action'); })(type);
    }
  }

  private async handleCommand(gameId: string, envelope: CommandEnvelope): Promise<{
    accepted: boolean;
    reason?: string;
    sequence?: number;
  }> {
    // TODO: validate command against turn ownership and expected action
    // For now, accept and emit placeholder event
    const eventLog = (await this.state.storage.get<EventEnvelope[]>(EVENT_LOG_KEY(gameId))) ?? [];
    const sequence = eventLog.length;

    const accepted = true;
    if (accepted) {
      // Emit event(s) from command
      const event: EventEnvelope = {
        sequence,
        gameId,
        turnNumber: envelope.turnNumber,
        action: envelope.expectedAction,
        mode: envelope.mode,
        emittedAtMs: Date.now(),
        causedByCommandId: envelope.commandId,
        event: { type: 'COMMAND_ACCEPTED', command: envelope }
      };

      eventLog.push(event);
      await this.state.storage.put(EVENT_LOG_KEY(gameId), eventLog);

      // Broadcast to websocket subscribers
      this.broadcastEvent(gameId, event);

      return { accepted: true, sequence };
    }

    return { accepted: false, reason: 'Unhandled validation' };
  }

  private async getEventLog(gameId: string, fromSequence: number, limit: number): Promise<EventEnvelope[]> {
    const eventLog = (await this.state.storage.get<EventEnvelope[]>(EVENT_LOG_KEY(gameId))) ?? [];
    return eventLog.slice(fromSequence, fromSequence + limit);
  }

  private broadcastEvent(gameId: string, event: EventEnvelope): void {
    // TODO: send event to all connected websocket clients for this game
    const payload = JSON.stringify(event);
    for (const conn of Object.values(this.connections)) {
      if (conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.send(payload);
      }
    }
  }

  private handleSession(socket: WebSocket, userId: string) {
    socket.accept();
    const connection: Connection = { socket, quitting: false, userId };
    this.connections[userId] = connection;

    socket.addEventListener('message', async (msg) => {
      try {
        if (typeof msg.data === 'string') {
          const envelope = JSON.parse(msg.data) as CommandEnvelope;
          // TODO: route based on scope: 'GAME' vs 'BATTLE'
          // For now, handle as GAME scope
          const result = await this.handleCommand(envelope.gameId, envelope);
          connection.socket.send(JSON.stringify({ type: 'COMMAND_RESULT', result }));
        }
      } catch (err) {
        console.error('WS message error:', err);
        connection.socket.send(JSON.stringify({ type: 'ERROR', message: String(err) }));
      }
    });

    const onClose = () => { connection.quitting = true; };
    socket.addEventListener('close', onClose);
    socket.addEventListener('error', onClose);
  }
}
