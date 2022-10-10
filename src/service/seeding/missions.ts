import type { MissionOverview } from '../../../shared/game';
import { ProvinceKey } from '../../../shared/provinces';

export const missionForProvince = (key: ProvinceKey): MissionOverview | undefined => {
  switch (key) {
    case ProvinceKey.EagleNest:
      return {
        description: 'Rebels need help',
        objective: 'Destroy Rocket Launcher',
        reward: 'Rebel forces will join you'
      };
    case ProvinceKey.Milos:
      return {
        description: 'Annihilate their research capacity',
        objective: 'Destroy the Laboratory',
        reward: '5000 R. Pts'
      };
    case ProvinceKey.Canuck:
      return {
        description: 'Special units under attack by the enemy',
        objective: 'Destroy all enemy units',
        reward: 'Special units'
      };
    case ProvinceKey.Kinabal:
      return {
        description: '',
        objective: 'Destroy all the enemy units without destroying a single building',
        reward: '5000 Cr.'
      };
    default:
      return undefined;
  }
};
