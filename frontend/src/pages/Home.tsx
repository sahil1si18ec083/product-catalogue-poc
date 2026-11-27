import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { ProductGrid } from "../components/ProductGrid";
import type { Product } from "../types";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([api.featured(), api.categories()])
    .then(([featured, cats]) => { setProducts(featured); setCategories(cats); })
    .catch(e => setError(e.message)); }, []);
  return <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">THE EVERYDAY EDIT · VOL. 01</p><h1>Good things.<br/><em>Well chosen.</em></h1><p className="hero-description">A considered collection of pieces made to bring a little more joy to the everyday.</p><a href="#featured" className="dark-button">Explore the collection <span>↗</span></a></div><div className="hero-art"><div className="hero-circle"></div><div className="hero-caption">OBJECTS FOR<br/>BETTER LIVING</div><div className="hero-index">01 / 05</div></div></section>
    <section className="section category-strip"><div><p className="eyebrow">FIND YOUR SOMETHING</p><h2>Browse by category</h2></div><div className="category-links">{categories.map(c => <Link key={c} to={`/category/${encodeURIComponent(c)}`}>{c}<span>↗</span></Link>)}</div></section>
    <section className="section" id="featured"><div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Top rated favourites</h2></div><span className="muted">THE FIVE MOST LOVED</span></div>
      {error ? <p className="error">{error}</p> : products.length ? <ProductGrid products={products}/> : <p className="muted">Loading the collection...</p>}
    </section>
  </main>;
}