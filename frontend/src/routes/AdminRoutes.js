import { Route } from "react-router-dom";

import AdminHome from "../pages/admin/Home";
import AdminProfilePage from "../pages/admin/adminProfile";

const AdminRoutes = (
  <>
    <Route path="/admin/home" element={<AdminHome />} />
    <Route path="/admin/profile" element={<AdminProfilePage />} />
  </>
);

export default AdminRoutes;
