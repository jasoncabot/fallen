import { Events } from 'phaser';
import { CommandEnvelope, CommandIdentifier, StrategicCommand, TurnMode } from '../../../shared';

export interface StrategicCommandQueueEntry {
    envelope: CommandEnvelope<StrategicCommand>;
    status: 'queued' | 'sent' | 'acked' | 'rejected';
    reason?: string;
}

export interface EnqueueContext {
    gameId: string;
    actorPlayerId: string;
    turnNumber: number;
    expectedAction: number;
    mode?: TurnMode;
    scope?: 'GAME' | 'BATTLE';
    battleId?: string;
}

export default class StrategicCommandBus {
    readonly emitter: Events.EventEmitter;
    private readonly entries: StrategicCommandQueueEntry[];

    constructor() {
        this.emitter = new Events.EventEmitter();
        this.entries = [];
    }

    enqueue(command: StrategicCommand, context: EnqueueContext): CommandEnvelope<StrategicCommand> {
        const sequenceOffset = this.entries.filter((entry) =>
            entry.envelope.gameId === context.gameId &&
            entry.envelope.turnNumber === context.turnNumber &&
            entry.status !== 'rejected'
        ).length;

        const envelope: CommandEnvelope<StrategicCommand> = {
            commandId: crypto.randomUUID() as CommandIdentifier,
            gameId: context.gameId,
            scope: context.scope ?? 'GAME',
            battleId: context.battleId,
            actorPlayerId: context.actorPlayerId,
            turnNumber: context.turnNumber,
            expectedAction: context.expectedAction + sequenceOffset,
            mode: context.mode ?? 'STRATEGIC',
            issuedAtMs: Date.now(),
            command,
        };

        this.entries.push({ envelope, status: 'queued' });
        this.emitter.emit('commandQueued', envelope);
        return envelope;
    }

    markSent(commandId: string): void {
        const entry = this.entries.find((item) => item.envelope.commandId === commandId);
        if (!entry) return;
        entry.status = 'sent';
        this.emitter.emit('commandSent', entry.envelope);
    }

    markAcked(commandId: string): void {
        const entry = this.entries.find((item) => item.envelope.commandId === commandId);
        if (!entry) return;
        entry.status = 'acked';
        this.emitter.emit('commandAcked', entry.envelope);
    }

    markRejected(commandId: string, reason?: string): void {
        const entry = this.entries.find((item) => item.envelope.commandId === commandId);
        if (!entry) return;
        entry.status = 'rejected';
        entry.reason = reason;
        this.emitter.emit('commandRejected', entry.envelope, reason);
    }

    getEntriesForGame(gameId: string): StrategicCommandQueueEntry[] {
        return this.entries.filter((entry) => entry.envelope.gameId === gameId);
    }

    getPendingEnvelopesForGame(gameId: string): CommandEnvelope<StrategicCommand>[] {
        return this.entries
            .filter((entry) => entry.envelope.gameId === gameId && (entry.status === 'queued' || entry.status === 'sent'))
            .map((entry) => entry.envelope);
    }

    clearGame(gameId: string): void {
        const remaining = this.entries.filter((entry) => entry.envelope.gameId !== gameId);
        this.entries.length = 0;
        this.entries.push(...remaining);
    }
}
