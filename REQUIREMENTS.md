# Project Requirements

This document defines the functional and non-functional requirements for the DevCamper full-stack application (frontend and backend). It reflects the current implementation and clarifies expectations for stakeholders, developers, and testers.

## Overview

- Backend: Express + MongoDB REST API managing bootcamps, courses, reviews, and users with role-based access control, JWT authentication (httpOnly cookie and Bearer token), advanced query features, caching, and rate limiting.
- Frontend: React (Vite) SPA consuming the API, with protected routes, admin dashboard for CRUD, and responsive UI using Tailwind CSS.

## Personas & Roles

- Visitor: Can browse public endpoints (e.g., list bootcamps, details).
- Authenticated User: Can create/edit/delete own reviews; can enroll in typical flows depending on business rules.
- Publisher/Owner: Can create and manage their own bootcamps/courses.
- Admin: Full administrative control, including managing users and any resource.

Seed users (for local/dev):
- Admin: admin@gmail.com / 123456
- Test User: test@gmail.com / 123456

## Functional Requirements

Authentication & Authorization
- Register, login, logout flows.
- Persist auth via httpOnly JWT cookie; support Authorization: Bearer <token>.
- Get current user profile (`/auth/me`).
- Role-based access:
  - Admin: manage users and all resources.
  - Owner/Publisher: update/delete only own bootcamps/courses.
  - User: create/update/delete their own reviews.

Bootcamps
- CRUD operations.
- Query features: filtering, field selection, sorting, pagination via a reusable middleware.
- Optional photo upload for bootcamps (stored under public/uploads/ when configured).
- Geolocation support for addresses using geocoding provider (fallback to OpenStreetMap if not configured).

Courses
- CRUD operations, scoped to a bootcamp.
- List courses globally or by specific bootcamp.

Reviews
- CRUD operations, scoped to a bootcamp.
- Authenticated users can manage only their own reviews; admin can manage any.

Users (Admin)
- Admin-only user management CRUD.

Documentation
- OpenAPI/Swagger specification in server: `swagger.yaml`.
- JSDoc-generated HTML in `server/docs/` for controllers and middlewares.

Caching & Performance
- Response caching layer honoring `ETag` and conditional requests.
- Do not cache auth endpoints; respect Authorization/Cookie via `Vary` headers.

Rate Limiting & Throttling
- Rate limits applied; relaxed in development, stricter in production.

Email & Notifications
- Utility for sending emails (e.g., reset, notifications) when configured.

### Frontend
- SPA routes available for browsing bootcamps, viewing details (courses, reviews), About, Login, Register, Dashboard, and Admin CRUD.
- Auth UI for login/register; persists session via cookie + optional token; shows role-aware navigation and content.
- Admin-only UI to manage bootcamps, courses, users, and reviews.
- Filters for bootcamps list (rating, careers) and detail tabs for courses/reviews.
- Connection test page to verify API reachability from the client.

## Non-Functional Requirements

Security
- HTTP headers hardening (Helmet).
- XSS protection, HPP, and MongoDB injection sanitization.
- CORS configured for SPA clients with credentials.
- Cookies marked httpOnly; SameSite and Secure applied appropriately.

Reliability & Error Handling
- Centralized error middleware with consistent response shape.
- Consistent API responses: `{ success, data }` for resources; empty `{}` for delete.

Maintainability & Modularity
- Layered architecture: loaders, routes, controllers, models, middlewares, utils.
- Configuration per environment (dev, prod, test).

Observability
- Structured logging (console-first) and actionable error messages in development.

Testing
- Jest-based tests for acceptance and feature coverage located in `server/test/`.
 
 UX & Frontend
- Responsive layout across common breakpoints (mobile, tablet, desktop).
- Consistent component styling using Tailwind utility classes.
- Basic client-side error handling and loading indicators.

## Environments & Configuration

Config files: `server/config/dev.json`, `server/config/prod.json`, `server/config/test.json` and `server/config/config.js` loader.

Environment Variables (examples)
- `PORT` (default 8080)
- `MONGO_URI` (overrides config db URL when present)
- `JWT_SECRET`, `JWT_EXPIRE`, `JWT_COOKIE_EXPIRE`
- `CORS_ORIGINS` (e.g., http://localhost:3000, http://localhost:5173)
- Geocoder: `GEOCODER_PROVIDER`, `GEOCODER_API_KEY` (optional; falls back to OSM)
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `FROM_NAME`
 
 Frontend (Vite)
- Runs on port 3000 by default with proxy to `http://localhost:8080` for `/api/*`.

## External Interfaces

- REST endpoints documented in [server/swagger.yaml](server/swagger.yaml).
- Auth cookie and Bearer token support for clients.
 - Frontend consumes API at `/api/v1/*` via Axios, using `withCredentials: true` and `Authorization: Bearer <token>` when present.

## Constraints

- Node.js LTS, MongoDB compatible with Mongoose used here.
- No breaking changes to public API contract without updating Swagger and tests.

## Acceptance Criteria

- Authenticated CRUD paths enforce role-based rules.
- Public listing and details endpoints function with query features.
- Caching, CORS, and rate limiting behave as designed in dev/prod.
- Seed and reseed flows operate using `server/seeder.js` without requiring external geocoding credentials.
- Test suite passes locally against the test configuration.
- Frontend renders public and protected routes correctly; admin panel visible to admin only; listing filters work; detail tabs show courses and reviews; connection test page can reach the API.
