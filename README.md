# Adaptive Probe - MERN Stack AI Chatbot 🚀

A production-ready **Adaptive Probe** mini-chatbot built with the **MERN stack** (MongoDB, Express, React/Next.js, Node.js). This application intelligently conducts qualitative research interviews using AI-powered follow-up questions.

---

## 🎯 Features

✅ **AI-Powered Adaptive Probing**: Uses GPT-4o-mini to generate intelligent follow-up questions  
✅ **Smart Session Management**: MongoDB tracks full conversation history with metadata  
✅ **Real-time Chat UI**: Next.js frontend with responsive, modern design  
✅ **Research Dashboard**: View and analyze all completed interviews with AI summaries  
✅ **Auto-Completion**: Interview terminates after 3 probes or when AI detects completeness  
✅ **Error Handling**: Comprehensive error handling across backend and frontend  

---

## 🏗️ Project Structure

```
adaptive-probe/
│
├── server/
│   ├── models/
│   │   └── Session.js          # MongoDB Mongoose schema
│   │
│   ├── controllers/
│   │   └── chatController.js   # Route handlers
│   │
│   ├── services/
│   │   └── openaiService.js    # OpenAI API integration
│   │
│   ├── routes/
│   │   └── chatRoutes.js       # Express route definitions
│   │
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   │
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handler
│   │
│   ├── server.js               # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── app/
│   │   ├── components/         # React components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── InputArea.jsx
│   │   │   ├── SessionsList.jsx
│   │   │   └── TypingIndicator.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.jsx        # Dashboard main page
│   │   │   └── [id]/
│   │   │       └── page.jsx    # Session detail view
│   │   │
│   │   ├── layout.jsx          # Root layout
│   │   └── page.jsx            # Home page (chat)
│   │
│   ├── lib/
│   │   └── api.js              # API client utilities
│   │
│   ├── styles/
│   │   └── globals.css         # Tailwind CSS
│   │
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.local
│
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** v16+ (installed and in PATH)
- **npm** or **yarn**
- **MongoDB Atlas** account (for cloud MongoDB)
- **OpenAI API Key** (GPT-4o-mini access)

---

## ⚙️ Setup Instructions

### Step 1: Clone/Download Project

```bash
cd c:\Users\user\Desktop\Projects\fullstack_app
```

### Step 2: Setup Backend

#### 2a. Install Dependencies

```bash
cd server
npm install
```

#### 2b. Configure Environment Variables

Create a `.env` file in the `server/` directory (copy from `.env.example`):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adaptive-probe?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**How to get these keys:**

- **MongoDB**: Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), create a cluster, and get connection string
- **OpenAI**: Get API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

#### 2c. Start Backend

```bash
npm run dev
```

✅ You should see: `🚀 Server running on port 5000`

---

### Step 3: Setup Frontend

#### 3a. In a New Terminal, Navigate to Client

```bash
cd client
npm install
```

#### 3b. Start Frontend Dev Server

```bash
npm run dev
```

✅ You should see: `ready - started server on 0.0.0.0:3000`

---

## 🚀 Testing the Application

### 1. Open Browser

Navigate to: **http://localhost:3000**

### 2. Start New Interview

- Initial question appears automatically
- Type a response to your first question
- Click **Submit**

### 3. Watch AI Respond

- AI evaluates your answer
- Generates a follow-up probe if needed
- Continues for up to 3 probes
- Interview auto-completes with AI summary

### 4. View Dashboard

Click **View Researcher Dashboard** (bottom right) to:
- See all past interviews
- View AI-generated summaries
- Click any session to see full transcript

---

## 📡 API Endpoints

### POST `/api/chat/session/new`
Create a new interview session

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "studyContext": "Streaming App Preferences",
    "messages": [...],
    "isCompleted": false,
    "probeCount": 0,
    "createdAt": "..."
  }
}
```

### POST `/api/chat/submit`
Submit user answer and get AI response

**Request:**
```json
{
  "sessionId": "...",
  "userMessage": "Netflix is my favorite..."
}
```

### GET `/api/chat/sessions`
Get all sessions (for dashboard)

### GET `/api/chat/session/:sessionId/transcript`
Get full session transcript with AI summary

---

## 🧠 How It Works

1. **User opens app** → Backend creates new session
2. **User submits answer** → Saved to MongoDB
3. **Backend calls OpenAI** → GPT-4o-mini evaluates response
4. **AI decides**: Is answer detailed? If yes, mark complete. If no, generate probe.
5. **Frontend updates** → Shows new message and waits for next input
6. **Repeat** until 3 probes asked or interview complete
7. **Dashboard** → Researchers view all sessions and AI summaries

---

## 🛠️ Troubleshooting

### Backend won't connect to MongoDB
- Check MONGODB_URI in .env is correct
- Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for development)
- Check internet connection

### OpenAI API errors
- Verify OPENAI_API_KEY is valid and has available credits
- Check rate limits at platform.openai.com

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in client/.env.local matches backend URL
- Check CORS settings in server.js

### Port already in use
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For port 3000:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📝 Key Files Explained

### Server Side

**server.js** - Express app initialization with CORS and routes

**models/Session.js** - MongoDB schema storing messages array (conversation history)

**services/openaiService.js** - Wrapper around OpenAI API with system prompt

**controllers/chatController.js** - Route handlers (create session, submit answer, fetch sessions)

**config/db.js** - MongoDB connection logic

### Client Side

**components/ChatContainer.jsx** - Main component managing session state and API calls

**components/ChatWindow.jsx** - Displays messages array with user/assistant bubbles

**components/InputArea.jsx** - Text input form for user answers

**lib/api.js** - Axios HTTP client with baseURL pointing to backend

**app/dashboard/page.jsx** - Lists all sessions

**app/dashboard/[id]/page.jsx** - Displays full transcript and AI summary

---

## 🚀 Production Deployment

### Backend (Node.js + Express)
- Deploy to **Heroku**, **Render**, or **AWS EC2**
- Use environment variables for secrets
- Set `NODE_ENV=production`

### Frontend (Next.js)
- Deploy to **Vercel** (recommended for Next.js)
- Or deploy to **Netlify** with static build
- Set `NEXT_PUBLIC_API_URL` to production backend URL

### Database (MongoDB)
- Use **MongoDB Atlas** (cloud)
- Ensure IP whitelist includes production server

---

## 📊 Example Interview Flow

```
System: "Tell us about your streaming services experience"

User: "Netflix is easy"

AI Analysis: Vague → Generate probe
AI: "What specifically makes it easy?"

User: "The interface is intuitive and recommendations are good"

AI Analysis: Detailed → More probing possible
AI: "How do recommendations compare to other services?"

User: "Better than Hulu, similar to Prime Video"

AI Analysis: Comprehensive + 2 probes done → Can continue
AI: "What would improve your experience?"

User: "Lower prices, more diverse content"

AI Analysis: Very detailed + 3 probes → Session complete
Session ends, AI summary generated
```

---

## 🎯 Architectural Highlights

✅ **Separation of Concerns** - Models, controllers, services isolated  
✅ **Stateless Backend** - MongoDB is source of truth  
✅ **AI Memory** - Full conversation history sent to GPT every request  
✅ **Error Handling** - Graceful failures with meaningful error messages  
✅ **Responsive UI** - Works on desktop and mobile  
✅ **Research Dashboard** - Admin view mirrors production research platforms  

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

---

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for qualitative research teams and product analysts.**

---

## 🤝 Next Steps

1. **Customize system prompt** in `server/services/openaiService.js` for your use case
2. **Add authentication** (JWT tokens, Google OAuth)
3. **Deploy to production** (Vercel for frontend, Render/AWS for backend)
4. **Add data export** (CSV, PDF transcripts)
5. **Implement analytics** (track completion rates, average interview duration)

Good luck! 🚀
