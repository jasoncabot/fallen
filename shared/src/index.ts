import { Province, ProvinceKey } from "./provinces";
import { ProvinceLookup } from "./buffer/data/province-lookup";
import { ByteBuffer } from "flatbuffers";
import { UnitCategory, UnitData, UnitType, UnitValue, WeaponData } from "./units";
import { EncyclopediaEntry, StructureCategory, StructureData, StructureType, StructureValue } from "./structures";

// @ts-ignore
import provinceData from "./data/provinces.bin";

const loadProvinces: () => Record<ProvinceKey, Province> = () => {
    const data = provinceData;
    const lookup = ProvinceLookup.getRootAsProvinceLookup(new ByteBuffer(data));

    let provinces = {} as Record<ProvinceKey, Province>;
    for (let i = 0; i < lookup.provincesLength(); i++) {
        const province = lookup.provinces(i)!;
        provinces[province.key()] = province;
    }

    return provinces;
};

export { EncyclopediaEntry };
export { UnitCategory, UnitData, UnitType, UnitValue, WeaponData };
export { StructureCategory, StructureData, StructureType, StructureValue };
export { ProvinceKey, Province, loadProvinces };
