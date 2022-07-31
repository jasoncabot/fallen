import { loadProvinces } from "@app/shared/index";

test("Should load all provinces", () => {
    const provinces = loadProvinces();
    expect(Object.keys(provinces)).toHaveLength(44);
});
