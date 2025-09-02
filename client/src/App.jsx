import "./App.css";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./auth/ForgetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./AdminPages/AdminDashboard";
import AdminAmenities from "./AdminPages/AdminAmenities";
import AdminStatistics from "./AdminPages/AdminStatistics";
import UsersReport from "./AdminPages/UsersReport"; // Add this import
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Amenities from "./pages/Amenities"; 
import Analytics from "./pages/Analytics"; 
import Menu from "./pages/Menu";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Guest from "./pages/Guest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
         <Route path="/guest" element={<Guest />} />

        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/amenities"
          element={
            <ProtectedRoute>
              <Amenities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/amenities"
          element={
            <ProtectedAdminRoute>
              <AdminAmenities />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <ProtectedAdminRoute>
              <AdminStatistics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users-report"
          element={
            <ProtectedAdminRoute>
              <UsersReport />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
