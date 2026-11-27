import { ArrowLeft, Star } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../types";

export function ProductPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); const [sending, setSending] = useState(false);
  useEffect(() => { api.product(id).then(setProduct).catch(e => setError(e.message)); }, [id]);
  async function submit(e: FormEvent) {
    e.preventDefault(); if (!product) return;
    setSending(true); setStatus("");
    try { const result = await api.enquire({ name, email, message, productId: product.id }); setStatus(result.message); setName(""); setEmail(""); setMessage(""); }
    catch (e) { setStatus(e instanceof Error ? e.message : "Unable to submit enquiry."); }
    finally { setSending(false); }
  }
  if (error) return <main className="section"><p className="error">{error}</p><Link to="/">Back home</Link></main>;
  if (!product) return <main className="section muted">Loading product...</main>;
  return <main className="section detail-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Back to collection</Link>
    <div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.title}/></div>
      <div className="detail-info"><p className="eyebrow">{product.category}</p><h1>{product.title}</h1><p className="detail-price">${product.price.toFixed(2)}</p>
        {product.rating && <p className="rating detail-rating"><Star size={15} fill="currentColor"/> {product.rating.rate} <span>({product.rating.count} reviews)</span></p>}
        <p className="description">{product.description}</p>
        <button className="dark-button enquire-button" onClick={() => { setOpen(!open); setStatus(""); }}>Enquire about this product <span>↗</span></button>
        {open && <form className="enquiry-form" onSubmit={submit}>
          <h3>Let's get in touch.</h3><label>Your name<input required minLength={2} maxLength={100} value={name} onChange={e => setName(e.target.value)}/></label>
          <label>Email address<input required type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)}/></label>
          <label>Message <span className="muted">(optional)</span><textarea maxLength={2000} rows={3} value={message} onChange={e => setMessage(e.target.value)}/></label>
          <button className="dark-button" disabled={sending}>{sending ? "Sending..." : "Send enquiry ↗"}</button>
          {status && <p className={status.startsWith("Thank") ? "success" : "error"} role="status">{status}</p>}
        </form>}
      </div>
    </div>
  </main>;
}