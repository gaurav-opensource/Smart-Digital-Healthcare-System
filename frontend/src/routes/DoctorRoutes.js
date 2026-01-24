import { Route } from "react-router-dom";

import DoctorHome from "../pages/doctor/home";
import DoctorProfile from "../pages/doctor/Profile";
import EditProfile from "../pages/doctor/EditProfile";
import DoctorDashboardPage from "../pages/doctor/DoctorDashboard";
import AddDoctorCard from "../pages/doctor/AddCard";
import DoctorRatingPage from "../pages/doctor/DoctorRating";

const DoctorRoutes = (
  <>
    <Route path="/doctor/home" element={<DoctorHome />} />
    <Route path="/doctor/profile" element={<DoctorProfile />} />
    <Route path="/doctor/edit-profile" element={<EditProfile />} />
    <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
    <Route path="/doctor/add-card" element={<AddDoctorCard />} />
    <Route path="/rate/:appointmentId/:doctorId" element={<DoctorRatingPage />} />
  </>
);

export default DoctorRoutes;
