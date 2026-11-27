import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="empty">No products found. Try another search.</div>;
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product}/>)}</div>;
}