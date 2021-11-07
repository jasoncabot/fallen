import { ProvinceIndexer } from "../src/province-indexer";

describe("province indexer", () => {
  it("should produce sparse structure array", () => {
    const indexer = new ProvinceIndexer({}, {});
    expect(indexer.wallAt({ x: 0, y: 0 })).toBeTruthy();
  })
});