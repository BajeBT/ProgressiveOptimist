# Progressive Optimist Club of Barbados — Club Website & Member Portal

A single-page React application that serves as the public website, member portal, and
administrative console for the Progressive Optimist Club of Barbados. It combines a public
marketing/outreach site with an authenticated members' area (dues, projects, gallery,
directory, documents) and a role-gated admin console for officers.

Live repository: `https://github.com/BajeBT/ProgressiveOptimist` · Hosted on Vercel.

---

## 1. What the Application Does

| Area | Audience | Summary |
| --- | --- | --- |
| **Public website** | Anyone | Club history, Optimist Creed, project/impact showcase, other Barbados clubs, Optimist International hierarchy, contact form. |
| **Donations** | Anyone | Stripe Checkout donation flow in BBD, charged in USD at the pegged rate. |
| **Membership application** | Prospective members | Public application form → email verification → officer approval. |
| **Member portal** | Signed-in members | Project posting, photo gallery, member directory, document library, dues status and online dues payment. |
| **Admin console** | Officers / elevated tiers | Site variables, member permissions, treasurer dues console, project moderation. |

### Core operations

1. **Membership lifecycle** — a public application creates a member record in
   `pending_verification`, emails a single-use link to set a password, moves the record to
   `pending`, and holds it until the President, Treasurer, or Secretary approves it. Approval
   promotes access to `member` and the role from `Pending` to `Active Member`.
2. **Dues management** — every member has one `dues_ledger` row per fiscal year
   (Oct 1 – Sep 30) plus itemised `dues_payments` rows. Payments arrive either through Stripe
   (recorded by webhook) or by hand from the Treasurer. Aggregates on the ledger are always
   recomputed from the itemised rows, never written directly.
3. **Projects/initiatives** — any signed-in member can post a project. Posts by moderators go
   live immediately; everyone else's wait in a moderation queue.
4. **Gallery** — photos upload to Google Photos via the Photos Library API, with metadata
   stored locally; separately, public Google Photos *shared albums* are scraped for display.
5. **Communications** — the contact form and all transactional email go out through AWS SES,
   with a non-production redirect safeguard.

---

## 2. Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18.3, React Router 7, Vite 6 |
| Styling | Tailwind CSS 3.4 (class-based dark mode), custom `optimist` colour palette, `clsx` + `tailwind-merge` |
| Icons | `lucide-react` |
| Backend | Vercel serverless functions (`/api/*.js`, Node ESM) |
| Database | Neon serverless Postgres (`@neondatabase/serverless`) |
| Payments | Stripe Checkout + webhooks |
| Email | AWS SES (`@aws-sdk/client-ses`) |
| Media | Google Photos Library API (OAuth refresh-token flow) |
| Auth | `bcryptjs` password hashing + custom HMAC-SHA256 signed session tokens |
| Hosting | Vercel (SPA rewrite: all paths → `/index.html`) |

---

## 3. Repository Structure

```
Optimist/
├── api/                        # Vercel serverless functions (one file = one function)
│   ├── auth.js                 # login, register, set/change/request password
│   ├── members.js              # roster list, add/bulk-add, approve, edit, permissions
│   ├── dues.js                 # dues status/payments/notes, statement tracking
│   ├── projects.js             # list, create, approve, delete
│   ├── gallery.js              # Google Photos upload/list/delete + shared albums
│   ├── site-settings.js        # club-wide configurable variables
│   ├── contact-subjects.js     # editable contact-form subject list
│   ├── send-contact-message.js # contact form → SES
│   ├── create-checkout-session.js       # Stripe donation checkout
│   ├── create-dues-checkout-session.js  # Stripe dues checkout (itemised, + card fee)
│   └── stripe-webhook.js       # payment confirmation → database
│
├── lib/                        # Shared server helpers (deliberately OUTSIDE /api, since
│   │                           # Vercel turns every file under /api into a function)
│   ├── db.js                   # Neon client, access tiers, dues rate, guards
│   ├── session.js              # signed session tokens, requireAccess guard
│   ├── email.js                # SES sender + non-production redirect
│   ├── password.js             # unambiguous random password generator
│   └── roles.js                # canonical roles + default avatars (browser-safe)
│
├── src/
│   ├── App.jsx                 # Router, error boundary, global post modal
│   ├── context/AuthContext.jsx # Central state store + all API calls (~1.4k lines)
│   ├── components/             # Navbar, Footer, project cards/modals, creed, hierarchy
│   ├── pages/                  # One component per route
│   └── data/                   # Static seed content (clubs, creed, hierarchy, projects, roster)
│
├── scripts/                    # One-off Node scripts: schema init, migrations, backfills
├── public/                     # Static assets (avatars, imagery)
├── vite.config.js              # Vite + custom dev middleware that executes /api routes locally
├── vercel.json                 # SPA rewrite
└── tailwind.config.js          # Theme tokens
```

### Notable structural decisions

- **`lib/` sits outside `api/`.** Vercel's Hobby plan caps serverless function count; anything
  placed under `api/` becomes its own function. Shared code lives in `lib/`, and related
  endpoints are consolidated (e.g. all gallery operations live in a single `api/gallery.js`).
- **Action-dispatch endpoints.** Most routes are `POST` with an `action` field in the body
  (`login`, `add`, `approve`, `update-payments`, …) rather than many REST paths — again to keep
  the function count low.
- **`AuthContext` is the single client-side data layer.** Pages read state and call mutators
  from `useAuth()`; no page talks to `fetch` directly for domain data.
- **Local dev shims the serverless runtime.** `vite.config.js` registers a middleware plugin
  that intercepts `/api/*`, `ssrLoadModule`s the matching handler, and supplies a
  `req`/`res` shim close enough to Vercel's. Without it the dev server would return handler
  source code instead of running it.

---

## 4. Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | HomePage — hero, theme, announcement banner, featured projects | Public |
| `/about` | AboutPage — club history, creed, officers | Public |
| `/projects` | ProjectsPage — project feed and detail modals | Public |
| `/barbados-clubs` | BarbadosClubsPage — sister clubs | Public |
| `/hierarchy` | HierarchyPage — Optimist International structure diagram | Public |
| `/directory` | MembershipDirectoryPage — roster (detail level depends on session) | Public / enriched |
| `/donate` | DonatePage — Stripe donation + bank transfer details | Public |
| `/contact` | ContactPage — SES-backed contact form | Public |
| `/membership` | MembershipPage — login/apply, then the member dashboard | Public → member |
| `/admin` | AdminSettingsPage — admin console | Elevated tiers |

`/membership` also handles deep links: `?action=set-password&email=…&token=…` (email
verification / password setup), `?duesPaid=true`, `?duesCanceled=true`.

### Member dashboard tabs (`/membership`)
`projects` · `gallery` · `directory` · `resources` (documents) · `dues`

### Admin console tabs (`/admin`)
`variables` · `permissions` · `treasurer` · `moderation`

---

## 5. Authentication & Authorisation

### Session tokens
Sessions are compact signed tokens minted in `lib/session.js`:
`base64url(JSON payload).base64url(HMAC-SHA256(payload, SESSION_SECRET))`, carrying
`memberId`, `email`, `access`, and a 12-hour expiry. They are sent as
`Authorization: Bearer <token>` and verified server-side with a constant-time comparison, so a
forged signature cannot be refined byte-by-byte. This replaced an earlier design that kept the
logged-in user in `localStorage` alone — which the browser owner can edit freely, making any
check on it advisory only.

### Access tiers
`super admin` · `finance` · `admin` · `moderator` (collectively **elevated**) · `member`, plus
the transient states `pending_verification` and `pending`.

### Governance flags (independent of tier)
`is_president`, `is_treasurer`, `is_secretary` — any of these (or the super-admin account) may
approve member records. The Treasurer's own member additions are trusted immediately; anyone
else's are queued for approval.

### The October 1st admin-grant expiry
Elevated access granted to an address **outside** `@progressiveoptimist.org` is time-limited. The
grant timestamp (`admin_granted_at`) is stamped when access is raised, and the grant expires at
the first **October 1st, 12:01 am Barbados time** (04:01 UTC — Barbados observes no daylight
saving) after that stamp, aligning with the club's fiscal year. Expiry is evaluated on each
login rather than by a scheduled job, so no cron infrastructure is required; once detected, the
downgrade is written back to the database so it is permanent. Addresses on the official club
domain keep their tier indefinitely.

### Permission matrix (server-enforced)

| Operation | Required |
| --- | --- |
| List roster (full detail, incl. email/phone/address/dues) | Any valid session |
| List roster (name/role/avatar only) | Public |
| Add / bulk-add / edit member, approve | `super admin`, `finance`, `admin` |
| Approve a pending member record | President, Treasurer, Secretary, or super admin |
| Reset another member's password | `super admin` |
| Change member permissions | `super admin`, `finance` |
| Dues status/payments/notes/statements | `super admin`, `finance`, `admin` |
| View own dues payment history | Owner, or dues managers for anyone |
| Site settings, contact subjects | `super admin`, `finance`, `admin` |
| Approve/delete projects | `super admin`, `finance`, `admin`, `moderator` |
| Create a project | Any valid session (auto-approved only for moderators) |
| Delete a gallery photo | Admin/finance tiers, or the original uploader |

### Password flows
- **Set / verify** — a 32-byte random token is generated, **bcrypt-hashed into the database**
  (the raw token only ever exists in the emailed link), expires in 60 minutes, and is single-use.
- **Legacy accounts** — members carried over from before passwords were enforced have no hash;
  a login attempt sends them the set-password email instead of admitting them.
- **Enumeration resistance** — `request-password-setup` returns the identical message whether or
  not the address exists.
- **Self-service change** requires the current password; **admin reset** does not, but is
  restricted to `super admin` and returns the new plaintext exactly once, to the requester only.

---

## 6. Data Model (Neon Postgres)

### `members`
`id` (`78008-NNNN`) · `name` · `gender` · `email` (unique) · `phone` · `address` · `join_date` ·
`sponsor` · `role` · `is_treasurer` · `is_president` · `is_secretary` · `avatar` · `access` ·
`approval_status` · `added_by` · `admin_granted_at` · `password` (bcrypt) · `reset_token`
(bcrypt) · `reset_token_expires` · `created_at`

### `dues_ledger` — one aggregate row per member
`member_id` (FK, cascade) · `fiscal_year` · `dues_rate` · `amount_paid` · `balance_due` ·
`payment_method` · `dues_status` · `last_payment_date` · `notes` · `email_last_sent` ·
`updated_at`

### `dues_payments` — itemised transactions
`member_id` · `fiscal_year` · `amount_bbd` · `payment_method` · `stripe_session_id` (unique;
`NULL` for manual entries) · `paid_at`

### `projects`
`id` · `title` · `category` · `date_str` · `image` · `flyer_url` · `excerpt` · `content` ·
`impact` · `is_featured` · `author` · `author_id` · `posted_at` · `children_served` ·
`approved` · `created_at`

### `gallery`
`id` · `title` · `caption` · `uploader` · `uploader_id` · `google_media_item_id` · `posted_at` ·
`created_at`

### `donations`
`stripe_session_id` (unique) · `donor_name` · `donor_email` · `bbd_amount` · `usd_amount` ·
`status` · `paid_at`

### `site_settings` — a single row, `id = 1`
`meeting_schedule` · `meeting_venue` · `contact_email` · `annual_dues_rate` · `theme_title` ·
`homepage_announcement` · `bank_name` · `bank_account_name` · `bank_account_number` ·
`bank_branch` · `bank_routing_number` · `updated_at`

### `contact_subjects`
`id` · `label` · `sort_order`

### Canonical roles (`lib/roles.js`)
Pending · Active Member · Director · Committee Chair · OI Representative · Past President ·
Vice President · President · Treasurer · Secretary · Public Relations Officer (PRO).
Each maps to a default avatar image, applied automatically whenever a role is set or changed.

---

## 7. API Reference

All endpoints return `{ success: boolean, message?: string, … }`. Mutating endpoints require a
`Bearer` session token.

### `POST /api/auth`
| `action` | Purpose |
| --- | --- |
| `login` | Verify credentials, resolve effective access, return `{ user, token }` |
| `register` | Public membership application; creates member + dues ledger, emails verification link |
| `request-password-setup` | Email a set-password link (enumeration-safe) |
| `set-password` | Consume the token and set the hash; promotes `pending_verification` → `pending` |
| `change-password` | Signed-in self-service change |

### `GET /api/members` · `POST /api/members`
`GET` returns the roster — reduced (id/name/role/avatar, excluding pending records) for
anonymous callers, full (contact details + joined dues ledger) for any valid session.
`POST` actions: `add`, `bulk-add`, `approve`, `update-record`, `reset-password`,
`update-permission`.

### `GET /api/dues` · `POST /api/dues`
`GET` returns a member's payment history. `POST` actions: `update-status`, `update-payments`
(replaces up to four manual rows for a fiscal year and recomputes the ledger), `update-notes`,
`statement-sent` (stamps `email_last_sent` for a batch).

### `GET /api/projects` · `POST /api/projects`
`GET` lists all projects. `POST` actions: `create`, `approve`, `delete`.

### `GET|POST|DELETE /api/gallery`
`GET` merges the Google Photos library (matched to local metadata) with photos from a
configured shared album, returning `photos`, `websitePhotos`, and `albumPhotos`.
`POST` uploads a base64 image to Google Photos and records metadata. `DELETE` removes the local
record subject to the uploader/admin check.

### `GET|POST /api/site-settings`
`GET` is public — the Donate and Membership pages and the dues checkout route all need the
current dues rate without a session. `POST` upserts row 1.

### `GET|POST /api/contact-subjects`
`GET` is public (the contact form needs the list before sign-in). `POST` actions: `add`,
`remove`, `reorder`.

### `POST /api/send-contact-message`
Sends via SES to whatever address is currently configured in `site_settings.contact_email`, with
the sender's address as `Reply-To`.

### `POST /api/create-checkout-session` / `POST /api/create-dues-checkout-session`
Create Stripe Checkout sessions for donations and dues respectively.

### `POST /api/stripe-webhook`
Signature-verified payment confirmation. **Body parsing is disabled for this route only**
(`export const config = { api: { bodyParser: false } }`), because Stripe's signature check needs
the exact raw request bytes — Vercel's default JSON parsing would re-serialise the payload and
break verification.

---

## 8. Payment Flows

### Currency
The Barbados dollar has been pegged at **BBD 2 = USD 1** since 1975, so all amounts are entered
and displayed in BBD and charged in USD at a fixed `0.5` conversion.

### Donations
Minimum BBD 5, requires a valid email. A single Checkout line item carries both the BBD and USD
figures in its description; donor name and both amounts ride along in session metadata.
Redirects to `/donate?success=true&amount=…` or `?canceled=true`.

### Dues
Checkout is built as **two itemised line items** so members see exactly what they are paying:

1. **Base dues** — credited to the member's ledger.
2. **Credit card processing fee — 3.75%** — the Stripe merchant fee, shown separately and *not*
   credited to the ledger.

The dues rate in force at the moment of checkout is captured into metadata (`officialRate`), so
the webhook computes the balance against the rate the member actually saw, unaffected by any
rate change between checkout and settlement.

### Webhook settlement
Only `checkout.session.completed` is treated as proof of payment — never the client-side
redirect back to `/donate` or `/membership`, which anyone could fake by visiting the URL with
the right query string. On a dues payment the webhook:

1. Inserts one `dues_payments` row (`ON CONFLICT (stripe_session_id) DO NOTHING`), so multiple
   partial payments accumulate correctly instead of overwriting one another, and retried
   webhooks are idempotent.
2. Re-sums the fiscal year and updates `dues_ledger` with the new total, balance, status
   (`Active Member (Dues Paid)` vs `Partially Paid (Balance Due)`), and payment method.

A negative balance is **not** floored at zero — an overpayment is a real credit and stays
visible as one (`-$25.00`) rather than being hidden.

### Manual payments
The Treasurer may enter up to four date/amount/method rows per fiscal year. Saving them deletes
and reinserts **only rows with a `NULL` `stripe_session_id`**, so editing the manual list can
never overwrite a genuine processor transaction. The ledger aggregate is then recomputed from
the complete payment history. Correspondingly, `update-record` deliberately does not write
`amount_paid`, `balance_due`, `payment_method`, or `last_payment_date` — those fields are owned
exclusively by the payments path and cannot be clobbered with stale form values.

---

## 9. Third-Party Integrations

### AWS SES
All outbound mail (`lib/email.js`) is sent from
`noreply@progressiveoptimist.org`. **Non-production safeguard:** when
`NODE_ENV !== 'production'`, every message is redirected to the admin test address
`dev@bajanthings.biz` and prefixed with a banner naming the original recipient, so test cycles
never reach club members.

### Google Photos
`api/gallery.js` exchanges a stored refresh token for an access token on each request. Two
sources are merged:
- **Website photos** — uploaded through the portal via the Photos Library API (raw upload →
  `mediaItems:batchCreate`), with title/caption/uploader kept locally and joined on
  `google_media_item_id`. Items missing from the library listing are recovered in batches of 50
  via `mediaItems:batchGet`.
- **Shared album photos** — a public shared-album URL is fetched and parsed for
  `lh3.googleusercontent.com` image URLs. This is a scrape of a public page, not an API call,
  and is inherently sensitive to Google markup changes; it fails soft (returns an empty list).

### WordPress
The members' document library and much of the historical project imagery are pulled from the
club's existing WordPress site at `progressiveoptimist.org/wp/`.

---

## 10. Configuration

Environment variables (`.env`, `.env.local` — both git-ignored; **never commit them**):

| Variable | Purpose |
| --- | --- |
| `NEON_DATABASE_URL` | Postgres connection string. Every route fails fast with a clear message if unset. |
| `SESSION_SECRET` | HMAC key for session tokens. Without it, session verification always fails. |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe key (bundled into the frontend by design) |
| `SES_REGION`, `SES_ACCESS_KEY_ID`, `SES_SECRET_ACCESS_KEY` | AWS SES credentials |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | Google Photos OAuth |
| `GOOGLE_PHOTOS_ALBUM_URL` | Optional default shared-album URL |
| `NODE_ENV` | `production` disables the email redirect safeguard |

Placeholder values beginning with `REPLACE_ME` are recognised as "not configured" and cause the
relevant feature to return a friendly message rather than crash.

**Runtime-configurable settings** (no deploy needed) live in `site_settings` and are edited from
the admin console's *Variables* tab: meeting schedule and venue, contact email, annual dues rate,
club theme title, homepage announcement banner, and the bank transfer details shown on the Donate
page. Changing the dues rate propagates to new member records, the Membership page, and Stripe
dues checkout from one place.

---

## 11. Running Locally

```bash
npm install
```

Create `.env` with at least `NEON_DATABASE_URL` and `SESSION_SECRET`, then:

```bash
npm run dev
```

The dev server runs on `http://localhost:3000` with host binding enabled, and serves `/api/*`
in-process through the Vite middleware plugin.

Other scripts:

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run lint
```

### Database scripts

Run once against a fresh database:

```bash
node scripts/init_db.js
```

Migrations and maintenance scripts in `scripts/` are idempotent (`CREATE TABLE IF NOT EXISTS`,
`ADD COLUMN IF NOT EXISTS`) and are run individually as needed — for example
`migrate_add_dues_payments_table.js`, `migrate_add_member_governance.js`,
`migrate_add_site_settings_table.js`, `migrate_add_gallery_table.js`,
`migrate_add_donations_table.js`, `migrate_add_bank_details.js`, plus data fixers such as
`backfill_dues_payments.js`, `fix_dues_rate_to_200.js`, and `seed_officer_accounts.js`.

### Stripe webhooks locally
Point the Stripe CLI at `/api/stripe-webhook` and set `STRIPE_WEBHOOK_SECRET` to the secret the
CLI prints; the route rejects any request whose signature does not verify.

---

## 12. Deployment

Deployed on **Vercel** from the `main` branch. `vercel.json` rewrites every path to
`/index.html` so client-side routing works on direct navigation and refresh. Each file in `api/`
becomes one serverless function — the Hobby plan's 12-function limit is a real constraint, and
is the reason gallery operations were consolidated into a single handler. Configure all
environment variables in the Vercel project settings.

Per the repository's working rules: **never push or trigger a deployment without explicit
approval.**

---

## 13. Design & Theming

- **Palette:** `optimist.blue #003399`, `royal #002266`, `sky #0284C7`, `gold #F59E0B`,
  `amber #FFBF00`, plus pearl/light/dark neutrals.
- **Typography:** Segoe UI Variable with a system fallback stack; the default Tailwind type
  scale is deliberately reduced (`xl` = 1.06rem, `5xl` = 2.55rem) for a denser, more document-like
  feel.
- **Dark mode:** class-based, toggled from the navbar and persisted through `AuthContext`.
- **Motion:** `float` and `pulse-slow` utilities for hero and accent elements.
- **Resilience:** a top-level `ErrorBoundary` in `App.jsx` catches render failures and offers a
  "Reset Session & Reload" button that clears `localStorage` — the practical recovery path when
  a stale cached session shape breaks a page.

---

## 14. Security Notes & Known Considerations

**Deliberate protections already in place**
- The database connection string is server-side only; it was previously hardcoded in
  `src/db/neon.js`, which shipped it to every visitor's browser.
- Session tokens are signed and compared in constant time.
- Password reset/setup tokens are stored hashed, expire in 60 minutes, and are single-use.
- Payment state changes only on a signature-verified webhook, never on a client redirect.
- Password-setup requests are enumeration-safe.
- Anonymous roster reads exclude contact details, dues figures, and pending applicants.
- Non-production email is redirected away from real members.

**Worth reviewing**
- `api/site-settings.js` carries real-looking bank account and routing numbers as hardcoded
  fallback defaults in a public repository. They should be moved to environment variables or
  seeded data only.
- `api/gallery.js` performs its own permission check from **client-supplied** `userRole` /
  `userAccess` / `userMemberId` fields rather than from the verified session, unlike every other
  route. It should use `getSession`/`requireAccess` like the rest.
- Shared-album ingestion depends on scraping Google's HTML and will break silently if that
  markup changes.
- Member IDs (`78008-` plus a random four-digit number) are generated without a uniqueness
  check; collisions are unlikely but not impossible.

---

## 15. Glossary

| Term | Meaning |
| --- | --- |
| **Fiscal year** | October 1 – September 30, matching Optimist International's year. |
| **Elevated access** | Any of `super admin`, `finance`, `admin`, `moderator`. |
| **Official email** | An address on `@progressiveoptimist.org`; exempt from admin-grant expiry. |
| **Dues ledger** | The single aggregate row per member; derived, never authored directly. |
| **Dues payments** | The itemised transaction rows; the source of truth for money received. |
| **Children served** | Mandatory impact metric on every project post, aggregated for reporting. |
