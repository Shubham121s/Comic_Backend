const express = require('express');
const ComicBook = require('../models/ComicBook');
const router = express.Router();

// Create a comic book
router.post('/', async (req, res) => {
  try {
    const comic = new ComicBook(req.body);
    await comic.save();
    res.status(201).json(comic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all comic books (with pagination, filtering, sorting)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'bookName', ...filters } = req.query;
    const comics = await ComicBook.find(filters)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(comics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comic book details by ID
router.get('/:id', async (req, res) => {
  try {
    const comic = await ComicBook.findById(req.params.id);
    if (!comic) return res.status(404).json({ message: 'Comic not found' });
    res.json(comic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a comic book
router.put('/:id', async (req, res) => {
  try {
    const comic = await ComicBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comic) return res.status(404).json({ message: 'Comic not found' });
    res.json(comic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comic book
router.delete('/:id', async (req, res) => {
  try {
    const comic = await ComicBook.findByIdAndDelete(req.params.id);
    if (!comic) return res.status(404).json({ message: 'Comic not found' });
    res.json({ message: 'Comic deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
