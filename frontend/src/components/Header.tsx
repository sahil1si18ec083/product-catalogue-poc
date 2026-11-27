import { Search, ShoppingBag } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  }
  return <header className="header">
    <Link to="/" className="brand"><span className="brand-mark">f.</span> forma<span className="brand-dot">.</span></Link>
    <form className="search" onSubmit={submit}>
      <Search size={17}/><input aria-label="Search products" value={term} onChange={e => setTerm(e.target.value)} placeholder="Search products, categories..."/>
      <button type="submit">Search</button>
    </form>
    <div className="header-note"><ShoppingBag size={18}/><span>CURATED GOODS</span></div>
  </header>;
}