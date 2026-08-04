# RentNest 🏠

**Find & List Rental Properties with Ease**

RentNest is a full-stack rental property marketplace. Landlords list and manage properties, tenants browse listings and submit rental requests with secure payments, and admins moderate the platform. The project is split into two separate applications — a Next.js frontend and an Express/Prisma backend — deployed as two independent services.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Roles & Permissions](#roles--permissions)
- [Core Features](#core-features)
- [Project Structure](#project-structure)
- [Cross-Origin Setup (Important)](#cross-origin-setup-important)
- [Environment Variables](#environment-variables)
- [Getting Started Locally](#getting-started-locally)
- [Deployment (Render)](#deployment-render)
- [Database Schema Overview](#database-schema-overview)
- [API Route Map](#api-route-map)
- [Known Gotchas](#known-gotchas)

---

## Architecture

RentNest is **two separate deployments**, not a monorepo served from one origin:

| Service | Stack | Example URL |
|---|---|---|
| Frontend | Next.js 16 (App Router, Turbopack) | `https://rentnest-a5.onrender.com` |
| Backend | Express + Prisma + PostgreSQL | `https://rentnest-a4.onrender.com` |

Because the two run on different hostnames, authentication cookies set by the backend are **not** automatically visible to browser `fetch` calls made from the frontend's client components. This is solved with a Next.js rewrite proxy — see [Cross-Origin Setup](#cross-origin-setup-important) below. This detail matters a lot for anyone extending the auth flow.

```
Browser
  │
  ├─ Server Components / Server Actions ──────► Backend (direct, full URL, manual Cookie header)
  │
  └─ Client Components (fetch) ─► /api/* (same-origin) ─► Next.js rewrite ─► Backend
```

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router, Turbopack, Server Actions)
- React 19
- TypeScript
- Tailwind CSS v4 + shadcn/ui (`base-nova` style, `@base-ui/react` primitives)
- Zod (form validation)
- react-hook-form
- Sonner (toasts)
- Framer Motion
- Embla Carousel

**Backend**
- Express 5
- Prisma ORM 7 (`@prisma/adapter-pg`) + PostgreSQL
- JWT auth (access + refresh tokens, httpOnly cookies)
- bcrypt (password hashing)
- Stripe Checkout (payments)
- Cloudinary (image hosting)
- Multer (multipart upload handling)

**Infra**
- Deployed on Render (two separate web services)
- Postgres hosted via Prisma Postgres (`pooled.db.prisma.io`)

---

## Roles & Permissions

| Role | Description | Frontend Access |
|---|---|---|
| **Tenant** | Browses listings, submits rental requests, pays rent, leaves reviews | Public pages + `/dashboard/tenant/*` |
| **Landlord** | Lists properties, manages availability, approves/rejects requests | Public pages + `/dashboard/landlord/*` |
| **Admin** | Moderates users, properties, and rental requests platform-wide | `/dashboard/admin/*` |

Role is chosen at registration (`TENANT` or `LANDLORD`; `ADMIN` is not self-assignable). Routes are protected both by:
- **`proxy.ts`** (Next.js middleware) — redirects unauthenticated users, blocks role-mismatched dashboard routes, and transparently refreshes an expired access token using the refresh token cookie.
- **Backend `auth` middleware** (`src/middlewares/auth.ts`) — verifies the JWT and checks role on every protected API route.

---

## Core Features

### Public
- Property grid with `next/image` optimization, price, location, amenities
- Search & filter by city, category, price range
- Sortable listing (price, newest, recommended)
- Property detail page: gallery, description, amenities, highlights, embedded map, landlord card, reviews, similar properties
- Skeleton loaders on every data-fetching page; `error.tsx` boundaries per route group

### Tenant
- Registration/login with Zod-validated forms
- Rental request flow (sheet/modal with move-in/move-out dates + message)
- Save/favorite properties (heart toggle, persisted via `SavedProperty` table)
- Stripe Checkout redirect on approval, with `/payment/success` and `/payment/cancel` outcome pages
- Dashboard: request history with status badges (`PENDING`/`APPROVED`/`REJECTED`/`ACTIVE`/`COMPLETED`), payment history, review submission after completed stays

### Landlord
- Dashboard overview (property count, pending requests)
- Property CRUD with a drag-and-drop image dropzone (Cloudinary-backed upload, live previews, cover image, per-image removal)
- Request management table with Approve/Reject/Complete actions and optimistic UI updates + toast feedback

### Admin
- Platform-wide stats overview
- User management table: search, pagination, ban/unban (admin accounts are ban-exempt)
- Property moderation: take down/restore listings, delete
- View all rental requests across the platform

---

## Project Structure

```
app/
├── (public)/                # Public marketing + property browsing
│   ├── _component/          # Home page sections (hero, features, CTA, stats)
│   └── properties/          # Listing grid + [id] detail page
├── (auth)/auth/              # Login/Register (Server Actions in _actions/)
├── (private)/dashboard/      # Role-scoped dashboards (tenant/landlord/admin)
│   └── _component/           # DashboardShell (sidebar, nav by role)
├── payment/                 # Stripe success/cancel outcome pages
└── layout.tsx / loading.tsx / error.tsx / not-found.tsx

components/
├── ui/                      # shadcn/ui primitives (base-nova style)
├── layout/                  # Navbar, Footer, mobile menu
└── shared/                  # Logo, etc.

service/                     # API client layer
├── client.ts                 # apiClient — browser vs. server-aware fetch wrapper
├── server-client.ts          # Server-only fetch with manual Cookie forwarding
├── getMe.ts / getSavedPropertyIds.ts   # Server-side auth/user helpers
├── landlordService.ts / adminService.ts / paymentService.ts / ...

lib/ , app/lib/               # cn() utility, Zod schemas, format helpers

proxy.ts                     # Next.js middleware — auth/role route protection
```

Backend (`src/`) follows a modules-per-feature pattern:

```
src/modules/
├── user/          # register, login, refresh, me
├── property/       # public listing + save/unsave
├── landlord/        # landlord-scoped property + request CRUD
├── rentalRequest/    # tenant-side request creation/listing
├── payment/          # Stripe checkout + webhook + verify
├── review/            # post-stay reviews
├── admin/              # user/property/rental moderation
├── category/            # property categories
└── upload/                # Cloudinary image upload
```

---

## Cross-Origin Setup (Important)

Frontend and backend live on different `onrender.com` subdomains, so browser-set cookies from the backend won't automatically attach to client-side `fetch` calls targeting the backend directly. This is handled as follows:

1. **`next.config.ts`** rewrites `/api/:path*` on the frontend to the backend's `/api/:path*`:
   ```ts
   async rewrites() {
     return [{ source: "/api/:path*", destination: `${backendApiUrl}/:path*` }];
   }
   ```
2. **`service/client.ts`** (`apiClient`) is environment-aware:
   - In the **browser**, it calls the relative `/api${endpoint}` — same-origin, so the `accessToken` cookie is attached automatically, and Next.js proxies the request server-to-server (forwarding cookies) to the backend.
   - On the **server** (e.g. during static generation or in server components calling public endpoints like `getProperties`), it calls the backend's **absolute** URL directly, since relative URLs can't be resolved outside a browser context.
3. **Authenticated server-side reads** (`getMe.ts`, `server-client.ts`, `getSavedPropertyIds.ts`) bypass `apiClient` entirely — they read the `accessToken` cookie via `next/headers` and forward it manually as a `Cookie` header on a direct backend fetch.

If you ever see `401 Invalid Access Token` on client-side dashboard calls in production, check first whether `apiClient` is hitting the backend directly instead of the same-origin `/api` proxy path.

---

## Environment Variables

### Frontend (`.env`)

```dotenv
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api   # used by server components/actions
BACKEND_API_URL=https://your-backend.onrender.com/api           # used by next.config.ts rewrite
FRONTEND_URL=https://your-frontend.onrender.com
NODE_ENV=production
```

### Backend (`.env`)

```dotenv
NODE_ENV=production

# Database
DATABASE_URL=

# Server
PORT=5000
SERVER_URL=https://your-backend.onrender.com
APP_URL=https://your-frontend.onrender.com     # used for CORS origin allowlist

# Auth
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_TOKEN_SECRET=
JWT_REFRESH_TOKEN_SECRET=
JWT_ACCESS_EXPIRES_IN=1d     # must be SHORTER than refresh expiry
JWT_REFRESH_EXPIRES_IN=7d    # must be LONGER than access expiry

# Stripe
STRIPE_PRODUCT_ID=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> ⚠️ Keep `JWT_ACCESS_EXPIRES_IN` shorter than `JWT_REFRESH_EXPIRES_IN`. If reversed, the refresh token JWT can expire while its cookie is still alive, silently breaking the token-refresh flow in `proxy.ts` after the access token's window passes.

---

## Getting Started Locally

**Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev        # runs on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev         # runs on http://localhost:3000
```

Locally, set `NEXT_PUBLIC_BACKEND_URL` / `BACKEND_API_URL` to `http://localhost:5000/api`, and backend `APP_URL` to `http://localhost:3000`.

---

## Deployment (Render)

Two separate Render **Web Services**, one per app, each with its own Environment tab configured with the variables above (env vars are per-service — values in a local `.env` file are never read by Render since `.env*` is gitignored).

Build commands:
- Frontend: `npm install; npm run build` → `npm run start`
- Backend: `npm run build` (runs `prisma generate && tsup`) → `npm run start`

After changing frontend env vars (especially `NEXT_PUBLIC_*`, which are inlined at build time), trigger **Clear build cache & deploy** rather than a plain redeploy.

---

## Database Schema Overview

Core Prisma models (see `prisma/models/*.prisma`):

- **User** — role (`TENANT` / `LANDLORD` / `ADMIN`), ban status
- **Property** — belongs to a landlord and a category; address, price, amenities, images, availability
- **Category** — property type taxonomy
- **RentalRequest** — tenant ↔ property, lifecycle status (`PENDING → APPROVED/REJECTED → ACTIVE → COMPLETED`)
- **Payment** — Stripe transaction tied to a rental request
- **Review** — tenant review of a property, requires a completed payment
- **SavedProperty** — tenant favorites (many-to-many via join table)

---

## API Route Map

| Route | Auth | Description |
|---|---|---|
| `POST /api/auth/register` | Public | Create account |
| `POST /api/auth/login` | Public | Login, sets cookies |
| `POST /api/auth/refresh-token` | Public (refresh cookie) | Rotate access token |
| `GET /api/auth/me` | Any role | Current user |
| `GET /api/properties` | Public | List/filter properties |
| `GET /api/properties/:id` | Public | Property detail |
| `POST/DELETE /api/properties/:id/save` | Tenant/Landlord/Admin | Save/unsave |
| `GET /api/properties/saved` | Tenant/Landlord/Admin | Saved list |
| `POST /api/landlord/properties` | Landlord/Admin | Create listing |
| `GET/PUT/DELETE /api/landlord/properties/:id` | Landlord/Admin | Manage own listing |
| `GET /api/landlord/requests` | Landlord/Admin | Incoming requests |
| `PATCH /api/landlord/requests/:id` | Landlord/Admin | Approve/reject/complete |
| `POST /api/rentals` | Tenant/Admin | Submit rental request |
| `GET /api/rentals`, `/api/rentals/:id` | Tenant/Admin | Own requests |
| `POST /api/payments/create` | Tenant/Admin | Start Stripe Checkout |
| `POST /api/payments/confirm` | Stripe webhook | Confirm payment |
| `POST /api/payments/verify` | Tenant/Admin | Verify from success page |
| `GET /api/payments` | Tenant/Admin | Payment history |
| `POST /api/reviews` | Tenant/Admin | Submit review |
| `POST /api/uploads/images` | Landlord/Admin | Upload property images to Cloudinary |
| `GET/PATCH /api/admin/users`, `/api/admin/users/:id` | Admin | User management |
| `GET/PATCH/DELETE /api/admin/properties*` | Admin | Property moderation |
| `GET /api/admin/rentals` | Admin | All rental requests |

---

## Known Gotchas

- **Cross-origin cookies**: see [Cross-Origin Setup](#cross-origin-setup-important) — this is the #1 source of "401 on client dashboard pages but works fine server-side" bugs.
- **`apiClient` must stay environment-aware**: don't revert `service/client.ts` to a single hardcoded backend URL, or public pages will fail to statically generate at build time (`Failed to parse URL from /api/...`).
- **JWT expiry ordering**: access token expiry must be shorter than refresh token expiry, matching the cookie `maxAge` values set in `LoginActions.ts`.
- **`STRIPE_WEBHOOK_SECRET`**: must not have leading/trailing whitespace — Stripe's signature check is exact.
- **Next.js rewrites don't run at build time**: any server-side code that needs `/api/*` during static generation must use an absolute backend URL, not a relative rewrite path.
