import { Link } from 'react-router-dom';

const BootcampCard = ({ bootcamp }) => {
  const { _id, name, description, location, careers, averageRating, photo } = bootcamp;

  return (
    <div className="card group">
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={photo ? `/uploads/${photo}` : 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {averageRating && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {averageRating.toFixed(1)}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 text-gray-900">{name}</h3>
      
      {location?.city && (
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location.city}, {location.state}
        </p>
      )}

      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      {careers && careers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {careers.slice(0, 3).map((career, index) => (
            <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
              {career}
            </span>
          ))}
        </div>
      )}

      <Link to={`/bootcamps/${_id}`} className="btn btn-primary w-full text-center">
        View Details
      </Link>
    </div>
  );
};

export default BootcampCard;
