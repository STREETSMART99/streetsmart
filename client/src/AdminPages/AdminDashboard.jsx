// import React, { useState, useEffect } from 'react';
// import avatar from '../assets/pfp.png';
// import "../css/AdminDashboard.css";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar'; 

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [amenities, setAmenities] = useState([]);

//   useEffect(() => {
//     axios.get("/api/amenities")
//       .then(res => setAmenities(Array.isArray(res.data) ? res.data : []))
//       .catch(() => setAmenities([]));
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


//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   // Calculate stats
//   const totalAmenities = amenities.length;
//   const openAmenities = amenities.filter(a => a.isOpen).length;

//   // Consider "newly added" as amenities added in the last 24 hours
//   const now = new Date();
//   const newlyAdded = amenities.filter(a => {
//     if (!a.createdAt) return false;
//     const created = new Date(a.createdAt);
//     return (now - created) < 24 * 60 * 60 * 1000; // last 24 hours
//   }).length;

//   // For review: you can define your own logic, e.g., amenities with isOpen === false
//   const forReview = amenities.filter(a => a.isOpen === false).length;

//   return (
//     <div className="dashboard">
//       <Sidebar activePage="dashboard" />
//       <main className="main-content">
//         <header className="header">
//           <div className="admin-info">
//             <div className="profile-dropdown">
//               <img
//                 src={avatar}
//                 alt="Admin"
//                 className="avatar"
//                 onClick={toggleDropdown}
//                 style={{ cursor: 'pointer' }}
//               />
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <p className="dropdown-item" onClick={handleLogout}>
//                     Logout
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <h2 className="page-title">Dashboard</h2>

//         <section className="stats">
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>TOTAL AMENITIES</h3>
//             <p style={{ color: 'white' }}>{totalAmenities} Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>AMENITIES OPEN</h3>
//             <p style={{ color: 'white' }}>{openAmenities} Open Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>NEWLY ADDED</h3>
//             <p style={{ color: 'white' }}>{newlyAdded} New Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>REVIEW</h3>
//             <p style={{ color: 'white' }}>{forReview} For Review</p>
//           </div>
//         </section>

//         <section className="traffic">
//           {["Monday", "Tuesday", "Wednesday"].map((day) => (
//             <div className="traffic-card" key={day}>
//               <p className="label">Foot Traffic Level</p>
//               <p className="day">{day}</p>
//               <div className="progress-circle"><span>80%</span></div>
//             </div>
//           ))}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import avatar from '../assets/pfp.png';
// import "../css/AdminDashboard.css";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar'; 

// const BASE_URL = "https://streetsmart-server.onrender.com";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [amenities, setAmenities] = useState([]);

//   useEffect(() => {
//     axios.get(`${BASE_URL}/api/amenities`)
//       .then(res => setAmenities(Array.isArray(res.data) ? res.data : []))
//       .catch(() => setAmenities([]));
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     } catch (error) {
//       alert("Logout failed. Please try again.");
//     }
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   // Calculate stats
//   const totalAmenities = amenities.length;
//   const openAmenities = amenities.filter(a => a.isOpen).length;

//   // Consider "newly added" as amenities added in the last 24 hours
//   const now = new Date();
//   const newlyAdded = amenities.filter(a => {
//     if (!a.createdAt) return false;
//     const created = new Date(a.createdAt);
//     return (now - created) < 24 * 60 * 60 * 1000; // last 24 hours
//   }).length;

//   // For review: amenities with isOpen === false
//   const forReview = amenities.filter(a => a.isOpen === false).length;

//   return (
//     <div className="dashboard">
//       <Sidebar activePage="dashboard" />
//       <main className="main-content">
//         <header className="header">
//           <div className="admin-info">
//             <div className="profile-dropdown">
//               <img
//                 src={avatar}
//                 alt="Admin"
//                 className="avatar"
//                 onClick={toggleDropdown}
//                 style={{ cursor: 'pointer' }}
//               />
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <p className="dropdown-item" onClick={handleLogout}>
//                     Logout
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <h2 className="page-title">Dashboard</h2>

//         <section className="stats">
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>TOTAL AMENITIES</h3>
//             <p style={{ color: 'white' }}>{totalAmenities} Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>AMENITIES OPEN</h3>
//             <p style={{ color: 'white' }}>{openAmenities} Open Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>NEWLY ADDED</h3>
//             <p style={{ color: 'white' }}>{newlyAdded} New Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>REVIEW</h3>
//             <p style={{ color: 'white' }}>{forReview} For Review</p>
//           </div>
//         </section>

//         <section className="traffic">
//           {["Monday", "Tuesday", "Wednesday"].map((day) => (
//             <div className="traffic-card" key={day}>
//               <p className="label">Foot Traffic Level</p>
//               <p className="day">{day}</p>
//               <div className="progress-circle"><span>80%</span></div>
//             </div>
//           ))}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
//////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import avatar from '../assets/pfp.png';
// import "../css/AdminDashboard.css";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar'; 

// const BASE_URL = "https://streetsmart-server.onrender.com";

// const daysOfWeek = [
//   "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
// ];

// // Helper for color based on traffic
// function getTrafficColor(percent) {
//   if (percent < 40) return "#43ea6b";      // green
//   if (percent < 70) return "#ffd600";      // yellow
//   return "#ff4b4b";                        // red
// }

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [amenities, setAmenities] = useState([]);
//   const [trafficLevels, setTrafficLevels] = useState([]);

//   useEffect(() => {
//     axios.get(`${BASE_URL}/api/amenities`)
//       .then(res => setAmenities(Array.isArray(res.data) ? res.data : []))
//       .catch(() => setAmenities([]));

//     // Demo: random traffic levels for each day (replace with real data if available)
//     setTrafficLevels(daysOfWeek.map(() => Math.floor(Math.random() * 61) + 20)); // 20-80%
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     } catch (error) {
//       alert("Logout failed. Please try again.");
//     }
//   };

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   // Calculate stats
//   const totalAmenities = amenities.length;
//   const openAmenities = amenities.filter(a => a.isOpen).length;
//   const now = new Date();
//   const newlyAdded = amenities.filter(a => {
//     if (!a.createdAt) return false;
//     const created = new Date(a.createdAt);
//     return (now - created) < 24 * 60 * 60 * 1000;
//   }).length;
//   const forReview = amenities.filter(a => a.isOpen === false).length;

//   return (
//     <div className="dashboard">
//       <Sidebar activePage="dashboard" />
//       <main className="main-content">
//         <header className="header">
//           <div className="admin-info">
//             <div className="profile-dropdown">
//               <img
//                 src={avatar}
//                 alt="Admin"
//                 className="avatar"
//                 onClick={toggleDropdown}
//                 style={{ cursor: 'pointer' }}
//               />
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <p className="dropdown-item" onClick={handleLogout}>
//                     Logout
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <h2 className="page-title">Dashboard</h2>

//         <section className="stats">
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>TOTAL AMENITIES</h3>
//             <p style={{ color: 'white' }}>{totalAmenities} Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>AMENITIES OPEN</h3>
//             <p style={{ color: 'white' }}>{openAmenities} Open Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>NEWLY ADDED</h3>
//             <p style={{ color: 'white' }}>{newlyAdded} New Amenities</p>
//           </div>
//           <div className="card gradient">
//             <h3 style={{ color: 'white' }}>REVIEW</h3>
//             <p style={{ color: 'white' }}>{forReview} For Review</p>
//           </div>
//         </section>

//         <section className="traffic">
//           {daysOfWeek.map((day, idx) => {
//             const percent = trafficLevels[idx] || 0;
//             const color = getTrafficColor(percent);
//             return (
//               <div className="traffic-card" key={day}>
//                 <p className="label">Foot Traffic Level</p>
//                 <p className="day">{day}</p>
//                 <div className="progress-circle">
//                   <svg className="progress-svg" width="64" height="64">
//                     <circle
//                       cx="32"
//                       cy="32"
//                       r="28"
//                       stroke="#eee"
//                       strokeWidth="8"
//                       fill="none"
//                     />
//                     <circle
//                       cx="32"
//                       cy="32"
//                       r="28"
//                       stroke={color}
//                       strokeWidth="8"
//                       fill="none"
//                       strokeDasharray={2 * Math.PI * 28}
//                       strokeDashoffset={2 * Math.PI * 28 * (1 - percent / 100)}
//                       style={{ transition: "stroke-dashoffset 1s" }}
//                     />
//                   </svg>
//                   <span className="progress-text" style={{ color }}>{percent}%</span>
//                 </div>
//               </div>
//             );
//           })}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

//////////////////////////////
import React, { useState, useEffect } from 'react';
import avatar from '../assets/pfp.png';
import "../css/AdminDashboard.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 

const BASE_URL = "https://streetsmart-server.onrender.com";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Helper for color based on traffic
function getTrafficColor(percent) {
  if (percent < 40) return "#43ea6b";      // green
  if (percent < 70) return "#ffd600";      // yellow
  return "#ff4b4b";                        // red
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [trafficLevels, setTrafficLevels] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/amenities`)
      .then(res => setAmenities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAmenities([]));

    // Demo: random traffic levels for each day (replace with real data if available)
    setTrafficLevels(daysOfWeek.map(() => Math.floor(Math.random() * 61) + 20)); // 20-80%
  }, []);

  // Copied logout logic from AdminStatistics
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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Calculate stats
  const totalAmenities = amenities.length;
  const openAmenities = amenities.filter(a => a.isOpen).length;
  const now = new Date();
  const newlyAdded = amenities.filter(a => {
    if (!a.createdAt) return false;
    const created = new Date(a.createdAt);
    return (now - created) < 24 * 60 * 60 * 1000;
  }).length;
  const forReview = amenities.filter(a => a.isOpen === false).length;

  return (
    <div className="dashboard">
      <Sidebar activePage="dashboard" />
      <main className="main-content">
        <header className="header">
          <div className="admin-info">
            <div className="profile-dropdown">
              <img
                src={avatar}
                alt="Admin"
                className="avatar"
                onClick={toggleDropdown}
                style={{ cursor: 'pointer' }}
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

        <h2 className="page-title">Dashboard</h2>

        <section className="stats">
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>TOTAL AMENITIES</h3>
            <p style={{ color: 'white' }}>{totalAmenities} Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>AMENITIES OPEN</h3>
            <p style={{ color: 'white' }}>{openAmenities} Open Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>NEWLY ADDED</h3>
            <p style={{ color: 'white' }}>{newlyAdded} New Amenities</p>
          </div>
          <div className="card gradient">
            <h3 style={{ color: 'white' }}>REVIEW</h3>
            <p style={{ color: 'white' }}>{forReview} For Review</p>
          </div>
        </section>

        <section className="traffic">
          {daysOfWeek.map((day, idx) => {
            const percent = trafficLevels[idx] || 0;
            const color = getTrafficColor(percent);
            return (
              <div className="traffic-card" key={day}>
                <p className="label">Foot Traffic Level</p>
                <p className="day">{day}</p>
                <div className="progress-circle">
                  <svg className="progress-svg" width="64" height="64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#eee"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={color}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - percent / 100)}
                      style={{ transition: "stroke-dashoffset 1s" }}
                    />
                  </svg>
                  <span className="progress-text" style={{ color }}>{percent}%</span>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
