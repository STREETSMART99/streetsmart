const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const cors = require('cors');

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET)
const app = express();

// ✅ Middleware Setup
app.use(express.json());
app.use(
  cors({
    origin: 'https://streetsmart-client.onrender.com', // your frontend URL
    credentials: true
  })
);
app.use(cookieParser());

// ✅ Application Routes
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/AdminRoutes"); 
const amenitiesRouter = require('./routes/amenitiesRoutes'); 

// daily reset cron job
require('./cron/resetCounter');
require('./cron/resetUserReport');

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use('/api/amenities', amenitiesRouter); 


// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  await database();
});


