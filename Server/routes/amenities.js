router.put('/:id', async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        availability: req.body.availability,
        location: req.body.location,
        isOpen: req.body.isOpen,
        open: req.body.open,
        close: req.body.close,
        cutoff: req.body.cutoff,
        counter: req.body.counter,
        maxCapacity: req.body.maxCapacity, 
        services: req.body.services,      
      },
      { new: true }
    );
    res.json(amenity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (add)
router.post('/', async (req, res) => {
  try {
    const amenity = new Amenity({
      name: req.body.name,
      description: req.body.description,
      availability: req.body.availability,
      location: req.body.location,
      isOpen: req.body.isOpen,
      open: req.body.open,
      close: req.body.close,
      cutoff: req.body.cutoff,
      counter: req.body.counter,
      maxCapacity: req.body.maxCapacity, // <-- make sure this is here
      services: req.body.services,       // <-- and this
    });
    await amenity.save();
    res.json(amenity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});