# Turn Engine Architecture

## Goals

- Server-authoritative game simulation in the Game Durable Object.
- Strict sequencing of actions so two players cannot mutate state concurrently.
- One command model across strategic and tactical phases.
- One event-log model for websocket push, polling, and deterministic replay.
- Flatbuffers-friendly envelopes for transport/storage compatibility.
- Keep strategic economy/empire simulation responsive while tactical battles execute independently.

## Core Loop

1. Client sends a command envelope to the Game Durable Object.
2. Durable Object validates turn ownership and expected action index.
3. Durable Object applies command against canonical game state.
4. Durable Object emits one or more domain events.
5. Durable Object appends events to event log and advances action cursor.
6. Durable Object broadcasts new events to websocket subscribers.
7. Polling clients read events by sequence.

The command is input. Events are output. State is derived by applying events in order.

## Topology: GameDO + BattleDO

- GameDO remains the authoritative owner of:
  - Strategic state
  - Turn ownership and action sequencing
  - Battle lifecycle (start/finish)
- BattleDO owns one active tactical battle:
  - Tactical map state and command processing
  - Tactical action ordering and resolution
  - Battle-local event stream
- Coordination contract:
  - GameDO emits TACTICAL_BATTLE_STARTED with battleId.
  - Tactical commands are submitted with scope=BATTLE and battleId.
  - BattleDO emits tactical events and a terminal TACTICAL_BATTLE_FINISHED.
  - GameDO consumes finish event, applies strategic consequences, advances phase.

This preserves single-threaded authority per context while allowing strategic and tactical workloads to scale independently.

## Shared Contracts

- Commands: [shared/commands.ts](shared/commands.ts)
- Events: [shared/events.ts](shared/events.ts)
- Engine/storage contracts: [shared/turn-engine.ts](shared/turn-engine.ts)

## Sequencing Rules

- Every command carries:
  - turnNumber
  - expectedAction
  - actorPlayerId
  - mode
- Command acceptance requires:
  - actor owns current turn
  - turnNumber matches canonical turn
  - expectedAction matches nextAction cursor
  - mode matches current phase
- If any check fails, emit COMMAND_REJECTED and do not mutate state.
- Additional split-DO checks:
  - scope=GAME commands are only accepted by GameDO
  - scope=BATTLE commands require an active battleId mapped to the game
  - battleId must map to the addressed province and expected participants

## Strategic vs Tactical

- Strategic phase:
  - Province-level movement, construction, infrastructure, invasion initiation.
- Tactical phase:
  - Battle-scoped movement and attacks inside a single province.

Entering tactical mode:

- STRATEGIC_INVADE_PROVINCE accepted.
- Emit PROVINCE_INVADED and TACTICAL_BATTLE_STARTED.
- Set phase to TACTICAL with tactical context and active battleId.

Exiting tactical mode:

- Battle resolution event emitted (TACTICAL_BATTLE_FINISHED).
- Province ownership and losses are applied.
- Phase returns to STRATEGIC.

## Pitfalls To Avoid (Lessons from mature turn-based engines)

- Divergent simulation rules between client and server:
  - Keep all authoritative rule evaluation in DOs.
  - Treat clients as prediction/rendering only.
- Non-deterministic battle resolution:
  - Seed all RNG in event payloads or deterministic PRNG state.
  - Do not use wall-clock-time-dependent logic in resolution.
- Log ambiguity:
  - Every event should include gameId, action, turnNumber, and when tactical, battleId.
  - Keep event versions explicit for migration safety.
- Cross-context deadlocks or ordering bugs:
  - Use one-way lifecycle: GameDO starts battle, BattleDO resolves, GameDO finalizes.
  - Avoid synchronous circular calls between GameDO and BattleDO.
- Replay drift after patches:
  - Version snapshots and event schemas.
  - Add replay conformance tests from golden event logs.
- Long tactical battles starving strategic UX:
  - Isolate battle processing in BattleDO and keep GameDO lightweight.
  - Expose strategic read endpoints that remain responsive during tactical execution.

## Event Log and Replay

- Each emitted event gets monotonic sequence.
- DO stores events append-only.
- Replay is state reconstruction from snapshot + events since snapshot sequence.
- Recommended snapshot cadence:
  - Every N events (for example 100)
  - End of each turn

## Flatbuffers Integration

Use a flatbuffers envelope for wire/storage:

- Header: gameId, sequence, turnNumber, action, mode, timestamps.
- Header: gameId, sequence, turnNumber, action, mode, scope, battleId?, timestamps.
- Body: command/event union payload.

Recommended approach:

- Keep TypeScript contracts in shared as source-of-truth domain model.
- Mirror envelopes in flatbuffers schema unions.
- Add codec layer in DO:
  - decode fb -> domain envelope
  - encode domain envelope -> fb

## Durable Object Responsibilities

- Own canonical game runtime state.
- Serialize command handling (single-threaded per game instance).
- Append commands/events to storage.
- Publish events to websocket connections.
- Serve event queries for polling/replay.

## API Shape (Suggested)

- POST /api/games/:id/commands
  - body: command envelope (json now, flatbuffers later)
  - response: accepted/rejected + latest sequence
- GET /api/games/:id/events?from=123&limit=200
  - returns ordered event envelopes
- WS /api/games/:id/ws
  - pushes event envelopes as they are appended

## Why This Works

- Deterministic: all state changes come from ordered command processing.
- Observable: event log is a complete timeline.
- Extensible: tactical/strategic are just different command subsets over the same engine.
- Resilient: snapshots + log support recovery and replay without custom per-feature code.
