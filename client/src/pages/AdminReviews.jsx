import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { reviewAPI, bootcampAPI } from '../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bootcamps, setBootcamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bootcampId: '',
    title: '',
    text: '',
    rating: 10,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, bootcampsRes] = await Promise.all([
        reviewAPI.getAll(),
        bootcampAPI.getAll(),
      ]);
      setReviews(reviewsRes.data.data || []);
      setBootcamps(bootcampsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title: formData.title, text: formData.text, rating: Number(formData.rating) };
      if (editingId) {
        await reviewAPI.update(editingId, payload);
      } else {
        await reviewAPI.create(formData.bootcampId, payload);
      }

      setFormData({ bootcampId: '', title: '', text: '', rating: 10 });
      setEditingId(null);
      setShowForm(false);
      fetchData();
      alert(editingId ? 'Review updated successfully!' : 'Review created successfully!');
    } catch (error) {
      alert('Error saving review: ' + (error.response?.data?.error || error.message));
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setFormData({
      bootcampId: review.bootcamp?._id || '',
      title: review.title || '',
      text: review.text || '',
      rating: review.rating || 10,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.delete(id);
        fetchData();
        alert('Review deleted successfully!');
      } catch (error) {
        alert('Error deleting review: ' + error.response?.data?.error || error.message);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Manage Reviews</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingId(null);
              setFormData({ bootcampId: '', title: '', text: '', rating: 10 });
              setShowForm((prev) => !prev);
            }}
          >
            {editingId ? 'Cancel Edit' : '+ Add Review'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Review' : 'Create Review'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Bootcamp *</label>
                  <select
                    className="input"
                    name="bootcampId"
                    value={formData.bootcampId}
                    onChange={handleChange}
                    required={!editingId}
                    disabled={!!editingId}
                  >
                    <option value="">Select bootcamp</option>
                    {bootcamps.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Rating (1-10)</label>
                  <input
                    className="input"
                    type="number"
                    name="rating"
                    min="1"
                    max="10"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    className="input"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="label">Text *</label>
                  <textarea
                    className="input"
                    name="text"
                    rows="3"
                    value={formData.text}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Review' : 'Create Review'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ bootcampId: '', title: '', text: '', rating: 10 });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{review.title}</h3>
                      <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm">
                        ⭐ {review.rating} / 10
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{review.text}</p>
                    <div className="text-sm text-gray-500">
                      <p>By: {review.user?.name || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => startEdit(review)}
                      className="btn btn-outline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p>No reviews found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
