import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import {
  TextField, Button, Typography, Box, Alert, MenuItem, CircularProgress, Grid
} from '@mui/material';
import BASE_URL from '../apiConfig';

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'admin', label: 'Admin' },
];

const specializations = [
  'Cardiology', 'General Physician', 'Orthopedics',
  'Pediatrics', 'Neurology', 'Dermatology', 'Other',
];

const SignupPage = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', location: '',
    phoneNumber: '', licenseNumber: '', fees: '', specialization: '',
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [certificationFile, setCertificationFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const alertRef = useRef();
  const navigate = useNavigate();

  // ✅ Handle form inputs
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Compress and store file
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length === 0) return;

    if (name === 'profilePhoto') {
      const compressed = await imageCompression(files[0], {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
      });
      setProfilePhotoFile(compressed);
    } else if (name === 'certification') {
      setCertificationFile(files[0]);
    }
  };

  // ✅ Cloudinary Upload Helper
  const uploadToCloudinary = async (file, type = 'image') => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ml_default');
    data.append('cloud_name', 'dznnyaj0z');
    data.append('folder', 'Healthcare');

    const url = type === 'image'
      ? 'https://api.cloudinary.com/v1_1/dznnyaj0z/image/upload'
      : 'https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload';

    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel("Upload timeout"), 15000);

    try {
      const res = await axios.post(url, data, { cancelToken: source.token });
      clearTimeout(timeout);
      return res.data.secure_url;
    } catch (err) {
      clearTimeout(timeout);
      console.error('Cloudinary upload failed:', err);
      throw new Error('File upload failed. Please try again.');
    }
  };

  // ✅ Handle Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    let endpoint = role === 'user'
      ? '/users/register'
      : role === 'doctor'
        ? '/doctors/register'
        : '/admin/register';

    try {
      let profilePhotoURL = '';
      let certificationURL = '';

      // ⚡ Upload files in parallel for doctor
      if (role === 'doctor') {
        if (!profilePhotoFile || !certificationFile) {
          setError('Both profile photo and certification are required.');
          setLoading(false);
          return;
        }

        const [photo, cert] = await Promise.all([
          uploadToCloudinary(profilePhotoFile, 'image'),
          uploadToCloudinary(certificationFile, 'raw')
        ]);

        profilePhotoURL = photo;
        certificationURL = cert;
      }

      // ✅ Prepare payload
      let payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (role === 'user') {
        payload.location = formData.location;
        payload.phoneNumber = formData.phoneNumber;
      } else if (role === 'doctor') {
        payload = {
          ...payload,
          location: formData.location,
          phoneNumber: formData.phoneNumber,
          licenseNumber: formData.licenseNumber,
          fees: formData.fees,
          specialization: formData.specialization,
          profilePhoto: profilePhotoURL,
          certification: certificationURL,
        };
      }

      // ✅ Call backend API
      const res = await axios.post(`${BASE_URL}${endpoint}`, payload);

      setSuccess(res.data.message || 'Signup successful! Please log in.');
      navigate('/login');

      // ✅ Reset form
      setFormData({
        name: '', email: '', password: '', location: '',
        phoneNumber: '', licenseNumber: '', fees: '', specialization: '',
      });
      setProfilePhotoFile(null);
      setCertificationFile(null);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex bg-gray-100">
      <Grid container className="flex-grow">
        {/* Left Side Image */}
        <Grid item xs={false} md={6} className="hidden md:flex items-center justify-center bg-blue-600 p-8">
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.7l0CKJ7ImEzkmAQE31FMEAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Signup Illustration"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </Grid>

        {/* Right Side Form */}
        <Grid item xs={12} md={6} className="flex items-center justify-center p-8">
          <Box className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <Typography variant="h4" className="text-center font-bold text-gray-800 mb-6">
              Signup
            </Typography>

            <div ref={alertRef}>
              {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}
            </div>

            <TextField
              select label="Role" name="role" value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth margin="normal"
            >
              {roleOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>

            <form onSubmit={handleSubmit}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required margin="normal" />
              <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required margin="normal" />
              <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required margin="normal" />

              {(role === 'user' || role === 'doctor') && (
                <>
                  <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth required margin="normal" />
                  <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth margin="normal" placeholder="+1234567890" />
                </>
              )}

              {role === 'doctor' && (
                <>
                  <TextField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} fullWidth required margin="normal" />
                  <TextField label="Fees" name="fees" type="number" value={formData.fees} onChange={handleChange} fullWidth required margin="normal" inputProps={{ min: 1 }} />
                  <TextField select label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} fullWidth required margin="normal">
                    {specializations.map(spec => (
                      <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                    ))}
                  </TextField>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Profile Photo</Typography>
                    <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange} required />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Certification (PDF)</Typography>
                    <input type="file" name="certification" accept="application/pdf" onChange={handleFileChange} required />
                  </Box>
                </>
              )}

              <Button type="submit" variant="contained" fullWidth sx={{
                mt: 4, py: 1.5, bgcolor: 'blue.600',
                '&:hover': { bgcolor: 'blue.700' }
              }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
              Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupPage;
