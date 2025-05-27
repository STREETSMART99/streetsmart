const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/AdminMiddleware");

const router = express.Router();

router.get("/AdminDashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
});

module.exports = router;