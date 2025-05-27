import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import axios from 'axios';
import '../css/Analytics.css';

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
  const [iotData, setIotData] = useState([]);
  const [bestTime, setBestTime] = useState('');
  const [worstTime, setWorstTime] = useState('');
  const [userReport, setUserReport] = useState({ comment: '', image: null });
  const [alerts, setAlerts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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
          `/api/analytics/historical?amenity=${encodeURIComponent(amenityName)}&date=${selectedDate}`
        );
        setHistoricalData(res.data.data || []);
      } catch (err) {
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
          `/api/analytics/forecast?amenity=${encodeURIComponent(amenityName)}&date=${selectedDate}`
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
        setAlerts((a) => [...a, { type: 'error', msg: 'Failed to load forecast data.' }]);
      }
    };
    fetchForecast();
  }, [amenityName, selectedDate]);

  // Real-time IoT data via polling (replace with WebSocket for production)
  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `/api/analytics/iot?amenity=${encodeURIComponent(amenityName)}`
        );
        setIotData(res.data.iot || []);
      } catch (err) {
        // Ignore for now
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [amenityName]);

  // Set dark mode
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Compose chart data (merge historical, forecast, iot)
  const chartData = timeSlots.map((time, idx) => {
    const hist = historicalData[idx]?.value ?? null;
    const forecast = forecastData[idx]?.value ?? null;
    const iot = iotData[idx]?.value ?? null;
    return { time, hist, forecast, iot };
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
      await axios.post('/api/analytics/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAlerts((a) => [...a, { type: 'success', msg: 'Report submitted! Thank you.' }]);
      setUserReport({ comment: '', image: null });
    } catch (err) {
      setAlerts((a) => [...a, { type: 'error', msg: 'Failed to submit report.' }]);
    }
    setSubmitting(false);
  };

  return (
    <div className={`predictive-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="predictive-background-shape"></div>
      <button className="predictive-back" onClick={() => navigate(-1)}>&larr;</button>
      <div className="predictive-content">
        <h2 className="predictive-title">Predictive Analytics</h2>

        {/* Alerts */}
        {alerts.map((alert, idx) => (
          <div key={idx} className={`alert alert-${alert.type}`}>{alert.msg}</div>
        ))}

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
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === 'hist') return [`${value} (historical)`, 'Historical'];
                          if (name === 'forecast') return [`${value} (forecast)`, 'Forecast'];
                          if (name === 'iot') return [`${value} (real-time)`, 'IoT'];
                          return [value, name];
                        }}
                      />
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
                      <Area
                        type="monotone"
                        dataKey="iot"
                        stroke="#e74c3c"
                        fill="#e74c3c"
                        fillOpacity={0.1}
                        name="IoT"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time IoT Data */}
          <div className="right-panel">
            <div className="live-view-box">
              <div className="live-view-placeholder">📊</div>
              <p className="live-description"><strong>IoT Data Overview</strong></p>
              <p className="live-subtext">
                {iotData.length > 0
                  ? `Latest: ${iotData[iotData.length - 1].value} people detected`
                  : 'Real-time data from IoT devices will be displayed here.'}
              </p>
            </div>

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
      </div>
    </div>
  );
};

export default Analytics;
