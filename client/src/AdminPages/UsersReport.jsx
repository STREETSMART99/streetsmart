// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import avatar from "../assets/pfp.png";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../css/AdminDashboard.css";

// const UsersReport = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

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

//   return (
//     <div className="dashboard">
//       <Sidebar activePage="users-report" />
//       <main className="main-content">
//         <header className="header">
//           <div className="admin-info">
//             <div className="profile-dropdown">
//               <img
//                 src={avatar}
//                 alt="Admin"
//                 className="avatar"
//                 onClick={toggleDropdown}
//                 style={{ cursor: "pointer" }}
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
//         <h2 className="page-title" style={{ fontWeight: "bold" }}>
//           Users Report
//         </h2>
//       </main>
//     </div>
//   );
// };

// export default UsersReport;
//////////////////////////

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import avatar from "../assets/pfp.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AdminDashboard.css";

const BASE_URL = "https://streetsmart-server.onrender.com";

const UsersReport = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/users`, { withCredentials: true })
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setUsers([]));
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

  return (
    <div className="dashboard">
      <Sidebar activePage="users-report" />
      <main className="main-content">
        <header className="header">
          <div className="admin-info">
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
        </header>
        <h2 className="page-title" style={{ fontWeight: "bold" }}>
          Users Report
        </h2>
        <div className="users-report-box">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Admin</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.isVerified ? "Yes" : "No"}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UsersReport;
