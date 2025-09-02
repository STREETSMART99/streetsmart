import React, { useState, useEffect } from 'react';
import avatar from '../assets/pfp.png';
import "../css/AdminDashboard.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    axios.get("/api/amenities")
      .then(res => setAmenities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAmenities([]));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true, // to send cookies
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

  // Calculate stats
  const totalAmenities = amenities.length;
  const openAmenities = amenities.filter(a => a.isOpen).length;

  // Consider "newly added" as amenities added in the last 24 hours
  const now = new Date();
  const newlyAdded = amenities.filter(a => {
    if (!a.createdAt) return false;
    const created = new Date(a.createdAt);
    return (now - created) < 24 * 60 * 60 * 1000; // last 24 hours
  }).length;

  // For review: you can define your own logic, e.g., amenities with isOpen === false
  const forReview = amenities.filter(a => a.isOpen === false).length;

  return (
    <div className="dashboard">
      <Sidebar activePage="dashboard" />
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
            <p style={{ color: 'white' }}>{totalAmenities} Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>AMENITIES OPEN</h3>
            <p style={{ color: 'white' }}>{openAmenities} Open Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>NEWLY ADDED</h3>
            <p style={{ color: 'white' }}>{newlyAdded} New Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>REVIEW</h3>
            <p style={{ color: 'white' }}>{forReview} For Review</p>
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
