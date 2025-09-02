const express = require('express');
const router = express.Router();
const Amenity = require('../models/Amenity');

// Add new amenity
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      availability,
      location,
      isOpen,
      open,
      close,
      cutoff,
      maxCapacity,
      services,
      counter
    } = req.body;
    const amenity = new Amenity({
      name,
      description,
      availability,
      location,
      isOpen,
      open,
      close,
      cutoff,
      maxCapacity,
      services,
      counter: counter ?? 0
    });
    await amenity.save();
    res.json(amenity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all amenities
router.get('/', async (req, res) => {
  const amenities = await Amenity.find();
  res.json(amenities);
});

// Update amenity
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      availability,
      location,
      isOpen,
      open,
      close,
      cutoff,
      maxCapacity,
      services,
      counter
    } = req.body;
    const amenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        availability,
        location,
        isOpen,
        open,
        close,
        cutoff,
        maxCapacity,
        services,
        counter: counter ?? 0
      },
      { new: true }
    );
    res.json(amenity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete amenity
router.delete('/:id', async (req, res) => {
  try {
    await Amenity.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;