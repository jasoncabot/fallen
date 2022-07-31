import { Province, ProvinceKey } from "@app/shared/provinces";
import provinceData from "@app/shared/data/provinces.bin";
import { ProvinceLookup } from "./buffer/data/province-lookup";
import { ByteBuffer } from "flatbuffers";

const loadProvinces: () => Record<ProvinceKey, Province> = () => {
    const data = provinceData;
    const lookup = ProvinceLookup.getRootAsProvinceLookup(new ByteBuffer(data));

    let provinces = {} as Record<ProvinceKey, Province>;
    for (let i = 0; i < lookup.provincesLength(); i++) {
        const province = lookup.provinces(i);
        provinces[province.key()] = province;
    }

    return provinces;
};

export { ProvinceKey, Province }
export { loadProvinces };
