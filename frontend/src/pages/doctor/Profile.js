import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import BASE_URL from '../../apiConfig'

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
   
    if (location.state?.doctor) {
      setDoctor(location.state.doctor);
      return;
    }

    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const doctorRes = await axios.get(`${BASE_URL}/doctors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(doctorRes.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      }
    };

    fetchDoctorProfile();
  }, [location]);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100 pt-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-teal-700 font-medium">
            Loading Doctor Profile...
          </p>
        </div>
      </div>
    );
  }

  const photoUrl =
    doctor.profilePhoto && !imageError ? doctor.profilePhoto : null;

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 lg:p-8 pt-48">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6">
        {/* Left Profile Card */}
        <div className="w-full xl:w-1/3 bg-white rounded-xl shadow-md p-6 flex flex-col items-center pt-28">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-gray-100">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Doctor"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-5xl text-blue-600 font-bold uppercase">
                {doctor.name.charAt(0)}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Dr. {doctor.name}
          </h2>
          <p className="text-gray-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">{doctor.location}</p>
        </div>

        {/* Right Profile Details */}
        <div className="w-full xl:w-2/3 bg-white rounded-xl shadow-md p-6 overflow-y-auto pt-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Profile Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <ProfileCard label="Name" value={`Dr. ${doctor.name}`} />
            <ProfileCard label="Specialization" value={doctor.specialization} />
            <ProfileCard label="Email" value={doctor.email} />
            <ProfileCard label="Phone" value={doctor.phoneNumber} />
            <ProfileCard label="Location" value={doctor.location} />
            <ProfileCard
              label="Consultation Fees"
              value={`₹${doctor.fees}`}
              color="text-green-600"
            />
            <ProfileCard
              label="Availability"
              value={
                doctor.availability?.length
                  ? doctor.availability
                      .map(
                        (slot) =>
                          `${new Date(slot.date).toLocaleDateString()} (${
                            slot.startTime
                          } - ${slot.endTime})`
                      )
                      .join(", ")
                  : "Not Available"
              }
            />
          </div>

          <Section title="Experience" content={doctor.experience} />
          <Section title="About" content={doctor.about} />
          <Section title="Achievements" content={doctor.achievements} />
          <Section title="Other Information" content={doctor.other} />

          {doctor.certification && (
            <div className="mb-6">
              <a
                href={doctor.certification}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                View Certification Document
              </a>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-10">
            <ActionButton
              text="Edit Profile"
              color="bg-teal-600 hover:bg-teal-700"
              onClick={() => navigate("/doctor/edit-profile")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Small Components */
const ProfileCard = ({ label, value, color = "text-gray-800" }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
    <p className="text-xs uppercase text-gray-500">{label}</p>
    <p className={`mt-1 font-medium ${color}`}>{value || "N/A"}</p>
  </div>
);

const Section = ({ title, content }) => (
  <div className="mb-6">
    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">
      {title}
    </p>
    <p className="text-gray-700">{content || "No information provided."}</p>
  </div>
);

const ActionButton = ({ text, onClick, color }) => (
  <button
    onClick={onClick}
    className={`${color} text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition transform hover:scale-105`}
  >
    {text}
  </button>
);

export default DoctorProfile;
