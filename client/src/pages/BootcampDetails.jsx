import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bootcampAPI, courseAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BootcampDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [bootcamp, setBootcamp] = useState(null);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBootcampDetails();
  }, [id]);

  const fetchBootcampDetails = async () => {
    try {
      setLoading(true);
      const [bootcampRes, coursesRes, reviewsRes] = await Promise.all([
        bootcampAPI.getById(id),
        courseAPI.getAll(id),
        reviewAPI.getAllForBootcamp(id),
      ]);

      setBootcamp(bootcampRes.data.data);
      setCourses(coursesRes.data.data);
      // reviews endpoint for a bootcamp returns { success, count, reviews }
      setReviews(reviewsRes.data.data || reviewsRes.data.reviews || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bootcamp details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Bootcamp not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{bootcamp.name}</h1>
            {bootcamp.location && (
              <p className="text-gray-600 flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {bootcamp.location.formattedAddress}
              </p>
            )}
            {bootcamp.averageRating && (
              <div className="flex items-center">
                <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {bootcamp.averageRating.toFixed(1)} / 10
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'courses', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 mb-6">{bootcamp.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Career Paths</h3>
                  <div className="flex flex-wrap gap-2">
                    {bootcamp.careers?.map((career, index) => (
                      <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {bootcamp.averageCost && (
                  <div>
                    <h3 className="font-semibold mb-2">Average Cost</h3>
                    <p className="text-2xl font-bold text-primary-600">${bootcamp.averageCost.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bootcamp.housing && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Housing
                  </div>
                )}
                {bootcamp.jobAssistance && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Job Assistance
                  </div>
                )}
                {bootcamp.jobGuarantee && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Job Guarantee
                  </div>
                )}
                {bootcamp.acceptGi && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Accepts GI Bill
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Courses Offered</h2>
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-3">{course.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-gray-500">
                              <strong>Duration:</strong> {course.weeks} weeks
                            </span>
                            <span className="text-gray-500">
                              <strong>Skill Level:</strong> {course.minimumSkill}
                            </span>
                            {course.scholarshipAvailable && (
                              <span className="text-green-600 font-medium">Scholarship Available</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-2xl font-bold text-primary-600">${course.tuition.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No courses available yet.</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{review.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold">
                          {review.rating} / 10
                        </div>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BootcampDetails;
