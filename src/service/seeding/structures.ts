import type { UnitSeed } from './units';

export interface StructureSeed {
  type: string;
  position: { x: number; y: number };
  units?: Pick<UnitSeed, 'type' | 'experience'>[];
}

export const structures: Record<string, StructureSeed[]> = {
  haven: [
    { position: { x: 20, y: 24 }, type: 'ENERGY' }, { position: { x: 20, y: 27 }, type: 'ENERGY' },
    { position: { x: 18, y: 24 }, type: 'ENERGY' }, { position: { x: 18, y: 27 }, type: 'ENERGY' },
    { position: { x: 27, y: 23 }, type: 'MINING' }, { position: { x: 18, y: 21 }, type: 'MINING' },
    { position: { x: 28, y: 19 }, type: 'TOWER' }, { position: { x: 27, y: 20 }, type: 'BARRACKS' },
    { position: { x: 22, y: 20 }, type: 'FACTORY' }, { position: { x: 31, y: 22 }, type: 'AIRPORT' },
    { position: { x: 23, y: 29 }, type: 'LAB' }, { position: { x: 23, y: 31 }, type: 'LAB' },
    { position: { x: 24, y: 27 }, type: 'SCANNER' },
    { position: { x: 23, y: 24 }, type: 'DROPSHIP', units: [{ type: 'TROOP', experience: 1 }, { type: 'SQUAD', experience: 1 }, { type: 'LTTANK', experience: 1 }] },
    { position: { x: 27, y: 27 }, type: 'STARPORT' }
  ],
  'eagle-nest': [
    { position: { x: 7, y: 0 }, type: 'ENERGY' }, { position: { x: 9, y: 20 }, type: 'ENERGY' },
    { position: { x: 11, y: 0 }, type: 'ENERGY' }, { position: { x: 7, y: 6 }, type: 'ENERGY' },
    { position: { x: 18, y: 18 }, type: 'ENERGY' }, { position: { x: 3, y: 3 }, type: 'MINING' },
    { position: { x: 4, y: 17 }, type: 'MINING' }, { position: { x: 33, y: 21 }, type: 'TOWER' },
    { position: { x: 30, y: 19 }, type: 'TOWER' }, { position: { x: 31, y: 16 }, type: 'TOWER' },
    { position: { x: 23, y: 36 }, type: 'TOWER' }, { position: { x: 25, y: 36 }, type: 'TOWER' },
    { position: { x: 26, y: 36 }, type: 'TOWER' }, { position: { x: 28, y: 36 }, type: 'TOWER' },
    { position: { x: 27, y: 29 }, type: 'TOWER' }, { position: { x: 24, y: 29 }, type: 'TOWER' },
    { position: { x: 28, y: 16 }, type: 'TOWER' }, { position: { x: 26, y: 5 }, type: 'TOWER' },
    { position: { x: 38, y: 13 }, type: 'TOWER' }, { position: { x: 26, y: 33 }, type: 'TOWER' },
    { position: { x: 25, y: 33 }, type: 'TOWER' }, { position: { x: 18, y: 4 }, type: 'BARRACKS' },
    { position: { x: 0, y: 21 }, type: 'FACTORY' }, { position: { x: 14, y: 20 }, type: 'LAB' },
    { position: { x: 5, y: 8 }, type: 'ANTIMISSILE' }, { position: { x: 17, y: 8 }, type: 'SCANNER' }
  ],
  cartasone: [
    { position: { x: 42, y: 0 }, type: 'ENERGY' }, { position: { x: 45, y: 3 }, type: 'ENERGY' },
    { position: { x: 42, y: 4 }, type: 'BARRACKS' }, { position: { x: 38, y: 0 }, type: 'MINING' },
    { position: { x: 27, y: 8 }, type: 'TOWER' }, { position: { x: 27, y: 3 }, type: 'TOWER' },
    { position: { x: 35, y: 2 }, type: 'TOWER' }, { position: { x: 45, y: 6 }, type: 'ENERGY' },
    { position: { x: 45, y: 8 }, type: 'ENERGY' }, { position: { x: 33, y: 8 }, type: 'MINING' },
    { position: { x: 45, y: 11 }, type: 'ENERGY' }, { position: { x: 40, y: 8 }, type: 'FACTORY' },
    { position: { x: 30, y: 12 }, type: 'TOWER' }, { position: { x: 44, y: 15 }, type: 'MINING' },
    { position: { x: 34, y: 16 }, type: 'TOWER' }, { position: { x: 38, y: 18 }, type: 'TOWER' },
    { position: { x: 39, y: 4 }, type: 'LAB' }, { position: { x: 41, y: 15 }, type: 'LAB' },
    { position: { x: 30, y: 5 }, type: 'ANTIMISSILE' }, { position: { x: 41, y: 12 }, type: 'SCANNER' },
    { position: { x: 37, y: 4 }, type: 'ENERGY' }, { position: { x: 36, y: 23 }, type: 'TOWER' },
    { position: { x: 37, y: 20 }, type: 'ENERGY' }, { position: { x: 38, y: 29 }, type: 'TOWER' },
    { position: { x: 44, y: 30 }, type: 'TOWER' }, { position: { x: 44, y: 21 }, type: 'MINING' },
    { position: { x: 41, y: 21 }, type: 'MINING' }, { position: { x: 44, y: 25 }, type: 'MINING' },
    { position: { x: 40, y: 25 }, type: 'MINING' }
  ],
  milos: [
    { position: { x: 23, y: 25 }, type: 'LAB' }, { position: { x: 11, y: 23 }, type: 'ENERGY' },
    { position: { x: 10, y: 26 }, type: 'ENERGY' }, { position: { x: 33, y: 36 }, type: 'ENERGY' },
    { position: { x: 27, y: 26 }, type: 'ENERGY' }, { position: { x: 9, y: 17 }, type: 'MINING' },
    { position: { x: 9, y: 31 }, type: 'MINING' }, { position: { x: 9, y: 36 }, type: 'MINING' },
    { position: { x: 28, y: 36 }, type: 'MINING' }, { position: { x: 25, y: 28 }, type: 'TOWER' },
    { position: { x: 21, y: 26 }, type: 'TOWER' }, { position: { x: 26, y: 23 }, type: 'TOWER' },
    { position: { x: 20, y: 23 }, type: 'TOWER' }, { position: { x: 22, y: 23 }, type: 'TOWER' },
    { position: { x: 16, y: 32 }, type: 'BARRACKS' }, { position: { x: 13, y: 33 }, type: 'FACTORY' },
    { position: { x: 18, y: 27 }, type: 'ANTIMISSILE' }, { position: { x: 24, y: 32 }, type: 'SCANNER' },
    { position: { x: 14, y: 23 }, type: 'ENERGY' }
  ]
};
