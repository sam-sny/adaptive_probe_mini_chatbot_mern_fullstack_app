# 🔧 Complete Troubleshooting & Testing Guide

## 🎯 Quick Diagnostics

Run these commands to diagnose issues:

```bash
# Check Node.js version (need v16+)
node --version

# Check npm version
npm --version

# Check if ports are in use
# Windows:
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# macOS/Linux:
lsof -i :5000
lsof -i :3000

# Check backend health
curl http://localhost:5000/api/health
```

---

## 📌 Common Issues & Solutions

### ❌ Issue 1: "Cannot connect to MongoDB"

#### Symptoms:
```
❌ Error connecting to MongoDB: connect ECONNREFUSED
```

#### Solutions (in order):

**1a. Check MongoDB URI format**
```env
# WRONG:
MONGODB_URI=mongodb://username:password@cluster...

# CORRECT (with +srv):
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adaptive-probe?retryWrites=true&w=majority
```

**1b. Verify credentials**
```
MongoDB Atlas → Your Cluster → Connect → Drivers
Copy the exact connection string and replace:
- username: your database user
- password: your database password (URL encode special chars)
- cluster name: your actual cluster name
```

**1c. Special characters in password**

If your password contains `@`, `#`, `$`, etc., URL encode them:
```
@ = %40
# = %23
$ = %24
% = %25
/ = %2F
```

**Example:**
```
Password: my@pass#123
URL: my%40pass%23123
```

**1d. IP Whitelist**

MongoDB Atlas requires IP whitelist:
1. Go to MongoDB Atlas
2. Network Access → IP Whitelist
3. Add IP Address → "0.0.0.0/0" (for development)
4. Add and Save

**1e. Test Connection Directly**

```bash
# From backend folder, create test file:
# test-mongo.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

# Run it:
node test-mongo.js
```

---

### ❌ Issue 2: "OpenAI API Key Error"

#### Symptoms:
```
❌ Error 401: Invalid authentication credentials
```

#### Solutions:

**2a. Check API Key Format**
```
# WRONG:
OPENAI_API_KEY=my-api-key

# CORRECT (starts with sk-proj-):
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**2b. Verify Key is Valid**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Check your key exists
3. Copy the **full** key (don't miss any characters)
4. Paste into `.env` (no quotes needed)

**2c. Check Account Has Credits**
1. Go to [platform.openai.com/account/billing/overview](https://platform.openai.com/account/billing/overview)
2. Check "Available balance" > $0
3. If $0, add a payment method or credits

**2d. Check Rate Limits**
1. Go to [platform.openai.com/account/rate-limits](https://platform.openai.com/account/rate-limits)
2. Check you haven't exceeded limits
3. Wait if necessary

**2e. Test API Key**

```bash
# Create test file: test-openai.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say hello' }
      ],
      max_tokens: 10,
    });
    console.log('✅ OpenAI API Key Valid!');
    console.log('Response:', response.choices[0].message.content);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();

# Run it:
node test-openai.js
```

---

### ❌ Issue 3: "Port 5000 already in use"

#### Symptoms:
```
EADDRINUSE: address already in use :::5000
```

#### Solutions:

**3a. Find process using port (Windows)**
```bash
netstat -ano | findstr :5000

Output:
  TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345

Kill the process:
taskkill /PID 12345 /F
```

**3b. Find process using port (macOS/Linux)**
```bash
lsof -i :5000

Output:
node    12345 user    10u  IPv6 ...

Kill the process:
kill -9 12345
```

**3c. Use different port**

If you want to keep the other process:
```
# In server/.env
PORT=5001

# Restart backend
# In frontend client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

### ❌ Issue 4: "Frontend can't connect to backend"

#### Symptoms:
```
Error: Network Error
Failed to fetch http://localhost:5000/api/chat/session/new
```

#### Solutions:

**4a. Check backend is running**
```bash
# Open new terminal and test:
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running","timestamp":"2024-01-01T12:00:00.000Z"}

# If error, start backend:
cd server
npm run dev
```

**4b. Check NEXT_PUBLIC_API_URL**

File: `client/.env.local`
```env
# Check this matches your backend:
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**4c. Check CORS is enabled**

File: `server/server.js`
```javascript
// Should have:
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

**4d. Check FRONTEND_URL in backend .env**

File: `server/.env`
```env
# Should match frontend URL:
FRONTEND_URL=http://localhost:3000
```

**4e. Clear browser cache**
1. Press `F12` → DevTools
2. Right-click refresh button → "Empty cache and hard refresh"
3. Try again

---

### ❌ Issue 5: "Port 3000 already in use"

#### Symptoms:
```
Error: listen EADDRINUSE: address already in use :::3000
```

#### Solutions (same as Port 5000):

```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

Or use different port:
```bash
cd client
npm run dev -- -p 3001
```

---

### ❌ Issue 6: "Missing dependencies"

#### Symptoms:
```
Cannot find module 'express'
Cannot find module 'mongoose'
```

#### Solutions:

**6a. Reinstall dependencies**
```bash
# Backend:
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend:
cd ../client
rm -rf node_modules package-lock.json
npm install
```

**6b. Check Node version**
```bash
node --version    # Should be v16 or higher
```

If lower, upgrade from https://nodejs.org/

---

### ❌ Issue 7: "AI not responding / timeout"

#### Symptoms:
```
Error: Request timeout
No response from AI
Waiting forever...
```

#### Solutions:

**7a. Check OpenAI API status**
1. Go to [status.openai.com](https://status.openai.com)
2. Check if services are operational
3. If down, wait for recovery

**7b. Increase timeout in backend**

File: `server/services/openaiService.js`
```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: apiMessages,
  timeout: 60000,  // Increase this (milliseconds)
});
```

**7c. Check API rate limits**

You might have hit rate limits. Wait a few minutes and try again.

**7d. Test OpenAI directly**

```bash
# From server folder:
node -e "
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 10
}).then(r => console.log('✅ Works!', r.choices[0].message.content))
.catch(e => console.error('❌ Error:', e.message));
"
```

---

### ❌ Issue 8: ".env file not found"

#### Symptoms:
```
Error: ENOENT: no such file or directory, open '.env'
undefined is not a valid key
```

#### Solutions:

**8a. Create .env file**

Backend:
```bash
cd server
# Windows:
type nul > .env
# macOS/Linux:
touch .env
```

Add to it:
```env
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-proj-...
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Frontend:
```bash
cd client
# Windows:
type nul > .env.local
# macOS/Linux:
touch .env.local
```

Add to it:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**8b. Restart servers after creating .env**

Changes to .env require restart:
```bash
# Stop (Ctrl+C) and restart:
npm run dev
```

---

## 🧪 Testing Workflow

### Step 1: Verify Backend

```bash
# Terminal 1:
cd server
npm run dev

# Wait for:
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Step 2: Verify Frontend

```bash
# Terminal 2:
cd client
npm run dev

# Wait for:
✓ Ready in 3.2s
```

### Step 3: Test Health Endpoints

```bash
# Terminal 3:
# Test backend
curl http://localhost:5000/api/health

# Expected:
{"status":"Server is running","timestamp":"..."}
```

### Step 4: Test Full Flow in Browser

1. Open http://localhost:3000
2. See initial question
3. Type: "Netflix is great"
4. Click Submit
5. Wait 2-3 seconds
6. See AI response
7. Type another response
8. Repeat 3 times
9. See "Thank you" and summary

---

## 📊 Browser DevTools Testing

### Console Tab (F12)

Look for errors:
```javascript
// Error example:
GET http://localhost:5000/api/chat/session/new 404

// Fix: Ensure backend is running
```

### Network Tab (F12)

Check API calls:
1. Click any network request
2. See Response tab
3. Look for error messages

### Application Tab (F12)

Check stored data:
- Local Storage → Check API URL
- Cookies → Should be empty for local dev

---

## 📋 Manual API Testing (Postman/Curl)

### Test 1: Create Session

```bash
curl -X POST http://localhost:5000/api/chat/session/new \
  -H "Content-Type: application/json"

# Expected response:
{
  "success": true,
  "data": {
    "_id": "...",
    "messages": [{"role": "assistant", "content": "Tell us..."}],
    "isCompleted": false
  }
}
```

### Test 2: Submit Answer

```bash
curl -X POST http://localhost:5000/api/chat/submit \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "COPY_FROM_TEST_1",
    "userMessage": "Netflix is great"
  }'

# Expected response:
{
  "success": true,
  "data": {
    "messages": [
      {"role": "assistant", "content": "Tell us..."},
      {"role": "user", "content": "Netflix is great"},
      {"role": "assistant", "content": "What makes..."}
    ],
    "probeCount": 1
  }
}
```

### Test 3: Get All Sessions

```bash
curl http://localhost:5000/api/chat/sessions

# Expected response:
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

## ✅ Success Checklist

All of these should show ✅:

- [ ] `node --version` shows v16+
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts without errors
- [ ] Backend console shows "✅ MongoDB Connected"
- [ ] Backend console shows "🚀 Server running on port 5000"
- [ ] Frontend console shows "✓ Ready in 3.2s"
- [ ] `curl http://localhost:5000/api/health` returns success
- [ ] http://localhost:3000 loads in browser
- [ ] Initial question appears on screen
- [ ] Can type in textarea
- [ ] Submit button works
- [ ] AI generates response (wait 2-3 sec)
- [ ] Response appears in chat
- [ ] After 3 exchanges, interview completes
- [ ] Summary box appears
- [ ] Dashboard link works
- [ ] Dashboard shows your session

**All checked? You're ready to go!** 🎉

---

## 📞 Support Resources

| Issue Type | Resource |
|-----------|----------|
| MongoDB | [MongoDB Docs](https://docs.mongodb.com) |
| Express | [Express Docs](https://expressjs.com) |
| Next.js | [Next.js Docs](https://nextjs.org/docs) |
| Node.js | [Node.js Docs](https://nodejs.org/docs) |
| OpenAI | [OpenAI Docs](https://platform.openai.com/docs) |

---

Keep this file handy when testing! 🔧
