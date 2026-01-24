import { Route } from "react-router-dom";

import Home from "../pages/user/home.js";
import UserProfile from "../pages/user/UserProfile";
import DoctorListPage from "../pages/user/DoctorSearchPage.js";
import AppointmentForm from "../pages/user/Apponinment";
import PaymentPage from "../pages/user/PaymentPage";
import UserDashboardPage from "../pages/user/UserDashboard";
import DoctorProfile from "../pages/user/DoctorProfile";
import RateDoctor from "../pages/user/DoctorRating";

const UserRoutes = (
  <>
    <Route path="/user/home" element={<Home />} />
    <Route path="/user/profile" element={<UserProfile />} />
    <Route path="/doctorlist" element={<DoctorListPage />} />
    <Route path="/book-appointment/:doctorId" element={<AppointmentForm />} />
    <Route path="/rating/:appointmentId" element={<RateDoctor />} />
    <Route path="/user/dashboard" element={<UserDashboardPage />} />
    <Route path="/user/doctorprofile/:doctorId" element={<DoctorProfile />} />
    <Route path="/user/payment" element={<PaymentPage />} />
  </>
);

export default UserRoutes;
