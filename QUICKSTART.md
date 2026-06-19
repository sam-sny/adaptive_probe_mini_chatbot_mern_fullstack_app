# 🚀 QUICK START - Run This First!

## ✅ You Have Everything Set Up

Your MERN stack application is **complete and ready to test**. Follow these steps to run it.

---

## 📋 Before You Start

Make sure you have:
1. ✅ Node.js installed (`node --version`)
2. ✅ MongoDB Atlas account with connection string
3. ✅ OpenAI API key
4. ✅ Created `server/.env` with your keys
5. ✅ Created `client/.env.local`

If you haven't done these, **read [RUNNING_GUIDE.md](RUNNING_GUIDE.md) first** (Steps 1-4).

---

## 🚀 Option 1: Automated Start (Easiest)

### Windows
Double-click: `start-dev.bat`

Or from Command Prompt:
```cmd
start-dev.bat
```

### macOS/Linux
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This will:
- ✅ Check for Node.js
- ✅ Verify .env files exist
- ✅ Start backend on port 5000
- ✅ Start frontend on port 3000

---

## 🖥️ Option 2: Manual Start (Full Control)

### Terminal 1 - Backend

```bash
cd server
npm install        # Only first time
npm run dev
```

Wait for:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

### Terminal 2 - Frontend

```bash
cd client
npm install        # Only first time
npm run dev
```

Wait for:
```
✓ Ready in 3.2s
Local: http://localhost:3000
```

---

## 🧪 Step 3: Test in Browser

Open: **http://localhost:3000**

### Interview Flow:
1. ✅ Initial question appears
2. ✅ Type a response (e.g., "Netflix is great")
3. ✅ Click Submit
4. ✅ Wait for AI response (2-3 seconds)
5. ✅ Continue for 3 probes total
6. ✅ Interview completes
7. ✅ Green summary box appears
8. ✅ Click "View Researcher Dashboard"
9. ✅ See all sessions listed

---

## ✅ Success Indicators

You'll know it's working when you see:

| Component | Sign of Success |
|-----------|-----------------|
| Backend | `✅ MongoDB Connected` and `🚀 Server running` |
| Frontend | `✓ Ready in 3.2s` and loads http://localhost:3000 |
| Chat | Initial question appears on screen |
| Submit | Response is sent and AI responds |
| Completion | After 3 probes, green summary box |
| Dashboard | Lists all completed interviews |

---

## 🛑 If Something Goes Wrong

### Backend won't start?
```bash
# Check MongoDB URI is correct
# Check OpenAI API key is valid
# Check ports 5000 isn't in use:
netstat -ano | findstr :5000
```

### Frontend won't load?
```bash
# Check backend is running first
# Check NEXT_PUBLIC_API_URL=http://localhost:5000 in client/.env.local
# Check port 3000 isn't in use:
netstat -ano | findstr :3000
```

### See complete troubleshooting in [RUNNING_GUIDE.md](RUNNING_GUIDE.md)

---

## 📊 Testing Checklist

Go through this after starting both services:

- [ ] Backend console shows "✅ MongoDB Connected"
- [ ] Frontend loads and displays chat interface
- [ ] Initial question appears: "Tell us about streaming services..."
- [ ] Can type in the textarea
- [ ] Submit button works
- [ ] AI generates a response (takes 2-3 seconds)
- [ ] Response appears in chat
- [ ] Continue conversation for 3 rounds
- [ ] After 3 probes, "Thank you for your insights" appears
- [ ] Green summary box shows below input area
- [ ] "View Researcher Dashboard" link works
- [ ] Dashboard shows your interview session
- [ ] Can click session to see full transcript

**If all items checked ✅: Your app is fully working!**

---

## 📚 Next Steps

### To Understand the Architecture
- Read [ARCHITECTURE.md](ARCHITECTURE.md)

### To Deploy to Production
- Read [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md)

### For Complete Documentation
- Read [README.md](README.md)

### For Detailed Running Instructions
- Read [RUNNING_GUIDE.md](RUNNING_GUIDE.md)

---

## 🎯 Key Endpoints

While testing, you can also call these directly:

```bash
# Test backend health
curl http://localhost:5000/api/health

# Create a new session
curl -X POST http://localhost:5000/api/chat/session/new

# Get all sessions
curl http://localhost:5000/api/chat/sessions
```

---

## 💡 Pro Tips

1. **Keep multiple terminals open**: One for backend, one for frontend, one for testing
2. **Watch backend logs**: They show what's happening with each request
3. **Use browser DevTools**: Network tab shows API calls, Console shows any errors
4. **Read error messages carefully**: They usually tell you exactly what's wrong
5. **Restart backend if files change**: Some changes require restart (not auto-reloaded)

---

## 🚀 You're Ready!

Your MERN stack application is:
- ✅ Fully built
- ✅ Fully configured
- ✅ Ready to test
- ✅ Scalable architecture
- ✅ Production-ready code

**Now run it and test it!** 🎉

Questions? Check the [RUNNING_GUIDE.md](RUNNING_GUIDE.md) for detailed troubleshooting.
