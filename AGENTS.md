# AGENTS

## Migrated Repository Notes

This file now holds repository-specific working notes that were previously kept in local repo memory.

- Client strict TS errors reduced by restoring legacy frontend contracts: GameOptions class methods, Authenticator person helpers, and API helpers (getAndCache, socketAuth).
- Use @shared/index import path in client scenes; @fallen/shared is stale.
- Game create/show must use one canonical ID: force game.id = id inside DO create action; otherwise client receives a different ID than the DO name and GET /api/games/:id returns 404.

- import.meta.env needs "types": ["vite/client"] in tsconfig.client.json.
- Legacy missing assets modules recreated at client/assets/Resources.ts and client/assets/Sounds.ts.
- client/features/strategic/adapters/StrategicProjectionAdapter.ts requires explicit target narrowing (unit vs structure) for command handling under strict mode.

- Keep strategic runtime ports generic-safe: use CommandEnvelope<StrategicCommand> in client runtime callbacks; plain CommandEnvelope widens to GameCommand and breaks optimistic mapper typing.
- ConstructionModeCategory includes sentinel values (ROAD, WALL, RECYCLE), but STRATEGIC_BUILD_STRUCTURE.category must remain StructureCategory; guard or branch RECYCLE before building structure commands.

## Turn Engine Architecture (GameDO + BattleDO Split)

- Command/Event Split: CommandEnvelope includes scope: 'GAME' | 'BATTLE' and optional battleId.
- EventEnvelope includes optional battleId for cross-DO event correlation.
- Tactical lifecycle: GameDO emits TACTICAL_BATTLE_STARTED with battleId. BattleDO owns tactical state. Finishes with TACTICAL_BATTLE_FINISHED consumed by GameDO.
- Single-threaded authority: GameDO for strategic, BattleDO for tactical. No circular calls.
- Storage contracts: TurnEngine, BattleEngine, EventLogStore, SnapshotStore, CommandStore, BattleIndexStore, BattleRuntimeStore.
- Docs: see docs/architecture/turn-engine.md for full flow and pitfalls to avoid.

## Implemented in DO + Routes (Phase 1)

- DO integration: Added submit-command and events actions to Game DO.
- Event log: DO stores append-only event log keyed by gameId.
- Command handler stub: handleCommand() validates and emits COMMAND_ACCEPTED event, broadcasts to WS subscribers.
- WebSocket messaging: WS handler parses commands from JSON and dispatches via handleCommand().
- HTTP routes: POST /api/games/:id/commands for submission, GET /api/games/:id/events?from=X&limit=Y for polling/replay.
- Auth guard: Commands validated against authenticated userId.

## Build and Deployment Status

- TypeScript: passes strict mode (npm run typecheck).
- Build: Vite build succeeds (npm run build -> dist/).
- Exported architecture: shared/commands.ts, shared/events.ts, shared/turn-engine.ts all export types cleanly.
- shared/index.ts uses export-star pattern to re-export modules.

## Next Priorities for Runnable Game View

1. Basic game flow (MainMenu -> NewGame -> CreateGame -> LoadGameResources -> StrategicOverview).
- Verify StrategicOverview scene loads and displays province map with fog of war.
- StrategicOverview already has buttonZoom that shows ProvinceOverview zoomed in.

2. Province detail view (strategic deep-dive).
- Ensure clicking a province or zoom button navigates to ProvinceStrategic.
- ProvinceStrategic should show terrain, units, structures with fog-of-war rules.
- Only show units and structures if province is in scannableProvinces.
- If not scannable, show Out of scanning range message.

3. Command submission (hook up new command API).
- Client scenes emit commands to POST /api/games/:id/commands.
- DO ingests, validates, emits events, and broadcasts via WS.
- Client listens for events via WS or polling via GET /api/games/:id/events.

4. Rule engine.
- Implement command validation for turn ownership, mode checks, and action index sequencing.

5. Tactical mode.
- When invasion is initiated, route tactical commands to BattleDO (scope=BATTLE).
