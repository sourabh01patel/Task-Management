# TaskFlow — Modern MERN Stack Task Management Web Application

TaskFlow is a production-grade, secure, modern, and responsive Task Management Web Application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS.

---

## 🚀 Features

- **Robust Authentication & Security**:
  - JWT (JSON Web Token) authentication with bcrypt.js password hashing (10 salt rounds).
  - Protected API routes and protected React routes.
  - Strict multi-tenant data isolation: every task query is scoped strictly to the authenticated user's ID (`req.user._id`).
  - Rate limiting on authentication and API endpoints to prevent brute-force attacks.
  - Input validation and sanitized error handling preventing database exposure.
- **Task Management (Full CRUD)**:
  - Create tasks with Title, Description, Due Date, Priority (`Low`, `Medium`, `High`), and Status (`To Do`, `In Progress`, `Done`).
  - Real-time status toggling with optimistic UI updates.
  - Edit task metadata and deadlines.
  - Confirmation modal dialog before deleting tasks.
- **Search, Filtering & Sorting**:
  - Real-time text search by task title.
  - Status filter (`All`, `To Do`, `In Progress`, `Done`).
  - Priority filter (`All`, `Low`, `Medium`, `High`).
  - Sort by Due Date (earliest/latest), Priority, Title (A-Z), and Creation Date.
  - Quick filters for **Overdue** tasks and **Upcoming Deadlines** (due within 7 days).
- **Executive Dashboard**:
  - Metric summary cards: Total Tasks, Pending (To Do), In Progress, Completed, Overdue.
  - Visual status completion and priority distribution charts.
  - Upcoming deadlines widget and recently created tasks widget.
- **User Profile Management**:
  - View account credentials and creation date.
  - Update full name and email address.
  - Securely update account password with current password verification.
- **Modern Responsive UI/UX**:
  - Built with React 18, Vite, and Tailwind CSS.
  - Responsive layout with collapsible mobile navigation sidebar.
  - Floating toast notifications for success and error messages.
  - Clean SVG iconography via Lucide React.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`AuthContext`, `TaskContext`)
- **HTTP Client**: Axios with automatic JWT request/response interceptors
- **Styling**: Tailwind CSS & Lucide React Icons

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Security Middleware**: `cors`, `express-rate-limit`, centralized error handling

---

## 📁 Project Structure

```text
Task management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js      # Register, login, me & profile update handlers
│   │   ├── taskController.js      # Task CRUD, filters & status updates
│   │   └── dashboardController.js # Aggregations for metrics & charts
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification
│   │   ├── errorMiddleware.js    # 404 & centralized error handler
│   │   └── rateLimiter.js        # Express rate limiting
│   ├── models/
│   │   ├── User.js               # User schema with pre-save password hash
│   │   └── Task.js               # Task schema with compound indexes
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── taskRoutes.js         # /api/tasks routes
│   │   └── dashboardRoutes.js    # /api/dashboard routes
│   ├── utils/
│   │   └── generateToken.js      # JWT signing helper
│   ├── server.js                 # Express server configuration
│   ├── test-runner.js            # Automated end-to-end test suite
│   ├── .env                      # Local environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Sidebar, Header, Layout, TaskCard, TaskFilter, StatCard, Toast, Modal
│   │   ├── context/              # AuthContext & TaskContext
│   │   ├── pages/                # Login, Register, Dashboard, AllTasks, CreateTask, EditTask, Profile
│   │   ├── routes/               # ProtectedRoute & PublicRoute guards
│   │   ├── services/             # Axios API instance & service methods
│   │   ├── utils/                # Date formatters & color constants
│   │   ├── App.jsx               # Route mappings
│   │   ├── main.jsx              # React root entry
│   │   └── index.css             # Tailwind base & utilities
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env                      # Local frontend API URL
│   └── package.json
```

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection URI

### 2. Backend Setup
1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Verify or edit `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=supersecretjwtkey_taskmanager_2026_dev_env_safe
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   # or: npm start
   ```
   Server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Verify `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Running the Automated Verification Tests

The backend includes a comprehensive 17-point test runner that validates authentication, multi-tenant isolation, filtering, search, metrics, and task CRUD:

```bash
cd backend
node test-runner.js
```

---

## 🌐 Production Deployment Guide

### 1. Database: MongoDB Atlas
1. Sign up/log in at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a database user and secure password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so cloud servers like Render can connect.
5. Under **Clusters > Connect > Drivers**, copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

### 2. Backend Deployment: Render
1. Push your project to GitHub.
2. Log in to [render.com](https://render.com) and click **New + > Web Service**.
3. Connect your repository and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGO_URI` = `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET` = `<Generate a long random secure string>`
   - `JWT_EXPIRE` = `7d`
   - `CLIENT_URL` = `https://your-frontend-app.vercel.app`
5. Click **Deploy Web Service**. Note your public URL (e.g., `https://task-backend.onrender.com`).

### 3. Frontend Deployment: Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New > Project**.
2. Select your repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://task-backend.onrender.com/api`
5. Click **Deploy**. Your application is live!

