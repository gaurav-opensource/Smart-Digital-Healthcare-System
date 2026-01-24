import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadTestReport from './UploadTestReport';

import BASE_URL from '../../api/api';

const UserDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = userRes.data.id || userRes.data.user?.id;
        if (!userId) throw new Error('User ID not found');

        const appointmentsRes = await axios.get(
          `${BASE_URL}/appointments/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(appointmentsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleJoinCall = (appointment) => {
    const appointmentTime = new Date(appointment.date + ' ' + appointment.time);
    const now = new Date();
    const diffMinutes = (appointmentTime - now) / (1000 * 60);

    if (diffMinutes <= 10 && diffMinutes >= -30) {
      // Allow joining if within 10 mins before or up to 30 mins after
      navigate(`/video-call/${appointment._id}`);
    } else {
      alert('You can join the video call only 10 minutes before the scheduled time.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10 text-lg">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10 text-lg">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Your Dashboard</h2>

        {appointments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {appointments.map((appointment) => {
              const appointmentTime = new Date(appointment.date + ' ' + appointment.time);
              const now = new Date();
              const diffMinutes = (appointmentTime - now) / (1000 * 60);
              const canJoin = diffMinutes <= 10 && diffMinutes >= -30;

              return (
                <div key={appointment._id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">Appointment with Dr. {appointment.doctor?.name || 'N/A'}</h3>

                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">📍 Location:</span> {appointment.doctor?.location || 'N/A'}</p>
                    <p><span className="font-semibold">📅 Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
                    <p><span className="font-semibold">⏰ Time:</span> {appointment.time}</p>
                    <p><span className="font-semibold">🩺 Specialization:</span> {appointment.doctor?.specialization || 'N/A'}</p>
                  </div>

                  <div className="mt-4">
                    {appointment.test ? (
                      <a
                        href={`${BASE_URL}${appointment.test}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-700 hover:underline"
                      >
                        🧾 View Uploaded Report
                      </a>
                    ) : (
                      <UploadTestReport
                        appointmentId={appointment._id}
                        onUploadSuccess={() => window.location.reload()}
                      />
                    )}
                  </div>

                  <div className="mt-4">
                    {appointment.prescription ? (
                      <a
                        href={appointment.prescription}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-700 hover:underline"
                      >
                        💊 View Prescription
                      </a>
                    ) : (
                      <p className="text-gray-500 italic">No prescription uploaded yet.</p>
                    )}
                  </div>

                  {  (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => handleJoinCall(appointment)}
                        disabled={!canJoin}
                        className={`px-6 py-2 font-bold rounded-full transition-all shadow-md ${
                          canJoin
                            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        🎥 Join Video Call
                      </button>
                      { (
                        <p className="text-sm text-gray-500 mt-2">
                          Video call can be joined 10 minutes before the scheduled time.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">No completed appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
