const express = require('express');
const auth = require("../middleware/auth"); // optional middleware
const ReadingList = require("../models/ReadingList");

const router = express.Router();

/**
 * @route   POST /reading-list
 * @desc    Add a book to a user's reading list
 * @access  Private (requires auth)
 */
router.post('/', auth, async (req, res) => {
    try {
        const { user, book } = req.body;

        // Ensure user or book is provided
        if (!user || !book) {
            return res.status(400).json({ error: "User and book are required." });
        }

        const entry = await ReadingList.create({ user, book });
        res.status(201).json(entry);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Book already in reading list for this user.' });
        }
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /reading-list
 * @desc    Get all reading list entries (optionally filtered by user)
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const filter = {};
        if (req.query.user) filter.user = req.query.user;

        const entries = await ReadingList.find(filter)
            .populate('user', 'name email') // populate only necessary fields
            .populate('book', 'title author'); 

        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /reading-list/:id
 * @desc    Get a single reading list entry by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const entry = await ReadingList.findById(req.params.id)
            .populate('user', 'name email')
            .populate('book', 'title author');

        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   PUT /reading-list/:id
 * @desc    Update a reading list entry (only book can be updated)
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { book } = req.body;
        if (!book) return res.status(400).json({ error: "Book ID is required to update." });

        const entry = await ReadingList.findByIdAndUpdate(
            req.params.id,
            { book },
            { new: true, runValidators: true }
        );

        if (!entry) return res.status(404).json({ error: 'Entry not found' });

        res.json(entry);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Book already in reading list for this user.' });
        }
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /reading-list/:id
 * @desc    Remove a book from a user's reading list
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await ReadingList.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });

        res.json({ message: 'Entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
