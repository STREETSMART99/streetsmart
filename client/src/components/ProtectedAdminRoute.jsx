import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider"; // ✅ Correct import

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    console.log("User context is undefined, redirecting...");
    return <Navigate to="/login" />;
  }

  return user.isAdmin ? children : <Navigate to="/dashboard" />;
};

export default ProtectedAdminRoute;