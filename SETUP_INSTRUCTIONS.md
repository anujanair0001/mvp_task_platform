# MVP Task Platform - Setup Guide

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

## Quick Setup

**1. Clone & Install**
```bash
git clone <repository-url>
cd mvp_task_platform
```

**2. Backend Setup**
```bash
cd backend
npm install
npm install --save-dev jest supertest
cp .env.example .env
npm run dev
```

**3. Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm start
```

**4. Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5002

## Configuration

**Environment Variables** (backend/.env)
```
PORT=5002
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Database**
- SQLite (auto-created)
- Location: `backend/src/db/database.sqlite`

**First User**
1. Go to http://localhost:3000
2. Register an account
3. First user becomes admin automatically

## Development

**Backend Commands**
```bash
npm run dev    # Development server
npm start      # Production server
npm test       # Run Jest tests
```

**Frontend Commands**
```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run Jest tests
```

## Testing

**Backend:** `cd backend && npm install --save-dev jest && npm test`  
**Frontend:** `cd frontend && npm test`

## Troubleshooting

**Port Issues**
```bash
lsof -i:5002        # Find process using port
kill -9 <PID>       # Kill process
```

**Common Fixes**
- Ensure backend runs before frontend
- Check `.env` file configuration
- Reset database: delete `backend/src/db/database.sqlite`
- Check console for error messages

## Project Structure

```
mvp_task_platform/
├── backend/src/
│   ├── routes/         # API endpoints
│   ├── models/         # Database models
│   ├── middleware/     # Auth & validation
│   └── controllers/    # Business logic
├── frontend/src/
│   ├── pages/          # Main pages
│   ├── components/     # UI components
│   ├── context/        # State management
│   └── utils/          # API client
```

## Features

- User authentication & authorization
- Task management (CRUD operations)
- Real-time collaboration with comments
- Activity tracking
- Admin dashboard
- Dark/Light theme
- Responsive design

## Usage

1. Register/Login at http://localhost:3000
2. Create and manage tasks
3. Collaborate with comments
4. Track team activity
5. Admin users can manage platform

---
**Last Updated:** December 2025  
**Created by:** Anuja S Nair
