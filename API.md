# API Documentation

Base URL: `http://localhost:5000/api` (development)

All protected routes require header: `Authorization: Bearer <token>`

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/auth/logout` | Yes | Logout (client-side token clear) |

### Register / Login Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "...", "email": "...", "role": "member" },
    "token": "jwt_token_here"
  }
}
```

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | Yes | Get profile |
| PUT | `/users/profile` | Yes | Update profile |
| GET | `/users/search?q=john` | Yes | Search users by name/email |

## Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | Yes | List user's projects |
| POST | `/projects` | Yes (Admin) | Create project |
| GET | `/projects/:id` | Yes | Get project details |
| PUT | `/projects/:id` | Yes | Update project |
| DELETE | `/projects/:id` | Yes | Delete project |
| POST | `/projects/:id/members` | Yes | Add team member |
| DELETE | `/projects/:id/members/:userId` | Yes | Remove member |
| PATCH | `/projects/:id/members/:userId` | Yes | Update member role |

### Create Project
```json
{ "title": "My Project", "description": "Project description" }
```

### Add Member
```json
{ "email": "user@example.com", "role": "member" }
```

## Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tasks` | Yes | List tasks (supports filters) |
| POST | `/tasks` | Yes | Create task |
| GET | `/tasks/:id` | Yes | Get task |
| PUT | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |

### Query Parameters (GET /tasks)
- `project` - Filter by project ID
- `status` - todo | in_progress | completed
- `priority` - low | medium | high
- `assignedTo` - User ID or `me`
- `search` - Search in title/description
- `sort` - dueDate, -dueDate, createdAt, -createdAt, title, priority

### Create Task
```json
{
  "title": "Task title",
  "description": "Description",
  "priority": "high",
  "dueDate": "2026-06-01",
  "assignedTo": "user_id",
  "project": "project_id",
  "status": "todo"
}
```

## Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Yes | Dashboard stats and summaries |

### Dashboard Response
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalTasks": 10,
      "completedTasks": 3,
      "pendingTasks": 7,
      "overdueTasks": 2
    },
    "statusBreakdown": [{ "_id": "todo", "count": 5 }],
    "priorityBreakdown": [{ "_id": "high", "count": 2 }],
    "recentTasks": [],
    "myTasks": [],
    "overdueTasksList": [],
    "projectSummaries": []
  }
}
```

## Health Check

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/health` | No |

## Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Valid email is required" }]
}
```
