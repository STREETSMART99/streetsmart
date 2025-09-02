// // src/pages/Amenities.js

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/AdminAmenities.css";
// import avatar from "../assets/pfp.png";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// // Fix default marker icon for leaflet in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const DEFAULT_CENTER = [14.589793, 120.981617];

// function LocationPicker({ setFormData }) {
//   useMapEvents({
//     click(e) {
//       setFormData((prev) => ({
//         ...prev,
//         latitude: e.latlng.lat,
//         longitude: e.latlng.lng,
//       }));
//     },
//   });
//   return null;
// }

// const AdminAmenities = () => {
//   const [amenities, setAmenities] = useState([]);
//   const [search, setSearch] = useState(""); // <-- Add this line
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("add");
//   const [currentAmenity, setCurrentAmenity] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     availability: "Clear",
//     latitude: "",
//     longitude: "",
//     isOpen: true,
//     open: "",
//     close: "",
//     cutoff: "",
//     maxCapacity: "",
//     services: "",
//   });
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   // Fetch amenities from backend
//   useEffect(() => {
//     const fetchAmenities = () => {
//       axios.get("/api/amenities")
//         .then(res => {
//           const data = Array.isArray(res.data) ? res.data : [];
//           setAmenities(data);
//         })
//         .catch(err => {
//           setAmenities([]);
//         });
//     };
//     fetchAmenities();
//     const interval = setInterval(fetchAmenities, 5000); // poll every 5s
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post("/api/auth/logout", {}, { withCredentials: true });
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     } catch (error) {
//       alert("Logout failed. Please try again.");
//     }
//   };

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   const handleAvailabilityChange = (index, value) => {
//     const amenity = amenities[index];
//     axios.put(`/api/amenities/${amenity._id}`, { ...amenity, availability: value })
//       .then(res => {
//         const updated = [...amenities];
//         updated[index] = res.data;
//         setAmenities(updated);
//       });
//   };

//   const handleAddAmenity = async () => {
//     if (
//       !formData.name ||
//       !formData.description ||
//       formData.latitude === "" ||
//       formData.longitude === "" ||
//       isNaN(parseFloat(formData.latitude)) ||
//       isNaN(parseFloat(formData.longitude))
//     ) {
//       alert("Please fill in all fields and provide valid coordinates.");
//       return;
//     }
//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         availability: formData.availability,
//         location: [
//           parseFloat(formData.latitude),
//           parseFloat(formData.longitude)
//         ],
//         isOpen: formData.isOpen,
//         open: formData.open,
//         close: formData.close,
//         cutoff: formData.cutoff,
//         counter: 0, // Always send counter for new amenities
//         maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
//         services: formData.services
//           ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
//           : [],
//       };
//       const res = await axios.post("/api/amenities", payload);
//       console.log("POST /api/amenities response:", res.data);
//       setAmenities([...amenities, res.data]);
//       resetModal();
//     } catch (err) {
//       alert("Failed to add amenity.");
//     }
//   };

//   const handleDelete = async (index) => {
//     const amenity = amenities[index];
//     try {
//       await axios.delete(`/api/amenities/${amenity._id}`);
//       setAmenities(amenities.filter((_, i) => i !== index));
//     } catch (err) {
//       alert("Failed to delete amenity.");
//     }
//   };

//   const handleEditClick = (index) => {
//     const amenity = amenities[index];
//     let latitude = "";
//     let longitude = "";
//     if (
//       Array.isArray(amenity.location) &&
//       amenity.location.length === 2
//     ) {
//       latitude = String(amenity.location[0] ?? "");
//       longitude = String(amenity.location[1] ?? "");
//     }
//     setCurrentAmenity(amenity);
//     setFormData({
//       name: amenity.name || "",
//       description: amenity.description || "",
//       availability: amenity.availability || "Clear",
//       latitude,
//       longitude,
//       isOpen: amenity.isOpen ?? true,
//       open: amenity.open ?? "",
//       close: amenity.close ?? "",
//       cutoff: amenity.cutoff ?? "",
//       maxCapacity: amenity.maxCapacity ?? "",
//       services: (amenity.services || []).join(", "),
//     });
//     setModalMode("edit");
//     setShowModal(true);
//   };

//   const handleSaveEdit = async () => {
//     if (
//       !formData.name ||
//       !formData.description ||
//       formData.latitude === "" ||
//       formData.longitude === "" ||
//       isNaN(parseFloat(formData.latitude)) ||
//       isNaN(parseFloat(formData.longitude))
//     ) {
//       alert("Please fill in all fields and provide valid coordinates.");
//       return;
//     }
//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         availability: formData.availability,
//         location: [
//           parseFloat(formData.latitude),
//           parseFloat(formData.longitude)
//         ],
//         isOpen: formData.isOpen,
//         open: formData.open,
//         close: formData.close,
//         cutoff: formData.cutoff,
//         counter: currentAmenity.counter ?? 0, // Preserve counter on edit
//         maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
//         services: formData.services
//           ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
//           : [],
//       };
//       const res = await axios.put(`/api/amenities/${currentAmenity._id}`, payload);
//       setAmenities(amenities.map(a => a._id === currentAmenity._id ? res.data : a));
//       resetModal();
//     } catch (err) {
//       alert("Failed to update amenity.");
//     }
//   };

//   const resetModal = () => {
//     setFormData({
//       name: "",
//       description: "",
//       availability: "Clear",
//       latitude: "",
//       longitude: "",
//       isOpen: true,
//       open: "",
//       close: "",
//       cutoff: "",
//       maxCapacity: "",
//       services: "",
//     });
//     setCurrentAmenity(null);
//     setModalMode("add");
//     setShowModal(false);
//   };

//   // Filter amenities based on search
//   const filteredAmenities = amenities.filter(a =>
//    (a.name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="dashboard">
//       <Sidebar activePage="amenities" />
//       <div className="main-content">
//         <div className="top-bar">
//           <input
//             className="search-bar"
//             type="text"
//             placeholder="Search for Amenity"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//           <div className="profile-dropdown">
//             <img
//               src={avatar}
//               alt="Admin"
//               className="avatar"
//               onClick={toggleDropdown}
//               style={{ cursor: "pointer" }}
//             />
//             {dropdownOpen && (
//               <div className="dropdown-menu">
//                 <p className="dropdown-item" onClick={handleLogout}>
//                   Logout
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <h1 className="section-title">Amenities</h1>

//         <div className="amenities-controls">
//           <button className="add-btn" onClick={() => setShowModal(true)}>Add</button>
//         </div>

//         <table className="amenities-table">
//           <thead>
//             <tr>
//               <th>Amenity</th>
//               <th>Description</th>
//               <th>Availability</th>
//               <th>Status</th>
//               <th>Open</th>
//               <th>Close</th>
//               <th>Cutoff</th>
//               <th>Live Counter</th>
//               <th>Max Capacity</th>
//               <th>Services</th>
//               <th>Edit/Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAmenities.map((amenity, index) => (
//               <tr key={amenity._id}>
//                 <td>{amenity.name}</td>
//                 <td>{amenity.description}</td>
//                 <td>
//                   <select
//                     value={amenity.availability}
//                     onChange={(e) => handleAvailabilityChange(index, e.target.value)}
//                   >
//                     <option value="Clear">🟢 Clear</option>
//                     <option value="Moderate">🟡 Moderate</option>
//                     <option value="Crowded">🔴 Crowded</option>
//                   </select>
//                 </td>
//                 <td>{amenity.isOpen ? "Open" : "Closed"}</td>
//                 <td>{amenity.open}</td>
//                 <td>{amenity.close}</td>
//                 <td>{amenity.cutoff}</td>
//                 <td>
//                   {amenity.counter ?? 0}
//                 </td>
//                 <td>{amenity.maxCapacity}</td>
//                 <td>{Array.isArray(amenity.services) ? amenity.services.join(", ") : amenity.services || ""}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEditClick(index)}>Edit</button>
//                   <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {showModal && (
//           <div className="modal-backdrop">
//             <div className="modal-content">
//               <div className="modal-form-fields">
//                 <h2>{modalMode === "edit" ? "Edit Amenity" : "Add New Amenity"}</h2>
//                 <input
//                   type="text"
//                   placeholder="Amenity Name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Latitude"
//                   value={formData.latitude || ""}
//                   onChange={e => setFormData({ ...formData, latitude: e.target.value })}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Longitude"
//                   value={formData.longitude || ""}
//                   onChange={e => setFormData({ ...formData, longitude: e.target.value })}
//                 />
//                 <label>
//                   Status:
//                   <select
//                     value={formData.isOpen ? "open" : "closed"}
//                     onChange={e => setFormData({ ...formData, isOpen: e.target.value === "open" })}
//                   >
//                     <option value="open">Open</option>
//                     <option value="closed">Closed</option>
//                   </select>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Open Time (e.g. 8:00 AM)"
//                   value={formData.open}
//                   onChange={e => setFormData({ ...formData, open: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Close Time (e.g. 5:00 PM)"
//                   value={formData.close}
//                   onChange={e => setFormData({ ...formData, close: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Cutoff (e.g. 4:30 PM)"
//                   value={formData.cutoff}
//                   onChange={e => setFormData({ ...formData, cutoff: e.target.value })}
//                 />

//                 {/* Map Picker */}
//                 <div style={{ margin: "1rem 0" }}>
//                   <MapContainer
//                     center={[
//                       formData.latitude ? parseFloat(formData.latitude) : DEFAULT_CENTER[0],
//                       formData.longitude ? parseFloat(formData.longitude) : DEFAULT_CENTER[1],
//                     ]}
//                     zoom={15}
//                     style={{ height: "180px", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <LocationPicker setFormData={setFormData} />
//                     {formData.latitude && formData.longitude && (
//                       <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
//                     )}
//                   </MapContainer>
//                   <small>Click on the map to set latitude and longitude.</small>
//                 </div>

//                 <select
//                   value={formData.availability}
//                   onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
//                 >
//                   <option value="Clear">🟢 Clear</option>
//                   <option value="Moderate">🟡 Moderate</option>
//                   <option value="Crowded">🔴 Crowded</option>
//                 </select>
//                 <input
//                   type="number"
//                   placeholder="Max Capacity"
//                   value={formData.maxCapacity}
//                   onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Services (comma separated, e.g. Wi-Fi, Restrooms)"
//                   value={formData.services}
//                   onChange={e => setFormData({ ...formData, services: e.target.value })}
//                 />
//                 <div className="modal-buttons">
//                   {modalMode === "edit" ? (
//                     <button className="add-btn" onClick={handleSaveEdit}>Save</button>
//                   ) : (
//                     <button className="add-btn" onClick={handleAddAmenity}>Add</button>
//                   )}
//                   <button className="delete-btn" onClick={resetModal}>Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAmenities;

/////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/AdminAmenities.css";
// import avatar from "../assets/pfp.png";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// // Fix default marker icon for leaflet in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const DEFAULT_CENTER = [14.589793, 120.981617];
// const BASE_URL = "https://streetsmart-server.onrender.com";

// function LocationPicker({ setFormData }) {
//   useMapEvents({
//     click(e) {
//       setFormData((prev) => ({
//         ...prev,
//         latitude: e.latlng.lat,
//         longitude: e.latlng.lng,
//       }));
//     },
//   });
//   return null;
// }

// const AdminAmenities = () => {
//   const [amenities, setAmenities] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("add");
//   const [currentAmenity, setCurrentAmenity] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     availability: "Clear",
//     latitude: "",
//     longitude: "",
//     isOpen: true,
//     open: "",
//     close: "",
//     cutoff: "",
//     maxCapacity: "",
//     services: "",
//   });
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   // Fetch amenities from backend
//   useEffect(() => {
//     const fetchAmenities = () => {
//       axios.get(`${BASE_URL}/api/amenities`)
//         .then(res => {
//           console.log("GET /api/amenities response:", res.data);
//           const data = Array.isArray(res.data) ? res.data : [];
//           setAmenities(data);
//         })
//         .catch(err => {
//           console.error("GET /api/amenities error:", err);
//           setAmenities([]);
//         });
//     };
//     fetchAmenities();
//     const interval = setInterval(fetchAmenities, 5000); // poll every 5s
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert("Logout failed. Please try again.");
//     }
//   };

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   const handleAvailabilityChange = (index, value) => {
//     const amenity = amenities[index];
//     axios.put(`${BASE_URL}/api/amenities/${amenity._id}`, { ...amenity, availability: value })
//       .then(res => {
//         const updated = [...amenities];
//         updated[index] = res.data;
//         setAmenities(updated);
//       })
//       .catch(err => {
//         console.error("PUT /api/amenities error:", err);
//       });
//   };

//   const handleAddAmenity = async () => {
//     if (
//       !formData.name ||
//       !formData.description ||
//       formData.latitude === "" ||
//       formData.longitude === "" ||
//       isNaN(parseFloat(formData.latitude)) ||
//       isNaN(parseFloat(formData.longitude))
//     ) {
//       alert("Please fill in all fields and provide valid coordinates.");
//       return;
//     }
//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         availability: formData.availability,
//         location: [
//           parseFloat(formData.latitude),
//           parseFloat(formData.longitude)
//         ],
//         isOpen: formData.isOpen,
//         open: formData.open,
//         close: formData.close,
//         cutoff: formData.cutoff,
//         counter: 0,
//         maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
//         services: formData.services
//           ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
//           : [],
//       };
//       const res = await axios.post(`${BASE_URL}/api/amenities`, payload);
//       console.log("POST /api/amenities response:", res.data);
//       setAmenities([...amenities, res.data]);
//       resetModal();
//     } catch (err) {
//       console.error("POST /api/amenities error:", err);
//       alert("Failed to add amenity.");
//     }
//   };

//   const handleDelete = async (index) => {
//     const amenity = amenities[index];
//     try {
//       await axios.delete(`${BASE_URL}/api/amenities/${amenity._id}`);
//       setAmenities(amenities.filter((_, i) => i !== index));
//     } catch (err) {
//       console.error("DELETE /api/amenities error:", err);
//       alert("Failed to delete amenity.");
//     }
//   };

//   const handleEditClick = (index) => {
//     const amenity = amenities[index];
//     let latitude = "";
//     let longitude = "";
//     if (
//       Array.isArray(amenity.location) &&
//       amenity.location.length === 2
//     ) {
//       latitude = String(amenity.location[0] ?? "");
//       longitude = String(amenity.location[1] ?? "");
//     }
//     setCurrentAmenity(amenity);
//     setFormData({
//       name: amenity.name || "",
//       description: amenity.description || "",
//       availability: amenity.availability || "Clear",
//       latitude,
//       longitude,
//       isOpen: amenity.isOpen ?? true,
//       open: amenity.open ?? "",
//       close: amenity.close ?? "",
//       cutoff: amenity.cutoff ?? "",
//       maxCapacity: amenity.maxCapacity ?? "",
//       services: (amenity.services || []).join(", "),
//     });
//     setModalMode("edit");
//     setShowModal(true);
//   };

//   const handleSaveEdit = async () => {
//     if (
//       !formData.name ||
//       !formData.description ||
//       formData.latitude === "" ||
//       formData.longitude === "" ||
//       isNaN(parseFloat(formData.latitude)) ||
//       isNaN(parseFloat(formData.longitude))
//     ) {
//       alert("Please fill in all fields and provide valid coordinates.");
//       return;
//     }
//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         availability: formData.availability,
//         location: [
//           parseFloat(formData.latitude),
//           parseFloat(formData.longitude)
//         ],
//         isOpen: formData.isOpen,
//         open: formData.open,
//         close: formData.close,
//         cutoff: formData.cutoff,
//         counter: currentAmenity.counter ?? 0,
//         maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
//         services: formData.services
//           ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
//           : [],
//       };
//       const res = await axios.put(`${BASE_URL}/api/amenities/${currentAmenity._id}`, payload);
//       setAmenities(amenities.map(a => a._id === currentAmenity._id ? res.data : a));
//       resetModal();
//     } catch (err) {
//       console.error("PUT /api/amenities error:", err);
//       alert("Failed to update amenity.");
//     }
//   };

//   const resetModal = () => {
//     setFormData({
//       name: "",
//       description: "",
//       availability: "Clear",
//       latitude: "",
//       longitude: "",
//       isOpen: true,
//       open: "",
//       close: "",
//       cutoff: "",
//       maxCapacity: "",
//       services: "",
//     });
//     setCurrentAmenity(null);
//     setModalMode("add");
//     setShowModal(false);
//   };

//   // Filter amenities based on search
//   const filteredAmenities = amenities.filter(a =>
//     (a.name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="dashboard">
//       <Sidebar activePage="amenities" />
//       <div className="main-content">
//         <div className="top-bar">
//           <input
//             className="search-bar"
//             type="text"
//             placeholder="Search for Amenity"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//           <div className="profile-dropdown">
//             <img
//               src={avatar}
//               alt="Admin"
//               className="avatar"
//               onClick={toggleDropdown}
//               style={{ cursor: "pointer" }}
//             />
//             {dropdownOpen && (
//               <div className="dropdown-menu">
//                 <p className="dropdown-item" onClick={handleLogout}>
//                   Logout
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <h1 className="section-title">Amenities</h1>

//         <div className="amenities-controls">
//           <button className="add-btn" onClick={() => setShowModal(true)}>Add</button>
//         </div>

//         <table className="amenities-table">
//           <thead>
//             <tr>
//               <th>Amenity</th>
//               <th>Description</th>
//               <th>Availability</th>
//               <th>Status</th>
//               <th>Open</th>
//               <th>Close</th>
//               <th>Cutoff</th>
//               <th>Live Counter</th>
//               <th>Max Capacity</th>
//               <th>Services</th>
//               <th>Edit/Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAmenities.map((amenity, index) => (
//               <tr key={amenity._id}>
//                 <td>{amenity.name}</td>
//                 <td>{amenity.description}</td>
//                 <td>
//                   <select
//                     value={amenity.availability}
//                     onChange={(e) => handleAvailabilityChange(index, e.target.value)}
//                   >
//                     <option value="Clear">🟢 Clear</option>
//                     <option value="Moderate">🟡 Moderate</option>
//                     <option value="Crowded">🔴 Crowded</option>
//                   </select>
//                 </td>
//                 <td>{amenity.isOpen ? "Open" : "Closed"}</td>
//                 <td>{amenity.open}</td>
//                 <td>{amenity.close}</td>
//                 <td>{amenity.cutoff}</td>
//                 <td>
//                   {amenity.counter ?? 0}
//                 </td>
//                 <td>{amenity.maxCapacity}</td>
//                 <td>{Array.isArray(amenity.services) ? amenity.services.join(", ") : amenity.services || ""}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEditClick(index)}>Edit</button>
//                   <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {showModal && (
//           <div className="modal-backdrop">
//             <div className="modal-content">
//               <div className="modal-form-fields">
//                 <h2>{modalMode === "edit" ? "Edit Amenity" : "Add New Amenity"}</h2>
//                 <input
//                   type="text"
//                   placeholder="Amenity Name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Latitude"
//                   value={formData.latitude || ""}
//                   onChange={e => setFormData({ ...formData, latitude: e.target.value })}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Longitude"
//                   value={formData.longitude || ""}
//                   onChange={e => setFormData({ ...formData, longitude: e.target.value })}
//                 />
//                 <label>
//                   Status:
//                   <select
//                     value={formData.isOpen ? "open" : "closed"}
//                     onChange={e => setFormData({ ...formData, isOpen: e.target.value === "open" })}
//                   >
//                     <option value="open">Open</option>
//                     <option value="closed">Closed</option>
//                   </select>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Open Time (e.g. 8:00 AM)"
//                   value={formData.open}
//                   onChange={e => setFormData({ ...formData, open: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Close Time (e.g. 5:00 PM)"
//                   value={formData.close}
//                   onChange={e => setFormData({ ...formData, close: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Cutoff (e.g. 4:30 PM)"
//                   value={formData.cutoff}
//                   onChange={e => setFormData({ ...formData, cutoff: e.target.value })}
//                 />

//                 {/* Map Picker */}
//                 <div style={{ margin: "1rem 0" }}>
//                   <MapContainer
//                     center={[
//                       formData.latitude ? parseFloat(formData.latitude) : DEFAULT_CENTER[0],
//                       formData.longitude ? parseFloat(formData.longitude) : DEFAULT_CENTER[1],
//                     ]}
//                     zoom={15}
//                     style={{ height: "180px", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <LocationPicker setFormData={setFormData} />
//                     {formData.latitude && formData.longitude && (
//                       <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
//                     )}
//                   </MapContainer>
//                   <small>Click on the map to set latitude and longitude.</small>
//                 </div>

//                 <select
//                   value={formData.availability}
//                   onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
//                 >
//                   <option value="Clear">🟢 Clear</option>
//                   <option value="Moderate">🟡 Moderate</option>
//                   <option value="Crowded">🔴 Crowded</option>
//                 </select>
//                 <input
//                   type="number"
//                   placeholder="Max Capacity"
//                   value={formData.maxCapacity}
//                   onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Services (comma separated, e.g. Wi-Fi, Restrooms)"
//                   value={formData.services}
//                   onChange={e => setFormData({ ...formData, services: e.target.value })}
//                 />
//                 <div className="modal-buttons">
//                   {modalMode === "edit" ? (
//                     <button className="add-btn" onClick={handleSaveEdit}>Save</button>
//                   ) : (
//                     <button className="add-btn" onClick={handleAddAmenity}>Add</button>
//                   )}
//                   <button className="delete-btn" onClick={resetModal}>Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAmenities;

///////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminAmenities.css";
import avatar from "../assets/pfp.png";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon for leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [14.589793, 120.981617];
const BASE_URL = "https://streetsmart-server.onrender.com";

function LocationPicker({ setFormData }) {
  useMapEvents({
    click(e) {
      setFormData((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    },
  });
  return null;
}

const AdminAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentAmenity, setCurrentAmenity] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    availability: "Clear",
    latitude: "",
    longitude: "",
    isOpen: true,
    open: "",
    close: "",
    cutoff: "",
    maxCapacity: "",
    services: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch amenities from backend
  useEffect(() => {
    const fetchAmenities = () => {
      axios.get(`${BASE_URL}/api/amenities`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [];
          setAmenities(data);
        })
        .catch(() => setAmenities([]));
    };
    fetchAmenities();
    const interval = setInterval(fetchAmenities, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleAvailabilityChange = (index, value) => {
    const amenity = amenities[index];
    axios.put(`${BASE_URL}/api/amenities/${amenity._id}`, { ...amenity, availability: value })
      .then(res => {
        const updated = [...amenities];
        updated[index] = res.data;
        setAmenities(updated);
      })
      .catch(() => {});
  };

  const handleAddAmenity = async () => {
    if (
      !formData.name ||
      !formData.description ||
      formData.latitude === "" ||
      formData.longitude === "" ||
      isNaN(parseFloat(formData.latitude)) ||
      isNaN(parseFloat(formData.longitude))
    ) {
      alert("Please fill in all fields and provide valid coordinates.");
      return;
    }
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        availability: formData.availability,
        location: [
          parseFloat(formData.latitude),
          parseFloat(formData.longitude)
        ],
        isOpen: formData.isOpen,
        open: formData.open,
        close: formData.close,
        cutoff: formData.cutoff,
        counter: 0,
        maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
        services: formData.services
          ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      };
      const res = await axios.post(`${BASE_URL}/api/amenities`, payload);
      setAmenities([...amenities, res.data]);
      resetModal();
    } catch {
      alert("Failed to add amenity.");
    }
  };

  const handleDelete = async (index) => {
    const amenity = amenities[index];
    try {
      await axios.delete(`${BASE_URL}/api/amenities/${amenity._id}`);
      setAmenities(amenities.filter((_, i) => i !== index));
    } catch {
      alert("Failed to delete amenity.");
    }
  };

  const handleEditClick = (index) => {
    const amenity = amenities[index];
    let latitude = "";
    let longitude = "";
    if (
      Array.isArray(amenity.location) &&
      amenity.location.length === 2
    ) {
      latitude = String(amenity.location[0] ?? "");
      longitude = String(amenity.location[1] ?? "");
    }
    setCurrentAmenity(amenity);
    setFormData({
      name: amenity.name || "",
      description: amenity.description || "",
      availability: amenity.availability || "Clear",
      latitude,
      longitude,
      isOpen: amenity.isOpen ?? true,
      open: amenity.open ?? "",
      close: amenity.close ?? "",
      cutoff: amenity.cutoff ?? "",
      maxCapacity: amenity.maxCapacity ?? "",
      services: (amenity.services || []).join(", "),
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      formData.latitude === "" ||
      formData.longitude === "" ||
      isNaN(parseFloat(formData.latitude)) ||
      isNaN(parseFloat(formData.longitude))
    ) {
      alert("Please fill in all fields and provide valid coordinates.");
      return;
    }
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        availability: formData.availability,
        location: [
          parseFloat(formData.latitude),
          parseFloat(formData.longitude)
        ],
        isOpen: formData.isOpen,
        open: formData.open,
        close: formData.close,
        cutoff: formData.cutoff,
        counter: currentAmenity.counter ?? 0,
        maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
        services: formData.services
          ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      };
      const res = await axios.put(`${BASE_URL}/api/amenities/${currentAmenity._id}`, payload);
      setAmenities(amenities.map(a => a._id === currentAmenity._id ? res.data : a));
      resetModal();
    } catch {
      alert("Failed to update amenity.");
    }
  };

  const resetModal = () => {
    setFormData({
      name: "",
      description: "",
      availability: "Clear",
      latitude: "",
      longitude: "",
      isOpen: true,
      open: "",
      close: "",
      cutoff: "",
      maxCapacity: "",
      services: "",
    });
    setCurrentAmenity(null);
    setModalMode("add");
    setShowModal(false);
  };

  // Filter amenities based on search
  const filteredAmenities = amenities.filter(a =>
    (a.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar activePage="amenities" />
      <div className="main-content">
        <div className="top-bar">
          <input
            className="search-bar"
            type="text"
            placeholder="Search for Amenity"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
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
              <th>Status</th>
              <th>Open</th>
              <th>Close</th>
              <th>Cutoff</th>
              <th>Live Counter</th>
              <th>Max Capacity</th>
              <th>Services</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmenities.map((amenity, index) => (
              <tr key={amenity._id}>
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
                <td>{amenity.isOpen ? "Open" : "Closed"}</td>
                <td>{amenity.open}</td>
                <td>{amenity.close}</td>
                <td>{amenity.cutoff}</td>
                <td>
                  {amenity.counter ?? 0}
                </td>
                <td>{amenity.maxCapacity}</td>
                <td>{Array.isArray(amenity.services) ? amenity.services.join(", ") : amenity.services || ""}</td>
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
              <div className="modal-form-fields">
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
                <input
                  type="number"
                  placeholder="Latitude"
                  value={formData.latitude || ""}
                  onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={formData.longitude || ""}
                  onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                />
                <label>
                  Status:
                  <select
                    value={formData.isOpen ? "open" : "closed"}
                    onChange={e => setFormData({ ...formData, isOpen: e.target.value === "open" })}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <input
                  type="text"
                  placeholder="Open Time (e.g. 8:00 AM)"
                  value={formData.open}
                  onChange={e => setFormData({ ...formData, open: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Close Time (e.g. 5:00 PM)"
                  value={formData.close}
                  onChange={e => setFormData({ ...formData, close: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Cutoff (e.g. 4:30 PM)"
                  value={formData.cutoff}
                  onChange={e => setFormData({ ...formData, cutoff: e.target.value })}
                />

                {/* Map Picker */}
                <div style={{ margin: "1rem 0" }}>
                  <MapContainer
                    center={[
                      formData.latitude ? parseFloat(formData.latitude) : DEFAULT_CENTER[0],
                      formData.longitude ? parseFloat(formData.longitude) : DEFAULT_CENTER[1],
                    ]}
                    zoom={15}
                    style={{ height: "180px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker setFormData={setFormData} />
                    {formData.latitude && formData.longitude && (
                      <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
                    )}
                  </MapContainer>
                  <small>Click on the map to set latitude and longitude.</small>
                </div>

                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  <option value="Clear">🟢 Clear</option>
                  <option value="Moderate">🟡 Moderate</option>
                  <option value="Crowded">🔴 Crowded</option>
                </select>
                <input
                  type="number"
                  placeholder="Max Capacity"
                  value={formData.maxCapacity}
                  onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Services (comma separated, e.g. Wi-Fi, Restrooms)"
                  value={formData.services}
                  onChange={e => setFormData({ ...formData, services: e.target.value })}
                />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAmenities;
