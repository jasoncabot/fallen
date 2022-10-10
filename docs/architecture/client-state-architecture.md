# Client State Architecture Principles

This document defines the guiding architecture for turn-based gameplay in the client.

## Goals

- Keep game rules deterministic and testable.
- Keep Phaser rendering rich but replaceable.
- Support optimistic local commands with authoritative server reconciliation.
- Make feature changes additive rather than requiring scene-wide rewrites.

## Layering Model

Use a strict inside-out dependency flow:

1. Domain Core
- Pure reducers and validators.
- No Phaser, network, or storage access.
- Input: Commands and events.
- Output: New state and domain events.

2. Application Store
- Elm-style `update(model, msg) -> { model, effects }`.
- Owns local UI mode state, selection state, and command queue state.
- Builds optimistic projection from authoritative state + pending commands.

3. Ports
- Typed interfaces for network, audio, clock, and rendering effects.
- Domain and store code depend on ports, never concrete adapters.
- Strategic projection contract is defined by `StrategicProjectionAdapterPort` in `client/features/strategic/ports.ts`.

4. Adapters
- Phaser scene adapters implement rendering and input mapping.
- HTTP/WS adapter implements network submit, ack, reject, replay.
- Adapters are the only place side effects are executed.
- Strategic province projection + optimistic command application is implemented by `StrategicProjectionAdapter` in `client/features/strategic/adapters/StrategicProjectionAdapter.ts`.

## Elm / Reducer Rules

- Every user interaction is converted into a typed message.
- Scene code must not mutate domain state directly.
- Reducers are total and deterministic for all message variants.
- Effect emission is declarative; effect execution is outside reducers.

## CQRS-lite Strategy

Use separate write and read concerns without introducing full distributed complexity:

- Write path: validate and apply commands against authoritative rules.
- Read path: projection model optimized for render decisions.
- Optimistic read projection may include pending local commands.
- Server acks/rejections reconcile into authoritative state and trigger rebase.

## Command Queue Contract

Each queued command must include:

- `clientId`: unique client-generated id.
- `sequence`: monotonically increasing local order.
- `status`: `queued | sent | acked | rejected`.
- `submittedAt`: local timestamp for diagnostics.

Queue rules:

- Preserve in-order processing semantics.
- Never mutate historical entries in place except status transitions.
- On rejection, rebuild optimistic projection from authoritative state plus remaining valid pending commands.

## Authoritative + Optimistic State Split

Store two distinct snapshots:

- Authoritative: confirmed by server events.
- Optimistic: authoritative plus pending local commands.

Render from optimistic state only.

## Phaser Adapter Rules

Phaser scenes are adapters, not business logic owners.

Allowed responsibilities:

- Input capture and translation to store messages.
- Render diff application (tiles, sprites, overlays, UI states).
- Camera controls and scene transitions.
- Animation playback driven by effect payloads.

Disallowed responsibilities:

- Command validation logic.
- Rule evaluation for movement/build legality.
- Authoritative state mutations.

Current mapping:
- `StrategicStore` + `StrategicRuntime`: message update and command/event lifecycle.
- `StrategicProjectionAdapter`: projection data and command-driven render model updates.
- `ProvinceStrategic` and `ProvinceOverview`: Phaser scene adapters that read from projection port and draw sprites/blitters.

## Naming Conventions

Type names should reflect architectural purpose:

- `GameState`, `ProvinceState`: authoritative domain state.
- `PlayerGameProjection`: read model for player-visible state.
- `UnitEntityState`, `StructureEntityState`: entity-level state.
- Avoid vague suffixes like `Thing`.

## Testing Strategy

- Unit test reducers and validators in isolation.
- Snapshot test projection transformations.
- Adapter tests should focus on effect-to-Phaser mapping, not domain rules.
- Replay tests should prove deterministic rehydration from event stream.

## Migration Rules For Existing Scenes

When refactoring legacy scenes:

1. Introduce store first, keep current rendering.
2. Move command generation into reducer messages.
3. Move validation and command apply into domain services.
4. Convert scene mutation paths into render effects.
5. Remove legacy state fields only after parity is verified.
6. Replace scene utility classes with feature adapters under `client/features/*/adapters` and reference through ports.

## Non-Goals

- No heavy framework dependency is required.
- No hard requirement to convert every scene at once.
- No lock-in to a single transport (HTTP polling or WebSocket both supported).
