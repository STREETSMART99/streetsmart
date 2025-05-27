// src/pages/Amenities.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminAmenities.css";
import avatar from "../assets/pfp.png"; // Import the profile picture
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import the reusable Sidebar component

const AdminAmenities = () => {
  const [amenities, setAmenities] = useState([
    { name: "Plaza Hugo Basketball Court", description: "Outdoor court for public use", availability: "Clear" },
    { name: "Arsenio H. Lacson Public Library", description: "Public reading and reference center", availability: "Clear" },
    { name: "Philippine-Thailand Friendship Circle", description: "Cultural park and gathering space", availability: "Crowded" },
    { name: "Manila DSW District 5/6 Office", description: "Government social welfare office", availability: "Moderate" },
    { name: "Sta. Ana Arts Center", description: "Performing arts and culture center", availability: "Crowded" },
    { name: "Manila City Hall", description: "Main administrative government office", availability: "Moderate" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    availability: "Clear",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true, // Send cookies
        }
      );

      console.log("Logout response:", res.data);

      // Clear localStorage if used for auth
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

  const handleAvailabilityChange = (index, value) => {
    const updated = [...amenities];
    updated[index].availability = value;
    setAmenities(updated);
  };

  const handleAddAmenity = () => {
    if (!formData.name || !formData.description) return;
    setAmenities([...amenities, formData]);
    resetModal();
  };

  const handleDelete = (index) => {
    const updated = amenities.filter((_, i) => i !== index);
    setAmenities(updated);
  };

  const handleEditClick = (index) => {
    setFormData(amenities[index]);
    setCurrentIndex(index);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    const updated = [...amenities];
    updated[currentIndex] = formData;
    setAmenities(updated);
    resetModal();
  };

  const resetModal = () => {
    setFormData({ name: "", description: "", availability: "Clear" });
    setCurrentIndex(null);
    setModalMode("add");
    setShowModal(false);
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="amenities" /> {/* Add the reusable Sidebar component */}
      <div className="main-content">
        <div className="top-bar">
          <input className="search-bar" type="text" placeholder="Search for Amenity" />
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

        <h1 className="section-title">Amenities</h1>

        <div className="amenities-controls">
          <button className="add-btn" onClick={() => setShowModal(true)}>Add</button>
        </div>

        <table className="amenities-table">
          <thead>
            <tr>
              <th>Amenity</th>
              <th>Description</th>
              <th>Availability</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {amenities.map((amenity, index) => (
              <tr key={index}>
                <td>{amenity.name}</td>
                <td>{amenity.description}</td>
                <td>
                  <select
                    value={amenity.availability}
                    onChange={(e) => handleAvailabilityChange(index, e.target.value)}
                  >
                    <option value="Clear">🟢 Clear</option>
                    <option value="Moderate">🟡 Moderate</option>
                    <option value="Crowded">🔴 Crowded</option>
                  </select>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h2>{modalMode === "edit" ? "Edit Amenity" : "Add New Amenity"}</h2>
              <input
                type="text"
                placeholder="Amenity Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="Clear">🟢 Clear</option>
                <option value="Moderate">🟡 Moderate</option>
                <option value="Crowded">🔴 Crowded</option>
              </select>
              <div className="modal-buttons">
                {modalMode === "edit" ? (
                  <button className="add-btn" onClick={handleSaveEdit}>Save</button>
                ) : (
                  <button className="add-btn" onClick={handleAddAmenity}>Add</button>
                )}
                <button className="delete-btn" onClick={resetModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAmenities;

