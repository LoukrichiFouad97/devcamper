import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { bootcampAPI, courseAPI, adminAPI, reviewAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ bootcamps: 0, courses: 0, users: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  const [bootcamps, setBootcamps] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [bootcampForm, setBootcampForm] = useState({ id: null, name: '', description: '', address: '', email: '' });
  const [courseForm, setCourseForm] = useState({ id: null, bootcampId: '', title: '', description: '', weeks: '', tuition: '', minimumSkill: 'beginner' });
  const [userForm, setUserForm] = useState({ id: null, name: '', email: '', password: '', role: 'user' });
  const [reviewForm, setReviewForm] = useState({ id: null, bootcampId: '', title: '', text: '', rating: 10 });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [bootcampsRes, coursesRes, usersRes, reviewsRes] = await Promise.all([
          bootcampAPI.getAll(),
          courseAPI.getAll(),
          adminAPI.getUsers(),
          reviewAPI.getAll(),
        ]);

        setCounts({
          bootcamps: bootcampsRes.data?.data?.length || 0,
          courses: coursesRes.data?.data?.length || 0,
          users: usersRes.data?.data?.length || 0,
          reviews: reviewsRes.data?.data?.length || 0,
        });

        setBootcamps(bootcampsRes.data?.data || []);
        setCourses(coursesRes.data?.data || []);
        setUsers(usersRes.data?.data || []);
        setReviews(reviewsRes.data?.data || []);
      } catch (err) {
        console.error('Error loading dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const resetBootcampForm = () => setBootcampForm({ id: null, name: '', description: '', address: '', email: '' });
  const resetCourseForm = () => setCourseForm({ id: null, bootcampId: '', title: '', description: '', weeks: '', tuition: '', minimumSkill: 'beginner' });
  const resetUserForm = () => setUserForm({ id: null, name: '', email: '', password: '', role: 'user' });
  const resetReviewForm = () => setReviewForm({ id: null, bootcampId: '', title: '', text: '', rating: 10 });

  const refreshAll = async () => {
    const [bRes, cRes, uRes, rRes] = await Promise.all([
      bootcampAPI.getAll(),
      courseAPI.getAll(),
      adminAPI.getUsers(),
      reviewAPI.getAll(),
    ]);
    setBootcamps(bRes.data?.data || []);
    setCourses(cRes.data?.data || []);
    setUsers(uRes.data?.data || []);
    setReviews(rRes.data?.data || []);
    setCounts({
      bootcamps: bRes.data?.data?.length || 0,
      courses: cRes.data?.data?.length || 0,
      users: uRes.data?.data?.length || 0,
      reviews: rRes.data?.data?.length || 0,
    });
  };

  const saveBootcamp = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (bootcampForm.id) {
        await bootcampAPI.update(bootcampForm.id, bootcampForm);
      } else {
        await bootcampAPI.create(bootcampForm);
      }
      resetBootcampForm();
      await refreshAll();
      alert('Bootcamp saved');
    } catch (err) {
      alert('Error saving bootcamp: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const deleteBootcamp = async (id) => {
    if (!window.confirm('Delete this bootcamp?')) return;
    await bootcampAPI.delete(id);
    await refreshAll();
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: courseForm.title,
        description: courseForm.description,
        weeks: courseForm.weeks,
        tuition: courseForm.tuition,
        minimumSkill: courseForm.minimumSkill,
      };
      if (courseForm.id) {
        await courseAPI.update(courseForm.id, payload);
      } else {
        await courseAPI.create(courseForm.bootcampId, payload);
      }
      resetCourseForm();
      await refreshAll();
      alert('Course saved');
    } catch (err) {
      alert('Error saving course: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await courseAPI.delete(id);
    await refreshAll();
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (userForm.id) {
        const payload = { name: userForm.name, email: userForm.email, role: userForm.role };
        if (userForm.password) payload.password = userForm.password;
        await adminAPI.updateUser(userForm.id, payload);
      } else {
        await adminAPI.createUser(userForm);
      }
      resetUserForm();
      await refreshAll();
      alert('User saved');
    } catch (err) {
      alert('Error saving user: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminAPI.deleteUser(id);
    await refreshAll();
  };

  const saveReview = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: reviewForm.title, text: reviewForm.text, rating: Number(reviewForm.rating) };
      if (reviewForm.id) {
        await reviewAPI.update(reviewForm.id, payload);
      } else {
        await reviewAPI.create(reviewForm.bootcampId, payload);
      }
      resetReviewForm();
      await refreshAll();
      alert('Review saved');
    } catch (err) {
      alert('Error saving review: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await reviewAPI.delete(id);
    await refreshAll();
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold">Total Bootcamps</h3>
              <p className="text-4xl font-bold text-primary-600 mt-2">{counts.bootcamps}</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold">Total Courses</h3>
              <p className="text-4xl font-bold text-primary-600 mt-2">{counts.courses}</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold">Total Users</h3>
              <p className="text-4xl font-bold text-primary-600 mt-2">{counts.users}</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold">Total Reviews</h3>
              <p className="text-4xl font-bold text-primary-600 mt-2">{counts.reviews}</p>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600 mb-6">
            You have full admin access to manage all bootcamps, courses, users, and reviews.
          </p>
          <p className="text-gray-600">Use the sections below for quick create/update/delete across all resources.</p>
        </div>

        {/* Users */}
        <div className="card mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Users</h3>
              <p className="text-gray-500 text-sm">Create, edit, delete users</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetUserForm();
              }}
            >
              New User
            </button>
          </div>
          <form onSubmit={saveUser} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input className="input" placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
            <input className="input" placeholder="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
            <input className="input" placeholder={userForm.id ? 'Password (optional)' : 'Password'} type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required={!userForm.id} />
            <select className="input" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="user">User</option>
              <option value="publisher">Publisher</option>
              <option value="admin">Admin</option>
            </select>
            <div className="md:col-span-4 flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>{userForm.id ? 'Update' : 'Create'}</button>
              {userForm.id && (
                <button type="button" className="btn btn-secondary" onClick={resetUserForm}>Cancel</button>
              )}
            </div>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 capitalize">{u.role}</td>
                    <td className="px-3 py-2 space-x-2">
                      <button className="text-primary-600" onClick={() => setUserForm({ id: u._id, name: u.name, email: u.email, password: '', role: u.role })}>Edit</button>
                      <button className="text-red-600" onClick={() => deleteUser(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bootcamps */}
        <div className="card mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Bootcamps</h3>
              <p className="text-gray-500 text-sm">Create, edit, delete bootcamps</p>
            </div>
            <button className="btn btn-primary" onClick={resetBootcampForm}>New Bootcamp</button>
          </div>
          <form onSubmit={saveBootcamp} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input className="input" placeholder="Name" value={bootcampForm.name} onChange={(e) => setBootcampForm({ ...bootcampForm, name: e.target.value })} required />
            <input className="input" placeholder="Email" type="email" value={bootcampForm.email} onChange={(e) => setBootcampForm({ ...bootcampForm, email: e.target.value })} required />
            <input className="input" placeholder="Address" value={bootcampForm.address} onChange={(e) => setBootcampForm({ ...bootcampForm, address: e.target.value })} required />
            <input className="input" placeholder="Description" value={bootcampForm.description} onChange={(e) => setBootcampForm({ ...bootcampForm, description: e.target.value })} required />
            <div className="md:col-span-4 flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>{bootcampForm.id ? 'Update' : 'Create'}</button>
              {bootcampForm.id && (
                <button type="button" className="btn btn-secondary" onClick={resetBootcampForm}>Cancel</button>
              )}
            </div>
          </form>
          <div className="grid md:grid-cols-2 gap-3">
            {bootcamps.map((b) => (
              <div key={b._id} className="border rounded p-3 flex justify-between">
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-sm text-gray-600">{b.description?.slice(0, 90)}{b.description?.length > 90 ? '…' : ''}</div>
                </div>
                <div className="space-x-2 text-sm">
                  <button className="text-primary-600" onClick={() => setBootcampForm({ id: b._id, name: b.name || '', description: b.description || '', address: b.address || '', email: b.email || '' })}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteBootcamp(b._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="card mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Courses</h3>
              <p className="text-gray-500 text-sm">Create, edit, delete courses</p>
            </div>
            <button className="btn btn-primary" onClick={resetCourseForm}>New Course</button>
          </div>
          <form onSubmit={saveCourse} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <select className="input" value={courseForm.bootcampId} onChange={(e) => setCourseForm({ ...courseForm, bootcampId: e.target.value })} required={!courseForm.id} disabled={!!courseForm.id}>
              <option value="">Bootcamp</option>
              {bootcamps.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <input className="input" placeholder="Title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
            <input className="input" placeholder="Weeks" type="number" value={courseForm.weeks} onChange={(e) => setCourseForm({ ...courseForm, weeks: e.target.value })} required />
            <input className="input" placeholder="Tuition" type="number" value={courseForm.tuition} onChange={(e) => setCourseForm({ ...courseForm, tuition: e.target.value })} required />
            <select className="input" value={courseForm.minimumSkill} onChange={(e) => setCourseForm({ ...courseForm, minimumSkill: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <textarea className="input md:col-span-5" rows="2" placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required />
            <div className="md:col-span-5 flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>{courseForm.id ? 'Update' : 'Create'}</button>
              {courseForm.id && (
                <button type="button" className="btn btn-secondary" onClick={resetCourseForm}>Cancel</button>
              )}
            </div>
          </form>
          <div className="grid md:grid-cols-2 gap-3">
            {courses.map((c) => (
              <div key={c._id} className="border rounded p-3 flex justify-between">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-gray-600">{c.description}</div>
                </div>
                <div className="space-x-2 text-sm">
                  <button className="text-primary-600" onClick={() => setCourseForm({ id: c._id, bootcampId: c.bootcamp?._id || '', title: c.title || '', description: c.description || '', weeks: c.weeks || '', tuition: c.tuition || '', minimumSkill: c.minimumSkill || 'beginner' })}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteCourse(c._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="card mt-8 mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Reviews</h3>
              <p className="text-gray-500 text-sm">Create, edit, delete reviews</p>
            </div>
            <button className="btn btn-primary" onClick={resetReviewForm}>New Review</button>
          </div>
          <form onSubmit={saveReview} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select className="input" value={reviewForm.bootcampId} onChange={(e) => setReviewForm({ ...reviewForm, bootcampId: e.target.value })} required={!reviewForm.id} disabled={!!reviewForm.id}>
              <option value="">Bootcamp</option>
              {bootcamps.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <input className="input" placeholder="Title" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} required />
            <input className="input" placeholder="Rating (1-10)" type="number" min="1" max="10" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} required />
            <textarea className="input md:col-span-4" rows="2" placeholder="Text" value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} required />
            <div className="md:col-span-4 flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>{reviewForm.id ? 'Update' : 'Create'}</button>
              {reviewForm.id && (
                <button type="button" className="btn btn-secondary" onClick={resetReviewForm}>Cancel</button>
              )}
            </div>
          </form>
          <div className="grid md:grid-cols-2 gap-3">
            {reviews.map((r) => (
              <div key={r._id} className="border rounded p-3 flex justify-between">
                <div>
                  <div className="font-semibold">{r.title} · ⭐ {r.rating}</div>
                  <div className="text-sm text-gray-600">{r.text}</div>
                </div>
                <div className="space-x-2 text-sm">
                  <button className="text-primary-600" onClick={() => setReviewForm({ id: r._id, bootcampId: r.bootcamp?._id || '', title: r.title || '', text: r.text || '', rating: r.rating || 10 })}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteReview(r._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
