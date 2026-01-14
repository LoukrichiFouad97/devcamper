# System Design

This document explains the architecture, key components, and design decisions of the DevCamper full-stack application (frontend + backend).

## Architecture Overview

- API Server: Express application bootstrapped via loaders under `server/loaders/`.
- Database: MongoDB with Mongoose ODM models in `server/models/`.
- Routing: Express routers in `server/routes/`, mapping to controllers in `server/controllers/`.
- Middlewares: Cross-cutting concerns (auth, caching, errors, rate limiting, etc.) in `server/middlewares/`.
- Config: Environment-specific settings in `server/config/`.
- Docs: Swagger spec (`server/swagger.yaml`) and generated JSDoc HTML under `server/docs/`.
- Frontend SPA: React + Vite app in `client/` with Tailwind CSS and React Router.

Request Flow
1. HTTP request enters Express (via `server/loaders/express.loader.js`).
2. Global middlewares applied (security, body parsing, CORS, rate limiting, response enhancer, cache headers).
3. Router dispatch to route handlers in `server/routes/`.
4. Per-route middlewares: `requireSignin`, `hasAuthorization`, `advancedResults`, etc.
5. Controller executes domain logic and interacts with Mongoose models.
6. Response standardized by `responseEnhancer` middleware and sent with appropriate headers.
7. Errors propagate to centralized error handler in `server/middlewares/error.js`.

## Key Components

Authentication & Authorization
- Auth middleware `requireSignin` reads JWT from httpOnly cookie or Authorization header.
- `hasAuthorization` enforces role-based access and ownership checks for protected resources.
- Logout clears cookie with proper attributes; auth endpoints are non-cacheable.

Caching
- Custom cache middleware in `server/middlewares/cache.js` sets `ETag`, `Vary: Authorization, Cookie`.
- Skips caching for auth endpoints and when Authorization is present.

Rate Limiting
- Applied globally; relaxed thresholds in development, stricter in production.
- `app.set('trust proxy', 1)` to ensure correct client IP handling when behind proxies.

Query Utilities
- `server/middlewares/advancedResults.js` supports filtering, selection, sorting, pagination, and population for listing endpoints.

Error Handling
- `server/utils/errorResponse.js` to create structured errors.
- Centralized `server/middlewares/error.js` ensures consistent error shape.

Email & Notifications
- `server/utils/sendEmail.js` abstracts SMTP provider; activated when env config is present.

Geocoding
- `server/utils/geoCoder.js` provides geocoding with provider fallback to OpenStreetMap.
- `server/models/Bootcamp.model.js` pre-save hook attempts to resolve `location`; guarded to avoid failures without API keys.

## Data Model Relationships (High-Level)

- User 1..* Bootcamps (owner/publisher)
- Bootcamp 1..* Courses (scoped by `bootcamp` reference)
- Bootcamp 1..* Reviews (scoped by `bootcamp` and `user`)

See Mongoose schemas in `server/models/` for fields and validation.

## API Surface

- Auth endpoints (login, register, me, logout)
- Bootcamps (CRUD, list with query features)
- Courses (CRUD, list globally or by bootcamp)
- Reviews (CRUD, scoped to bootcamps)
- Users (admin-only CRUD)

Definitive details in [server/swagger.yaml](server/swagger.yaml).

## Frontend Architecture

- Build/runtime: Vite dev server on port 3000; proxies `/api/*` to `http://localhost:8080`.
- Routing: React Router v6 defined in `client/src/App.jsx`.
	- Public: `/`, `/bootcamps`, `/bootcamps/:id`, `/about`, `/login`, `/register`, `/test`
	- Protected: `/dashboard` via `PrivateRoute`
	- Admin: `/admin`, `/admin/bootcamps`, `/admin/courses`, `/admin/users`, `/admin/reviews` via `AdminRoute`
- State/Auth: `AuthContext` handles login/register/logout, `authAPI.getMe()` hydration, and token storage; Axios is configured with `withCredentials: true` and adds `Authorization` header when token exists.
- API Service: `client/src/services/api.js` centralizes resource clients (auth, bootcamps, courses, reviews, users).
- Layout: `Layout` wraps `Navbar` + `Footer`; `AdminLayout` provides sidebar nav for admin pages.
- Styling: Tailwind CSS utilities and small component classes (e.g., `btn`, `card`).
- Views: Admin pages implement CRUD forms and tables; list pages support filtering; details page uses tabbed content for courses/reviews.

## Configuration & Environments

- `server/config/*.json` + `server/config/config.js` compose environment-specific settings (dev/prod/test).
- `MONGO_URI` env var overrides configured DB URL when provided.
- CORS configured to allow SPA origins and `credentials: true` for cookies.
 - Vite dev server proxies `/api` to backend; adjust in `client/vite.config.js` for custom ports.

## Security Posture

- Helmet, xss-clean, hpp, express-mongo-sanitize applied.
- JWT secrets and cookie lifetimes configurable.
- Cookies marked httpOnly; SameSite and Secure flags applied appropriately.

## Testing Strategy

- Jest configuration in `server/jest.config.js`.
- Tests in `server/test/` cover auth, resources (bootcamps, courses, reviews, users), and acceptance.
- Script helper `server/run-unit-tests.cjs` streamlines test execution.
 - Manual UI tests for SPA routes and protected/admin flows (see TESTING.md).

## Deployment Considerations

- Provide `MONGO_URI`, JWT, CORS, geocoding, and SMTP environment variables as needed.
- Production rate-limits should be enabled with appropriate thresholds.
- Serve behind a proxy or platform that forwards client IP (trust proxy enabled).
 - Build the frontend with `npm run build` and serve static files separately (e.g., CDN) or via a hosting service; ensure API base URL and CORS settings are aligned.

## Known Trade-offs

- Geocoding during writes increases latency; guarded and optional via provider fallback.
- Cache invalidation is time/head-based (ETag) and path-driven; no distributed cache assumed.
 - Client-side token in localStorage is optional and used only for header propagation; httpOnly cookie remains primary to reduce XSS exposure.
