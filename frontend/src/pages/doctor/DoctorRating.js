import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Rating as MuiRating, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../api/api'; 
const SubmitRating = () => {
  const { appointmentId, doctorId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setMessage('No token found. Please log in.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/ratings/add`,
        { doctorId, appointmentId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API Response:', response.data);
      setMessage(response.data.message);
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.error || 'Error submitting rating');
    }
  };


  // ================= Render =================
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6">Rate Your Doctor</Typography>
      <MuiRating
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        precision={0.5}
      />
      <TextField
        label="Comment"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit Rating
      </Button>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};



export default SubmitRating;