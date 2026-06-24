const Session = require('../models/Session');
const { generateProbe, generateSummary } = require('../services/aiService');

/**
 * Initialize a new chat session
 * POST /api/chat/session/new
 * Requires: Authentication (userId from middleware)
 */
exports.createNewSession = async (req, res, next) => {
  try {
    const initialQuestion =
      'Tell us about your experience using streaming services over the last month.';

    const session = await Session.create({
      userId: req.userId, // From authMiddleware
      studyContext: 'Streaming App Preferences',
      messages: [
        {
          role: 'assistant',
          content: initialQuestion,
        },
      ],
      probeCount: 0,
      isCompleted: false,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit user answer and get AI response
 * POST /api/chat/submit
 * Body: { sessionId, userMessage }
 * Requires: Authentication (userId from middleware)
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, userMessage } = req.body;

    // Validate input
    if (!sessionId || !userMessage || userMessage.trim() === '') {
      const err = new Error('Session ID and user message are required');
      err.statusCode = 400;
      throw err;
    }

    // 1. Find the active session
    let session = await Session.findById(sessionId);
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      throw err;
    }

    // Verify the session belongs to the current user
    if (session.userId.toString() !== req.userId) {
      const err = new Error('Unauthorized: Session does not belong to you');
      err.statusCode = 403;
      throw err;
    }

    // Check if session is already completed
    if (session.isCompleted) {
      const err = new Error('This session is already completed');
      err.statusCode = 400;
      throw err;
    }

    // 2. Save user's message to database
    session.messages.push({
      role: 'user',
      content: userMessage,
    });

    // 3. Call OpenAI to generate next probe or completion signal
    const aiReply = await generateProbe(session.messages);

    // 4. Determine if interview should end
    const isSessionComplete =
      aiReply === 'SESSION_COMPLETE' || session.probeCount >= 3;

    if (isSessionComplete) {
      // Generate AI summary for this interview
      const summary = await generateSummary(session.messages);

      session.isCompleted = true;
      session.summary = summary;
      session.messages.push({
        role: 'assistant',
        content:
          'Thank you for your valuable insights! Your interview is now complete.',
      });
    } else {
      // Continue with next probe
      session.probeCount += 1;
      session.messages.push({
        role: 'assistant',
        content: aiReply,
      });
    }

    // 5. Save updated session to MongoDB
    await session.save();

    // 6. Return updated session to frontend
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific session by ID
 * GET /api/chat/session/:sessionId
 * Requires: Authentication (userId from middleware)
 */
exports.getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      throw err;
    }

    // Verify the session belongs to the current user
    if (session.userId.toString() !== req.userId) {
      const err = new Error('Unauthorized: Session does not belong to you');
      err.statusCode = 403;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all sessions for current user (for researcher dashboard)
 * GET /api/chat/sessions
 * Requires: Authentication (userId from middleware)
 */
exports.getAllSessions = async (req, res, next) => {
  try {
    // Only return sessions belonging to the current user
    const sessions = await Session.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('_id studyContext probeCount isCompleted summary createdAt updatedAt');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get session with full transcript for viewing
 * GET /api/chat/session/:sessionId/transcript
 */
exports.getSessionTranscript = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        studyContext: session.studyContext,
        messages: session.messages,
        summary: session.summary,
        isCompleted: session.isCompleted,
        probeCount: session.probeCount,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
