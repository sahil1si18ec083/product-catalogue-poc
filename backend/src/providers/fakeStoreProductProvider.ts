import type { Product, ProductProvider } from "../types";

export class FakeStoreProductProvider implements ProductProvider {
  constructor(private readonly baseUrl = "https://fakestoreapi.com") {}

  async list(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) throw new Error(`Product source returned ${response.status}`);
    return response.json() as Promise<Product[]>;
  }

  async getById(id: number): Promise<Product | null> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Product source returned ${response.status}`);
    return response.json() as Promise<Product>;
  }
}