import axios from 'axios';
import BASE_URL from '../api/api'



const login = async (role, email, password) => {
  let endpoint = '';
  if (role === 'user') endpoint = `${BASE_URL}/users/login`;
  else if (role === 'doctor') endpoint = `${BASE_URL}/doctors/login`;
  else if (role === 'admin') endpoint = `${BASE_URL}/admin/login`;
  else throw new Error('Invalid role selected');

  const response = await axios.post(endpoint, { email, password });
  return response.data;
};



export const registerUser = (data) => axios.post(`${BASE_URL}/users/register`, data);
export const registerDoctor = (data) => axios.post(`${BASE_URL}/doctors/register`, data);
export const registerAdmin = (data) => axios.post(`${BASE_URL}/admin/register`, data);

const logout = () => {
  localStorage.removeItem('authData'); 
};

const authService = {
  login,
  logout,
};

export default authService;

