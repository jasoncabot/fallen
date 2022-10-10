import {
    CommandIdentifier,
    ProvinceKey,
    StrategicCommand,
    StructureIdentifier,
    UnitIdentifier,
    UnitEntityState,
} from '../../../shared';
import { ConstructionMode, ConstructionModeCategory } from './construction';

export interface TileIndex {
    x: number;
    y: number;
}

export interface QueuedStrategicCommand {
    clientId: string;
    sequence: number;
    status: 'queued' | 'sent' | 'acked' | 'rejected';
    commandId?: CommandIdentifier;
    reason?: string;
    command: StrategicCommand;
}

export interface StrategicUiState {
    selectedUnitId: UnitIdentifier | null;
    constructionMode: ConstructionMode | null;
    overviewVisible: boolean;
}

export interface StrategicState {
    ui: StrategicUiState;
    queue: QueuedStrategicCommand[];
    nextSequence: number;
}

export type StrategicEffect =
    | { type: 'QUEUE_COMMAND'; command: StrategicCommand; clientId: string; sequence: number }
    | { type: 'PLAY_SOUND'; sound: 'yessir' };

export type StrategicMessage =
    | { type: 'CLEAR_SELECTION' }
    | { type: 'TOGGLE_OVERVIEW' }
    | { type: 'SET_CONSTRUCTION_MODE'; mode: ConstructionMode | null }
    | { type: 'UNIT_SELECTED'; unit: UnitEntityState }
    | { type: 'UNIT_TURN_REQUEST'; province: ProvinceKey; unit: UnitEntityState }
    | { type: 'UNIT_MOVE_REQUEST'; province: ProvinceKey; unit: UnitEntityState; tileIndex: TileIndex; canOccupy: boolean }
    | {
        type: 'UNIT_DISEMBARK_REQUEST';
        province: ProvinceKey;
        unitId: UnitIdentifier;
        containerId: StructureIdentifier;
        containerType: 'structure';
        tileIndex: TileIndex;
        canDisembark: boolean;
    }
    | { type: 'STRUCTURE_BOARD_REQUEST'; province: ProvinceKey; unit: UnitEntityState; dropshipId: StructureIdentifier; canBoard: boolean }
    | { type: 'CONSTRUCTION_REQUEST'; command: StrategicCommand | null; canConstruct: boolean }
    | { type: 'COMMAND_SENT'; clientId: string; commandId: CommandIdentifier }
    | { type: 'ACK_COMMAND'; commandId: CommandIdentifier }
    | { type: 'REJECT_COMMAND'; commandId: CommandIdentifier; reason: string };

export interface StrategicDispatchResult {
    state: StrategicState;
    effects: StrategicEffect[];
}

const createInitialState = (): StrategicState => ({
    ui: {
        selectedUnitId: null,
        constructionMode: null,
        overviewVisible: false,
    },
    queue: [],
    nextSequence: 1,
});

const withQueuedCommand = (state: StrategicState, command: StrategicCommand): StrategicDispatchResult => {
    const sequence = state.nextSequence;
    const clientId = `strategic-${sequence}`;
    const queued: QueuedStrategicCommand = {
        clientId,
        sequence,
        status: 'queued',
        command,
    };

    return {
        state: {
            ...state,
            queue: [...state.queue, queued],
            nextSequence: state.nextSequence + 1,
        },
        effects: [{
            type: 'QUEUE_COMMAND',
            command,
            clientId,
            sequence,
        }],
    };
};

const asProvinceId = (province: ProvinceKey): string => String(province);

const buildStructureCommand = (province: ProvinceKey, category: ConstructionModeCategory, at: TileIndex): StrategicCommand => {
    if (category === 'ROAD') {
        return {
            type: 'STRATEGIC_BUILD_ROAD',
            provinceId: asProvinceId(province),
            at,
        };
    }

    if (category === 'WALL') {
        return {
            type: 'STRATEGIC_BUILD_WALL',
            provinceId: asProvinceId(province),
            at,
        };
    }

    if (category === 'RECYCLE') {
        throw new Error('RECYCLE is not a buildable structure category');
    }

    return {
        type: 'STRATEGIC_BUILD_STRUCTURE',
        provinceId: asProvinceId(province),
        category,
        at,
    };
};

const update = (state: StrategicState, message: StrategicMessage): StrategicDispatchResult => {
    switch (message.type) {
        case 'CLEAR_SELECTION':
            return {
                state: {
                    ...state,
                    ui: {
                        ...state.ui,
                        selectedUnitId: null,
                        constructionMode: null,
                    },
                },
                effects: [],
            };
        case 'TOGGLE_OVERVIEW':
            return {
                state: {
                    ...state,
                    ui: {
                        ...state.ui,
                        overviewVisible: !state.ui.overviewVisible,
                        constructionMode: state.ui.overviewVisible ? state.ui.constructionMode : null,
                    },
                },
                effects: [],
            };
        case 'SET_CONSTRUCTION_MODE':
            return {
                state: {
                    ...state,
                    ui: {
                        ...state.ui,
                        constructionMode: message.mode,
                        selectedUnitId: message.mode ? null : state.ui.selectedUnitId,
                    },
                },
                effects: [],
            };
        case 'UNIT_SELECTED':
            return {
                state: {
                    ...state,
                    ui: {
                        ...state.ui,
                        selectedUnitId: message.unit.id,
                        constructionMode: null,
                    },
                },
                effects: [{ type: 'PLAY_SOUND', sound: 'yessir' }],
            };
        case 'UNIT_TURN_REQUEST':
            return withQueuedCommand(state, {
                type: 'STRATEGIC_TURN_UNIT',
                provinceId: asProvinceId(message.province),
                unitId: message.unit.id,
            });
        case 'UNIT_MOVE_REQUEST':
            if (!message.canOccupy) return { state, effects: [] };
            return withQueuedCommand(state, {
                type: 'STRATEGIC_MOVE_UNIT',
                provinceId: asProvinceId(message.province),
                unitId: message.unit.id,
                to: message.tileIndex,
            });
        case 'UNIT_DISEMBARK_REQUEST':
            if (!message.canDisembark) return { state, effects: [] };
            return withQueuedCommand(state, {
                type: 'STRATEGIC_DISEMBARK',
                provinceId: asProvinceId(message.province),
                unitId: message.unitId,
                structureId: message.containerId,
                at: message.tileIndex,
            });
        case 'STRUCTURE_BOARD_REQUEST':
            if (!message.canBoard) return { state, effects: [] };
            return withQueuedCommand(state, {
                type: 'STRATEGIC_BOARD',
                provinceId: asProvinceId(message.province),
                unitId: message.unit.id,
                structureId: message.dropshipId,
            });
        case 'CONSTRUCTION_REQUEST':
            if (!message.canConstruct || !message.command) return { state, effects: [] };
            return withQueuedCommand(state, message.command);
        case 'COMMAND_SENT':
            return {
                state: {
                    ...state,
                    queue: state.queue.map((item) =>
                        item.clientId === message.clientId
                            ? { ...item, status: 'sent', commandId: message.commandId }
                            : item
                    ),
                },
                effects: [],
            };
        case 'ACK_COMMAND':
            return {
                state: {
                    ...state,
                    queue: state.queue.map((item) =>
                        item.commandId === message.commandId
                            ? { ...item, status: 'acked' }
                            : item
                    ),
                },
                effects: [],
            };
        case 'REJECT_COMMAND':
            return {
                state: {
                    ...state,
                    queue: state.queue.map((item) =>
                        item.commandId === message.commandId
                            ? { ...item, status: 'rejected', reason: message.reason }
                            : item
                    ),
                },
                effects: [],
            };
        default:
            return { state, effects: [] };
    }
};

export const buildConstructionCommand = (
    province: ProvinceKey,
    category: ConstructionModeCategory,
    tileIndex: TileIndex,
): StrategicCommand => buildStructureCommand(province, category, tileIndex);

export default class StrategicStore {
    private _state: StrategicState;

    constructor(initial: StrategicState = createInitialState()) {
        this._state = initial;
    }

    get state(): StrategicState {
        return this._state;
    }

    dispatch(message: StrategicMessage): StrategicDispatchResult {
        const result = update(this._state, message);
        this._state = result.state;
        return result;
    }
}
