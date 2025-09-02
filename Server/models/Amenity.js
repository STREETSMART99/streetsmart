const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  name: String,
  description: String,
  availability: String,
  location: {
    type: [Number],
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  open: {
    type: String,
    default: "",
  },
  close: {
    type: String,
    default: "",
  },
  cutoff: {
    type: String,
    default: "",
  },
  maxCapacity: {
    type: Number,
    default: 0,
  },
  services: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Amenity', AmenitySchema);