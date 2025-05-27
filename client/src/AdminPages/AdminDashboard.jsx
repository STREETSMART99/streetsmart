import React, { useState } from 'react';
import avatar from '../assets/pfp.png';
import "../css/AdminDashboard.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Import the reusable Sidebar component

const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true, // Important to send cookies
        }
      );

      console.log("Logout response:", res.data);

      // Optionally clear localStorage if used for auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="dashboard" /> {/* Add the reusable Sidebar component */}
      <main className="main-content">
        <header className="header">
          <div className="admin-info">
            <div className="profile-dropdown">
              <img
                src={avatar}
                alt="Admin"
                className="avatar"
                onClick={toggleDropdown}
                style={{ cursor: 'pointer' }}
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

        <h2 className="page-title">Dashboard</h2>

        <section className="stats">
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>TOTAL AMENITIES</h3>
            <p style={{ color: 'white' }}>0 Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>AMENITIES OPEN</h3>
            <p style={{ color: 'white' }}>0 Open Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>NEWLY ADDED</h3>
            <p style={{ color: 'white' }}>0 New Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>REVIEW</h3>
            <p style={{ color: 'white' }}>0 For Review</p>
          </div>
        </section>

        <section className="traffic">
          {["Monday", "Tuesday", "Wednesday"].map((day) => (
            <div className="traffic-card" key={day}>
              <p className="label">Foot Traffic Level</p>
              <p className="day">{day}</p>
              <div className="progress-circle"><span>80%</span></div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
