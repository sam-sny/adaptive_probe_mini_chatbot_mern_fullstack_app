# Technical Architecture Document

## System Design

### High-Level Flow

```
┌─────────────────┐
│  React Frontend │ (Next.js on port 3000)
└────────┬────────┘
         │
         │ HTTP/JSON
         ▼
┌─────────────────────┐
│  Express Backend    │ (Node.js on port 5000)
└────────┬────────────┘
         │
         │ Queries/Saves
         ▼
┌─────────────────────────────────────────┐
│  MongoDB Atlas                          │
│  Database: adaptive-probe               │
│  Collections: sessions                  │
└─────────────────────────────────────────┘
         ▲
         │
         │ HTTP API Calls
         │
      ┌──┴──┐
      │     │
      ▼     ▼
   ┌──────────────┐
   │ OpenAI API   │ (GPT-4o-mini)
   │ (gpt-4o-mini)│
   └──────────────┘
```

---

## Data Models

### Session Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  studyContext: String,        // "Streaming App Preferences"
  
  messages: [
    {
      role: "user|assistant|system",
      content: String,
      timestamp: Date
    }
  ],
  
  isCompleted: Boolean,         // false initially
  probeCount: Number,           // 0-3 probes allowed
  summary: String,              // AI-generated after completion
  
  createdAt: Date,
  updatedAt: Date
}
```

### Message Format

Messages follow OpenAI ChatCompletion API format:
- `role`: "system", "assistant", or "user"
- `content`: The actual text
- `timestamp`: When message was created

---

## API Contract

### 1. Create Session

```
POST /api/chat/session/new

Response:
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "studyContext": "Streaming App Preferences",
    "messages": [
      {
        "role": "assistant",
        "content": "Tell us about your experience...",
        "timestamp": "2024-01-01T12:00:00Z"
      }
    ],
    "isCompleted": false,
    "probeCount": 0,
    "summary": null,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### 2. Submit Answer

```
POST /api/chat/submit

Request:
{
  "sessionId": "507f1f77bcf86cd799439011",
  "userMessage": "Netflix is easy to use"
}

Response:
{
  "success": true,
  "data": {
    // Updated session with new messages
    "messages": [
      // ... existing messages
      { "role": "user", "content": "Netflix is easy to use", ... },
      { "role": "assistant", "content": "What specifically makes it easy?", ... }
    ],
    "probeCount": 1,
    "isCompleted": false
  }
}
```

### 3. Get All Sessions

```
GET /api/chat/sessions

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studyContext": "Streaming App Preferences",
      "probeCount": 3,
      "isCompleted": true,
      "summary": "User values ease of use...",
      "createdAt": "2024-01-01T12:00:00Z",
      "updatedAt": "2024-01-01T12:30:00Z"
    }
  ]
}
```

### 4. Get Session Transcript

```
GET /api/chat/session/:sessionId/transcript

Response:
{
  "success": true,
  "data": {
    "sessionId": "507f1f77bcf86cd799439011",
    "studyContext": "Streaming App Preferences",
    "messages": [...],
    "summary": "...",
    "isCompleted": true,
    "probeCount": 3,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## AI Workflow

### System Prompt Strategy

The system prompt defines researcher behavior:

```
You are an expert, neutral qualitative market research moderator.
Your goal is to understand the "why" behind consumer choices...

1. If vague: ask ONE neutral follow-up probe
2. Never use filler words
3. If detailed OR 3 probes asked: reply "SESSION_COMPLETE"
4. Always remain professional
5. Keep probes concise (1-2 sentences)
```

### Decision Logic

```
On each user message:
  1. Append user message to session.messages
  2. Call OpenAI with [system_prompt, ...all_messages]
  3. Receive AI response
  
  4. If response == "SESSION_COMPLETE":
     - Set isCompleted = true
     - Call generateSummary()
     - Append completion message
  
  5. Else if probeCount >= 3:
     - Set isCompleted = true
     - Call generateSummary()
  
  6. Else:
     - Increment probeCount
     - Append AI response to messages
  
  7. Save session to MongoDB
  8. Return updated session to frontend
```

---

## Error Handling Strategy

### Frontend Errors

1. **Network error**: Display "Connection failed" message
2. **API error (4xx)**: Show error from backend
3. **API error (5xx)**: Show "Server error, try again"
4. **Session not found**: Redirect to home

### Backend Errors

1. **Validation error** → 400 Bad Request
2. **Not found** → 404 Not Found
3. **OpenAI API error** → 500 with message
4. **Database error** → 500 with generic message

All errors flow through global error handler in `middleware/errorHandler.js`

---

## Performance Considerations

### Optimizations

✅ **Short token limits** (max_tokens: 150 for probes) - Reduces latency  
✅ **Model choice** (gpt-4o-mini) - Fast and cheap  
✅ **MongoDB indexes** - Auto-indexed on _id, can add on createdAt  
✅ **Frontend pagination** - Dashboard can paginate sessions  

### Scalability Notes

- **Current**: Works for 100s of concurrent users
- **For 1000s**: Add Redis caching for sessions
- **For 10000s**: Add queue system (Bull/RabbitMQ) for OpenAI calls

---

## Security Considerations

⚠️ **Current Implementation** (Development):
- No authentication
- CORS allows localhost:3000
- API keys in .env files

🔒 **For Production**:
- Add JWT authentication
- Implement rate limiting
- Use environment secrets (not .env files)
- Add HTTPS
- Sanitize user input
- Add audit logging

---

## Testing Strategy

### Manual Testing

1. **Happy path**: Normal interview flow
2. **Error cases**: Submit empty message, bad sessionId
3. **Edge cases**: Very long responses, special characters
4. **Dashboard**: View multiple sessions, click through

### Automated Testing (Future)

```javascript
// Example Jest test
describe('POST /api/chat/submit', () => {
  it('should save user message and return AI response', async () => {
    const session = await chatAPI.createNewSession();
    const result = await chatAPI.submitAnswer(session._id, 'test message');
    expect(result.messages.length).toBe(3); // system + assistant + user
  });
});
```

---

## Deployment Checklist

- [ ] Set environment variables in production
- [ ] Update CORS to production frontend URL
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Setup monitoring/logging
- [ ] Test end-to-end in staging
- [ ] Configure auto-scaling
- [ ] Setup database backups
- [ ] Document deployment process

---

## Monitoring & Debugging

### Useful Commands

```bash
# View backend logs
tail -f server.log

# View MongoDB Atlas metrics
# Navigate to Metrics tab in MongoDB Atlas UI

# Test API endpoint
curl -X POST http://localhost:5000/api/chat/session/new

# Check database
# MongoDB Atlas UI → Collections → sessions
```

### Metrics to Track

- OpenAI API latency
- Database query times
- Interview completion rate
- Average probe count
- Error rates

---

End of Architecture Document
