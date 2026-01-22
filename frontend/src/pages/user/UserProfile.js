import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../apiConfig';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  console.log(token)

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const userRes = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10 text-lg">Loading user profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10 text-lg">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">User Profile</h2>

        <div className="space-y-4 text-lg text-gray-700">
          <p><span className="font-semibold">👤 Name:</span> {user.name}</p>
          <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
          <p><span className="font-semibold">📱 Phone:</span> {user.phoneNumber || 'Not provided'}</p>
          <p><span className="font-semibold">📍 Location:</span> {user.location || 'Not provided'}</p>
          <p><span className="font-semibold">🛡️ Role:</span> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
