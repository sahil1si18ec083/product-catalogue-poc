import type { Product } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...options, headers: { "Content-Type": "application/json", ...options?.headers }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  return response.json() as Promise<T>;
}
export const api = {
  featured: () => request<Product[]>("/products/featured"),
  categories: () => request<string[]>("/categories"),
  products: (search = "", category = "") => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    return request<Product[]>(`/products?${params}`);
  },
  product: (id: string) => request<Product>(`/products/${id}`),
  enquire: (payload: { name: string; email: string; message: string; productId: number }) =>
    request<{ message: string }>("/enquiries", { method: "POST", body: JSON.stringify(payload) })
};