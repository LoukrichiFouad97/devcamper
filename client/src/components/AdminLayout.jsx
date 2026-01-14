import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">DevCamper Admin</h1>
        </div>
        <nav className="mt-8">
          <Link to="/admin" className="block px-6 py-3 hover:bg-gray-800 transition">
            📊 Dashboard
          </Link>
          <Link to="/admin/bootcamps" className="block px-6 py-3 hover:bg-gray-800 transition">
            🏕️ Bootcamps
          </Link>
          <Link to="/admin/courses" className="block px-6 py-3 hover:bg-gray-800 transition">
            📚 Courses
          </Link>
          <Link to="/admin/users" className="block px-6 py-3 hover:bg-gray-800 transition">
            👥 Users
          </Link>
          <Link to="/admin/reviews" className="block px-6 py-3 hover:bg-gray-800 transition">
            ⭐ Reviews
          </Link>
          <Link to="/" className="block px-6 py-3 hover:bg-gray-800 transition border-t border-gray-700 mt-4">
            ← Back to App
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
