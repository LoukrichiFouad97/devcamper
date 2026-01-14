import { useState, useEffect } from 'react';
import { bootcampAPI } from '../services/api';
import BootcampCard from '../components/BootcampCard';

const Bootcamps = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    averageRating: '',
    careers: '',
  });

  useEffect(() => {
    fetchBootcamps();
  }, [filters]);

  const fetchBootcamps = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.averageRating) params['averageRating[gte]'] = filters.averageRating;
      if (filters.careers) params.careers = filters.careers;

      const response = await bootcampAPI.getAll(params);
      setBootcamps(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bootcamps. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Browse Bootcamps</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Minimum Rating</label>
            <select name="averageRating" value={filters.averageRating} onChange={handleFilterChange} className="input">
              <option value="">All Ratings</option>
              <option value="7">7+ Stars</option>
              <option value="8">8+ Stars</option>
              <option value="9">9+ Stars</option>
            </select>
          </div>
          <div>
            <label className="label">Career Path</label>
            <select name="careers" value={filters.careers} onChange={handleFilterChange} className="input">
              <option value="">All Careers</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Data Science">Data Science</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Bootcamps Grid */}
      {bootcamps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bootcamps.map((bootcamp) => (
            <BootcampCard key={bootcamp._id} bootcamp={bootcamp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No bootcamps found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Bootcamps;
