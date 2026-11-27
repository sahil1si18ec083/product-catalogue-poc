# AI Usage Notes

## Tools and models
- **AI coding assistant:** OpenAI Codex (used for planning, scaffolding, implementation and review)
- **Agent instruction file:** `AGENTS.md` (committed at repo root)
- **Plan/spec:** `docs/PLAN.md` (written before any code was generated)

## Key prompts / decisions

*Prompts are reconstructed from memory and paraphrased. They reflect the intent
and shape of my real sessions, not verbatim transcripts.*

### 1. Architecture
> "I'm building a product catalogue PoC: React + TypeScript client, Node/TypeScript
> backend, Fake Store API as the data source. Constraints: the client must never call
> Fake Store directly, and the data source, email provider and styling must be
> swappable later. Propose a folder structure and the key interfaces 
### 2. Backend
> "Implement the Express backend Endpoints: featured products, products by category (top rated plus the rest), search, product by id, and POST /enquiries. 
> Validate the enquiry body with zod, and map upstream errors to clean 502/404 responses. Email
> sending goes through the `EmailSender` interface with an SMTP implementation

### 3. Frontend
> "Build the React pages: Home (5 featured), Category (top rated, then additional
> products), Search results, Product detail with an Enquire form and a thank-you state.
> Use a single API client module pointing at the backend, with loading and error
> states. Keep styling isolated (CSS modules or one theme file) 
### 4. Tests
> "Write tests for the critical path only: unit tests for featured/category/search
> logic with a fake repository, validation tests for the enquiry endpoint, and a test
 
> Add one frontend test for the enquiry form submit and thank-you message. Don't test trivial getters."

### 5. Review and fixes
> "Review this diff as a skeptical senior engineer. Look for security basics (input
> validation, header injection in the email subject/body, CORS config), error handling
> gaps, secrets in the repo, and anything that breaks the 'run in under 10 minutes'
> requirement."

## Where the AI got something wrong (and how I caught it)


1. **Search only matched product titles.** The first implementation filtered on
   `title` only, but the acceptance criteria say "text matching that search term".
   Caught by manually searching for a word that appears only in a description.
   Fixed by matching title, description and category, and added a unit test.
2. **Fake Store URL leaked into the client.** The generated API module had the
   Fake Store base URL as a fallback. Caught while reviewing the frontend diff
   against constraint #2. Removed it; the client now only knows `VITE_API_BASE_URL`.
3. **Over-mocked tests.** Some generated tests mocked the repository and the
   service, so they only asserted that mocks were called. Rewrote them to use a
   fake repository with real data and assert on actual output.
4. **"Top rated" left undefined.** The AI silently sorted by `rating.count`.
   Caught while reading the code; changed to `rating.rate` with count as a
   tie-breaker, and recorded it in DECISIONS.md.

## Time spent

> Fill in your real numbers. Total should reflect actual time, even if over 3 hours.

| Phase | Time |
|---|---|
| Planning (reading brief, spec, architecture) | ~_45_ min |
| Building (backend + frontend) | ~_60_ min |
| Testing | ~_30_ min |
| Reviewing / fixing AI output | ~_30_ min |
| Docs (README, DECISIONS, AI_USAGE) | ~_15_ min |
| **Total** | **~_3_ h _0_ min** |