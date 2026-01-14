import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // If admin, show the full admin dashboard with CRUD directly at /dashboard
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Account Type</h3>
          <p className="text-2xl font-bold capitalize">{user?.role}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Email</h3>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Name</h3>
          <p className="text-lg">{user?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        
        {user?.role === 'admin' && (
          <div className="space-y-4">
            <div className="border-l-4 border-primary-600 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-1">⚙️ Admin Dashboard</h3>
              <p className="text-gray-600 mb-3">Full control over all resources</p>
              <a href="/admin" className="btn btn-primary">
                Go to Admin Panel
              </a>
            </div>
          </div>
        )}

        {user?.role === 'publisher' && (
          <div className="space-y-4">
            <div className="border-l-4 border-primary-600 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-1">Manage Your Bootcamps</h3>
              <p className="text-gray-600">Create, edit, and manage your bootcamp listings</p>
              <button className="btn btn-primary mt-3">Create New Bootcamp</button>
            </div>
            <div className="border-l-4 border-primary-600 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-1">Manage Courses</h3>
              <p className="text-gray-600">Add and update courses for your bootcamps</p>
              <button className="btn btn-outline mt-3">Manage Courses</button>
            </div>
          </div>
        )}

        {user?.role === 'user' && (
          <div className="space-y-4">
            <div className="border-l-4 border-primary-600 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-1">Browse Bootcamps</h3>
              <p className="text-gray-600">Discover the perfect bootcamp for your career goals</p>
              <a href="/bootcamps" className="btn btn-primary mt-3 inline-block">
                Browse Now
              </a>
            </div>
            <div className="border-l-4 border-primary-600 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-1">Your Reviews</h3>
              <p className="text-gray-600">View and manage your bootcamp reviews</p>
              <button className="btn btn-outline mt-3">View Reviews</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
