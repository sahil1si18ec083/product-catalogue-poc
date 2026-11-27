# Decisions and assumptions

## Assumptions
- “Top rated” means the five products with the highest numeric rating, with product ID as a deterministic tie-breaker. `FEATURED_PRODUCT_IDS` can override this selection.
- Product metadata is illustrative; Fake Store API is acceptable per the brief.
- Search matches product title, description and category, case-insensitively.
- A category page displays the category's featured products first, then the remaining products.
- Enquiry fields are name, email and optional message. Product context is included in the email.
- The brief does not specify a visual design, so the UI uses a restrained responsive catalogue layout.

## Simplifications
- No authentication or admin interface; featured IDs are configuration.
- No database because product data is external and enquiry persistence was not requested.
- SMTP is configurable. In local mode without SMTP credentials, the email adapter logs the enquiry so reviewers can test without creating a paid account.
- Pagination, advanced filtering and cart/checkout are out of scope.

## How it can grow
- `ProductProvider` isolates the external catalogue source from the rest of the backend.
- `EmailProvider` isolates delivery from enquiry validation and routing.
- Frontend calls only our own API and uses a small typed API client.
- Featured product selection is configuration-driven rather than hard-coded in UI components.
- A database repository can be added behind the enquiry service without changing the form contract.

## Next day
- Persist enquiries and add an admin workflow.
- Add integration tests for provider failures and SMTP delivery.
- Add pagination, sorting and accessible component-level interaction tests.
- Add Docker Compose, CI checks and deployment infrastructure compatible with AWS.
