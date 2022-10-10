import { PlayerGameProjection, ProvinceState } from './game';
import { Province } from './provinces';
import { StructureData, StructureType, StructureValue } from './structures';

export const calculateIncome: (province: ProvinceState, category: string) => number = (province: any, category: any) => {
  // TODO: need to take the current technology
  const structures: StructureValue[] = Object.values(province.structures || {});
  return structures.reduce((total: number, structure: StructureValue) => {
    const reference = StructureData[structure.kind.category];
    if (reference.production.category !== category) return total;
    return total + reference.production.value;
  }, 0);
};

export const calculateTotalIncome = (game: PlayerGameProjection, category: any) => {
  return Object.values(game.provinces)
    .filter((p: ProvinceState) => p.owner === game.player.owner)
    .map((p) => calculateIncome(p, category))
    .reduce((total: number, current: number) => total + current, 0);
};

export const hasStructureOfType = (type: StructureType) => {
  return (province: any) => {
    return Object.values(province.structures || {}).find((s: any) => s.kind.type === type);
  };
};

export const countStructureOfType = (type: StructureType) => {
  return (province: any) => {
    return Object.values(province.structures || {}).filter((s: any) => s.kind.type === type).length;
  };
};

export const countUnitsInside = (province: any) => {
  return Object.values(province.structures || {}).reduce((total: number, structure: any) => {
    return total + Object.values(structure.units || {}).length;
  }, 0);
};

export const countUnitsOutside = (province: any) => {
  return Object.values(province.units || {}).length;
};
