# 🚀 Authentication System - Quick Start Guide

## Getting Started

### 1. **Start Backend Server**
```bash
cd server
npm install  # Already done, but run again if needed
npm run dev  # Starts on http://localhost:5000
```

### 2. **Start Frontend**
```bash
cd client
npm install  # If needed
npm run dev  # Starts on http://localhost:3000
```

### 3. **Navigate to Application**
Open **http://localhost:3000** in your browser

---

## First Time Setup

### ✅ Option A: Create New Account

1. **Click "Sign Up"** in top navigation or go to `http://localhost:3000/auth/signup`
2. **Fill in the form:**
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `mypassword123`
   - Confirm: `mypassword123`
3. **Click "Create Account"**
4. ✅ You're now logged in!
5. **Start interviewing:** You'll see the chat interface

### ✅ Option B: Use Demo Account

1. **Click "Sign In"** or go to `http://localhost:3000/auth/login`
2. **Click "Use Demo Account" button** (auto-fills fields)
3. **Click "Sign In"**
   - Email: `demo@example.com`
   - Password: `password123`
4. ✅ You're now logged in!

### ✅ Option C: Create Demo Account First

If demo account doesn't exist, create it manually:
1. Go to Signup: `http://localhost:3000/auth/signup`
2. Enter:
   - Name: `Demo User`
   - Email: `demo@example.com`
   - Password: `password123`
3. Click "Create Account"
4. You now have the demo account!

---

## What You Can Now Do

### 💬 **Chat/Interview**
- Home page (`/`) shows the adaptive interview interface
- You'll see the initial question from the AI
- Type your responses
- AI will ask up to 3 follow-up probes
- After complete, you get an AI-generated summary

### 📊 **Dashboard**
- Click "Dashboard" in navbar
- See all your past interviews
- Click any interview to view full transcript
- See AI summary of insights

### 👤 **User Account**
- Navbar shows your name and email
- Click "Logout" to sign out
- After logout, redirected to login page
- Your data is saved in MongoDB

---

## Key Features Included

✅ **Secure Authentication**
- Passwords hashed with bcrypt
- JWT token-based auth
- Token auto-injected in API calls

✅ **User-Specific Data**
- Each user only sees their own interviews
- Sessions tied to user account
- Cannot access other users' data

✅ **Professional UI**
- Responsive design
- Real-time auth state
- Toast notifications for errors/success
- Loading states and spinners

✅ **Automatic Token Management**
- Token stored in localStorage
- Auto-cleared on logout
- Expired tokens redirect to login

---

## Testing Workflows

### Test 1: Complete Interview
```
1. Login with demo account
2. Answer the first question
3. AI asks follow-ups (up to 3)
4. Interview auto-completes
5. See AI-generated summary
6. Go to Dashboard → See interview recorded
```

### Test 2: Multiple Accounts
```
1. Create Account A (email: user1@test.com)
2. Create 1 interview
3. Logout
4. Create Account B (email: user2@test.com)
5. Create 1 interview
6. Logout
7. Login as Account A
8. Dashboard shows only Account A's interview
9. Verify Account B's interview NOT visible
```

### Test 3: Protected Routes
```
1. Logout
2. Try accessing: http://localhost:3000/
3. Should redirect to: http://localhost:3000/auth/login
4. After login, can access all pages
```

### Test 4: Session Persistence
```
1. Login
2. Go to Dashboard
3. Note a session ID
4. Close browser (or tab)
5. Reopen http://localhost:3000
6. Should still be logged in
7. Navigate to same session
8. All data still there ✅
```

---

## Navbar Navigation

When **logged in**, navbar shows:
```
🚀 Adaptive Probe | Dashboard | John Doe (john@test.com) | [Logout]
```

When **logged out**, navbar shows:
```
🚀 Adaptive Probe | [Sign In] | [Sign Up]
```

---

## Error Handling

### Common Errors & Solutions

**"User already exists with this email"**
- Email already registered
- Use different email or reset password

**"Invalid email or password"**
- Credentials incorrect
- Check email and password
- Try with demo account

**"No token provided"**
- Session expired
- Click logout and login again

**"Unauthorized: Session does not belong to you"**
- Trying to access another user's session
- Only visible in dev tools/API
- UI prevents this automatically

**"Cannot read property 'userId' of null"**
- Auth context not loaded
- Refresh page
- Clear localStorage and login again

---

## Technical Details

### API Endpoints

```
POST   /api/auth/register       → Create account
POST   /api/auth/login          → Login
GET    /api/auth/me             → Get current user
POST   /api/auth/logout         → Logout

POST   /api/chat/session/new    → Start interview (requires auth)
POST   /api/chat/submit         → Send message (requires auth)
GET    /api/chat/sessions       → Get all user's sessions (requires auth)
GET    /api/chat/session/:id    → Get specific session (requires auth)
GET    /api/chat/session/:id/transcript → Get full transcript (requires auth)
```

### Request Format

```javascript
// With Authentication
headers: {
  Authorization: "Bearer <jwt_token>",
  Content-Type: "application/json"
}
```

### Response Format

```javascript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: "Error message"
}
```

---

## Troubleshooting

### "Infinite redirect to login"
- Clear localStorage: `localStorage.clear()`
- Refresh browser
- Login again

### "Cannot connect to backend"
- Ensure backend running: `npm run dev` in server folder
- Check port 5000 is open
- Check `.env` files are configured

### "Chat not working after login"
- Refresh page
- Check browser console for errors
- Verify token in localStorage: `localStorage.getItem('token')`

### "Logout button not showing"
- Refresh page
- Check AuthProvider is in layout.jsx
- Verify Navbar component imported

---

## Next Steps

After authentication is working:

1. **Add OAuth** (Google, GitHub)
   - `server/routes/authRoutes.js` - add OAuth endpoints
   - `client/app/auth/login/page.jsx` - add OAuth buttons

2. **Email Verification**
   - Send email confirmation on signup
   - Verify before allowing chat

3. **Password Reset**
   - Email-based password recovery
   - Token-based reset flow

4. **Admin Dashboard**
   - View all users
   - View all sessions
   - Analytics and insights

5. **API Keys**
   - Let users generate API keys
   - Access chat via REST API

---

## Support

### When stuck:

1. **Check Auth Documentation** → `AUTH_DOCUMENTATION.md`
2. **Check Browser Console** → F12 → Console tab
3. **Check Backend Logs** → Terminal running server
4. **Check MongoDB** → MongoDB Atlas console
5. **Check Credentials** → `.env` files in server and client

### Database Connection

If MongoDB not connecting:
1. Open MongoDB Atlas
2. Go to "Network Access"
3. Check IP is whitelisted (should be 0.0.0.0/0 for dev)
4. Check connection string in `.env`

---

**Status:** ✅ Ready to use!  
**Created:** 2024  
**Last Updated:** Today
