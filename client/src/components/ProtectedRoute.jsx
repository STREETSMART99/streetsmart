import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute: Token found:", token);

  if (!token) {
    console.log("ProtectedRoute: No token found. Redirecting to login...");
    return <Navigate to="/login" />;
  }

  console.log("ProtectedRoute: Token exists. Rendering child component...");
  return children;
};

export default ProtectedRoute;