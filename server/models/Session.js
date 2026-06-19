const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['system', 'assistant', 'user'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SessionSchema = new mongoose.Schema({
  // User who owns this session
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Tracks who or what project this chat belongs to
  studyContext: {
    type: String,
    default: 'Streaming App Preferences',
  },

  // Array storing the exact dialogue history for LLM context memory
  messages: [MessageSchema],

  // Status flags to handle UI states and analytics
  isCompleted: {
    type: Boolean,
    default: false,
  },

  // Track number of probes to prevent infinite loops
  probeCount: {
    type: Number,
    default: 0,
  },

  // Optional: Store AI-generated summary after interview completes
  summary: {
    type: String,
    default: null,
  },

  // Metadata for admin dashboard
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update updatedAt timestamp on save
SessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', SessionSchema);
