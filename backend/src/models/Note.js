import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    // Mongoose automatically manages createdAt and updatedAt
    timestamps: true,
  }
);

// Compound index for searching notes by user and content
noteSchema.index({ userId: 1, title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
