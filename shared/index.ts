import { Province, ProvinceKey } from './provinces';
import { ProvinceLookup } from './buffer/data/province-lookup';
import { ByteBuffer } from 'flatbuffers';

// @ts-ignore
import provinceData from './data/provinces.bin';

let cacheByEnum: Record<number, Province> | undefined;
let cacheBySlug: Record<string, Province> | undefined;

const PROVINCE_SLUG_TO_KEY: Record<string, ProvinceKey> = {
  aberdeen: ProvinceKey.Aberdeen,
  alma: ProvinceKey.Alma,
  ayden: ProvinceKey.Ayden,
  balkany: ProvinceKey.Balkany,
  brimstone: ProvinceKey.Brimstone,
  'brome-lake': ProvinceKey.BromeLake,
  bromont: ProvinceKey.Bromont,
  canuck: ProvinceKey.Canuck,
  cartasone: ProvinceKey.Cartasone,
  chaos: ProvinceKey.Chaos,
  chertsy: ProvinceKey.Chertsy,
  creedmoor: ProvinceKey.Creedmoor,
  delos: ProvinceKey.Delos,
  'eagle-nest': ProvinceKey.EagleNest,
  elkin: ProvinceKey.Elkin,
  esterel: ProvinceKey.Esterel,
  'free-city': ProvinceKey.FreeCity,
  garland: ProvinceKey.Garland,
  granby: ProvinceKey.Granby,
  haven: ProvinceKey.Haven,
  'high-point': ProvinceKey.HighPoint,
  hull: ProvinceKey.Hull,
  kamouraska: ProvinceKey.Kamouraska,
  kinabal: ProvinceKey.Kinabal,
  lachine: ProvinceKey.Lachine,
  marshall: ProvinceKey.Marshall,
  'masson-lake': ProvinceKey.MassonLake,
  milos: ProvinceKey.Milos,
  norenda: ProvinceKey.Norenda,
  norwood: ProvinceKey.Norwood,
  orford: ProvinceKey.Orford,
  'point-harbour': ProvinceKey.PointHarbour,
  rawdon: ProvinceKey.Rawdon,
  roanoke: ProvinceKey.Roanoke,
  'rock-castle': ProvinceKey.RockCastle,
  rolland: ProvinceKey.Rolland,
  sherbrooke: ProvinceKey.Sherbrooke,
  'snake-river': ProvinceKey.SnakeRiver,
  sparta: ProvinceKey.Sparta,
  sutton: ProvinceKey.Sutton,
  thetfordmines: ProvinceKey.Thetfordmines,
  'three-rivers': ProvinceKey.ThreeRivers,
  valleyfield: ProvinceKey.Valleyfield,
  waterloo: ProvinceKey.Waterloo,
};

const PROVINCE_KEY_TO_SLUG: Record<number, string> = Object.fromEntries(
  Object.entries(PROVINCE_SLUG_TO_KEY).map(([slug, key]) => [key as number, slug])
);

const initProvinceCache = (): void => {
  if (cacheByEnum && cacheBySlug) return;

  const lookup = ProvinceLookup.getRootAsProvinceLookup(new ByteBuffer(provinceData));
  const byEnum: Record<number, Province> = {};
  const bySlug: Record<string, Province> = {};

  for (let i = 0; i < lookup.provincesLength(); i++) {
    const province = lookup.provinces(i)!;
    const enumKey = province.key() as number;

    byEnum[enumKey] = province;

    const slug = PROVINCE_KEY_TO_SLUG[enumKey];
    if (slug) {
      bySlug[slug] = province;
    }
  }

  cacheByEnum = byEnum;
  cacheBySlug = bySlug;
};

const provinceForKey = (key: ProvinceKey | string): Province | undefined => {
  initProvinceCache();

  if (!cacheByEnum || !cacheBySlug) {
    return undefined;
  }

  let found: Province | undefined;

  if (typeof key === 'number') {
    found = cacheByEnum[key];
  } else {
    const normalized = key.trim();
    const asNumber = Number(normalized);

    if (Number.isInteger(asNumber)) {
      found = cacheByEnum[asNumber];
    }

    if (!found) {
      const enumValue = PROVINCE_SLUG_TO_KEY[normalized.toLowerCase()];
      if (enumValue !== undefined) {
        found = cacheByEnum[enumValue];
      }
    }

    if (!found) {
      found = cacheBySlug[normalized] ?? cacheBySlug[normalized.toLowerCase()];
    }
  }

  return found;
};

const provinceSlugForKey = (key: ProvinceKey | string): string | undefined => {
  if (typeof key === 'string') {
    const normalized = key.toLowerCase();
    return PROVINCE_SLUG_TO_KEY[normalized] !== undefined ? normalized : undefined;
  }

  const directSlug = PROVINCE_KEY_TO_SLUG[key as number];
  if (directSlug) return directSlug;

  return PROVINCE_KEY_TO_SLUG[key as number];
};

// Re-export all named exports from individual modules
export * from './game';
export * from './structures';
export * from './units';
export * from './terrain';
export * from './technology';
export * from './provinces';
export * from './resource';
export * from './commands';
export * from './events';

export { provinceForKey, provinceSlugForKey, ProvinceKey, Province };
