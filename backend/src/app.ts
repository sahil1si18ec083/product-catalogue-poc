import express from "express";
import cors from "cors";
import { z } from "zod";
import { FakeStoreProductProvider } from "./providers/fakeStoreProductProvider";
import { ConsoleEmailProvider, SmtpEmailProvider } from "./providers/smtpEmailProvider";
import { CatalogueService } from "./services/catalogueService";
import { EnquiryService } from "./services/enquiryService";

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
  app.use(express.json({ limit: "20kb" }));

  const productProvider = new FakeStoreProductProvider(process.env.PRODUCT_API_BASE_URL);
  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const emailProvider = smtpConfigured ? new SmtpEmailProvider() : new ConsoleEmailProvider();
  const featuredIds = (process.env.FEATURED_PRODUCT_IDS || "1,2,3,4,5")
    .split(",").map(Number).filter(Number.isInteger);
  const catalogue = new CatalogueService(productProvider, featuredIds);
  const enquiries = new EnquiryService(productProvider, emailProvider);

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.get("/api/products/featured", async (_req, res, next) => {
    try { res.json(await catalogue.featured()); } catch (error) { next(error); }
  });
  app.get("/api/categories", async (_req, res, next) => {
    try { res.json(await catalogue.categories()); } catch (error) { next(error); }
  });
  app.get("/api/products", async (req, res, next) => {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      res.json(await catalogue.all(search, category));
    } catch (error) { next(error); }
  });
  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Invalid product id" });
      const product = await catalogue.get(id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) { next(error); }
  });

  const enquirySchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    message: z.string().trim().max(2000).optional(),
    productId: z.number().int().positive()
  });
  app.post("/api/enquiries", async (req, res, next) => {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Please provide a valid name, email and product." });
    try {
      await enquiries.submit(parsed.data);
      res.status(201).json({ message: "Thank you. Your enquiry has been submitted." });
    } catch (error) { next(error); }
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    const status = typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status: unknown }).status) : 502;
    res.status(status >= 400 && status < 600 ? status : 500)
      .json({ error: status === 404 ? "Product not found" : "Something went wrong. Please try again." });
  });
  return app;
}