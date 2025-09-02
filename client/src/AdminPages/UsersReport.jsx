import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import avatar from "../assets/pfp.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AdminDashboard.css";

const UsersReport = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="dashboard">
      <Sidebar activePage="users-report" />
      <main className="main-content">
        <header className="header">
          <div className="admin-info">
            <div className="profile-dropdown">
              <img
                src={avatar}
                alt="Admin"
                className="avatar"
                onClick={toggleDropdown}
                style={{ cursor: "pointer" }}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>
        <h2 className="page-title" style={{ fontWeight: "bold" }}>
          Users Report
        </h2>
      </main>
    </div>
  );
};

export default UsersReport;