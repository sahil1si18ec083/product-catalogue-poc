import type { EmailProvider, ProductProvider } from "../types";

export class EnquiryService {
  constructor(private readonly products: ProductProvider, private readonly email: EmailProvider) {}
  async submit(input: { name: string; email: string; message?: string; productId: number }) {
    const product = await this.products.getById(input.productId);
    if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
    await this.email.sendEnquiry({ name: input.name, email: input.email, message: input.message, product });
  }
}