const mongoose = require("mongoose");
const cron = require("node-cron");

const userReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => new Date().setHours(0,0,0,0), 
    unique: true
  },
  light: {
    type: Number,
    default: 0
  },
  moderate: {
    type: Number,
    default: 0
  },
  heavy: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("UserReport", userReportSchema);
