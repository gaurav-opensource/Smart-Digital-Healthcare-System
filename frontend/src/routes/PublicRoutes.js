import { Route } from "react-router-dom";

// Importing all public page components
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import NotFound from "../pages/NotFoundPage";
import RiskPredictPage from "../pages/RiskPredictPage";
import VideoMeetComponent from "../socket/VidoesCall";
import RecommendBestDoctor from "../pages/RecommendbestDoctor";


const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/doctors" element={<RecommendBestDoctor />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/predict" element={<RiskPredictPage />} />
    <Route path="/video-call/:appointmentId" element={<VideoMeetComponent />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default PublicRoutes;
