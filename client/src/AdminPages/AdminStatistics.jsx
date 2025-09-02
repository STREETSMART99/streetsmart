import React, { useState } from "react";
import "../css/AdminStatistics.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/pfp.png"; // Import the profile picture
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import the reusable Sidebar component

const dataValues = [68, 75, 85, 50];
const labels = ["Crowd Level", "Usage Trends", "Peak Time", "Reports"];
const COLORS = ["#3498db", "#2ecc71", "#f39c12", "#e74c3c"];

const AdminStatistics = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
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


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="statistics" /> {/* Add the reusable Sidebar component */}
      <main className="main-content">
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'black', fontWeight: 'bold', fontSize: '32px' }}>Statistics</h2>
          <div className="admin-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

        <div className="statistics-cards">
          {labels.map((label, index) => {
            const percent = dataValues[index];
            const chartData = [
              { name: "Used", value: percent },
              { name: "Remaining", value: 100 - percent },
            ];

            return (
              <div className="card" key={index}>
                <h3>{label.toUpperCase()}</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={i === 0 ? COLORS[index] : "#ecf0f1"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="card-percent">{percent}%</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminStatistics;
  
