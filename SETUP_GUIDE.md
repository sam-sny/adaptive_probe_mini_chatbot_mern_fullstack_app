# Setup Guide - Adaptive Probe MERN Stack

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup

In new terminal:
```bash
cd client
npm install
npm run dev
```

### 3. Access Application

- **Chat**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Backend Health**: http://localhost:5000/api/health

---

## Getting API Keys

### MongoDB Atlas

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string: "Connect" → "Drivers" → Copy connection string
5. Replace `<password>` with your database password

### OpenAI API Key

1. Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new API key
3. Copy and paste into `.env`

---

## Development Workflow

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev

# Terminal 3: Database administration (optional)
# Use MongoDB Atlas UI at mongodb.com/cloud/atlas
```

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Chat appears with initial question
- [ ] Can type and submit responses
- [ ] AI generates follow-up questions
- [ ] Interview completes after 3 probes
- [ ] Dashboard shows completed sessions
- [ ] Can click session to view full transcript

---

## Useful Commands

```bash
# View all sessions in MongoDB (from MongoDB Atlas UI)
# Collections → adaptive-probe → sessions

# Restart backend
# Stop Terminal 1, run: npm run dev

# Restart frontend
# Stop Terminal 2, run: npm run dev

# Clear Node cache (if issues):
rm -rf node_modules
npm install
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` |
| MongoDB connection fails | Check MONGODB_URI, verify IP whitelist (0.0.0.0/0) |
| OpenAI errors | Verify API key, check rate limits |
| Frontend can't reach backend | Check NEXT_PUBLIC_API_URL, ensure backend running |

---

Enjoy building! 🚀
