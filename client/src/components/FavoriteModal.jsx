import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import "../css/favorite.css";

const FavoriteModal = ({ open, onClose }) => {
  const [favorites, setFavorites] = useState([]);
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    if (!open) return;
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("/api/auth/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data.favorites || []);
    };
    const fetchAmenities = async () => {
      const res = await axios.get("/api/amenities");
      setAmenities(res.data || []);
    };
    fetchFavorites();
    fetchAmenities();
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
        <ul className="favorite-list">
          {favoriteAmenities.length > 0 ? favoriteAmenities.map(a => (
            <li key={a._id}>
              <FaStar />
              <span>{a.name}</span>
            </li>
          )) : <li>No Saved Places yet.</li>}
        </ul>
      </div>
    </div>
  );
};

export default FavoriteModal;