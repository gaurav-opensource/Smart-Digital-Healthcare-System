import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/api";
import { Star, MapPin, IndianRupee } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function RecommendBestDoctor() {
  const query = useQuery();
  const specialist = query.get("specialist");
  const sort = query.get("sort");

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [specialist, sort]);

  const fetchDoctors = async () => {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/users/search-doctors`, {
      params: { specialization: specialist, sort },
    });
    setDoctors(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Best {specialist} Doctors
        </h1>
        <p className="text-gray-500 text-sm">
          Sorted by rating, fees & experience
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading doctors...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && doctors.length === 0 && (
        <p className="text-center text-gray-500">
          No doctors found for this specialization.
        </p>
      )}

      {/* DOCTOR CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col items-center text-center"
          >
            {/* PHOTO */}
            <img
              src={doc.profilePhoto}
              alt={doc.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mb-3"
            />

            {/* NAME */}
            <h3 className="text-lg font-bold text-gray-800">
              Dr. {doc.name}
            </h3>

            {/* SPECIALIZATION */}
            <span className="text-sm text-blue-600 font-medium">
              {doc.specialization}
            </span>

            {/* INFO */}
            <div className="flex flex-col gap-1 text-sm text-gray-600 mt-3">
              <p className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {doc.rating || "4.5"} Rating
              </p>

              <p className="flex items-center justify-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {doc.fees} Consultation Fee
              </p>

              <p className="flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                {doc.location}
              </p>
            </div>

            {/* CTA */}
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendBestDoctor;
