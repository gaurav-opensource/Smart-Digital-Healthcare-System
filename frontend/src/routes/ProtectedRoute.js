import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");  // role should be: "user", "doctor", "admin"
 

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If children exist → render layout
  return children ? children : <Outlet />;
};


export default ProtectedRoute;
