import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import BASE_URL from '../../api/api';

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    specialization: "",
    minFees: "",
    maxFees: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/doctors/getdoctor`, {
        params: filters,
      });
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all unique specializations
  const fetchSpecializations = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/doctors/getdoctor`);
      const specs = [...new Set(data.map((doc) => doc.specialization))];
      setSpecializations(specs);
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const handleBookAppointment = (e, doctorId) => {
    e.stopPropagation(); 
    navigate(`/user/doctorprofile/${doctorId}`);
  };

  const handleViewProfile = (doctorId) => {
    navigate(`/doctor/profile/${doctorId}`);
  };

  const handleSpecializationClick = (spec) => {
    setFilters({ ...filters, specialization: spec });
    setTimeout(() => fetchDoctors(), 0); 
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 pt-20">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md rounded-lg p-5 h-fit sticky top-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Specializations
          </h2>
          <ul className="space-y-2">
            <li
              onClick={() => handleSpecializationClick("")}
              className={`cursor-pointer px-3 py-2 rounded-md font-medium ${
                filters.specialization === ""
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </li>
            {specializations.map((spec, i) => (
              <li
                key={i}
                onClick={() => handleSpecializationClick(spec)}
                className={`cursor-pointer px-3 py-2 rounded-md font-medium ${
                  filters.specialization === spec
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {spec}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Filters */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="minFees"
                placeholder="Min Fees"
                value={filters.minFees}
                onChange={handleFilterChange}
                className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="maxFees"
                placeholder="Max Fees"
                value={filters.maxFees}
                onChange={handleFilterChange}
                className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold rounded-full px-4 py-2 hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-100 text-red-600 text-center p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <p className="col-span-full text-center text-gray-600">
                Loading doctors...
              </p>
            )}
            {doctors.length === 0 && !loading && !error && (
              <p className="col-span-full text-center text-gray-600">
                No doctors found.
              </p>
            )}

            {doctors.map((doc) => (
              <div
                key={doc._id}
                onClick={() => handleViewProfile(doc._id)}
                className="relative bg-white rounded-lg shadow-md p-5 flex flex-col transition transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                {/* Badge - Specialization */}
                <div className="absolute top-3 right-3 bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-md">
                  {doc.specialization || "General"}
                </div>

                {/* Profile */}
                {doc.profilePhoto ? (
                  <img
                    src={doc.profilePhoto}
                    alt={doc.name}
                    className="w-20 h-20 mx-auto rounded-full border-2 border-gray-200 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto flex items-center justify-center bg-gray-300 text-white text-xl font-bold rounded-full border-2 border-gray-200">
                    {doc.name[0]}
                  </div>
                )}

                {/* Name + Location */}
                <h2 className="mt-4 text-lg font-bold text-center text-gray-800">
                  {doc.name}
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  {doc.location}
                </p>

                {/* Fees */}
                <p className="mt-2 text-center font-semibold text-green-600">
                  ₹{doc.fees}
                </p>

                {/* Details */}
                <div className="mt-3 grid grid-cols-2 text-sm gap-y-2 text-gray-600">
                  <div>
                    <span className="text-gray-400">Experience:</span>{" "}
                    <span className="font-semibold">
                      {doc.experience || "N/A"} yrs
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rating:</span>{" "}
                    <span className="font-semibold">{doc.rating || "N/A"}</span>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={(e) => handleBookAppointment(e, doc._id)}
                  className="mt-5 w-full bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorListPage;
