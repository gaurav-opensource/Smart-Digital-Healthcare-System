import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BASE_URL from '../../apiConfig.js'


const Home = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        // Handle no token case, e.g., redirect to login
        setIsLoading(false);
        return;
      }

      try {
        // Fetch doctor profile
        const doctorRes = await fetch(`${BASE_URL}/doctors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!doctorRes.ok) throw new Error("Failed to fetch doctor profile");
        const doctorData = await doctorRes.json();
        setDoctor(doctorData);

        // Get doctor ID for other API calls
        const doctorId = doctorData._id || doctorData.id || doctorData.user?._id;

        // Fetch appointments
        const appointmentRes = await fetch(
          `${BASE_URL}/appointments/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!appointmentRes.ok) throw new Error("Failed to fetch appointments");
        const appointmentData = await appointmentRes.json();
        setAppointments(appointmentData);

        // Fetch ratings
        const ratingRes = await fetch(
          `${BASE_URL}/ratings/doctor/${doctorId}`
        );
        if (!ratingRes.ok) throw new Error("Failed to fetch ratings");
        const ratingData = await ratingRes.json();
        setRatings(ratingData);

      } catch (error) {
        console.error("Error fetching data:", error);
        // On auth error, remove token and possibly redirect
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          // navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-blue-700 font-medium">Loading Professional Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
        <p className="text-xl text-red-500">
          Error: Unable to load doctor profile. Please try again.
        </p>
      </div>
    );
  }

  // Calculate dynamic counts
  const today = new Date().toLocaleDateString();
  const todayAppointments = appointments.filter(appt => new Date(appt.date).toLocaleDateString() === today);
  const pendingAppointments = appointments.filter(appt => !appt.isCompleted);
  const completedAppointments = appointments.filter(appt => appt.isCompleted);
  const averageRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : "N/A";

  const photoUrl = doctor.profilePhoto && !imageError ? doctor.profilePhoto : null;

  const cardData = [
    {
      title: "Today's Appointments",
      count: todayAppointments.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H4.5V3a.75.75 0 0 1 .75-.75Zm.75 6a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H7.5ZM12 9a.75.75 0 0 0-.75.75v1.5h-1.5a.75.75 0 0 0 0 1.5H12v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5V9.75A.75.75 0 0 0 12 9Zm-3.75 3a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5h-.008Zm9-3a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5h-.008Zm-9 3a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5h-.008Zm9 0a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5h-.008Zm-9 3a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5h-.008Zm9 0a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5h-.008ZM18.75 6H5.25v12.75h13.5V6Z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
      route: "/complete/doctor",
    },
    {
      title: "Pending Appointments",
      count: pendingAppointments.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h.215C7.291 3 8.1 3.518 8.444 4.31a1.288 1.288 0 0 0 2.404 0c.344-.792 1.153-1.31 2.226-1.31h.215a3 3 0 0 1 3 3v2.129a3 3 0 0 1-1-.219V6a1.5 1.5 0 0 0-1.5-1.5h-.215c-1.288 0-2.355.65-2.81 1.626a.75.75 0 0 1-1.48 0C8.565 5.15 7.498 4.5 6.215 4.5H6A1.5 1.5 0 0 0 4.5 6v12a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.129a3 3 0 0 1-1 .219V18a1.5 1.5 0 0 0-1.5-1.5h-2.129a3 3 0 0 1-.219-1H18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 18 4.5h-.215c-1.288 0-2.355.65-2.81 1.626a.75.75 0 0 1-1.48 0c-.455-.976-1.522-1.626-2.81-1.626h-.215A1.5 1.5 0 0 0 6 6v2.129a3 3 0 0 1-1-.219V6Zm6.994 5.25a.75.75 0 1 0-1.488-.255l-3.5 6a.75.75 0 0 0 .759 1.055l.775-.43l1.849 2.034a.75.75 0 0 0 1.135-.084l3-5.25a.75.75 0 1 0-1.299-.75l-2.072 3.626-1.458-1.594Z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-yellow-100 text-yellow-600",
      route: "/pending/doctor",
    },
    {
      title: "Completed Appointments",
      count: completedAppointments.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M7.493 18.25a.75.75 0 0 1-.749-.75l.002-12.753A.75.75 0 0 1 7.5 4a.75.75 0 0 1 .75.75v.081c.57.086 1.144.204 1.721.354A8.967 8.967 0 0 0 12 5.25c1.193 0 2.327.119 3.407.348A3.013 3.013 0 0 1 18 8.25v2.266a1.5 1.5 0 0 0 1.295 1.489c1.556.34 3.109.563 4.655.683a.75.75 0 0 1 .745.745V18a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6.75a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 .743.648L6.75 6.75v11.25Zm4.507-.75a.75.75 0 0 0-.75-.75H5.25a.75.75 0 0 0-.75.75v.008a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75V17.5Z" />
        </svg>
      ),
      color: "bg-green-100 text-green-600",
      route: "/doctor/chatlist",
    },
    {
      title: "Average Rating",
      count: averageRating,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
      route: "/doctor/profile",
    },
  ];

  const upcomingAppointments = appointments.filter(appt => new Date(appt.date) >= new Date()).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-24 pb-32">
        <div className="relative w-full max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 py-12 px-4 md:px-8">
          {/* Content Section */}
          <div className="flex flex-col justify-center items-start text-left lg:h-[80vh]">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight md:leading-snug">
              Welcome, Dr. {doctor.name}
            </h1>
            <p className="mt-4 text-sm md:text-base text-white max-w-md">
              Your professional dashboard. Manage your appointments, track your ratings, and stay connected with your patients.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                View Appointments
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition duration-300">
                Manage Profile
              </button>
            </div>

            {/* Statistics Section */}
            <div className="mt-12 w-full flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-start">
                <span className="text-3xl md:text-4xl font-bold">{appointments.length}</span>
                <span className="text-white text-sm md:text-base mt-1">Total Appointments</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-3xl md:text-4xl font-bold">{doctor.experience || "N/A"}</span>
                <span className="text-white text-sm md:text-base mt-1">Years of Clinical Excellence</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-3xl md:text-4xl font-bold">{averageRating}</span>
                <span className="text-white text-sm md:text-base mt-1">Patient Satisfaction Rating</span>
              </div>
            </div>
          </div>

          {/* Image and Social Icons Section */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="w-60 h-60 rounded-full overflow-hidden shadow-lg border-4 border-white">
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

            {/* Social Icons (using inline SVG) */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 pr-12">
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V275.9h-45v-56h45v-40c0-49.6 30.6-76.8 74.3-76.8 20.2 0 37.8 1.5 42.9 2.2V128h-31.5c-24.9 0-29.6 12.5-29.6 29.1v36.5h63.2l-10.3 56h-52.9v188.1H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.56-298.559 298.56-59.449 0-114.655-17.219-161.189-47.228 8.447.974 16.568 1.299 25.34 1.299 49.07 0 94.212-16.568 130.291-44.475-46.111-.975-84.755-31.293-98.3-72.796 6.174 1.142 12.382 1.567 18.77 1.567 29.289 0 56.407-9.752 77.22-25.724-61.905-1.783-112.435-67.155-112.435-131.94 0-1.21.102-2.427.204-3.638 17.219 9.502 37.064 15.281 57.753 16.096-36.46-24.316-60.01-65.494-60.01-110.128 0-24.464 6.697-47.078 18.397-66.524 66.237 81.657 163.631 135.093 273.914 140.407-1.123-5.582-1.89-11.378-1.89-17.251 0-41.972 33.918-76.21 76.21-76.21 22.092 0 42.424 9.336 56.671 24.288 17.818-3.565 35.329-10.326 50.413-18.749-5.872 18.257-18.125 33.66-34.195 43.619z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M224.1 140.2c-35.3 0-59.3 1.3-76.2 2.7-16.7 1.5-27.8 3.5-35.2 6.7s-13.4 7.8-18.1 12.5c-4.7 4.7-8.2 11.2-12.5 18.1-3.2 7.4-5.2 18.5-6.7 35.2-1.4 16.9-2.7 40.9-2.7 76.2s1.3 59.3 2.7 76.2c1.5 16.7 3.5 27.8 6.7 35.2s7.8 13.4 12.5 18.1c4.7 4.7 11.2 8.2 18.1 12.5 7.4 3.2 18.5 5.2 35.2 6.7 16.9 1.4 40.9 2.7 76.2 2.7s59.3-1.3 76.2-2.7c16.7-1.5 27.8-3.5 35.2-6.7s13.4-7.8 18.1-12.5c4.7-4.7 8.2-11.2 12.5-18.1 3.2-7.4 5.2-18.5 6.7-35.2 1.4-16.9 2.7-40.9 2.7-76.2s-1.3-59.3-2.7-76.2c-1.5-16.7-3.5-27.8-6.7-35.2s-7.8-13.4-12.5-18.1c-4.7-4.7-11.2-8.2-18.1-12.5-7.4-3.2-18.5-5.2-35.2-6.7-16.9-1.4-40.9-2.7-76.2-2.7zM224 374c-82.7 0-150-67.3-150-150s67.3-150 150-150 150 67.3 150 150-67.3 150-150 150zm125.7-223.7c-17.9-17.9-46.6-17.9-64.5 0s-17.9 46.6 0 64.5 46.6 17.9 64.5 0 17.9-46.6 0-64.5zM224 300c-41.4 0-75-33.6-75-75s33.6-75 75-75 75 33.6 75 75-33.6 75-75 75z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 576 512" fill="currentColor">
                    <path d="M549.655 124.083a11.233 11.233 0 0 0-7.777-7.777C504.609 103.543 459.187 96 300 96c-159.187 0-204.609 7.543-241.878 20.306a11.233 11.233 0 0 0-7.777 7.777C20.59 159.043 16 215.253 16 256c0 40.747 4.59 96.957 20.306 131.917a11.233 11.233 0 0 0 7.777 7.777C95.391 408.457 140.813 416 300 416c159.187 0 204.609-7.543 241.878-20.306a11.233 11.233 0 0 0 7.777-7.777C591.41 352.957 596 296.747 596 256c0-40.747-4.59-96.957-20.306-131.917zM207 336c0 6.6-5.4 12-12 12h-68c-6.6 0-12-5.4-12-12v-68c0-6.6 5.4-12 12-12h68c6.6 0 12 5.4 12 12v68zM393 336c0 6.6-5.4 12-12 12h-68c-6.6 0-12-5.4-12-12v-68c0-6.6 5.4-12 12-12h68c6.6 0 12 5.4 12 12v68z"/>
                </svg>
              </a>
            </div>
            
            {/* Vertical Line */}
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-300 to-purple-300"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 md:p-10 -mt-24 relative z-10">
        {/* Doctor Welcome Section */}
        <div className="bg-white shadow-xl rounded-3xl p-8 mb-10 text-center transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
            Welcome, Dr. {doctor.name} <span className="text-xl">👨‍⚕️</span>
          </h1>
          <p className="text-gray-700 text-lg">
            Here’s your dashboard overview and next actions.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cardData.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${item.color} text-center focus:outline-none`}
            >
              <div className="text-4xl mb-2 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-lg mt-2 font-bold">{item.count}</p>
            </button>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions Card */}
          <div className="lg:col-span-1 bg-white shadow-xl rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <button onClick={() => navigate("/doctor/profile")} className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">View Profile</span>
              </button>
              <button onClick={() => navigate("/doctor/profile")} className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.25 4.5A.75.75 0 0 1 12 5.25v1.5a.75.75 0 0 1-1.5 0v-1.5c0-.414.336-.75.75-.75Zm.75 14.25a.75.75 0 0 1-.75.75v1.5a.75.75 0 0 1 1.5 0v-1.5a.75.75 0 0 1-.75-.75ZM18.528 7.387a.75.75 0 0 1 .057 1.059l-1.077 1.078a.75.75 0 0 1-1.058-.057l-1.078-1.077a.75.75 0 0 1 .057-1.058l1.077-1.078a.75.75 0 0 1 1.058.057Zm-15 0a.75.75 0 0 1 1.059-.057l1.077 1.078a.75.75 0 1 1-1.058 1.058L3.585 8.446a.75.75 0 0 1-.057-1.059Zm11.25 10.5a.75.75 0 0 1 .057 1.059l-1.077 1.078a.75.75 0 0 1-1.058-.057l-1.078-1.077a.75.75 0 0 1 .057-1.058l1.077-1.078a.75.75 0 0 1 1.058.057Zm-15 0a.75.75 0 0 1 1.059-.057l1.077 1.078a.75.75 0 1 1-1.058 1.058L3.585 18.446a.75.75 0 0 1-.057-1.059ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                </svg>
                <span className="font-medium">Update Availability</span>
              </button>
              <button onClick={() => navigate("/doctor/records")} className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h.215C7.291 3 8.1 3.518 8.444 4.31a1.288 1.288 0 0 0 2.404 0c.344-.792 1.153-1.31 2.226-1.31h.215a3 3 0 0 1 3 3v2.129a3 3 0 0 1-1-.219V6a1.5 1.5 0 0 0-1.5-1.5h-.215c-1.288 0-2.355.65-2.81 1.626a.75.75 0 0 1-1.48 0C8.565 5.15 7.498 4.5 6.215 4.5H6A1.5 1.5 0 0 0 4.5 6v12a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.129a3 3 0 0 1-1 .219V18a1.5 1.5 0 0 0-1.5-1.5h-2.129a3 3 0 0 1-.219-1H18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 18 4.5h-.215c-1.288 0-2.355.65-2.81 1.626a.75.75 0 0 1-1.48 0c-.455-.976-1.522-1.626-2.81-1.626h-.215A1.5 1.5 0 0 0 6 6v2.129a3 3 0 0 1-1-.219V6Zm6.994 5.25a.75.75 0 1 0-1.488-.255l-3.5 6a.75.75 0 0 0 .759 1.055l.775-.43l1.849 2.034a.75.75 0 0 0 1.135-.084l3-5.25a.75.75 0 1 0-1.299-.75l-2.072 3.626-1.458-1.594Z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Patient Records</span>
              </button>
            </div>
          </div>

          {/* Upcoming Appointments Table */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upcoming Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.user?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.description || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => navigate(`/video-call/${appt._id}`)} className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                            Start Call
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No upcoming appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Patient Notes Section */}
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recent Patient Ratings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ratings.length > 0 ? (
              ratings.slice(0, 2).map((rating) => (
                <div key={rating._id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{rating.user?.name || "Anonymous"}</h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-lg ${i < rating.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {rating.comment && <p className="text-gray-600">{rating.comment}</p>}
                  <p className="text-xs text-gray-400 text-right mt-1">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic text-center col-span-2">No patient ratings yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-500 bg-white shadow-inner mt-12">
        © 2025 HealthMate — Doctor Portal
      </div>
    </div>
  );
};

export default Home;
