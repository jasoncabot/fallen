import { CommandEnvelope, EventEnvelope, StrategicCommand } from '../../../shared';
import StrategicStore, { StrategicDispatchResult, StrategicMessage } from './store';
import StrategicCommandBus from './command-bus';
import { StrategicCommandTransport, StrategicRuntimeCallbacks, StrategicRuntimeCommandContext } from './ports';

interface RuntimeOptions {
    store: StrategicStore;
    bus: StrategicCommandBus;
    transport: StrategicCommandTransport;
    callbacks?: StrategicRuntimeCallbacks;
}

export default class StrategicRuntime {
    private readonly store: StrategicStore;
    private readonly bus: StrategicCommandBus;
    private readonly transport: StrategicCommandTransport;
    private readonly callbacks: StrategicRuntimeCallbacks;

    constructor(options: RuntimeOptions) {
        this.store = options.store;
        this.bus = options.bus;
        this.transport = options.transport;
        this.callbacks = options.callbacks || {};
    }

    get state() {
        return this.store.state;
    }

    dispatch(message: StrategicMessage, context: StrategicRuntimeCommandContext): StrategicDispatchResult {
        const result = this.store.dispatch(message);
        this.applyEffects(result.effects, context);
        return result;
    }

    applyEvent(event: EventEnvelope): void {
        switch (event.event.type) {
            case 'COMMAND_ACCEPTED':
                this.bus.markAcked(event.event.command.commandId);
                this.store.dispatch({ type: 'ACK_COMMAND', commandId: event.event.command.commandId });
                break;
            case 'COMMAND_REJECTED':
                this.bus.markRejected(event.event.commandId, event.event.reason);
                this.store.dispatch({
                    type: 'REJECT_COMMAND',
                    commandId: event.event.commandId,
                    reason: event.event.message,
                });
                break;
        }
    }

    private applyEffects(effects: StrategicDispatchResult['effects'], context: StrategicRuntimeCommandContext): void {
        effects.forEach((effect) => {
            if (effect.type === 'PLAY_SOUND') {
                this.callbacks.onPlaySound?.(effect.sound);
                return;
            }

            const envelope = this.bus.enqueue(effect.command, {
                gameId: context.gameId,
                actorPlayerId: context.actorPlayerId,
                turnNumber: context.turnNumber,
                expectedAction: context.expectedAction,
                mode: 'STRATEGIC',
                scope: 'GAME',
            });

            this.store.dispatch({
                type: 'COMMAND_SENT',
                clientId: effect.clientId,
                commandId: envelope.commandId,
            });

            this.callbacks.onOptimisticCommand?.(effect.command, envelope);

            this.bus.markSent(envelope.commandId);
            this.transport
                .submitCommand(context.gameId, envelope)
                .then((response) => {
                    if (response.accepted) {
                        this.bus.markAcked(envelope.commandId);
                        this.store.dispatch({ type: 'ACK_COMMAND', commandId: envelope.commandId });
                        return;
                    }

                    this.bus.markRejected(envelope.commandId, response.reason);
                    this.store.dispatch({
                        type: 'REJECT_COMMAND',
                        commandId: envelope.commandId,
                        reason: response.reason || 'Command rejected by server',
                    });
                })
                .catch((error: Error) => {
                    this.bus.markRejected(envelope.commandId, error.message);
                    this.store.dispatch({
                        type: 'REJECT_COMMAND',
                        commandId: envelope.commandId,
                        reason: error.message,
                    });
                });
        });
    }
}
