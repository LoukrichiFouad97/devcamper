# Testing Guide

This guide explains how to set up and run tests for the DevCamper application (backend and frontend), including data seeding for local/test environments and a manual QA checklist.

## Test Types

- Unit/Feature tests: Validate controllers, middlewares, and routes behavior.
- Acceptance tests: End-to-end flows through HTTP endpoints.

Tests live in [server/test](server/test) and are configured by [server/jest.config.js](server/jest.config.js).

## Prerequisites

- Node.js (LTS) and npm installed.
- MongoDB accessible (local or container).
- Appropriate environment variables for the `test` environment (`server/config/test.json` governs defaults).
 - For frontend smoke checks, Vite dev server (`client`) runs on port 3000 by default.

## Installing Dependencies

```bash
cd server
npm ci
```

## Local Test Database

- Ensure your `server/config/test.json` points to a test database.
- Optionally override with `MONGO_URI` env var for CI environments.

## Seeding Test Data (Optional)

Use the provided seeder to quickly populate data for local/manual tests.

```bash
cd server
node seeder.js -i   # import seed data from _data/
# node seeder.js -d # delete all data
```

Seed users:
- Admin: admin@gmail.com / 123456
- User: test@gmail.com / 123456

## Running Tests

Common options (choose one based on your `package.json` scripts):

```bash
cd server
# If a test script exists
npm test

# Or directly via Jest
npx jest

# Or using the provided runner
node run-unit-tests.cjs
```

To run a specific suite:

```bash
npx jest test/auth.test.js
npx jest test/bootcamps.test.js
npx jest test/courses.test.js
npx jest test/reviews.test.js
npx jest test/users.test.js
```

## Frontend Smoke Tests

Run the frontend dev server and verify major flows:

```bash
cd client
npm ci
npm run dev
```

Manual checks:
- `/test` shows a successful call to `/api/v1/bootcamps` and renders JSON.
- `/` loads Home; navbar links navigate without full reload.
- `/bootcamps` lists entries and filters work (rating, careers).
- `/bootcamps/:id` loads overview, courses, and reviews tabs.
- `/login` + `/register` complete flows, then `/auth/me` hydrates user and redirects to `/dashboard`.
- `/dashboard` loads for logged-in users; renders Admin dashboard for admin.
- Admin routes (`/admin*`) accessible only to admin users.

## Recommended Test Areas

- Auth: register, login, `/auth/me`, logout, cookie + Bearer flows.
- Authorization: owner vs admin controls for bootcamps/courses; user-owned reviews.
- Query behavior: filter, select, sort, pagination via `advancedResults`.
- CRUD: bootcamps, courses (scoped to bootcamp), reviews (scoped), users (admin-only).
- Caching & headers: `ETag`, `Vary`, and no-store on auth endpoints.
- Error cases: validation, not found, unauthorized, forbidden.
 - UI/UX: loading states, error banners, navigation guards, and responsiveness.

## Manual QA Checklist

- Can browse bootcamps without authentication.
- Logging in sets httpOnly cookie; `/auth/me` returns current user.
- Non-admin cannot access user management endpoints.
- Owner can update/delete own bootcamp; cannot modify others' bootcamps.
- Reviews: user can create/update/delete own; admin can manage all.
- Responses consistently return `{ success, data }` (or `{}` for delete).
- Rate limiting not overly aggressive in development; stricter in production.
- CORS works with SPA origins and credentials; no caching of auth endpoints.
 - SPA routes render without full page reload; protected/admin routes redirect appropriately.

## CI Recommendations

- Use a dedicated MongoDB for tests; set via `MONGO_URI`.
- Run `npm ci` for deterministic installs.
- Execute `npx jest --runInBand` in CI to reduce resource contention.
 - Optionally add basic frontend E2E (e.g., Playwright/Cypress) for critical happy paths when needed.
