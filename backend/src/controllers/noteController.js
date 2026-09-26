import Note from '../models/Note.js';

// @desc    Get all notes for authenticated user (including unassigned legacy notes)
// @route   GET /api/notes
export const getNotes = async (req, res, next) => {
  try {
    const { search } = req.query;
    const userId = req.user.uid;

    // Show notes belonging to this user, plus unassigned legacy notes
    const userScope = {
      $or: [
        { userId: userId },
        { userId: { $exists: false } },
        { userId: null },
        { userId: '' }
      ]
    };

    let query = userScope;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query = {
        $and: [
          userScope,
          {
            $or: [
              { title: { $regex: searchRegex } },
              { content: { $regex: searchRegex } }
            ]
          }
        ]
      };
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Verify ownership if note is assigned to another user
    if (note.userId && note.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this note'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note for authenticated user
// @route   POST /api/notes
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const note = await Note.create({
      userId: req.user.uid,
      title: title.trim(),
      content: content ? content.trim() : ''
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.userId && note.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this note'
      });
    }

    // Claim note for this user if it was an unassigned legacy note
    if (!note.userId) {
      note.userId = req.user.uid;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
      }
      note.title = title.trim();
    }

    if (content !== undefined) {
      note.content = content.trim();
    }

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      data: updatedNote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note by ID
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.userId && note.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
