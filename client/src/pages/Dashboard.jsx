
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Dashboard.css";
import pfp from "../assets/pfp.png";
import "leaflet/dist/leaflet.css";
import { FaStar } from "react-icons/fa";

// Helper component to fly to a location when center changes
const FlyToLocation = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 18, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

export default function Dashboard() {
  const [nightMode, setNightMode] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userPhoto, setUserPhoto] = useState(""); // Only photo
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch amenities
    axios
      .get("/api/amenities")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAmenities(data);
        if (data.length > 0 && !selectedLocation) {
          setSelectedLocation(data[0].name); // Select the first amenity by default
        }
      })
      .catch((err) => console.error("Failed to fetch amenities", err));

    // Fetch user photo only
    const fetchUserPhoto = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserPhoto("");
          return;
        }
        const response = await axios.get("https://streetsmart-server.onrender.com/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPhoto(response.data.photo);
      } catch (error) {
        setUserPhoto("");
      }
    };
    fetchUserPhoto();

    // Fetch favorites
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("/api/auth/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data.favorites || []);
    };
    fetchFavorites();
    // eslint-disable-next-line
  }, []);

  const toggleNightMode = () => setNightMode((prev) => !prev);

  const filteredAmenities = Array.isArray(amenities)
    ? amenities.filter((a) =>
        a.name && a.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleFavorite = async (amenityName) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (favorites.includes(amenityName)) {
      // Remove favorite
      const res = await axios.delete("/api/auth/favorites", {
        headers: { Authorization: `Bearer ${token}` },
        data: { amenity: amenityName }
      });
      setFavorites(res.data.favorites);
    } else {
      // Add favorite
      const res = await axios.post("/api/auth/favorites", { amenity: amenityName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data.favorites);
    }
  };

  // Filter amenities with valid location (array of two numbers)
  const validAmenities = amenities.filter(
    a =>
      Array.isArray(a.location) &&
      a.location.length === 2 &&
      typeof a.location[0] === "number" &&
      typeof a.location[1] === "number"
  );

  const selectedAmenity = validAmenities.find(a => a.name === selectedLocation);

  const mapCenter =
    (selectedAmenity && selectedAmenity.location) ||
    (validAmenities.length > 0 && validAmenities[0].location) ||
    [14.589793, 120.981617]; // fallback to Manila city hall

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
                  src={userPhoto ? userPhoto : pfp}
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
              <li></li>
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
              filteredAmenities.map((amenity) => (
                <li
                  key={amenity._id}
                  className={`dashboard__amenity-item ${
                    selectedLocation === amenity.name
                      ? "dashboard__amenity-item--active"
                      : ""
                  }`}
                  onClick={() => setSelectedLocation(amenity.name)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedLocation(amenity.name);
                    }
                  }}
                  role="button"
                  aria-pressed={selectedLocation === amenity.name}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaStar
                      style={{
                        color: favorites.includes(amenity.name) ? "#FFD700" : "#ccc",
                        cursor: "pointer"
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(amenity.name);
                      }}
                      title={favorites.includes(amenity.name) ? "Unfavorite" : "Favorite"}
                    />
                    <div>
                      <p className="dashboard__amenity-title">{amenity.name}</p>
                      <p>{`Description for ${amenity.name}.`}</p>
                    </div>
                  </div>
                  {/* Add View Analytics Button */}
                  <button
                    className="dashboard__view-analytics-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/analytics?amenity=${encodeURIComponent(amenity.name)}`, {
                        state: {
                          amenityDetails: {
                            name: amenity.name,
                            description: amenity.description,
                            services: amenity.services,
                            open: amenity.open,
                            close: amenity.close,
                            cutoff: amenity.cutoff,
                            maxCapacity: amenity.maxCapacity,
                            counter: amenity.counter ?? 0,
                            availability: amenity.availability,
                          }
                        }
                      });
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
        {/* Only render MapContainer if mapCenter is defined */}
        {mapCenter && (
          <MapContainer
            center={mapCenter}
            zoom={15}
            className="dashboard__map-container"
            style={{ height: "100%", width: "100%" }}
          >
            <FlyToLocation center={mapCenter} />

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

            {/* Use amenity locations from the database */}
            {validAmenities.map((amenity) => (
              <Marker key={amenity._id} position={amenity.location}>
                <Popup autoOpen={selectedLocation === amenity.name} autoPan={false}>
                  <strong>{amenity.name}</strong>
                  <br />
                  {amenity.description}
                </Popup>
                {/* Always show the amenity name above the marker */}
                {selectedLocation === amenity.name && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "-30px",
                      transform: "translate(-50%, 0)",
                      background: "white",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    {amenity.name}
                  </div>
                )}
              </Marker>
            ))}
          </MapContainer>
        )}
      </main>
    </div>
  );
}







