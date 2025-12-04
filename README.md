# MVP Task Collaboration Platform

A secure, full-stack task collaboration platform with comprehensive user management and real-time features.

## ✨ Features Implemented

### 🔐 User Management
- ✅ User registration with secure password hashing (bcrypt)
- ✅ JWT-based authentication with protected routes
- ✅ User profile dashboard with quick actions
- ✅ Password reset functionality with email notifications
- ✅ Role-based access control (user/admin)
- ✅ Input validation and comprehensive error handling

### 📋 Task Management
- ✅ Create, edit, and delete tasks
- ✅ Task assignment to team members
- ✅ Priority levels (Low, Medium, High)
- ✅ Status tracking (Todo, In Progress, Done)
- ✅ Task filtering and pagination
- ✅ Real-time task updates (5-second polling)

### 💬 Collaboration Features
- ✅ Task comments system
- ✅ Activity feed tracking
- ✅ Team member visibility
- ✅ Real-time collaboration indicators

### 👑 Admin Features
- ✅ Admin dashboard with platform statistics
- ✅ User role management
- ✅ System-wide task and comment oversight
- ✅ Comprehensive admin analytics

### 🎨 User Experience
- ✅ Dark/Light theme support
- ✅ Responsive design
- ✅ Intuitive task management interface
- ✅ Real-time update notifications

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript, React Router
- **Backend**: Node.js with Express
- **Database**: SQLite with custom models
- **Authentication**: JWT with bcryptjs password hashing
- **Email**: Nodemailer for password reset
- **Styling**: Custom CSS-in-JS with theme system
- **Validation**: express-validator

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file and configure:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` file with your email credentials
5. Start the development server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5001`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   Application runs on `http://localhost:3000`

### Database Setup
- SQLite database is automatically created on first run
- Database file: `backend/src/db/database.sqlite`
- First registered user automatically becomes admin

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Tasks
- `GET /api/tasks/my` - Get user's tasks (paginated)
- `GET /api/tasks/users` - Get all users for assignment
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/comments/task/:taskId` - Get task comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Activities
- `GET /api/activities` - Get recent activities

### Admin (Admin only)
- `GET /api/admin/tasks` - Get all tasks
- `GET /api/admin/users` - Get all users
- `GET /api/admin/comments` - Get all comments
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/users/:id/role` - Update user role

## 🔒 Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **Authentication**: JWT tokens with expiration
- **Input Validation**: express-validator for all endpoints
- **Authorization**: Role-based access control
- **Password Reset**: Secure token-based reset with expiration
- **Protected Routes**: Middleware-based route protection

## 🎯 Key Features

### Real-time Updates
- Automatic task refresh every 5 seconds
- Visual indicators for new updates
- Live activity feed

### Task Management
- Drag-and-drop-style interface
- Quick status updates
- Priority-based organization
- Assignment management

### Collaboration
- Comment threads on tasks
- Activity tracking
- Team visibility

### Admin Dashboard
- Platform statistics
- User management
- Content moderation

## 📱 Usage

1. **Register/Login**: Create account or sign in
2. **Dashboard**: View overview and quick actions
3. **Tasks**: Create, manage, and collaborate on tasks
4. **Activity**: Monitor team activity and updates
5. **Admin** (if admin): Manage users and platform settings

## 🔧 Development

### Project Structure
```
mvp_task_platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── utils/          # Helper functions
│   │   └── db/            # Database setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # API utilities
│   └── package.json
└── README.md
```

### Available Scripts

**Backend:**
- `npm start` - Production server
- `npm run dev` - Development server with nodemon

**Frontend:**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## 🚀 Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. Configure production environment variables
3. Start backend: `cd backend && npm start`
4. Serve frontend build files

## 🎯 Development Notes

### Interview Task Implementation
This project demonstrates modern full-stack development capabilities with:

- **Rapid Development**: Efficient implementation using modern tools and frameworks
- **AI-Powered Development**: Collaborative development with AI assistance for accelerated delivery
- **Industry Standards**: Applied current best practices for security, testing, and documentation
- **Scalable Architecture**: Designed with growth and maintainability in mind

### Technical Approach
- **Frontend**: React with TypeScript for type safety and modern UI patterns
- **Backend**: Node.js/Express with comprehensive API design
- **Database**: SQLite for simplicity with proper data modeling
- **Security**: JWT authentication, input validation, and secure password handling
- **Testing**: Jest framework for both frontend and backend validation

### Development Efficiency
- **Total Time**: ~7 hours of focused development
- **AI Collaboration**: Leveraged AI tools for rapid scaffolding and implementation
- **Modern Workflow**: Efficient development using contemporary tools and practices

## 📄 License

MIT License - see LICENSE file for details