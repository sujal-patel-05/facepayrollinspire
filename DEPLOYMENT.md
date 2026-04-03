# 🚀 FaceAI Deployment Guide

## Architecture
```
Vercel (Frontend) → Render (Backend API) → Supabase (PostgreSQL DB)
```

---

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Create a project (choose a region close to you, e.g., Mumbai)
3. Go to **Project Settings** → **Database** → **Connection string** → **URI**
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. **Important**: Use the **Transaction mode** (port `6543`) connection string

---

## Step 2: Deploy Backend on Render

1. **Push your code to GitHub** (if not already)
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Name** | `faceai-backend` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Docker` |
   | **Instance Type** | Free (or Starter) |

5. **Add Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Supabase connection string from Step 1 |
   | `SECRET_KEY` | Any random secure string (e.g., `openssl rand -hex 32`) |
   | `FRONTEND_URL` | *(Set after Vercel deploy, e.g., `https://faceai.vercel.app`)* |

6. Click **Deploy** → Wait for build to complete
7. Your backend URL will be: `https://faceai-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repo
3. Configure:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. **Add Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Your Render backend URL (e.g., `https://faceai-backend.onrender.com`) |

5. Click **Deploy**

---

## Step 4: Connect Frontend ↔ Backend

After both are deployed:

1. **Update Render**: Go back to Render → Environment → set `FRONTEND_URL` to your Vercel URL (e.g., `https://faceai.vercel.app`)
2. **Redeploy Render** to apply the CORS update

---

## Step 5: Create Admin User

After first deployment, the database is empty. Create an admin user:

1. Open your Render backend URL → `/docs` (FastAPI Swagger UI)
2. Use the `/auth/register` endpoint to create the first admin account
3. Or connect to Supabase SQL Editor and run:
   ```sql
   -- Check if tables were created
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| Backend crashes on startup | Check `DATABASE_URL` is correct in Render env vars |
| Frontend shows network error | Verify `VITE_API_URL` in Vercel env vars matches Render URL |
| CORS errors in browser | Set `FRONTEND_URL` in Render to exact Vercel URL (with `https://`) |
| Face recognition not working | InspireFace may fail on Render — check logs, fallback should auto-activate |
| Render free tier sleeps | Free tier spins down after 15 min inactivity, first request takes ~30s |

---

## 📋 Environment Variables Summary

### Render (Backend)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL connection string |
| `SECRET_KEY` | ✅ | JWT secret key (generate random string) |
| `FRONTEND_URL` | ✅ | Vercel frontend URL for CORS |

### Vercel (Frontend)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Render backend URL |
