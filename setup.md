# Team Task Manager — Complete Setup Guide

This guide walks you through setting up the application from scratch. No prior experience required — follow each step in order.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Setup](#2-local-setup)
3. [MongoDB Setup](#3-mongodb-setup)
4. [Backend Setup](#4-backend-setup)
5. [Frontend Setup](#5-frontend-setup)
6. [Environment Variables](#6-environment-variables)
7. [Running Locally](#7-running-locally)
8. [Seed Demo Data](#8-seed-demo-data)
9. [Railway Deployment](#9-railway-deployment)
10. [Production Deployment](#10-production-deployment)
11. [Troubleshooting](#11-troubleshooting)
12. [Common Errors and Fixes](#12-common-errors-and-fixes)

---

## 1. Prerequisites

Install these before starting:

### Node.js (v18 or higher)

1. Visit https://nodejs.org
2. Download the **LTS** version
3. Run the installer (keep default options)
4. Verify installation — open Terminal (Mac/Linux) or PowerShell (Windows):

```bash
node --version
npm --version
```

You should see version numbers like `v20.x.x` and `10.x.x`.

### Git (optional but recommended)

Download from https://git-scm.com/downloads

### Code Editor

Use [VS Code](https://code.visualstudio.com/) or Cursor.

### MongoDB

Choose **Option A** (local) or **Option B** (cloud — recommended for beginners).

---

## 2. Local Setup

### Step 1: Get the project files

If you have a ZIP file, extract it to a folder like `C:\Projects\team-task-manager`.

If using Git:

```bash
git clone <your-repository-url>
cd team-task-manager
```

### Step 2: Open the project in your editor

```bash
code .
```

Or use File → Open Folder in your editor.

### Step 3: Install all dependencies

Open a terminal in the project root folder and run:

```bash
npm run install:all
```

This installs packages for both `server/` and `client/`. Wait until it finishes (may take 2–5 minutes).

---

## 3. MongoDB Setup

### Option A: MongoDB Atlas (Cloud — Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Try Free** and create an account
3. Create a **free cluster** (M0)
4. Under **Database Access**, create a database user with a password (save it!)
5. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (for development)
6. Click **Connect** on your cluster → **Connect your application**
7. Copy the connection string. It looks like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

Replace `<password>` with your actual password.

### Option B: Local MongoDB

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs as a service on `mongodb://localhost:27017`
4. Your connection string:

```
mongodb://localhost:27017/team-task-manager
```

---

## 4. Backend Setup

### Step 1: Create environment file

```bash
cd server
copy .env.example .env
```

On Mac/Linux:

```bash
cp .env.example .env
```

### Step 2: Edit `server/.env`

Open `server/.env` in your editor and set:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=my_super_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Replace `MONGODB_URI` with your Atlas or local connection string.

### Step 3: Test the server

From the `server` folder:

```bash
npm run dev
```

You should see:

```
MongoDB connected: ...
Server running on port 5000 in development mode
```

Open http://localhost:5000/api/health — you should see `{"success":true,"message":"API is running",...}`

Press `Ctrl+C` to stop the server.

---

## 5. Frontend Setup

### Step 1: Create environment file

```bash
cd client
copy .env.example .env
```

On Mac/Linux: `cp .env.example .env`

### Step 2: Edit `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Test the frontend

From the `client` folder:

```bash
npm run dev
```

Open http://localhost:5173 — you should see the login page.

Press `Ctrl+C` to stop.

---

## 6. Environment Variables

### Server Variables Explained

| Variable | Required | What it does |
|----------|----------|--------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | Port the API listens on (default 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing login tokens — use a long random string in production |
| `JWT_EXPIRE` | No | How long tokens last (default `7d`) |
| `CLIENT_URL` | Yes | Frontend URL for CORS (must match where React runs) |

### Client Variables Explained

| Variable | Required | What it does |
|----------|----------|--------------|
| `VITE_API_URL` | Yes | Full URL to the API including `/api` |

**Important:** After changing `.env` files, restart the dev servers.

---

## 7. Running Locally

You need **two terminals** running at the same time.

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

### Open the app

Go to http://localhost:5173 in your browser.

---

## 8. Seed Demo Data

With the backend running (or in a new terminal from project root):

```bash
npm run seed
```

This creates demo users, projects, and tasks. Use these credentials to log in:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | admin123 | Admin |
| john@demo.com | member123 | Member |
| sarah@demo.com | member123 | Member |

---

## 9. Railway Deployment

[Railway](https://railway.app) hosts your app in the cloud.

### Step 1: Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

**Do not commit `.env` files** — they are in `.gitignore`.

### Step 2: Create Railway project

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository

### Step 3: Add MongoDB

**Option A:** Railway MongoDB plugin  
- Click **+ New** → **Database** → **MongoDB**  
- Copy the `MONGO_URL` variable

**Option B:** Use your MongoDB Atlas URI

### Step 4: Set environment variables

In Railway → your service → **Variables**, add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your mongodb uri>
JWT_SECRET=<generate a long random secret>
JWT_EXPIRE=7d
CLIENT_URL=https://your-app-name.up.railway.app
```

After first deploy, copy your Railway public URL and update `CLIENT_URL`.

For production frontend API calls, also add in Railway (or use same domain):

The server serves the built React app in production, so set:

```
CLIENT_URL=https://your-railway-url.up.railway.app
```

And in Railway build, the client uses relative `/api` — update `client/.env.production` or set at build time:

Create `client/.env.production`:

```env
VITE_API_URL=/api
```

### Step 5: Deploy

Railway auto-deploys on push. The `nixpacks.toml` and `railway.json` configure:

- Install client & server dependencies
- Build React app
- Start Express server (serves API + static frontend)

### Step 6: Seed production database

In Railway dashboard → your service → **Settings** → run command or use CLI:

```bash
railway run npm run seed --prefix server
```

### Step 7: Verify

Visit your Railway URL. Test login with `admin@demo.com` / `admin123`.

---

## 10. Production Deployment

### Build manually (optional)

```bash
npm run build --prefix client
NODE_ENV=production npm run start --prefix server
```

The server serves `client/dist` when `NODE_ENV=production`.

### Production checklist

- [ ] Strong `JWT_SECRET` (32+ random characters)
- [ ] MongoDB Atlas with IP whitelist (or Railway private network)
- [ ] `CLIENT_URL` matches your deployed domain
- [ ] `NODE_ENV=production`
- [ ] HTTPS enabled (Railway provides this automatically)
- [ ] Demo seed only run once; change demo passwords if needed

---

## 11. Troubleshooting

### "Cannot connect to MongoDB"

- Check `MONGODB_URI` is correct
- For Atlas: verify username/password, IP whitelist, and cluster is running
- For local: ensure MongoDB service is started

### "CORS error" in browser console

- Ensure `CLIENT_URL` in server `.env` exactly matches frontend URL (including port)
- Restart the server after changing `.env`

### "401 Unauthorized" on every request

- Log out and log in again
- Clear browser localStorage (Application tab in DevTools)
- Check `JWT_SECRET` has not changed between sessions

### Blank page after deploy

- Check Railway build logs for errors
- Ensure client build succeeded
- Verify `VITE_API_URL=/api` for same-origin production

### Port already in use

```bash
# Windows - find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Mac/Linux
lsof -i :5000
kill -9 <pid>
```

---

## 12. Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `MONGODB_URI is not defined` | Missing `.env` | Create `server/.env` from `.env.example` |
| `EADDRINUSE` | Port in use | Change `PORT` or kill existing process |
| `User already exists` | Email taken | Use different email or clear database |
| `Validation failed` | Invalid form data | Check required fields and email format |
| `Not authorized` | Wrong role or not in project | Log in as admin or get added to project |
| `npm: command not found` | Node not installed | Install Node.js and restart terminal |
| `Module not found` | Dependencies missing | Run `npm run install:all` |
| White screen React | JS error | Open browser console (F12) for details |
| `CastError: Invalid ID` | Bad URL parameter | Use valid MongoDB ObjectId in URLs |

### Reset database completely

```bash
# Re-run seed (clears and recreates all data)
npm run seed
```

### Get help

1. Check server terminal for error messages
2. Check browser console (F12 → Console)
3. Review [API.md](./API.md) for endpoint details
4. Review [README.md](./README.md) for architecture overview

---

**You're all set!** Log in at http://localhost:5173 with `admin@demo.com` / `admin123` and start managing tasks.
