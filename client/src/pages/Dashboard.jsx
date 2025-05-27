import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Dashboard.css";
import logo from "../assets/pfp.png";
import "leaflet/dist/leaflet.css";

const locations = {
  "Manila city hall": [14.589793, 120.981617],
  "Plaza Hugo Basketball Court and Theater": [14.5886, 120.9812],
  "Philippines-Thailand Friendship Circle": [14.5833, 120.9876],
  "MDSW District V & VI Office": [14.5891, 120.9753],
  "Sta Ana Art Center": [14.5789, 120.9871],
};


const FlyToLocation = ({ center }) => {
  const map = useMap();
  map.flyTo(center, 18, { duration: 1.5 }); 
  return null;
};

export default function Dashboard() {
  const [nightMode, setNightMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Manila city hall");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleNightMode = () => setNightMode((prev) => !prev);

  const filteredAmenities = Object.keys(locations).filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true, // Send cookies
      });
      localStorage.removeItem("user"); // Optional: if you store user info in localStorage
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      Swal.fire({
        title: "Logout Failed",
        text: err.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className={`dashboard ${nightMode ? "dashboard--night" : ""}`}>
      <aside className="dashboard__sidebar">
        <div>
          <header className="dashboard__header">
            <h1 className="dashboard__title">Street Smart</h1>
            <div className="dashboard__dropdown-wrapper">
              <button className="dashboard__dropdown-toggle" aria-label="User Menu">
                <img
                  alt="User profile"
                  className="dashboard__avatar"
                  height="40"
                  src={logo}
                  width="40"
                />
              </button>
              <div className="dashboard__dropdown-menu">
                <Link to="/menu" className="dashboard__dropdown-item">Profile</Link>
                <Link to="/UserSettings" className="dashboard__dropdown-item">Settings</Link>
                <button onClick={handleLogout} className="dashboard__dropdown-item">
                  Logout
                </button>
              </div>
            </div>
          </header>

          <nav className="dashboard__nav">
            <ul>
              <li>
              </li>
              <li>
                <Link to="/analytics" className="dashboard__nav-link">
                  Analytics
                </Link>
              </li>
            </ul>
          </nav>

          <form
            className="dashboard__search-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="search">
              Search for Amenity
            </label>
            <div className="dashboard__search-wrapper">
              <input
                id="search"
                type="search"
                placeholder="Search for Amenity"
                className="dashboard__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
            </div>
          </form>

          <ul id="amenities" className="dashboard__amenity-list">
            {filteredAmenities.length > 0 ? (
              filteredAmenities.map((name) => (
                <li
                  key={name}
                  className={`dashboard__amenity-item ${
                    selectedLocation === name ? "dashboard__amenity-item--active" : ""
                  }`}
                  onClick={() => setSelectedLocation(name)} // Update selected location
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedLocation(name);
                    }
                  }}
                  role="button"
                  aria-pressed={selectedLocation === name}
                >
                  <div>
                    <p className="dashboard__amenity-title">{name}</p>
                    <p>{`Description for ${name}.`}</p>
                  </div>
                  {/* Add View Analytics Button */}
                  <button
                    className="dashboard__view-analytics-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click
                      navigate(`/analytics?amenity=${name}`);
                    }}
                  >
                    View 
                  </button>
                </li>
              ))
            ) : (
              <li className="dashboard__no-results">No amenities found.</li>
            )}
          </ul>
        </div>

        <div>
          <hr className="dashboard__divider" />
          <label
            htmlFor="night-mode"
            className="dashboard__night-mode-label"
            title="Toggle Night Mode"
          >
            <div className="dashboard__toggle-wrapper">
              <input
                id="night-mode"
                type="checkbox"
                className="dashboard__toggle-input"
                checked={nightMode}
                onChange={toggleNightMode}
              />
              <div className="dashboard__toggle-bg"></div>
              <div className="dashboard__toggle-circle"></div>
            </div>
            <span>Night Mode</span>
          </label>
        </div>
      </aside>

      <main className="dashboard__main-content">
        <MapContainer
          center={locations[selectedLocation]}
          zoom={15}
          className="dashboard__map-container"
          style={{ height: "100%", width: "100%" }}
        >
          {/* Fly to the selected location */}
          <FlyToLocation center={locations[selectedLocation]} />

          {/* Use a different tile layer for night mode */}
          <TileLayer
            url={
              nightMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={
              nightMode
                ? '&copy; <a href="https://carto.com/">CARTO</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          {Object.entries(locations).map(([name, position]) => (
            <Marker key={name} position={position}>
              <Popup>{name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}


