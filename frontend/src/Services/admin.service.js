import axios from 'axios';
import BASE_URL from '../api/api';

const token = localStorage.getItem('token');

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// Admin Service Functions
const getProfile = async () => {
  const res = await axios.get(`${BASE_URL}/admin/profile`, config);
  return res.data;
};


// Fetch list of unverified doctors
const getUnverifiedDoctors = async () => {
  // Assuming unverified doctors api is separate (check backend routes)
  const res = await axios.get(`${BASE_URL}/doctors/unverified`, config);
  return res.data;
};


// Verify a doctor by ID
const verifyDoctor = async (doctorId) => {
  const res = await axios.put(`${BASE_URL}/verify-doctor/${doctorId}`, {}, config);
  return res.data;
};


const adminService = {
  getProfile,
  getUnverifiedDoctors,
  verifyDoctor,
};

export default adminService;
