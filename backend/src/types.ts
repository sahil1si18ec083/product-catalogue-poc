export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}
export interface ProductProvider {
  list(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
}
export interface Enquiry {
  name: string;
  email: string;
  message?: string;
  product: Product;
}
export interface EmailProvider {
  sendEnquiry(enquiry: Enquiry): Promise<void>;
}