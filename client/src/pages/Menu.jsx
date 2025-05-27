import React, { useEffect, useState } from 'react';
import '../css/Menu.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import {
  FaStar, FaUserEdit, FaCog, FaQuestionCircle, FaPowerOff, FaArrowLeft
} from 'react-icons/fa';
import pfp from '../assets/pfp.png'; // Import the pfp.png image

const Menu = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [fullName, setFullName] = useState(''); // State for user's full name

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode === 'true') {
      setDarkMode(true);
    }

    // Fetch user information from the backend
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        if (!token) {
          console.error('No token found');
          setFullName('Guest');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        console.log('User Details:', response.data); // Debugging log
        setFullName(response.data.fullName); // Set the full name from the response
      } catch (error) {
        console.error('Error fetching user info:', error);
        setFullName('Guest'); // Fallback if the request fails
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className={`menu-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="menu-background-shape" />
      <button className="menu-back" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft />
      </button>
      <div className="menu-content">
        <img
          className="menu-avatar"
          src={pfp} // Use the pfp.png image
          alt="Avatar"
        />
        <h2 className="menu-username">{fullName || 'Guest'}</h2> {/* Display full name or fallback */}
        <ul className="menu-links">
          <li onClick={() => navigate('/favorites')}><FaStar /> Favorites</li>
          <li onClick={() => navigate('/edit-profile')}><FaUserEdit /> Edit Profile</li>
          <li onClick={() => navigate('/settings')}><FaCog /> Settings</li>
          <li onClick={() => navigate('/help')}><FaQuestionCircle /> Help</li>
          <li onClick={handleLogout}>
            <FaPowerOff /> Log Out
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
