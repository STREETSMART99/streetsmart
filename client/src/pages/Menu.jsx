import React, { useEffect, useState } from 'react';
import '../css/Menu.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaStar, FaUserEdit, FaCog, FaQuestionCircle, FaPowerOff, FaArrowLeft, FaPlus
} from 'react-icons/fa';
import pfp from '../assets/pfp.png';
import FavoriteModal from "../components/FavoriteModal"; // Import the modal

const Menu = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState(''); // Add photo state
  const [showFavorites, setShowFavorites] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode === 'true') setDarkMode(true);

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setFullName('Guest');
          setPhoto('');
          return;
        }
        const response = await axios.get('https://streetsmart-server.onrender.com/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFullName(`${response.data.firstName} ${response.data.lastName}`);
        setPhoto(response.data.photo); 
      } catch (error) {
        setFullName('Guest');
        setPhoto('');
      }
    };

    fetchUserInfo();
  }, []);

  // Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'https://streetsmart-server.onrender.com/api/auth/upload-photo',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPhoto(res.data.photo); // Update photo with Cloudinary URL
    } catch (err) {
      alert('Failed to upload photo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`menu-wrapper ${darkMode ? 'dark' : ''}`}>
      {/* Black and white shapes for background */}
      <div className="shape shape-black top-left"></div>
      <div className="shape shape-white bottom-left"></div>
      <button className="menu-back" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft />
      </button>
      <div className="menu-content">
        <div className="menu-avatar-wrapper" style={{ position: "relative", display: "inline-block" }}>
          <img
            className="menu-avatar"
            src={photo ? photo : pfp}
            alt="Avatar"
          />
          <button
            className="menu-avatar-add-btn"
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Change profile photo"
          >
            <FaPlus />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>
        <h2 className="menu-username">{fullName || 'Guest'}</h2>
        <ul className="menu-links">
          <li onClick={() => setShowFavorites(true)}>
            <FaStar /> Favorites
          </li>
          <li onClick={() => navigate('/settings')}><FaCog /> Settings</li>
          <li onClick={() => navigate('/help')}><FaQuestionCircle /> Help</li>
          <li onClick={handleLogout}>
            <FaPowerOff /> Log Out
          </li>
        </ul>
        <FavoriteModal open={showFavorites} onClose={() => setShowFavorites(false)} />
      </div>
    </div>
  );
};

export default Menu;
