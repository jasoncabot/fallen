import { loadProvinces } from "../src";

test("Should load all provinces", () => {
    const provinces = loadProvinces();
    expect(Object.keys(provinces)).toHaveLength(44);
});
