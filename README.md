# CVFix — a clearer CV, grounded in real experience

A Nigeria-first CV reviewer and optional editable document package. React, TypeScript and Vite on the frontend; Cloudflare Pages Functions for encrypted checkout sessions and server-side Paystack verification.

## What changed in this version

- A new responsive, accessible homepage with clear positioning, short upload/paste tabs, before-and-after proof, mobile navigation, pricing and FAQs.
- Proper local DOCX extraction with Mammoth and selectable-text PDF extraction with a self-hosted PDF.js worker. TXT works too. Legacy DOC, scans, encrypted files, excessive pages and oversized files get actionable errors.
- Empty submissions are rejected; a fictional sample is only used after an explicit sample action.
- A documented, deterministic CVFix text assessment. Role ideas and actual job-description skill gaps are kept separate. No official ATS, salary, certification or hiring-probability claims.
- Conservative grammatical edits to supplied experience bullets. No invented numbers, tools, qualifications, employers, seniority or outcomes. Complete work history, dates, contact details, NYSC and education are preserved.
- An editable CV and cover-letter draft, change review/restoration, an accuracy-confirmation gate and complete multi-page PDF/DOCX exports. The fictional sample editor can be tried free.
- No browser-only payment unlock. The server checks Paystack status, reference, amount, currency, mode and review binding before returning a paid document.
- Explicit privacy/terms/payment-help/methodology pages, temporary encrypted checkout storage, and a “Clear this tab’s CV” action.
- Source-linked job listings without guessed salaries, broken currency conversions, fabricated match percentages or “Verified Today” badges.
- A real PNG share card, consistent ₦1,000 offer metadata, route-specific entry-page metadata, direct page loading, a real 404, self-hosted fonts and a production content-security policy.

**Important scope:** The previous unvalidated AI generation path is deliberately disabled. This release uses `rules-v2` and conservative editing, not a human-written or AI-generated full narrative. No CV is sent to Gemini or another AI provider. Do not market it as an official ATS simulation or a comprehensive AI rewrite. Any future AI layer needs its own disclosure, consent, factual-grounding checks and acceptance tests.

## Run locally

Use Node **20.19+** (Node 22 recommended for deployment).

```bash
npm ci
npm run dev
```

Open the address printed by Vite. The server binds to `0.0.0.0`; API requests use relative URLs, so workspace/live-preview hosts work without browser-facing localhost calls. The dev server invokes the same handlers used by Cloudflare Pages. Free reviews, uploads, sample editing and sample exports work with no credentials.

### Checks

```bash
npm run format:check
npm test
npm run typecheck
npm run build
npm audit --omit=dev
```

The unit/API tests use fictional data and mocked Paystack responses. **They do not make payments or contact Paystack.**

`npm run preview` previews built static assets only; it is not a server for Pages Functions. For local payment integration, use `npm run dev` with test settings, or Cloudflare Pages.

### Optional end-to-end browser checks

In a separate terminal, keep `npm run dev` running **without payment credentials**.

```bash
python -m pip install -r tests/browser-requirements.txt
python -m playwright install --with-deps chromium
python tests/browser_smoke.py --base-url http://127.0.0.1:3000
```

This checks real DOCX/TXT/PDF extraction, validation, responsive layouts, mobile menu/back navigation, local-only free review, disabled checkout, Word/PDF exports, multi-page retention, Yoruba characters/naira, job-role prefill, original job-specific payment recovery (mocked), late-response/session clearing, and axe WCAG 2/2.1 AA rules on 13 views. Reports and fictional downloads go to `test-results/`, which is ignored. Automated accessibility checks do **not** certify complete accessibility or replace manual keyboard/screen-reader testing.

To check built client assets with the production CSP replayed in Chromium, run the static preview on a separate port and use:

```bash
npm run build
npm run preview -- --port 3001
# In a second terminal:
python tests/browser_smoke.py --base-url http://127.0.0.1:3001 --production-headers
```

This verifies browser behavior under the configured policy, not delivery of Cloudflare headers/404 routing. Confirm those on the actual preview deployment.

## Cloudflare Pages setup

1. Deploy this branch to a **preview deployment first**, not directly to production.
2. Set build command to `npm run build`, output directory to `dist`, and build `NODE_VERSION` to `22`.
3. The `functions/` directory is bundled by Pages. No separate backend host is required.
4. Add the following **runtime** settings for the appropriate preview/production environment:

| Setting               | Purpose                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SESSION_SECRET`      | At least 32 high-entropy characters for AES-GCM checkout sessions. Use a securely generated random value.                                                              |
| `PAYSTACK_SECRET_KEY` | Server-only `sk_test_...` initially. Never put this in a `VITE_` variable or frontend source.                                                                          |
| `APP_URL`             | The exact HTTPS origin to which Paystack should return the browser, e.g. `https://cvfix.com.ng`. No subpath. Use the preview origin when testing a preview deployment. |
| `SUPPORT_EMAIL`       | A real, monitored support address you control. Published in help/footer and required before checkout is enabled.                                                       |

Generate a session secret locally and store it securely:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

For Vite development only, copy `.env.example` to `.env` and fill it locally. `.env`, `.dev.vars` and other secrets are ignored. **Do not commit them or send them in chat.** Cloudflare secrets must be available at runtime, not merely during the frontend build. Keep the session secret stable through a checkout’s 24-hour lifetime; rotating it invalidates existing checkout tokens.

The app returns `paymentsEnabled: false` and refuses initialization when required settings are missing or invalid. There is no test-key placeholder or simulated-success fallback. A configured `sk_test_...` explicitly displays **test mode** in checkout.

### Payment sequence

1. The browser runs a free review locally. No CV POST occurs.
2. The user chooses a paid package, enters a receipt email and explicitly consents.
3. `POST /api/analyze-cv` validates and encrypts the CV, target role and job description into a 24-hour token; it does **not** return the paid package.
4. `POST /api/payments/initialize` uses the secret Paystack key. The amount is fixed on the server to **100,000 kobo / NGN**. Paystack receives only the email, reference and opaque review identifier, not the CV.
5. The encrypted token/reference/expiry are saved to the current tab’s `sessionStorage`; the browser goes to Paystack’s official hosted checkout.
6. On return, `POST /api/payments/verify` calls Paystack directly. Only a matching successful transaction unlocks the package. The response also restores the original source, job description and review, rather than rescoring the cleaned draft with no job description. Client-supplied `verified`, amount or currency fields cannot grant access.
7. The user edits and confirms the document, then exports it locally. Edits are not autosaved to a server. The generated draft can be recovered in the same tab for 24 hours; downloaded files are the durable copies.

There is no CV database, account system or transactional email delivery in this implementation. Paystack keeps its own transaction records. Refunds are an **operator/support process through Paystack**, not an automated refund API. Keep receipts/references, and never tell someone to pay again before checking a disputed transaction.

## Before accepting live payments

- [ ] Review the new product scope and public wording. The package is conservative cleanup/editing/formatting, not a certified or expert-written rewrite.
- [ ] Publish and test the real support email. Review privacy, terms and refund wording against your actual operational process and applicable law.
- [ ] Set the four runtime settings in a preview environment with a **real Paystack test key**.
- [ ] Complete a genuine test-mode payment and verify the hosted return, exact amount/currency, package unlock, exports, retry/reload recovery and cancellation.
- [ ] Check the generated documents with multiple actual CV layouts, including long histories, unusual headings and special characters. Do not use real CVs in automated test fixtures.
- [ ] Verify production CSP, asset MIME types, API routing, custom domain and callback origin.
- [ ] Enable Cloudflare rate-limit/WAF rules for the payment/session endpoints and monitor failures **without logging CVs, checkout tokens, receipt emails or authorization headers**.
- [ ] Confirm cost/pricing and support/refund handling. Then use the live Paystack secret in production.
- [ ] Preserve or recover any old pending transactions separately. Old client-only unlock states and previous tokens are not migrated into this new payment model.

**No live payment has been tested as part of this code change. No production deployment is implied.** A passing mocked test suite is not a substitute for real Paystack test-mode acceptance testing.

## Reviewer and document limitations

- The score assesses extracted text, not visual columns, graphics, font sizes or every employer’s ATS configuration.
- The recognised keyword dictionary is deliberately limited. Unknown job descriptions fall back to the core-details category and explicitly explain why.
- Conservative edits may leave many bullets unchanged; no “20+ upgraded bullets” promise is made.
- Scanned/image-only PDFs need OCR elsewhere. Upload limits: 5 MB, 20 PDF pages, 30,000 CV characters, 12,000 job-description characters.
- PDF exports use bundled Noto Sans. Unsupported characters produce an actionable error instead of silently disappearing; Word is the alternative. Advanced scripts may need specialist formatting.
- The cover letter is a draft based only on supplied information. Names/placeholders and accuracy must be confirmed before export.
- Closing/reloading the page loses unsaved edits. Temporary checkout recovery does not preserve edits. Shared-device users should clear their session or site storage.
- There are no fake testimonials, fabricated recruiter endorsements, salary predictions or guarantees.

## Job source maintenance

```bash
npm run sync-jobs
```

The existing scheduled GitHub workflow refreshes Remotive snapshots every 12 hours. It records real source/fetch timestamps and preserves supplied salary strings/units. It does not infer pay, exchange rates, location eligibility or verification. Empty or restricted source locations are not treated as open to Nigeria. A source failure exits nonzero and keeps the previous snapshot.

The `mockJobs.ts` filename is retained for compatibility, but its entries are source snapshots, not invented candidate matches. Remotive attribution and original links remain visible. Check the provider’s terms/rate limits before expanding ingestion.

## Files worth knowing

- `src/lib/review.ts`: shared validation, versioned review rules and conservative wording suggestions.
- `src/lib/files.ts`: local extraction and input/ZIP-size guards.
- `src/lib/export.ts`: full PDF/DOCX exports and font-coverage validation.
- `server/`: bounded requests, same-origin checks, secure settings, encrypted sessions and server-only full document assembly.
- `functions/api/`: checkout preparation, public configuration and server-authoritative Paystack initialization/verification.
- `src/components/`: responsive home, report, editor, job board, pricing and public policy pages.
- `scripts/build-pages.js`: direct-entry HTML/SEO metadata for known routes. Add new routes here if you add pages.
- `public/_headers`: production static-asset security headers. API handlers set their own no-store/JSON headers.
- `tests/`: unit/API/source-ingestion checks and reproducible browser smoke tests.

Self-hosted font licenses are preserved in `src/assets/fonts/OFL.txt` and the installed Fontsource packages.
