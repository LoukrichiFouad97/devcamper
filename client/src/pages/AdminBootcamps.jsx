import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { bootcampAPI } from '../services/api';

const AdminBootcamps = () => {
  const careerOptions = [
    'Web Development',
    'Mobile Development',
    'UI/UX',
    'Data Science',
    'Business',
    'Other',
  ];
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    website: '',
    phone: '',
    email: '',
    careers: ['Web Development'],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const fetchBootcamps = async () => {
    try {
      const response = await bootcampAPI.getAll();
      setBootcamps(response.data.data);
    } catch (error) {
      console.error('Error fetching bootcamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCareersChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, careers: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.careers || payload.careers.length === 0) {
        payload.careers = ['Web Development'];
      }
      if (editingId) {
		await bootcampAPI.update(editingId, payload);
      } else {
		await bootcampAPI.create(payload);
      }
      setFormData({
        name: '',
        description: '',
        address: '',
        website: '',
        phone: '',
        email: '',
        careers: ['Web Development'],
      });
      setShowForm(false);
      setEditingId(null);
      fetchBootcamps();
      alert(editingId ? 'Bootcamp updated successfully!' : 'Bootcamp created successfully!');
    } catch (error) {
      alert('Error saving bootcamp: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bootcamp?')) {
      try {
        await bootcampAPI.delete(id);
        fetchBootcamps();
        alert('Bootcamp deleted successfully!');
      } catch (error) {
        alert('Error deleting bootcamp: ' + error.response?.data?.error || error.message);
      }
    }
  };

  const startEdit = (bootcamp) => {
    setEditingId(bootcamp._id);
    setFormData({
      name: bootcamp.name || '',
      description: bootcamp.description || '',
      address: bootcamp.address || '',
      website: bootcamp.website || '',
      phone: bootcamp.phone || '',
      email: bootcamp.email || '',
        careers: bootcamp.careers || ['Web Development'],
    });
    setShowForm(true);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Bootcamps</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                address: '',
                website: '',
                phone: '',
                email: '',
                careers: [],
              });
              setShowForm(!showForm);
            }}
            className="btn btn-primary"
          >
            {editingId ? 'Cancel Edit' : '+ Add New Bootcamp'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Bootcamp' : 'Create New Bootcamp'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Bootcamp Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., CodeAcademy"
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="input"
                  rows="4"
                  placeholder="Bootcamp description"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Careers (hold Ctrl/Cmd for multiple) *</label>
                <select
                  multiple
                  name="careers"
                  value={formData.careers}
                  onChange={handleCareersChange}
                  required
                  className="input h-32"
                >
                  {careerOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Bootcamp' : 'Create Bootcamp'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {bootcamps.length > 0 ? (
            bootcamps.map((bootcamp) => (
              <div key={bootcamp._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{bootcamp.name}</h3>
                    <p className="text-gray-600 mt-1">{bootcamp.description.substring(0, 100)}...</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-sm text-gray-500">📧 {bootcamp.email}</span>
                      <span className="text-sm text-gray-500">📍 {bootcamp.address}</span>
                      {bootcamp.averageRating && (
                        <span className="text-sm text-yellow-500">⭐ {bootcamp.averageRating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-outline text-sm"
                      onClick={() => startEdit(bootcamp)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bootcamp._id)}
                      className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>No bootcamps found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBootcamps;
