import nodemailer from "nodemailer";
import type { EmailProvider, Enquiry } from "../types";

export class SmtpEmailProvider implements EmailProvider {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  async sendEnquiry(enquiry: Enquiry): Promise<void> {
    const inbox = process.env.SALES_INBOX;
    if (!inbox) throw new Error("SALES_INBOX is not configured");
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: inbox,
      replyTo: enquiry.email,
      subject: `Product enquiry: ${enquiry.product.title}`,
      text: [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Product: ${enquiry.product.title} (#${enquiry.product.id})`,
        `Message: ${enquiry.message || "(none)"}`
      ].join("\\n")
    });
  }
}

export class ConsoleEmailProvider implements EmailProvider {
  async sendEnquiry(enquiry: Enquiry): Promise<void> {
    console.info("[DEMO EMAIL — configure SMTP to deliver]", {
      name: enquiry.name, email: enquiry.email,
      productId: enquiry.product.id, productTitle: enquiry.product.title,
      message: enquiry.message || ""
    });
  }
}