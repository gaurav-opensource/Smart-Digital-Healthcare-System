import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import BASE_URL from '../../api/api';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { doctorId } = useParams(); 

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token || !doctorId) {
        setIsLoading(false);
        return;
      }

      try {
        const doctorRes = await fetch(`${BASE_URL}/doctors/profile/${doctorId}`, {
        });

        if (!doctorRes.ok) throw new Error("Failed to fetch doctor profile");
        const doctorData = await doctorRes.json();
        setDoctor(doctorData);

        const ratingRes = await fetch(
          `${BASE_URL}/ratings/doctor/${doctorId}`
        );
        if (!ratingRes.ok) throw new Error("Failed to fetch ratings");
        const ratingData = await ratingRes.json();
        setRatings(ratingData);

      } catch (err) {
        console.error("Error fetching doctor data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [navigate, doctorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-blue-700 font-medium">
            Loading Doctor Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
        <p className="text-xl text-red-500">
          Doctor profile not found.
        </p>
      </div>
    );
  }

  const photoUrl = doctor.profilePhoto && !imageError ? doctor.profilePhoto : null;
  const averageRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : "N/A";

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1 text-yellow-400 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              i < rating ? "fill-yellow-400" : "fill-gray-300"
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.849 1.417 8.268L12 19.896l-7.417 3.969L6 15.597 0 9.748l8.332-1.73z" />
          </svg>
        ))}
        <span className="text-gray-600 ml-2">{rating ? `${rating} / 5` : 'N/A'}</span>
      </div>
    );
  };

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
      <p className="text-gray-700">
        {content || "No information provided."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 lg:p-8 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 pt-20">
        {/* Left Profile Card */}
        <div className="w-full xl:w-1/3 bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
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
          <StarRating rating={doctor.rating} />

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => navigate(`/book-appointment/${doctor._id}`)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition transform hover:scale-105"
            >
              Book Appointment
            </button>
            {doctor.certification && (
              <a
                href={doctor.certification}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-semibold shadow-sm transition transform hover:scale-105"
              >
                View Certification
              </a>
            )}
          </div>
        </div>

        {/* Right Profile Details */}
        <div className="w-full xl:w-2/3 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Professional Details
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
            <ProfileCard label="Experience" value={doctor.experience} />
            <ProfileCard
              label="Patient Rating"
              value={`${averageRating} / 5`}
              color="text-yellow-600"
            />
          </div>

          <Section title="About" content={doctor.about} />
          <Section title="Achievements" content={doctor.achievements} />
          <Section title="Other Information" content={doctor.other} />

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Patient Reviews & Ratings
            </h3>
            {ratings.length === 0 ? (
              <p className="text-gray-600 italic">No ratings yet.</p>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-800 font-semibold">
                        {rating.user?.name || "Anonymous"}
                      </p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < rating.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700">{rating.comment}</p>
                    )}
                    <p className="text-xs text-gray-400 text-right mt-1">
                      {new Date(rating.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
