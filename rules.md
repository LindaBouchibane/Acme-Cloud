# Architecture Rules — Acme Portal

## 1. Project structure

Two separate HubSpot Developer Projects in the same repo:

```
acme-portal/
├── theme/          # HubSpot Theme project — templates, modules, islands, UI
└── serverless/     # HubSpot App project  — serverless functions only
```

## 2. Data access — read vs. write

| Operation         | Where it runs                            | How                                              |
|-------------------|------------------------------------------|--------------------------------------------------|
| Read CRM data     | Module (server-side, SSR)                | GraphQL CRM query **or** HubL `hublDataTemplate` |
| Read contact info | Module / template                        | `request.contact` object (membership pages)      |
| **Write CRM**     | **Serverless function only**             | `@hubspot/api-client` — never from the browser   |

**No CRM mutations from the browser. Ever.**

## 3. Rendering architecture

Every page follows this exact chain:

```
HubL Template
  └── CMS React Module   ← SSR, data fetching, field values from CMS editor
        └── React Island ← client-only, interactivity, fetch to serverless
```

- **Modules** are server-rendered; they hold GraphQL queries and CMS field definitions.
- **Islands** are hydrated on the client; they handle state, loading/empty/error UI, and `fetch` calls.

## 4. Serverless function rules

- Each function lives in its **own single entrypoint file** — HubSpot does not bundle local `require`.
- All functions are exposed at `/hs/serverless/<functionName>`.
- Functions use `@hubspot/api-client` initialised with `PRIVATE_APP_ACCESS_TOKEN` from secrets (never hardcoded, never committed).
- `updateProfile` is the only write endpoint. It enforces a **strict whitelist**: `firstname`, `lastname`, `jobtitle`, `phone`. Any other property in the payload is ignored.
- Every function returns a typed JSON response: `{ success: true, contact: {...} }` or `{ success: false, error: "..." }`.
- HTTP error codes must match: 400 (invalid payload), 404 (contact not found), 500 (unexpected).

## 5. Profile edit form — "Mon compte" island

The profile form is a React island on `/mon-compte`. Rules:

**Pre-fill:** fields (`firstname`, `lastname`, `jobtitle`, `phone`) are initialised from the contact data passed by the SSR module — never empty on load.

**Front-end validation (before any fetch):**
- `firstname` and `lastname` are required (non-empty).
- `phone` must match a basic phone pattern if provided.
- Show inline field-level error messages; do not submit if invalid.

**State machine — the island manages exactly four states:**

| State | UI |
|---|---|
| `idle` | Form enabled, submit button active |
| `loading` | Form disabled, button shows spinner |
| `success` | Success banner, form re-enabled with updated values |
| `error` | Error banner with the message from the serverless response, form re-enabled |

**Submission:** `POST /hs/serverless/updateProfile` with body `{ contactId, firstname, lastname, jobtitle, phone }`.

**Post-success sync:** on a `success` response the island updates its local state with the values returned by the function — no page reload, no second fetch.

**Serverless function `updateProfile` — exact contract:**
- Reads `contactId` and the four allowed properties from the request body.
- Enforces whitelist: only `firstname`, `lastname`, `jobtitle`, `phone` are forwarded to HubSpot. Any other key in the payload is silently dropped.
- Calls `crm.contacts.basicApi.update(contactId, { properties })` via `@hubspot/api-client`.
- Returns `{ success: true, contact: { firstname, lastname, jobtitle, phone } }` on 200.
- Returns `{ success: false, error: "<human-readable message>" }` on 400 (missing/invalid payload), 404 (contact not found), or 500 (unexpected error).
- HTTP status code in the response must match the error type (not always 200).

## 6. Security

- `PRIVATE_APP_ACCESS_TOKEN` → stored in HubSpot project secrets only.
- `contactId` comes from the authenticated session (`request.contact.vid`) or the POST body — never trusted from an unauthenticated source.
- The `/mon-compte` page is protected by HubSpot membership. Non-authenticated visitors are redirected to the HubSpot login page (or see a clear message).

## 7. CMS editability

- The **Homepage module** must expose at minimum: `title`, `subtitle`, `body_text` (rich text or text), `cta_label`, `cta_url`, and `arguments` (repeater with label + description).
- A non-technical marketer must be able to change all homepage copy without touching code.

## 8. Catalogue page — full rules

**URL:** `/offres` (or a slug that matches the object name chosen).

**Data source:**
- Use a **custom CRM object** (recommended) or any existing HubSpot object (contacts, companies, deals, products, tickets) or a **HubDB table**. No hardcoded JSON, ever.
- Create 3–6 records manually in the portal before deploying.
- Document in the README: object type, how it was created, and which properties are displayed.

**Reading data — server side (module):**
- Fetch records via **GraphQL CRM** query inside the module, or via **HubL** (`hublDataTemplate` / HubDB API) — whichever fits the chosen object type.
- Pass the fetched list to the island as a prop; the island never fetches the catalogue list directly.

**Catalogue island — client behaviour:**
- Implements at least one of: **search** (text filter) or **filter** (by a property value).
- Manages three UI states:

| State | UI |
|---|---|
| `loading` | Skeleton or spinner while initial data is processed |
| `empty` | Clear message when no records match the current filter |
| `error` | Error message if the data prop is missing or malformed |

**Detail view:**
- Each record has a simple detail view — either an expanded inline card on the same page, or a dedicated detail page.
- No hardcoded mock data in the detail view either.

## 9. TypeScript

- All islands and shared UI components are written in TypeScript (`.tsx`).
- Module entrypoints may be `.jsx` if HubSpot tooling requires it, but typed where possible.

## 10. Shared UI components

Reusable components live in `theme/src/components/`:
- `Button` — primary / secondary variants
- `Input` — with label, error state
- `StatusBanner` — loading / success / error display

These are imported by islands, never by serverless functions.

## 11. What is explicitly out of scope

- Pixel-perfect design — layout and structure matter, not visual polish.
- Complex state management libraries — React built-ins (`useState`, `useReducer`) are sufficient.
- Backend logic beyond `updateProfile` — no extra serverless endpoints unless needed.
