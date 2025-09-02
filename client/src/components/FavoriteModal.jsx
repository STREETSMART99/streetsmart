// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaStar } from "react-icons/fa";
// import { ArrowLeft } from "lucide-react";
// import "../css/favorite.css";

// const FavoriteModal = ({ open, onClose }) => {
//   const [favorites, setFavorites] = useState([]);
//   const [amenities, setAmenities] = useState([]);

//   useEffect(() => {
//     if (!open) return;
//     const fetchFavorites = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get("/api/auth/favorites", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setFavorites(res.data.favorites || []);
//     };
//     const fetchAmenities = async () => {
//       const res = await axios.get("/api/amenities");
//       setAmenities(res.data || []);
//     };
//     fetchFavorites();
//     fetchAmenities();
//   }, [open]);

//   const favoriteAmenities = amenities.filter(a => favorites.includes(a.name));

//   if (!open) return null;

//   return (
//     <div className="favorite-modal-overlay">
//       <div className="favorite-modal">
//         <button className="favorite-back-btn" onClick={onClose} title="Close">
//           <ArrowLeft size={32} />
//         </button>
//         <h1>Saved Places</h1>
//         <ul className="favorite-list">
//           {favoriteAmenities.length > 0 ? favoriteAmenities.map(a => (
//             <li key={a._id}>
//               <FaStar />
//               <span>{a.name}</span>
//             </li>
//           )) : <li>No Saved Places yet.</li>}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default FavoriteModal;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import "../css/favorite.css";

const BASE_URL = "https://streetsmart-server.onrender.com";

const FavoriteModal = ({ open, onClose }) => {
  const [favorites, setFavorites] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${BASE_URL}/api/auth/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data.favorites || []);
      } catch (err) {
        setError("Failed to load favorites.");
        console.error("Favorites error:", err);
      }
    };
    const fetchAmenities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/amenities`);
        setAmenities(res.data || []);
      } catch (err) {
        setError("Failed to load amenities.");
        console.error("Amenities error:", err);
      }
    };
    Promise.all([fetchFavorites(), fetchAmenities()]).finally(() => setLoading(false));
  }, [open]);

  const favoriteAmenities = amenities.filter(a => favorites.includes(a.name));

  if (!open) return null;

  return (
    <div className="favorite-modal-overlay">
      <div className="favorite-modal">
        <button className="favorite-back-btn" onClick={onClose} title="Close">
          <ArrowLeft size={32} />
        </button>
        <h1>Saved Places</h1>
        {loading ? (
          <div className="favorite-loading">Loading...</div>
        ) : error ? (
          <div className="favorite-error">{error}</div>
        ) : (
          <ul className="favorite-list">
            {favoriteAmenities.length > 0 ? favoriteAmenities.map(a => (
              <li key={a._id}>
                <FaStar />
                <span>{a.name}</span>
              </li>
            )) : <li>No Saved Places yet.</li>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FavoriteModal;
