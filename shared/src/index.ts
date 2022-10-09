import { Province, ProvinceKey } from "./provinces";
import { ProvinceLookup } from "./buffer/data/province-lookup";
import { ByteBuffer } from "flatbuffers";

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

export { ProvinceKey, Province, loadProvinces }
