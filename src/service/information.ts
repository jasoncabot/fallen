import { provinceForKey, provinceSlugForKey } from '../../shared/index';
import { hasStructureOfType } from '../../shared/resource';
import type { GameState, PlayerGameProjection, ProvinceState } from '../../shared/game';
import type { ProvinceKey } from '../../shared/provinces';
import type { StructureType } from '../../shared/structures';

function touchingOwnedWithScanner(provinceKey: string, owner: string, provinces: Record<string, ProvinceState>): boolean {
  // ProvinceKey values are numeric enums in flatbuffer data; convert slugs as needed.
  const key = provinceKey as unknown as ProvinceKey;
  const province = provinceForKey(key);
  if (!province) return false;

  for (let i = 0; i < province.touchingLength(); i++) {
    const neighbour = province.touching(i);
    if (!neighbour) continue;
    const neighbourSlug = provinceSlugForKey(neighbour);
    if (!neighbourSlug) continue;
    const neighbourProvince = provinces[neighbourSlug];
    if (neighbourProvince?.owner === owner && hasStructureOfType('SCANNER' as StructureType)(neighbourProvince)) {
      return true;
    }
  }
  return false;
}

export function removeUnknown(game: GameState, userId: string): PlayerGameProjection {
  const player = game.sides[userId];

  const scannableProvinces: string[] = [];
  const filteredProvinces: Record<string, ProvinceState> = {};

  for (const [key, province] of Object.entries(game.provinces)) {
    const scannable = province.owner === player.owner || touchingOwnedWithScanner(key, player.owner, game.provinces);

    filteredProvinces[key] = scannable
      ? province
      : { ...province, walls: [], roads: [], units: undefined, structures: undefined };

    if (scannable) scannableProvinces.push(key);
  }

  return {
    id: game.id,
    playerId: userId,
    defaultProvince: game.defaultProvince,
    turn: game.turn,
    player,
    provinces: filteredProvinces,
    scannableProvinces
  };
}
