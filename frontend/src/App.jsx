import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Layout from './components/Layout';

// Page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            {/* Public Routes (Guests only) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes (Authenticated users only) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<AllTasksPage />} />
                <Route path="/tasks/create" element={<CreateTaskPage />} />
                <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
