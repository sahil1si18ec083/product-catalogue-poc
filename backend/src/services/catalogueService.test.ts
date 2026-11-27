import { describe, expect, it } from "vitest";
import { CatalogueService } from "./catalogueService";
import type { Product, ProductProvider } from "../types";

const sample: Product[] = [
  { id: 1, title: "Blue shirt", price: 10, description: "Cotton", category: "clothing", image: "", rating: { rate: 4.2, count: 10 } },
  { id: 2, title: "Gold ring", price: 20, description: "Metal", category: "jewellery", image: "", rating: { rate: 4.8, count: 5 } },
  { id: 3, title: "Red shirt", price: 12, description: "Linen", category: "clothing", image: "", rating: { rate: 3.9, count: 2 } }
];
const provider: ProductProvider = {
  list: async () => sample,
  getById: async id => sample.find(p => p.id === id) ?? null
};

describe("CatalogueService", () => {
  it("returns configured featured products", async () => {
    const service = new CatalogueService(provider, [3, 1]);
    expect((await service.featured()).map(p => p.id)).toEqual([3, 1]);
  });
  it("falls back to highest-rated products", async () => {
    const service = new CatalogueService(provider, []);
    expect((await service.featured())[0].id).toBe(2);
  });
  it("searches title, description and category", async () => {
    const service = new CatalogueService(provider, []);
    expect((await service.all("linen")).map(p => p.id)).toEqual([3]);
  });
  it("filters by category", async () => {
    const service = new CatalogueService(provider, []);
    expect((await service.all(undefined, "clothing")).length).toBe(2);
  });
});