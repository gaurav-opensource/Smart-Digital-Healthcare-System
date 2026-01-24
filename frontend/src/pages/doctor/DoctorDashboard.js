import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadPrescription from './UploadPrescription';


import BASE_URL from '../../api/api';

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, today, upcoming, awaiting, completed

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        
        const doctorRes = await axios.get(`${BASE_URL}/doctors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const doctorId = doctorRes.data._id || doctorRes.data.id;
        if (!doctorId) throw new Error('Doctor ID not found');

        // Fetch all appointments of doctor
        const appointmentsRes = await axios.get(
          `${BASE_URL}/appointments/doctor/${doctorId}`,
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

    fetchDoctorAppointments();
  }, [token]);


  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prev) =>
        prev.map((appt) => {
          if (!appt.date || !appt.time) return appt;
          if (appt.status !== 'pending') return appt;

          const now = new Date();
          const apptDate = new Date(appt.date);
          const [hours, minutes] = appt.time.split(':');
          apptDate.setHours(parseInt(hours));
          apptDate.setMinutes(parseInt(minutes));
          apptDate.setSeconds(0);

          const callStartTime = new Date(apptDate.getTime() - 20 * 60 * 1000);

          if (now >= callStartTime) {
            return { ...appt, status: 'vidoes-call' };
          }
          return appt;
        })
      );
    }, 30 * 1000); // check every 30 seconds

    return () => clearInterval(interval);
  }, []);


  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const filteredAppointments = appointments.filter((appointment) => {
    const apptDate = new Date(appointment.date)
      .toISOString()
      .split('T')[0];

    if (filter === 'all') return true;
    if (filter === 'today') return apptDate === today;
    if (filter === 'upcoming') return apptDate > today && appointment.status === 'pending';
    if (filter === 'awaiting') return appointment.status === 'awaiting_prescription';
    if (filter === 'completed') return appointment.status === 'completed';
    return true;
  });

  const handleJoinCall = (roomId) => {
    navigate(`/video-call/${roomId}`);
  };

  // --------- Status Tracker UI ---------
  const StatusTracker = ({ status }) => {
    const steps = [
      { key: 'pending', label: 'Pending' },
      { key: 'vidoes-call', label: 'Video Call' },
      { key: 'awaiting_prescription', label: 'Awaiting Prescription' },
      { key: 'completed', label: 'Completed' },
    ];

    // Determine current step index
    const currentIndex = steps.findIndex((s) => s.key === status);


    // Render the tracker
    return (
      <div className="flex items-center gap-2 mt-3">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${idx <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {idx + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                idx <= currentIndex ? 'text-blue-700 font-semibold' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`w-10 h-1 mx-2 ${
                  idx < currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  //Transition and loading states
  if (loading) {
    return <p className="text-center text-gray-600 mt-10 text-lg">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10 text-lg">{error}</p>;
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Doctor Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {['all', 'today', 'upcoming', 'awaiting', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded capitalize ${
                filter === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredAppointments.length > 0 ? (
          <ul className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <li
                key={appointment._id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50"
              >
                <p>
                  <span className="font-semibold">👤 Patient:</span>{' '}
                  {appointment.user?.name || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">📧 Email:</span>{' '}
                  {appointment.user?.email || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">📅 Date:</span>{' '}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">⏰ Time:</span>{' '}
                  {appointment.time || 'N/A'}
                </p>

                <p>
                  <span className="font-semibold">✅ Status:</span>{' '}
                  {appointment.status}
                </p>

                {/* Status Tracker */}
                <StatusTracker status={appointment.status} />

                {/* Video Call */}
                {appointment.status === 'vidoes-call' && (
                  <button
                    onClick={() => handleJoinCall(appointment._id)}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    🎥 Join Video Call
                  </button>
                )}

                {/* Prescription */}
                {appointment.prescription ? (
                  <a
                    href={appointment.prescription}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-700 underline mt-2 block"
                  >
                    🧾 View Prescription
                  </a>
                ) : appointment.status === 'awaiting_prescription' ? (
                  <UploadPrescription
                    appointmentId={appointment._id}
                    onUploadSuccess={() => window.location.reload()}
                  />
                ) : (
                  <p className="text-gray-500 italic">No prescription uploaded</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No appointments found for this tab.
          </p>
        )}
      </div>
    </div>
  );
};



export default DoctorDashboardPage;
