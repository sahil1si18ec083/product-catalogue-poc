import type { Product, ProductProvider } from "../types";

export class CatalogueService {
  constructor(private readonly provider: ProductProvider, private readonly featuredIds: number[]) {}

  async all(search?: string, category?: string): Promise<Product[]> {
    let products = await this.provider.list();
    if (category) products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search) {
      const term = search.trim().toLowerCase();
      products = products.filter(p =>
        [p.title, p.description, p.category].some(value => value.toLowerCase().includes(term))
      );
    }
    return products;
  }

  async featured(): Promise<Product[]> {
    const products = await this.provider.list();
    if (this.featuredIds.length) {
      const byId = new Map(products.map(p => [p.id, p]));
      const configured = this.featuredIds.map(id => byId.get(id)).filter((p): p is Product => Boolean(p));
      if (configured.length) return configured.slice(0, 5);
    }
    return [...products]
      .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0) || a.id - b.id)
      .slice(0, 5);
  }

  async categories(): Promise<string[]> {
    const products = await this.provider.list();
    return [...new Set(products.map(p => p.category))].sort();
  }

  get(id: number) { return this.provider.getById(id); }
}