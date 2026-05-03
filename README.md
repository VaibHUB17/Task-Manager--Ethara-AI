# Team Task Manager

A comprehensive full-stack web application for managing team projects and tasks efficiently. Built with modern technologies for a seamless user experience and robust backend infrastructure.

## Project Description

Team Task Manager is a collaborative platform designed to help teams organize, track, and manage their projects and tasks. The application provides role-based access control (Admin and Member roles), real-time task management, project collaboration, and an intuitive dashboard for monitoring team progress.

### Key Features

- **User Authentication & Authorization**: Secure signup/login with JWT-based authentication and role-based access control
- **Project Management**: Create, manage, and organize projects with team members
- **Task Management**: Create, assign, and track tasks with multiple statuses (To-do, In-Progress, In-Review, Completed)
- **Task Prioritization**: Set priority levels (high, medium, low) for tasks
- **Dashboard Analytics**: View team statistics and recent task activities
- **Member Management**: Add/remove team members to projects with different access levels
- **Task Filtering**: Filter tasks by project, status, and assigned member
- **Responsive UI**: Modern, responsive interface with animations and loading states

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Context API** - State management

## Installation Steps

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Frontend Configuration

The frontend uses `http://localhost:5000/api` as the default API base URL. If your backend runs on a different port or host, update the API configuration in `frontend/src/services/api.js`.

## Database Setup Instructions

### Option 1: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Create the database (MongoDB will create it automatically on first connection)

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add a database user with username and password
4. Whitelist your IP address
5. Get your connection string and add it to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
   ```

### Seed Test Data

Use MongoDB Shell (mongosh) to insert test users:

**Test Credentials** (using seed data):
- Admin: `admin1@example.com` / `Admin@123`
- Member: `member1@example.com` / `Member@123`

## How to Run Locally

### Running the Backend

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Running the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port)

### Running Both Simultaneously

Open two terminal windows/tabs:

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

For protected endpoints, include the authorization header:

```
Authorization: Bearer <token>
```

Get a token from the `POST /auth/login` or `POST /auth/signup` response.

### Postman Setup

1. Import the API endpoints from the sections below
2. Create an environment variable `{{token}}` and set it to the JWT token received from login
3. Use `{{token}}` in the Authorization header for protected endpoints

### Endpoints

#### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` (protected) - Get current user details

**Signup Request Body:**
```json
{
	"name": "Aarav Admin",
	"email": "admin1@example.com",
	"password": "Admin@123",
	"role": "admin"
}
```

**Login Request Body:**
```json
{
	"email": "admin1@example.com",
	"password": "Admin@123"
}
```

#### Projects
- `GET /projects` (protected: admin/member) - Get all projects
- `POST /projects` (protected: admin only) - Create a new project
- `GET /projects/:id` (protected: admin/member with access) - Get project details
- `PUT /projects/:id` (protected: admin only) - Update project
- `DELETE /projects/:id` (protected: admin only) - Delete project
- `POST /projects/:id/members` (protected: admin only) - Add member to project
- `DELETE /projects/:id/members/:userId` (protected: admin only) - Remove member from project

**Create Project Request Body:**
```json
{
	"name": "Website Revamp",
	"description": "Redesign client portal UI"
}
```

**Add Member Request Body:**
```json
{
	"userId": "6814f1a10000000000000003"
}
```

#### Tasks
- `GET /tasks` (protected: admin/member) - Get all tasks
- `POST /tasks` (protected: admin/member) - Create a new task
- `GET /tasks/:id` (protected: admin/member) - Get task details
- `PUT /tasks/:id` (protected) - Update task
- `DELETE /tasks/:id` (protected: admin only) - Delete task
- `PATCH /tasks/:id/status` (protected) - Update task status

**Query Parameters for GET /tasks:**
- `project` - Filter by project ID
- `status` - Filter by status (todo, in-progress, in-review, completed)
- `assignedTo` - Filter by assigned user ID

**Create Task Request Body:**
```json
{
	"title": "Create login page",
	"description": "Build responsive login screen",
	"project": "PROJECT_ID",
	"assignedTo": "USER_ID",
	"dueDate": "2026-05-20T12:00:00.000Z",
	"priority": "high"
}
```

**Update Task Status Request Body:**
```json
{
	"status": "completed"
}
```

#### Dashboard
- `GET /dashboard/stats` (protected) - Get dashboard statistics
- `GET /dashboard/recent-tasks` (protected) - Get recent tasks

## Testing Workflow

Suggested order for testing the API in Postman:

1. **Sign up or login** as an admin user
2. **Create a project** using the admin token
3. **Add a team member** to the project
4. **Create tasks** under that project
5. **Log in as a member** and update assigned task statuses
6. **Check dashboard endpoints** for statistics and recent activities

## Future Enhancements

- **Task Comments & Collaboration**: Add inline comments on tasks for team discussions
- **File Attachments**: Allow users to upload and attach files to tasks and projects
- **Email Notifications**: Send email alerts for task assignments and status updates
- **Real-time Updates**: Implement WebSockets for live collaboration and instant notifications
- **Activity Timeline**: Track and display all changes and activities on projects and tasks
- **Recurring Tasks**: Support for recurring/recurring task templates
- **Time Tracking**: Track time spent on tasks for productivity analysis
- **Task Templates**: Pre-built task templates for common project workflows
- **Advanced Filtering & Search**: Full-text search and advanced filtering options
- **Export Reports**: Export project and task data as PDF/Excel reports
- **Mobile App**: Native iOS and Android applications
- **Dark Mode**: Dark theme for the UI
- **Multi-language Support**: Internationalization (i18n) for multiple languages
- **Two-Factor Authentication**: Additional security layer with 2FA
- **Role Customization**: Custom roles with granular permissions
