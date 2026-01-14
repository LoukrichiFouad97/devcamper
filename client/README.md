# DevCamper Frontend

Modern React frontend for the DevCamper bootcamp discovery platform.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔐 JWT Authentication (Login/Register)
- 🏕️ Browse and search bootcamps
- 📚 View courses and reviews
- 👤 User dashboard
- 📱 Fully responsive design

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- DevCamper backend running on `http://localhost:8080`

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
client/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── BootcampCard.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Bootcamps.jsx
│   │   ├── BootcampDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Configuration

The frontend is configured to proxy API requests to `http://localhost:8080`. This is set in [vite.config.js](vite.config.js).

If your backend runs on a different port, update the proxy configuration:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:YOUR_PORT',
        changeOrigin: true,
      },
    },
  },
})
```

## Features Overview

### Authentication
- User registration with role selection (User/Publisher)
- JWT-based login
- Protected routes for authenticated users
- Persistent authentication using localStorage

### Bootcamp Discovery
- Browse all bootcamps
- Filter by rating and career path
- View detailed bootcamp information
- See courses and reviews

### User Dashboard
- View account information
- Quick access to main features
- Role-based content (User vs Publisher)

## Customization

### Colors
Edit [tailwind.config.js](tailwind.config.js) to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Styling
Global styles and utility classes are defined in [src/index.css](src/index.css).

## Building for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## License

ISC
