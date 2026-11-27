# Product Catalogue — AI-Native Engineer Challenge

A small, extensible product catalogue built with React + TypeScript and Node.js + TypeScript.

## Stack and rationale
- **React + TypeScript + Vite:** quick local setup, component-based UI and typed API contracts.
- **Express + TypeScript:** a thin HTTP layer with explicit service boundaries.
- **Fake Store API:** replaceable product data source. The browser never calls it directly.
- **Email adapter:** SMTP can be configured for real delivery; without SMTP, enquiries are logged locally so the complete form flow can be exercised without paid services.

## Requirements
- Node.js 20+ and npm 10+.

## Run locally
```bash
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173. Backend health check: http://localhost:4000/api/health.

Build and test:
```bash
npm test
npm run build
```

## Email configuration
To deliver enquiries to a real inbox, fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SALES_INBOX` and `MAIL_FROM` in `.env`. The app uses SMTP only when host and credentials are configured. With no SMTP settings, it writes the enquiry to the backend console and returns a successful demo response. Do not commit `.env`.

## API
- `GET /api/products?search=&category=`
- `GET /api/products/featured`
- `GET /api/categories`
- `GET /api/products/:id`
- `POST /api/enquiries`

## Project structure
- `backend/src/providers`: replaceable product and email providers.
- `backend/src/services`: application use cases.
- `backend/src/routes`: HTTP endpoints and validation.
- `frontend/src/api`: typed backend client; no external product API calls.
- `frontend/src/components` and `pages`: UI.

## Notes
This is a PoC foundation, not a production deployment. Before production, add persistent enquiry storage, rate limiting, request logging, observability, image optimization, pagination, stronger abuse protection, and deployment configuration. The Fake Store API's data and availability are outside this project's control.
