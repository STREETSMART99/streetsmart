const cron = require('node-cron');
const Amenity = require('../models/Amenity');

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await Amenity.updateMany({}, { $set: { counter: 0 } });
    console.log('All amenity counters reset to 0');
  } catch (err) {
    console.error('Failed to reset counters:', err);
  }
});