import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import MainLayout from "./layouts/MainLayout";

// Routes
import PublicRoutes from "./routes/PublicRoutes";
import UserRoutes from "./routes/UserRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import ServicePage from "./components/ServicePage";
import AboutPage from "./components/AboutPage";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        {PublicRoutes}
      </Route>

      {/* USER ROUTES */}
      <Route
        element={
          <ProtectedRoute role="user">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {UserRoutes}
        <Route path="/service" element={<ServicePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* DOCTOR ROUTES */}
      <Route
        element={
          <ProtectedRoute role="doctor">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {DoctorRoutes}
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {AdminRoutes}
      </Route>

    </Routes>
  );
}

export default App;
