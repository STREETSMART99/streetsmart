// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Legend,
//   BarChart,
//   Bar,
//   Tooltip
// } from 'recharts';
// import axios from 'axios';
// import '../css/Analytics.css';

// // Helper to generate time slots
// const generateTimeSlots = () => {
//   const slots = [];
//   let hour = 0;
//   let minute = 0;
//   while (hour < 24) {
//     const h = hour % 12 === 0 ? 12 : hour % 12;
//     const ampm = hour < 12 ? 'AM' : 'PM';
//     const time = `${h}:${minute === 0 ? '00' : '30'} ${ampm}`;
//     slots.push(time);
//     minute += 30;
//     if (minute === 60) {
//       minute = 0;
//       hour += 1;
//     }
//   }
//   return slots;
// };

// // Color scale for heatmap
// const getHeatColor = (value) => {
//   if (value < 35) return '#2ecc71'; // green
//   if (value < 70) return '#f1c40f'; // yellow
//   return '#e74c3c'; // red
// };

// const Analytics = () => {
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
//   const [darkMode, setDarkMode] = useState(false);
//   const [historicalData, setHistoricalData] = useState([]);
//   const [forecastData, setForecastData] = useState([]);
//   const [bestTime, setBestTime] = useState('');
//   const [worstTime, setWorstTime] = useState('');
//   const [userReport, setUserReport] = useState({ comment: '', image: null });
//   const [alerts, setAlerts] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [amenityDetails, setAmenityDetails] = useState(null);
//   const [viewMode, setViewMode] = useState('hourly'); // 'hourly' or 'daily'

//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const amenityName = queryParams.get("amenity") || "Unknown Location";
//   const timeSlots = generateTimeSlots();

//   // Fetch historical crowd data from backend (MongoDB)
//   useEffect(() => {
//     const fetchHistorical = async () => {
//       try {
//         const res = await axios.get(
//           `/api/analytics/historical?amenity=${encodeURIComponent(amenityName)}&date=${selectedDate}`
//         );
//         setHistoricalData(res.data.data || []);
//       } catch (err) {
//         setAlerts((a) => [...a, { type: 'error', msg: 'Failed to load historical data.' }]);
//       }
//     };
//     fetchHistorical();
//   }, [amenityName, selectedDate]);

//   // Fetch ARIMA forecast from backend
//   useEffect(() => {
//     const fetchForecast = async () => {
//       try {
//         const res = await axios.get(
//           `/api/analytics/forecast?amenity=${encodeURIComponent(amenityName)}&date=${selectedDate}`
//         );
//         setForecastData(res.data.forecast || []);
//         // Find best/worst times
//         if (res.data.forecast && res.data.forecast.length) {
//           const minIdx = res.data.forecast.reduce((min, d, i, arr) => d.value < arr[min].value ? i : min, 0);
//           const maxIdx = res.data.forecast.reduce((max, d, i, arr) => d.value > arr[max].value ? i : max, 0);
//           setBestTime(res.data.forecast[minIdx]?.time || '');
//           setWorstTime(res.data.forecast[maxIdx]?.time || '');
//         }
//       } catch (err) {
//         setAlerts((a) => [...a, { type: 'error', msg: 'Failed to load forecast data.' }]);
//       }
//     };
//     fetchForecast();
//   }, [amenityName, selectedDate]);

//   // Fetch amenity details: use location.state if available, else fetch from backend
//   useEffect(() => {
//     if (location.state && location.state.amenityDetails) {
//       setAmenityDetails(location.state.amenityDetails);
//     } else {
//       const fetchAmenity = async () => {
//         try {
//           const res = await axios.get(`/api/amenities?name=${encodeURIComponent(amenityName)}`);
//           setAmenityDetails(Array.isArray(res.data) ? res.data[0] : res.data);
//         } catch {
//           setAmenityDetails(null);
//         }
//       };
//       fetchAmenity();
//     }
//     // eslint-disable-next-line
//   }, [amenityName, location.state]);

//   // Set dark mode
//   useEffect(() => {
//     const root = document.documentElement;
//     const isDark = root.classList.contains("dark");
//     setDarkMode(isDark);
//   }, []);

//   // Compose chart data (merge historical, forecast)
//   const chartData = timeSlots.map((time, idx) => {
//     const hist = historicalData[idx]?.value ?? null;
//     const forecast = forecastData[idx]?.value ?? null;
//     return { time, hist, forecast };
//   });

//   // Handle user report submission
//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     const formData = new FormData();
//     formData.append('amenity', amenityName);
//     formData.append('date', selectedDate);
//     formData.append('comment', userReport.comment);
//     if (userReport.image) formData.append('image', userReport.image);
//     try {
//       await axios.post('/api/analytics/report', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setAlerts((a) => [...a, { type: 'success', msg: 'Report submitted! Thank you.' }]);
//       setUserReport({ comment: '', image: null });
//     } catch (err) {
//       setAlerts((a) => [...a, { type: 'error', msg: 'Failed to submit report.' }]);
//     }
//     setSubmitting(false);
//   };

//   // Example data (replace with your real data)
//   const hourlyData = [
//     { time: '00:00', value: 2 },
//     { time: '01:00', value: 4 },
//     { time: '02:00', value: 7 },
//     { time: '03:00', value: 10 },
//     { time: '04:00', value: 13 },
//     { time: '05:00', value: 16 },
//     { time: '06:00', value: 18 },
//     { time: '07:00', value: 20 },
//     { time: '08:00', value: 22 },
//     { time: '09:00', value: 19 },
//     { time: '10:00', value: 15 },
//     { time: '11:00', value: 12 },
//     { time: '12:00', value: 9 },
//   ];

//   const dailyData = [
//     { day: 'Mon', value: 80 },
//     { day: 'Tue', value: 120 },
//     { day: 'Wed', value: 100 },
//     { day: 'Thu', value: 140 },
//     { day: 'Fri', value: 160 },
//     { day: 'Sat', value: 200 },
//     { day: 'Sun', value: 180 },
//   ];

//   return (
//     <>
//       <div className={`predictive-wrapper ${darkMode ? 'dark' : ''}`}>
//         <div className="predictive-background-shape"></div>
//         <button className="predictive-back" onClick={() => navigate(-1)}>&larr;</button>
//         <div className="predictive-content">
//           {amenityDetails && (
//             <div style={{ position: "relative" }}>
//               {/* Top section: info + report summary */}
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
//                 {/* Amenity Info Panel */}
//                 <div>
//                   <div className="amenity-info-title">{amenityDetails.name}</div>
//                   <div className="amenity-info-description">{amenityDetails.description}</div>
//                   <div className="amenity-info-services">
//                     <b>Services:</b>{" "}
//                     <b>
//                       {Array.isArray(amenityDetails.services)
//                         ? amenityDetails.services.join(", ")
//                         : amenityDetails.services}
//                     </b>
//                   </div>
//                   <div className="amenity-info-hours-row">
//                     <div className="amenity-info-hour-box">
//                       <div className="amenity-info-hour-label">Open</div>
//                       <div className="amenity-info-hour-value">{amenityDetails.open || "--:--"}</div>
//                     </div>
//                     <div className="amenity-info-hour-box">
//                       <div className="amenity-info-hour-label">Close</div>
//                       <div className="amenity-info-hour-value">{amenityDetails.close || "--:--"}</div>
//                     </div>
//                     <div className="amenity-info-hour-box">
//                       <div className="amenity-info-hour-label">Cutoff</div>
//                       <div className="amenity-info-hour-value">{amenityDetails.cutoff || "--:--"}</div>
//                     </div>
//                   </div>
//                   <div className="amenity-info-occupancy-label">Current Occupancy</div>
//                   <div className="amenity-info-occupancy-value">
//                     {(amenityDetails.counter ?? 0)} / {(amenityDetails.maxCapacity ?? 0)}
//                   </div>
//                   <div className="amenity-info-status-row">
//                     Status:{" "}
//                     <span
//                       className={
//                         "amenity-info-status-value" +
//                         (amenityDetails.availability === "Moderate"
//                           ? " moderate"
//                           : amenityDetails.availability === "Crowded"
//                           ? " crowded"
//                           : "")
//                       }
//                     >
//                       {amenityDetails.availability || "Clear"}
//                     </span>
//                   </div>
//                 </div>
//                 {/* Right: Report Summary */}
//                 <div className="report-summary-box" style={{ marginLeft: 40 }}>
//                   <div className="report-summary-title">Report Summary</div>
//                   <div className="report-summary-row">
//                     <b>Best Day to Visit:</b> <span style={{ color: "#4b4b8d" }}>Wednesday</span>
//                   </div>
//                   <div className="report-summary-row">
//                     <b>Best Time to Visit:</b> <span style={{ color: "#2ecc71" }}>10:30 AM</span>
//                   </div>
//                   <div className="report-summary-note">
//                     (Based on simulated data. Real recommendations will appear here once IoT sensors are available.)
//                   </div>
//                 </div>
//               </div>
//               <div className="analytics-chart-tabs">
//                 <div
//                   className={`analytics-chart-tab${viewMode === "hourly" ? " active" : ""}`}
//                   onClick={() => setViewMode("hourly")}
//                 >
//                   Hourly
//                 </div>
//                 <div
//                   className={`analytics-chart-tab${viewMode === "daily" ? " active" : ""}`}
//                   onClick={() => setViewMode("daily")}
//                 >
//                   Daily
//                 </div>
//               </div>
//               <div className="analytics-chart-title">
//                 {viewMode === "hourly" ? "Hourly Data (24h)" : "Daily Data (7d)"}
//               </div>
//               <div className="analytics-chart-container">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={viewMode === "hourly" ? hourlyData : dailyData}
//                     margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
//                   >
//                     <XAxis
//                       dataKey={viewMode === "hourly" ? "time" : "day"}
//                       tick={{ fontSize: 13 }}
//                     />
//                     <YAxis hide />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#4b8dfb" radius={[8, 8, 0, 0]} barSize={24} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recommendations */}
//       <div className="recommendations">
//         <span role="img" aria-label="info">💡</span>
//         {bestTime && (
//           <span>
//             Best time to visit: <strong style={{ color: '#2ecc71' }}>{bestTime}</strong>
//           </span>
//         )}
//         {worstTime && (
//           <span style={{ marginLeft: 20 }}>
//             Avoid: <strong style={{ color: '#e74c3c' }}>{worstTime}</strong>
//           </span>
//         )}
//       </div>

//       <div className="predictive-panels">
//         {/* Main Content */}
//         <div className="left-panel">
//           <div className="location-box">
//             <div className="location-header">
//               <span role="img" aria-label="location" style={{ color: "black" }}>📍</span> Location: <strong>{amenityName}</strong>
//             </div>

//             <div className="date-row">
//               <span className="date-label">Today</span>
//               <input
//                 type="date"
//                 className="date-input"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//               />
//               <span className="time-label">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//             </div>

//             <div className="scrollable-time-chart">
//               <div className="time-labels">
//                 {timeSlots.map((slot, idx) => (
//                   <div
//                     key={idx}
//                     className="time-label"
//                     style={{
//                       background: chartData[idx]?.hist !== null
//                         ? getHeatColor(chartData[idx].hist)
//                         : undefined,
//                       color: chartData[idx]?.hist !== null
//                         ? '#fff'
//                         : undefined,
//                       borderRadius: 4,
//                       padding: '2px 6px'
//                     }}
//                   >
//                     {slot}
//                   </div>
//                 ))}
//               </div>
//               <div className="chart-wrapper">
//                 <ResponsiveContainer width="100%" height={timeSlots.length * 30}>
//                   <AreaChart data={chartData} layout="vertical">
//                     <XAxis type="number" hide />
//                     <YAxis type="category" dataKey="time" hide />
//                     <Legend />
//                     <Area
//                       type="monotone"
//                       dataKey="hist"
//                       stroke="#4b4b8d"
//                       fill="#4b4b8d"
//                       fillOpacity={0.2}
//                       name="Historical"
//                       isAnimationActive={false}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="forecast"
//                       stroke="#f39c12"
//                       fill="#f39c12"
//                       fillOpacity={0.15}
//                       name="Forecast"
//                       isAnimationActive={false}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel (no IoT) */}
//         <div className="right-panel">
//           {/* User Report Form */}
//           <form className="user-report-form" onSubmit={handleReportSubmit} style={{ marginTop: 30 }}>
//             <h4>Submit Live Report</h4>
//             <textarea
//               placeholder="Describe current conditions..."
//               value={userReport.comment}
//               onChange={e => setUserReport({ ...userReport, comment: e.target.value })}
//               required
//               rows={3}
//               style={{ width: '100%', marginBottom: 8 }}
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={e => setUserReport({ ...userReport, image: e.target.files[0] })}
//               style={{ marginBottom: 8 }}
//             />
//             <button type="submit" className="add-btn" disabled={submitting}>
//               {submitting ? 'Submitting...' : 'Submit Report'}
//             </button>
//           </form>
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 20, margin: "18px 0 0 0" }}>
//         <div
//           style={{
//             color: viewMode === "hourly" ? "#4b4b8d" : "#bbb",
//             fontWeight: 700,
//             borderBottom: viewMode === "hourly" ? "2px solid #4b4b8d" : "none",
//             cursor: "pointer"
//           }}
//           onClick={() => setViewMode("hourly")}
//         >
//           Hourly
//         </div>
//         <div
//           style={{
//             color: viewMode === "daily" ? "#4b4b8d" : "#bbb",
//             fontWeight: 700,
//             borderBottom: viewMode === "daily" ? "2px solid #4b4b8d" : "none",
//             cursor: "pointer"
//           }}
//           onClick={() => setViewMode("daily")}
//         >
//           Daily
//         </div>
//       </div>

//       <div style={{ fontWeight: 600, fontSize: 15, color: "#4b4b8d", margin: "10px 0 0 0" }}>
//         {viewMode === "hourly" ? "Hourly Data (24h)" : "Daily Data (7d)"}
//       </div>

//       <div style={{ width: "100%", height: "240px", margin: "10px 0 0 0" }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={viewMode === "hourly" ? hourlyData : dailyData}
//             margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
//           >
//             <XAxis
//               dataKey={viewMode === "hourly" ? "time" : "day"}
//               tick={{ fontSize: 13 }}
//             />
//             <YAxis hide />
//             <Tooltip />
//             <Bar dataKey="value" fill="#4b8dfb" radius={[8, 8, 0, 0]} barSize={24} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </>
//   );
// };

// export default Analytics;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Tooltip
} from 'recharts';
import axios from 'axios';
import '../css/Analytics.css';

const BASE_URL = "https://streetsmart-server.onrender.com";

// Helper to generate time slots
const generateTimeSlots = () => {
  const slots = [];
  let hour = 0;
  let minute = 0;
  while (hour < 24) {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const time = `${h}:${minute === 0 ? '00' : '30'} ${ampm}`;
    slots.push(time);
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
};

// Color scale for heatmap
const getHeatColor = (value) => {
  if (value < 35) return '#2ecc71'; // green
  if (value < 70) return '#f1c40f'; // yellow
  return '#e74c3c'; // red
};

const Analytics = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [darkMode, setDarkMode] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [bestTime, setBestTime] = useState('');
  const [worstTime, setWorstTime] = useState('');
  const [userReport, setUserReport] = useState({ comment: '', image: null });
  const [alerts, setAlerts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [amenityDetails, setAmenityDetails] = useState(null);
  const [viewMode, setViewMode] = useState('hourly'); // 'hourly' or 'daily'

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amenityName = queryParams.get("amenity") || "Unknown Location";
  const timeSlots = generateTimeSlots();

  // Fetch historical crowd data from backend (MongoDB)
  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/analytics/historical?amenity=${encodeURIComponent(amenityName)}&date=${selectedDate}`
        );
        setHistoricalData(res.data.data || []);
      } catch (err) {
        console.error("Failed to load historical data.", err);
        setAlerts((a) => [...a, { type: 'error', msg: 'Failed to load historical data.' }]);
      }
    };
    fetchHistorical();
  }, [amenityName, selectedDate]);

  // Fetch ARIMA forecast from backend
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/analytics/forecast?amenity=${encodeURIComponent(amenityName)}&date=${selectedDate}`
        );
        setForecastData(res.data.forecast || []);
        // Find best/worst times
        if (res.data.forecast && res.data.forecast.length) {
          const minIdx = res.data.forecast.reduce((min, d, i, arr) => d.value < arr[min].value ? i : min, 0);
          const maxIdx = res.data.forecast.reduce((max, d, i, arr) => d.value > arr[max].value ? i : max, 0);
          setBestTime(res.data.forecast[minIdx]?.time || '');
          setWorstTime(res.data.forecast[maxIdx]?.time || '');
        }
      } catch (err) {
        console.error("Failed to load forecast data.", err);
        setAlerts((a) => [...a, { type: 'error', msg: 'Failed to load forecast data.' }]);
      }
    };
    fetchForecast();
  }, [amenityName, selectedDate]);

  // Fetch amenity details: use location.state if available, else fetch from backend
  useEffect(() => {
    if (location.state && location.state.amenityDetails) {
      setAmenityDetails(location.state.amenityDetails);
    } else {
      const fetchAmenity = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/amenities?name=${encodeURIComponent(amenityName)}`);
          setAmenityDetails(Array.isArray(res.data) ? res.data[0] : res.data);
        } catch (err) {
          console.error("Failed to fetch amenity details.", err);
          setAmenityDetails(null);
        }
      };
      fetchAmenity();
    }
    // eslint-disable-next-line
  }, [amenityName, location.state]);

  // Set dark mode
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Compose chart data (merge historical, forecast)
  const chartData = timeSlots.map((time, idx) => {
    const hist = historicalData[idx]?.value ?? null;
    const forecast = forecastData[idx]?.value ?? null;
    return { time, hist, forecast };
  });

  // Handle user report submission
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append('amenity', amenityName);
    formData.append('date', selectedDate);
    formData.append('comment', userReport.comment);
    if (userReport.image) formData.append('image', userReport.image);
    try {
      await axios.post(`${BASE_URL}/api/analytics/report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAlerts((a) => [...a, { type: 'success', msg: 'Report submitted! Thank you.' }]);
      setUserReport({ comment: '', image: null });
    } catch (err) {
      console.error("Failed to submit report.", err);
      setAlerts((a) => [...a, { type: 'error', msg: 'Failed to submit report.' }]);
    }
    setSubmitting(false);
  };

  // Example data (replace with your real data)
  const hourlyData = [
    { time: '00:00', value: 2 },
    { time: '01:00', value: 4 },
    { time: '02:00', value: 7 },
    { time: '03:00', value: 10 },
    { time: '04:00', value: 13 },
    { time: '05:00', value: 16 },
    { time: '06:00', value: 18 },
    { time: '07:00', value: 20 },
    { time: '08:00', value: 22 },
    { time: '09:00', value: 19 },
    { time: '10:00', value: 15 },
    { time: '11:00', value: 12 },
    { time: '12:00', value: 9 },
  ];

  const dailyData = [
    { day: 'Mon', value: 80 },
    { day: 'Tue', value: 120 },
    { day: 'Wed', value: 100 },
    { day: 'Thu', value: 140 },
    { day: 'Fri', value: 160 },
    { day: 'Sat', value: 200 },
    { day: 'Sun', value: 180 },
  ];

  return (
    <>
      <div className={`predictive-wrapper ${darkMode ? 'dark' : ''}`}>
        <div className="predictive-background-shape"></div>
        <button className="predictive-back" onClick={() => navigate(-1)}>&larr;</button>
        <div className="predictive-content">
          {amenityDetails && (
            <div style={{ position: "relative" }}>
              {/* Top section: info + report summary */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                {/* Amenity Info Panel */}
                <div>
                  <div className="amenity-info-title">{amenityDetails.name}</div>
                  <div className="amenity-info-description">{amenityDetails.description}</div>
                  <div className="amenity-info-services">
                    <b>Services:</b>{" "}
                    <b>
                      {Array.isArray(amenityDetails.services)
                        ? amenityDetails.services.join(", ")
                        : amenityDetails.services}
                    </b>
                  </div>
                  <div className="amenity-info-hours-row">
                    <div className="amenity-info-hour-box">
                      <div className="amenity-info-hour-label">Open</div>
                      <div className="amenity-info-hour-value">{amenityDetails.open || "--:--"}</div>
                    </div>
                    <div className="amenity-info-hour-box">
                      <div className="amenity-info-hour-label">Close</div>
                      <div className="amenity-info-hour-value">{amenityDetails.close || "--:--"}</div>
                    </div>
                    <div className="amenity-info-hour-box">
                      <div className="amenity-info-hour-label">Cutoff</div>
                      <div className="amenity-info-hour-value">{amenityDetails.cutoff || "--:--"}</div>
                    </div>
                  </div>
                  <div className="amenity-info-occupancy-label">Current Occupancy</div>
                  <div className="amenity-info-occupancy-value">
                    {(amenityDetails.counter ?? 0)} / {(amenityDetails.maxCapacity ?? 0)}
                  </div>
                  <div className="amenity-info-status-row">
                    Status:{" "}
                    <span
                      className={
                        "amenity-info-status-value" +
                        (amenityDetails.availability === "Moderate"
                          ? " moderate"
                          : amenityDetails.availability === "Crowded"
                          ? " crowded"
                          : "")
                      }
                    >
                      {amenityDetails.availability || "Clear"}
                    </span>
                  </div>
                </div>
                {/* Right: Report Summary */}
                <div className="report-summary-box" style={{ marginLeft: 40 }}>
                  <div className="report-summary-title">Report Summary</div>
                  <div className="report-summary-row">
                    <b>Best Day to Visit:</b> <span style={{ color: "#4b4b8d" }}>Wednesday</span>
                  </div>
                  <div className="report-summary-row">
                    <b>Best Time to Visit:</b> <span style={{ color: "#2ecc71" }}>10:30 AM</span>
                  </div>
                  <div className="report-summary-note">
                    (Based on simulated data. Real recommendations will appear here once IoT sensors are available.)
                  </div>
                </div>
              </div>
              <div className="analytics-chart-tabs">
                <div
                  className={`analytics-chart-tab${viewMode === "hourly" ? " active" : ""}`}
                  onClick={() => setViewMode("hourly")}
                >
                  Hourly
                </div>
                <div
                  className={`analytics-chart-tab${viewMode === "daily" ? " active" : ""}`}
                  onClick={() => setViewMode("daily")}
                >
                  Daily
                </div>
              </div>
              <div className="analytics-chart-title">
                {viewMode === "hourly" ? "Hourly Data (24h)" : "Daily Data (7d)"}
              </div>
              <div className="analytics-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={viewMode === "hourly" ? hourlyData : dailyData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                  >
                    <XAxis
                      dataKey={viewMode === "hourly" ? "time" : "day"}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4b8dfb" radius={[8, 8, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <span role="img" aria-label="info">💡</span>
        {bestTime && (
          <span>
            Best time to visit: <strong style={{ color: '#2ecc71' }}>{bestTime}</strong>
          </span>
        )}
        {worstTime && (
          <span style={{ marginLeft: 20 }}>
            Avoid: <strong style={{ color: '#e74c3c' }}>{worstTime}</strong>
          </span>
        )}
      </div>

      <div className="predictive-panels">
        {/* Main Content */}
        <div className="left-panel">
          <div className="location-box">
            <div className="location-header">
              <span role="img" aria-label="location" style={{ color: "black" }}>📍</span> Location: <strong>{amenityName}</strong>
            </div>

            <div className="date-row">
              <span className="date-label">Today</span>
              <input
                type="date"
                className="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <span className="time-label">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="scrollable-time-chart">
              <div className="time-labels">
                {timeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="time-label"
                    style={{
                      background: chartData[idx]?.hist !== null
                        ? getHeatColor(chartData[idx].hist)
                        : undefined,
                      color: chartData[idx]?.hist !== null
                        ? '#fff'
                        : undefined,
                      borderRadius: 4,
                      padding: '2px 6px'
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={timeSlots.length * 30}>
                  <AreaChart data={chartData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="time" hide />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="hist"
                      stroke="#4b4b8d"
                      fill="#4b4b8d"
                      fillOpacity={0.2}
                      name="Historical"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="#f39c12"
                      fill="#f39c12"
                      fillOpacity={0.15}
                      name="Forecast"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (no IoT) */}
        <div className="right-panel">
          {/* User Report Form */}
          <form className="user-report-form" onSubmit={handleReportSubmit} style={{ marginTop: 30 }}>
            <h4>Submit Live Report</h4>
            <textarea
              placeholder="Describe current conditions..."
              value={userReport.comment}
              onChange={e => setUserReport({ ...userReport, comment: e.target.value })}
              required
              rows={3}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setUserReport({ ...userReport, image: e.target.files[0] })}
              style={{ marginBottom: 8 }}
            />
            <button type="submit" className="add-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, margin: "18px 0 0 0" }}>
        <div
          style={{
            color: viewMode === "hourly" ? "#4b4b8d" : "#bbb",
            fontWeight: 700,
            borderBottom: viewMode === "hourly" ? "2px solid #4b4b8d" : "none",
            cursor: "pointer"
          }}
          onClick={() => setViewMode("hourly")}
        >
          Hourly
        </div>
        <div
          style={{
            color: viewMode === "daily" ? "#4b4b8d" : "#bbb",
            fontWeight: 700,
            borderBottom: viewMode === "daily" ? "2px solid #4b4b8d" : "none",
            cursor: "pointer"
          }}
          onClick={() => setViewMode("daily")}
        >
          Daily
        </div>
      </div>

      <div style={{ fontWeight: 600, fontSize: 15, color: "#4b4b8d", margin: "10px 0 0 0" }}>
        {viewMode === "hourly" ? "Hourly Data (24h)" : "Daily Data (7d)"}
      </div>

      <div style={{ width: "100%", height: "240px", margin: "10px 0 0 0" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={viewMode === "hourly" ? hourlyData : dailyData}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey={viewMode === "hourly" ? "time" : "day"}
              tick={{ fontSize: 13 }}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#4b8dfb" radius={[8, 8, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Analytics;
