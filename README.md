# Team Task Manager

A production-ready full-stack SaaS application for managing team projects, tasks, and collaboration with role-based access control.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## Project Overview

Team Task Manager helps teams organize work efficiently. Admins can create projects, invite members, assign tasks, and track progress. Members can view assigned projects and update their task statuses. A rich dashboard provides real-time statistics, overdue alerts, and project summaries.

## Features

- **Authentication** — Signup, login, logout, JWT tokens, persistent sessions
- **Role-Based Access** — Admin and Member roles with granular permissions
- **Project Management** — Create, update, delete projects with descriptions
- **Team Management** — Invite members by email, assign project roles, remove members
- **Task CRUD** — Full task lifecycle with priorities and due dates
- **Task Assignment** — Assign tasks to team members
- **Status Tracking** — Todo, In Progress, Completed
- **Dashboard** — Stats cards, overdue tasks, my tasks, charts, project summaries
- **Search & Filters** — Search, filter by status/priority/project, sort tasks
- **Dark/Light Mode** — Theme toggle with persistence
- **Responsive UI** — Mobile-friendly Tailwind design

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, TailwindCSS, React Router, Axios, Zustand, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Security | Helmet, CORS, Rate Limiting, express-validator |
| Deployment | Railway |

## Screenshots

> Add screenshots of Dashboard, Projects, Tasks, and Login pages after running locally.

| Dashboard | Projects | Tasks |
|-----------|----------|-------|
| _screenshot_ | _screenshot_ | _screenshot_ |

## Folder Structure

```
team-task-manager/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── api/            # Axios & API services
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── store/          # Zustand stores
│       └── utils/
├── server/                 # Express backend
│   └── src/
│       ├── config/         # Database config
│       ├── controllers/    # Route handlers
│       ├── middleware/     # Auth, validation, errors
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── scripts/        # Seed script
│       └── validators/
├── API.md                  # API documentation
├── setup.md                # Detailed setup guide
├── railway.json            # Railway deployment config
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Quick Start

```bash
# Clone and install
git clone <repo-url>
cd team-task-manager
npm run install:all

# Configure environment (see Environment Variables)
cp server/.env.example server/.env
cp client/.env.example client/.env

# Seed demo data
npm run seed

# Run development (two terminals or use concurrently)
npm run dev --prefix server   # Terminal 1 - API on :5000
npm run dev --prefix client   # Terminal 2 - UI on :5173
```

Open http://localhost:5173

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/team-task-manager` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## API Routes

See [API.md](./API.md) for full documentation.

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Authentication |
| `/api/users` | User profile |
| `/api/projects` | Project CRUD & team |
| `/api/tasks` | Task CRUD |
| `/api/dashboard` | Dashboard stats |

## Demo Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| Member | john@demo.com | member123 |
| Member | sarah@demo.com | member123 |

## Deployment (Railway)

1. Push code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Add **MongoDB** plugin (or use MongoDB Atlas URI)
4. Deploy from GitHub repo
5. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-app.up.railway.app`
6. Railway builds the client and starts the server
7. Run seed once: `railway run npm run seed --prefix server`

See [setup.md](./setup.md) for detailed deployment steps.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run dev --prefix server` | Start API with hot reload |
| `npm run dev --prefix client` | Start Vite dev server |
| `npm run build --prefix client` | Build frontend |
| `npm run start --prefix server` | Start production server |
| `npm run seed` | Seed demo data |

## License

MIT
