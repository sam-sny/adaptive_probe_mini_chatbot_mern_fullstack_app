const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

// All chat routes require authentication
router.use(authMiddleware);

// Create new chat session
router.post('/session/new', chatController.createNewSession);

// Submit user answer and get AI response
router.post('/submit', chatController.submitAnswer);

// Get specific session
router.get('/session/:sessionId', chatController.getSession);

// Get session transcript (full conversation)
router.get('/session/:sessionId/transcript', chatController.getSessionTranscript);

// Get all sessions (for researcher dashboard)
router.get('/sessions', chatController.getAllSessions);

module.exports = router;
