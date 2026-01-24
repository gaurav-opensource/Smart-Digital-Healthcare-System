import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../api/api';



const StarIcon = ({ filled, onClick }) => (
  <svg
    className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
      filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.725c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
  </svg>
);

// Main RateDoctor component
const RateDoctor = () => {
  const { appointmentId } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); 
  const [comment, setComment] = useState('');
  const navigate = useNavigate();


 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      console.error('Please select a star rating.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('User not authenticated');
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/ratings`,
        { appointmentId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Thanks for rating!');
      navigate('/user/home');
    } catch (err) {
      console.error('Failed to submit rating:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md p-8 relative transform hover:scale-[1.01] transition-transform duration-300 ease-in-out mx-auto mt-16 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <h2 className="text-2xl font-bold text-gray-800">Rate Your Doctor</h2>
          <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stars Rating Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stars:
            </label>
            <div
              className="flex justify-center space-x-1"
              onMouseLeave={() => setHoverRating(0)} // Reset hover state when mouse leaves
            >
              {[1, 2, 3, 4, 5].map((starValue) => (
                <StarIcon
                  key={starValue}
                  filled={starValue <= (hoverRating || rating)} // Fill based on hover or actual rating
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)} // Set hover state
                />
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                You selected {rating} Star{rating > 1 && 's'}
              </p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your feedback"
              className="appearance-none relative block w-full px-3 py-2 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 resize-y rounded-md"
              rows={4}
            ></textarea>
          </div>

          {/* Submit Rating Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-8"
          >
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};

export default RateDoctor;
