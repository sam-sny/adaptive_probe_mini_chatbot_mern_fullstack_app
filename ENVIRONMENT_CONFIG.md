# DEVELOPMENT vs PRODUCTION Configuration Guide

## Development Setup (What You're Running Now)

### Backend Environment (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adaptive-probe?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-your-key
FRONTEND_URL=http://localhost:3000
```

**Start command:**
```bash
npm run dev
```

Uses `nodemon` for auto-reload on file changes.

---

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Start command:**
```bash
npm run dev
```

Uses Next.js hot reload.

---

## Production Setup (Ready When You Deploy)

### Backend Environment (.env for production)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adaptive-probe?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-your-key
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=info
```

**Start command:**
```bash
npm start
```

(Regular `node`, not `nodemon`)

---

### Frontend Environment (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Start command:**
```bash
npm run build
npm start
```

---

## Optimization Checklist

### Backend Optimization

- [x] Connection pooling (Mongoose default)
- [x] Error handling middleware
- [x] CORS configured
- [x] Short response tokens (max_tokens: 150)
- [ ] Add caching (Redis - future enhancement)
- [ ] Add rate limiting (express-rate-limit - future)
- [ ] Add monitoring (DataDog/New Relic - future)

### Frontend Optimization

- [x] Code splitting (Next.js automatic)
- [x] Image optimization (Next.js automatic)
- [x] CSS minification (Tailwind CSS)
- [ ] Add service worker (PWA - future)
- [ ] Add analytics (GA4 - future)

### Database Optimization

- [x] Using MongoDB Atlas (auto-scaling)
- [x] Indexing ready (add indexes in production)
- [ ] Add read replicas (future)

---

## How to Add Indexes to MongoDB

### In MongoDB Atlas UI:

1. Go to your cluster
2. Collections → sessions
3. Indexes tab
4. Create Index:

```javascript
// Index 1: For dashboard filtering
{
  "createdAt": -1
}

// Index 2: For completed sessions
{
  "isCompleted": 1,
  "createdAt": -1
}
```

These make queries **10-50x faster**.

---

## Starting Services in the Correct Order

### Start Services:
```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev

# MongoDB: Already running on Atlas (no action needed)
```

### Check Services:
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend access
Open http://localhost:3000
```

---

## Performance Metrics You Should Track

### Backend
- API response time (target: <500ms for probes)
- OpenAI API latency (typically 1-3s)
- Database query time (target: <50ms)
- Error rate (target: <1%)

### Frontend
- Page load time (target: <2s in dev, <500ms in prod)
- Time to interactive (target: <3s in dev, <1s in prod)
- Chat message render time (target: <100ms)

### Database
- Connection count
- Query count
- Storage used

---

## Monitoring Commands

### Check Backend Process
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Check Frontend Process
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### View MongoDB Metrics
1. Go to MongoDB Atlas
2. Your cluster → Metrics
3. View CPU, memory, connections

---

## Deployment Checklist

Before going to production:

- [ ] All tests passing locally
- [ ] Environment variables set in production
- [ ] MongoDB URI uses production credentials
- [ ] OpenAI API key is valid
- [ ] FRONTEND_URL in backend matches production domain
- [ ] NEXT_PUBLIC_API_URL in frontend matches API domain
- [ ] NODE_ENV=production on backend
- [ ] SSL/HTTPS enabled
- [ ] Database backups enabled (MongoDB Atlas automatic)
- [ ] Error logging configured
- [ ] Monitoring configured

---

## Quick Deployment Summary

### Option A: Free Tier (Recommended for Testing)
- **Frontend**: Deploy to Vercel (free, designed for Next.js)
- **Backend**: Deploy to Render or Railway (free, includes auto-restart)
- **Database**: MongoDB Atlas (free tier included)

### Option B: Full Stack
- **Frontend**: AWS Amplify or Netlify
- **Backend**: AWS EC2, DigitalOcean, or Heroku
- **Database**: MongoDB Atlas

---

End of Configuration Guide
