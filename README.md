# DevCamper - Full Stack Application

Complete bootcamp discovery platform with Node.js backend and React frontend.

## Project Structure

```
final_project/
├── server/          # Node.js/Express backend API
└── client/          # React frontend
```

## Quick Start

### 1) Start the Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs at: `http://localhost:8080`

### 2) Start the Frontend Client

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Client runs at: `http://localhost:3000`

## Features

### Backend (Server)
- RESTful API with Express.js
- MongoDB database with Mongoose
- JWT authentication
- OAuth (Google, GitHub)
- File uploads
- Geolocation support
- Rate limiting & security
- API documentation (Swagger)

### Frontend (Client)
- Modern React with Vite (fast HMR)
- Tailwind CSS styling
- React Router navigation (public, protected, and admin routes)
- Authentication context with JWT (cookie + Bearer)
- Responsive design and reusable components
- API integration via centralized Axios service and Vite proxy

#### Frontend Routes
- `/` Home
- `/bootcamps` listing with filters (rating, careers)
- `/bootcamps/:id` details with tabs (overview, courses, reviews)
- `/about` marketing page
- `/login`, `/register` auth pages
- `/dashboard` protected user dashboard (renders Admin dashboard for admin users)
- `/admin`, `/admin/bootcamps`, `/admin/courses`, `/admin/users`, `/admin/reviews` admin CRUD
- `/test` connection tester (calls `/api/v1/bootcamps` and displays response)

## Default Accounts

Check the `server/_data/users.json` file for test accounts.

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8080/api/docs`

## Environment Variables

Create a `.env` file in the server directory with:

```env
NODE_ENV=dev
DEVCAMPER_JWT=your_jwt_secret_here
MAX_UPLOAD_SIZE=1000000
```

Frontend uses Vite proxy to forward API calls:

```js
// client/vite.config.js
export default defineConfig({
	server: {
		port: 3000,
		proxy: {
			'/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false }
		}
	}
})
```

## Available Pages

- **Home** (`/`) - Landing page with features
- **Bootcamps** (`/bootcamps`) - Browse and filter bootcamps
- **Bootcamp Details** (`/bootcamps/:id`) - View bootcamp, courses, and reviews
- **About** (`/about`) - About DevCamper
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - Create new account
- **Dashboard** (`/dashboard`) - User dashboard (protected)
- **Admin** (`/admin` and subroutes) - Admin CRUD for bootcamps, courses, users, reviews
- **Test** (`/test`) - Quick backend connection test

## Technologies

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Passport.js
- JWT
- Nodemailer
- Node Geocoder

### Frontend
- React 18
- Vite
- React Router 6
- Tailwind CSS
- Axios

### Scripts
- Server: `npm run dev` (nodemon), `npm start`
- Client: `npm run dev`, `npm run build`, `npm run preview`

## Development

Both frontend and backend support hot-reload during development:
- Backend: Uses nodemon
- Frontend: Uses Vite HMR

## Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

## Documentation

- Requirements: [REQUIREMENTS.md](REQUIREMENTS.md)
- Design: [DESIGN.md](DESIGN.md)
- Testing: [TESTING.md](TESTING.md)

## License

ISC
