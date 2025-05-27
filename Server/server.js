// const express = require('express');
// const dotenv = require('dotenv');
// const cors =require('cors');    
// const cookieParser = require('cookie-parser');  
// const database = require('./config/database');



// dotenv.config();
// const app = express();


// //Middleware
// app.use(express.json());
// app.use(cors({
//     origin: process.env.CLIENT_URL, // allowed frontend domain
//     credentials: true,   // allow cookies
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], //allowed methods
//     allowedHeaders:[
//     "Content-Type",
//     "Authorization"
//     ]
// }));
// app.use(cookieParser());


// //APPLICATION ROUTES
// const authRouter = require('./routes/authRoutes');
// app.use('/api/auth', authRouter);


// //Listening
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async ()=> {
// console.log(`server running on port http://localhost:${PORT}`);
// await database();
// });


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET)
const app = express();

// ✅ Middleware Setup
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allowed frontend domain
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// ✅ Application Routes
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/AdminRoutes"); // ✅ Added Admin Routes

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);// ✅ Now Admin Routes are included!

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  await database();
});


