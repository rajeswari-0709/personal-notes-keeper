const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const requireAuth = require('../middleware/auth');

// All routes below require login
router.use(requireAuth);

// GET all notes for logged-in user, optional ?q= search term
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { user: req.session.userId };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notes.' });
  }
});

// CREATE a note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const note = new Note({
      title,
      content,
      user: req.session.userId
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating note.' });
  }
});

// UPDATE a note (only if it belongs to the logged-in user)
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating note.' });
  }
});

// DELETE a note (only if it belongs to the logged-in user)
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    res.json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting note.' });
  }
});

module.exports = router;
