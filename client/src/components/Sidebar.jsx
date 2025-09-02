import React from "react";
import { Link } from "react-router-dom";
import "../css/AdminDashboard.css"; // Reuse the existing CSS for styling

const Sidebar = ({ activePage }) => {
  return (
    <aside className="sidebar">
      <h1 className="logo">Street Smart</h1>
      <p className="role-label">ADMIN</p>
      <ul className="nav-list">
        <li className={`nav-link ${activePage === "dashboard" ? "active-link" : ""}`}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className={`nav-link ${activePage === "statistics" ? "active-link" : ""}`}>
          <Link to="/admin/statistics">Statistics</Link>
        </li>
        <li className={`nav-link ${activePage === "amenities" ? "active-link" : ""}`}>
          <Link to="/admin/amenities">Amenities</Link>
        </li>
        <li className={`nav-link ${activePage === "users-report" ? "active-link" : ""}`}>
          <Link to="/admin/users-report">Users Report</Link>
        </li>
      </ul>
      <div className="settings-icon">⚙️</div>
    </aside>
  );
};

export default Sidebar;