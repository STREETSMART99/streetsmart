const cron = require("node-cron");
const UserReport = require("./UserReport");

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    await UserReport.updateOne(
      { date: new Date().setHours(0,0,0,0) },
      { $set: { light: 0, moderate: 0, heavy: 0 } },
      { upsert: true }
    );
    console.log("User report counts reset for the new day.");
  } catch (err) {
    console.error("Failed to reset user reports:", err);
  }
});