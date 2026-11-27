import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductGrid } from "../components/ProductGrid";
import type { Product } from "../types";

export function Listing({ mode }: { mode: "category" | "search" }) {
  const params = useParams();
  const location = useLocation();
  const category = mode === "category" ? decodeURIComponent(params.name || "") : "";
  const query = mode === "search" ? new URLSearchParams(location.search).get("q") || "" : "";
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
    Promise.all([api.products(query, category), api.featured()])
      .then(([items, top]) => { setProducts(items); setFeatured(top.filter(p => p.category.toLowerCase() === category.toLowerCase())); })
      .catch(e => setError(e.message));
  }, [query, category]);
  const featuredIds = new Set(featured.map(p => p.id));
  const ordered = mode === "category" ? [...featured, ...products.filter(p => !featuredIds.has(p.id))] : products;
  return <main className="listing section">
    <p className="eyebrow">{mode === "category" ? "SHOP BY CATEGORY" : "SEARCH THE COLLECTION"}</p>
    <h1>{mode === "category" ? category : `Results for “${query}”`}</h1>
    <p className="muted result-count">{products.length} products</p>
    {error ? <p className="error">{error}</p> : <ProductGrid products={ordered}/>}
  </main>;
}