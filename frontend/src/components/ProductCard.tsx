import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  return <Link to={`/products/${product.id}`} className="product-card">
    <div className="product-image"><img src={product.image} alt={product.title} loading="lazy"/><span className="quick-view"><ArrowUpRight size={17}/></span></div>
    <div className="product-meta"><span>{product.category}</span>{product.rating && <span className="rating"><Star size={12} fill="currentColor"/> {product.rating.rate}</span>}</div>
    <h3>{product.title}</h3><p className="price">${product.price.toFixed(2)}</p>
  </Link>;
}