import { CommandEnvelope, StrategicCommand } from '../../../shared';
import * as api from '../../models/API';
import { StrategicCommandTransport, SubmitCommandResult } from './ports';

export class HttpStrategicCommandTransport implements StrategicCommandTransport {
    async submitCommand(gameId: string, envelope: CommandEnvelope<StrategicCommand>): Promise<SubmitCommandResult> {
        return api.post<SubmitCommandResult>(`/games/${gameId}/commands`, envelope);
    }
}

export class NoopStrategicCommandTransport implements StrategicCommandTransport {
    async submitCommand(_gameId: string, _envelope: CommandEnvelope<StrategicCommand>): Promise<SubmitCommandResult> {
        return { accepted: true };
    }
}
