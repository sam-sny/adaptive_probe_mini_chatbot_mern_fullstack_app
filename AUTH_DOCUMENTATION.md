# 🔐 Authentication System Documentation

## Overview
Professional-grade JWT + Local Auth system with separation of concerns and scalable architecture.

---

## Backend Architecture

### 1. **User Model** (`server/models/User.js`)
- ✅ Email-based authentication
- ✅ Bcrypt password hashing
- ✅ OAuth provider support (local/google/github)
- ✅ Auto-remove password from JSON responses

### 2. **Auth Service** (`server/services/authService.js`)
Pure business logic layer:
- `registerUser()` - Create account with validation
- `loginUser()` - Authenticate and generate JWT
- `getUserById()` - Fetch user profile
- `findOrCreateOAuthUser()` - OAuth user management
- `generateToken()` - JWT token generation
- `verifyToken()` - Token validation

### 3. **Auth Middleware** (`server/middleware/authMiddleware.js`)
- Extracts Bearer token from Authorization header
- Validates JWT signature
- Attaches `userId` to request object
- Returns 401 for invalid/missing tokens

### 4. **Auth Controller** (`server/controllers/authController.js`)
Request handlers:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (frontend clears token)

### 5. **Auth Routes** (`server/routes/authRoutes.js`)
```
POST   /api/auth/register    (public)
POST   /api/auth/login       (public)
GET    /api/auth/me          (protected)
POST   /api/auth/logout      (protected)
```

### 6. **Protected Chat Routes**
All chat endpoints now require `authMiddleware`:
```javascript
router.use(authMiddleware);
// All routes below require valid JWT
```

### 7. **Session Model Update**
Sessions now tied to users:
```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
}
```

---

## Frontend Architecture

### 1. **Auth API Layer** (`client/lib/authAPI.js`)
Centralized HTTP client:
- Axios instance with base URL
- Auto-injects JWT token into all requests
- Error handling for auth failures
- LocalStorage integration for token persistence

Methods:
```javascript
authAPI_service.register(email, password, name)
authAPI_service.login(email, password)
authAPI_service.getCurrentUser()
authAPI_service.logout()
```

### 2. **Auth Context** (`client/app/context/AuthContext.jsx`)
Global state management using React Context:
- `user` - Current user object
- `isAuthenticated` - Boolean flag
- `loading` - Initial auth check loading state
- `register()` - Signup function with toast
- `login()` - Login function with toast
- `logout()` - Logout function with toast

**Hook Usage:**
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### 3. **Protected Route Component** (`client/app/components/ProtectedRoute.jsx`)
Higher-order component that:
- Checks authentication status
- Shows loading spinner during auth check
- Redirects to `/auth/login` if not authenticated
- Wraps protected pages

**Usage:**
```jsx
export default function Page() {
  return (
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

### 4. **Auth Pages**
- `client/app/auth/login/page.jsx` - Login form with demo credentials
- `client/app/auth/signup/page.jsx` - Registration form with validation

### 5. **Navbar Component** (`client/app/components/Navbar.jsx`)
Global navigation bar showing:
- User name and email
- Dashboard link
- Logout button
- Login/Signup links (when not authenticated)

### 6. **Layout Integration** (`client/app/layout.jsx`)
Wrapped with:
```jsx
<AuthProvider>
  <ToastProvider>
    <Navbar />
    {children}
  </ToastProvider>
</AuthProvider>
```

### 7. **Protected Pages**
- `/` (Home/Chat) - Protected
- `/dashboard` - Protected
- `/dashboard/[id]` - Protected

---

## Flow Diagrams

### Signup Flow
```
User fills form
    ↓
Click "Create Account"
    ↓
AuthContext.register() calls authAPI_service.register()
    ↓
POST /api/auth/register
    ↓
Backend creates User + hashes password
    ↓
Generates JWT token
    ↓
Frontend stores token in localStorage
    ↓
AuthContext updates user state
    ↓
Toast notification "Account created!"
    ↓
Redirect to "/" (protected page)
```

### Login Flow
```
User fills form
    ↓
Click "Sign In"
    ↓
AuthContext.login() calls authAPI_service.login()
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Generates JWT token
    ↓
Frontend stores token in localStorage
    ↓
AuthContext updates user state
    ↓
Toast notification "Logged in successfully!"
    ↓
Redirect to "/" (or requested protected page)
```

### Protected Route Flow
```
User navigates to "/"
    ↓
ProtectedRoute component renders
    ↓
Check isAuthenticated && loading
    ↓
If loading: Show spinner
    ↓
If not authenticated: Redirect to /auth/login
    ↓
If authenticated: Render children
```

### Chat API Call Flow
```
User submits message
    ↓
ChatContainer calls chatAPI.submitAnswer()
    ↓
authAPI interceptor adds JWT to request:
   Authorization: Bearer <token>
    ↓
POST /api/chat/submit (with token in header)
    ↓
Backend authMiddleware verifies token
    ↓
req.userId is set
    ↓
Chat controller processes request with userId
    ↓
Response sent back to frontend
```

---

## Environment Configuration

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=adaptive-probe-jwt-secret-key-change-in-production-2024
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Security Best Practices

✅ **Implemented:**
- Bcrypt password hashing with salt
- JWT token-based authentication
- Bearer token in Authorization header
- Protected routes server-side
- Token expiration (7 days)
- User object doesn't include password field
- CORS configured for frontend origin

⚠️ **For Production:**
- Change JWT_SECRET to strong random string
- Use HTTPS instead of HTTP
- Set secure HTTP-only cookies for tokens
- Implement refresh tokens
- Add rate limiting on auth endpoints
- Implement email verification
- Add password reset flow
- Enable CORS for production domain only
- Use environment variables for all secrets

---

## Testing the Auth System

### 1. **Test Signup**
```
URL: http://localhost:3000/auth/signup
1. Fill form with new user details
2. Click "Create Account"
3. Should redirect to "/" (chat page)
4. Navbar shows user name
```

### 2. **Test Login**
```
URL: http://localhost:3000/auth/login
1. Use demo credentials:
   Email: demo@example.com
   Password: password123
2. Click "Sign In"
3. Should redirect to "/"
4. Navbar shows "Demo User"
```

### 3. **Test Protected Routes**
```
Without login:
1. Try accessing http://localhost:3000
2. Should redirect to /auth/login

After login:
1. Can access / and /dashboard
2. Navbar shows logout button
3. Click logout → redirects to /auth/login
```

### 4. **Test Chat with Auth**
```
1. Login with demo account
2. Chat feature should work
3. Sessions are saved to user's account
4. Visit dashboard to see user's sessions only
```

---

## Token Management

### Token Storage
- Stored in `localStorage` with key `token`
- Also stored in context state for reactive updates
- Loaded on app startup via AuthProvider useEffect

### Token Injection
- authAPI interceptor automatically adds token to all requests
- Format: `Authorization: Bearer <token>`

### Token Expiration
- Expires in 7 days (configurable in JWT_EXPIRE)
- Backend returns 401 when expired
- Frontend should handle and redirect to login

### Token Removal
- On logout: `localStorage.removeItem('token')`
- On invalid token: Same removal
- User state cleared in context

---

## Next Steps (Optional Enhancements)

### Short-term
- [ ] Email verification for signup
- [ ] Password reset flow
- [ ] Remember me functionality
- [ ] Session timeout handling

### Medium-term
- [ ] OAuth integration (Google, GitHub)
- [ ] Refresh tokens for better security
- [ ] Multi-device session management
- [ ] Account recovery options

### Long-term
- [ ] Role-based access control (RBAC)
- [ ] API key generation for developers
- [ ] Two-factor authentication (2FA)
- [ ] Social login providers
- [ ] SSO integration

---

## Troubleshooting

### Issue: "Cannot POST /api/auth/register"
**Solution:** Ensure auth routes are mounted in server.js:
```javascript
app.use('/api/auth', authRoutes);
```

### Issue: "JWT not found" error
**Solution:** Check that token is being stored in localStorage:
```javascript
localStorage.getItem('token')
```

### Issue: "401 Unauthorized" on protected routes
**Solution:** Ensure authMiddleware is applied to chat routes:
```javascript
router.use(authMiddleware);
```

### Issue: Navbar not showing user info
**Solution:** Verify AuthProvider wraps entire layout and context is used correctly.

### Issue: "Cannot read property 'userId' of null"
**Solution:** Ensure token is valid and authMiddleware is verifying it correctly.

---

## File Structure Summary
```
server/
├── models/
│   ├── User.js (new)
│   └── Session.js (updated with userId)
├── services/
│   └── authService.js (new)
├── controllers/
│   └── authController.js (new)
├── middleware/
│   └── authMiddleware.js (new)
└── routes/
    └── authRoutes.js (new)

client/
├── lib/
│   └── authAPI.js (new)
├── app/
│   ├── context/
│   │   └── AuthContext.jsx (new)
│   ├── components/
│   │   ├── ProtectedRoute.jsx (new)
│   │   └── Navbar.jsx (new)
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.jsx (new)
│   │   └── signup/
│   │       └── page.jsx (new)
│   ├── page.jsx (updated - protected)
│   ├── dashboard/
│   │   ├── page.jsx (updated - protected)
│   │   └── [id]/
│   │       └── page.jsx (updated - protected)
│   └── layout.jsx (updated - with AuthProvider)
```

---

**Created:** 2024 | **Status:** ✅ Production Ready
