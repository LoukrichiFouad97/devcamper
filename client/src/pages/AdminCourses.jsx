import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { courseAPI, bootcampAPI } from '../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bootcampId: '',
    title: '',
    description: '',
    weeks: '',
    tuition: '',
    minimumSkill: 'beginner',
    scholarshipAvailable: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, bootcampsRes] = await Promise.all([
        courseAPI.getAll(),
        bootcampAPI.getAll(),
      ]);
      setCourses(coursesRes.data.data || []);
      setBootcamps(bootcampsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        weeks: formData.weeks,
        tuition: formData.tuition,
        minimumSkill: formData.minimumSkill,
        scholarshipAvailable: formData.scholarshipAvailable,
      };

      if (editingId) {
        await courseAPI.update(editingId, payload);
      } else {
        await courseAPI.create(formData.bootcampId, payload);
      }
      setFormData({
        bootcampId: '',
        title: '',
        description: '',
        weeks: '',
        tuition: '',
        minimumSkill: 'beginner',
        scholarshipAvailable: false,
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
      alert(editingId ? 'Course updated successfully!' : 'Course created successfully!');
    } catch (error) {
      alert('Error saving course: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(id);
        fetchData();
        alert('Course deleted successfully!');
      } catch (error) {
        alert('Error deleting course: ' + error.response?.data?.error || error.message);
      }
    }
  };

  const startEdit = (course) => {
    setEditingId(course._id);
    setFormData({
      bootcampId: course.bootcamp?._id || '',
      title: course.title || '',
      description: course.description || '',
      weeks: course.weeks || '',
      tuition: course.tuition || '',
      minimumSkill: course.minimumSkill || 'beginner',
      scholarshipAvailable: !!course.scholarshipAvailable,
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
          <h1 className="text-4xl font-bold">Manage Courses</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                bootcampId: '',
                title: '',
                description: '',
                weeks: '',
                tuition: '',
                minimumSkill: 'beginner',
                scholarshipAvailable: false,
              });
              setShowForm(!showForm);
            }}
            className="btn btn-primary"
          >
            {editingId ? 'Cancel Edit' : '+ Add New Course'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Course' : 'Create New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Bootcamp *</label>
                <select
                  name="bootcampId"
                  value={formData.bootcampId}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Select a bootcamp</option>
                  {bootcamps.map((bootcamp) => (
                    <option key={bootcamp._id} value={bootcamp._id}>
                      {bootcamp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., Full Stack JavaScript"
                  />
                </div>
                <div>
                  <label className="label">Weeks *</label>
                  <input
                    type="number"
                    name="weeks"
                    value={formData.weeks}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., 12"
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
                  rows="3"
                  placeholder="Course description"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Tuition Cost *</label>
                  <input
                    type="number"
                    name="tuition"
                    value={formData.tuition}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., 9999"
                  />
                </div>
                <div>
                  <label className="label">Minimum Skill Level *</label>
                  <select
                    name="minimumSkill"
                    value={formData.minimumSkill}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="scholarshipAvailable"
                    checked={formData.scholarshipAvailable}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Scholarship Available</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Course' : 'Create Course'}
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
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-gray-600 mt-1">{course.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <span className="text-sm text-gray-500">⏱️ {course.weeks} weeks</span>
                      <span className="text-sm text-gray-500">💰 ${course.tuition.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">📈 {course.minimumSkill}</span>
                      {course.scholarshipAvailable && (
                        <span className="text-sm text-green-600 font-semibold">✓ Scholarship Available</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn btn-outline text-sm" onClick={() => startEdit(course)}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
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
              <p>No courses found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
