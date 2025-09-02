const express = require('express');
const router = express.Router();
const Amenity = require('../models/Amenity');

// Get live counter for an amenity
router.get('/:id/counter', async (req, res) => {
  const amenity = await Amenity.findById(req.params.id);
  if (!amenity) return res.status(404).send('Not found');
  res.json({ counter: amenity.counter });
});

// Update counter (simulate IoT update)
router.post('/:id/counter', async (req, res) => {
  const { value } = req.body;
  const amenity = await Amenity.findByIdAndUpdate(
    req.params.id,
    { $set: { counter: value } },
    { new: true }
  );
  if (!amenity) return res.status(404).send('Not found');
  res.json({ counter: amenity.counter });
});

module.exports = router;