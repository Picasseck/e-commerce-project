import { filterProducts, normalizeSearch } from "../../scripts/utils/searchUtils.js";

describe("searchUtils", () => {
  const products = [
    { id: "p1", name: "Black Socks" },
    { id: "p2", name: "Basketball" },
    { id: "p3", name: "T-Shirt Pack" }
  ];

  it("normalizeSearch trims and lowercases", () => {
    expect(normalizeSearch("  HeLLo ")).toBe("hello");
  });

  it("filterProducts returns all when search is empty", () => {
    expect(filterProducts(products, "")).toEqual(products);
    expect(filterProducts(products, "   ")).toEqual(products);
  });

  it("filters case-insensitively", () => {
    const result = filterProducts(products, "sock");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("p1");
  });

  it("returns empty array when no match", () => {
    expect(filterProducts(products, "iphone").length).toBe(0);
  });
});