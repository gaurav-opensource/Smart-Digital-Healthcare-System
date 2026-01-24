import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../api/api';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    address: '',
    availability: [{ date: '', startTime: '', endTime: '' }], 
    specialization: '',
    fees: '',
    about: '',
    experience: '',
    achievements: '',
    other: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${BASE_URL}/doctors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const {
          name,
          email,
          phoneNumber,
          location,
          address,
          availability,
          specialization,
          fees,
          about,
          experience,
          achievements,
          other,
        } = res.data;

        setFormData({
          name: name || '',
          email: email || '',
          phoneNumber: phoneNumber || '',
          location: location || '',
          address: address || '',
          availability: availability && availability.length > 0 ? availability : [{ date: '', startTime: '', endTime: '' }],
          specialization: specialization || '',
          fees: fees || '',
          about: about || '',
          experience: experience || '',
          achievements: achievements || '',
          other: other || '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle availability inputs
  const handleAvailabilityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAvailability = [...formData.availability];
    updatedAvailability[index][name] = value;
    setFormData((prev) => ({ ...prev, availability: updatedAvailability }));
  };

  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { date: '', startTime: '', endTime: '' }],
    }));
  };

  const removeAvailability = (index) => {
    const updatedAvailability = formData.availability.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, availability: updatedAvailability }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${BASE_URL}/doctors/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/doctor/profile'), 1500);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Failed to update profile.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-teal-700 text-center">
        Edit Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Availability</label>
          {formData.availability.map((slot, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="date"
                name="date"
                value={slot.date}
                onChange={(e) => handleAvailabilityChange(index, e)}
                className="px-3 py-2 border rounded-md"
              />
              <input
                type="time"
                name="startTime"
                value={slot.startTime}
                onChange={(e) => handleAvailabilityChange(index, e)}
                className="px-3 py-2 border rounded-md"
              />
              <input
                type="time"
                name="endTime"
                value={slot.endTime}
                onChange={(e) => handleAvailabilityChange(index, e)}
                className="px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => removeAvailability(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAvailability}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-md"
          >
            + Add Availability
          </button>
        </div>

        {/* Specialization */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Fees */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Fees</label>
          <input
            type="number"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* About */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Achievements */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Achievements</label>
          <input
            type="text"
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Other */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Other Info</label>
          <textarea
            name="other"
            value={formData.other}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {message && (
          <p className="text-center font-medium text-green-600">{message}</p>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
