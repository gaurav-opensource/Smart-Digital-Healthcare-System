import { Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import NotFound from "../pages/NotFoundPage";
import DiseasePredictPage from "../pages/DiseasePredictPage";
import VideoMeetComponent from "../socket/VidoesCall";


const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/predict" element={<DiseasePredictPage />} />
    <Route path="/video-call/:appointmentId" element={<VideoMeetComponent />} />
    <Route path="*" element={<NotFound />} />
    <Route path="/predict" element={<DiseasePredictPage/>} />
  </>
);

export default PublicRoutes;
