import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Invoices from './pages/Invoices';
import Projects from './pages/Projects';
import Files from './pages/Files';
import Settings from './pages/Settings';
import Analytics from './components/Analytics';
import ClientPortal from './pages/ClientPortal';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import ProjectRequest from './components/ProjectRequest';
import ProjectRequestManagement from './components/ProjectRequestManagement';
import ProjectDashboard from './pages/ProjectDashboard';
import Tasks from './pages/Tasks';

function App() {
  const { currentUser } = useAuth();

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
            <Route
              path="/login"
              element={
                !currentUser
                  ? <Login />
                  : currentUser.onboardingCompleted
                    ? <Navigate to="/dashboard" />
                    : <Navigate to="/onboarding" />
              }
            />
            <Route
              path="/signup"
              element={
                !currentUser
                  ? <Signup />
                  : currentUser.onboardingCompleted
                    ? <Navigate to="/dashboard" />
                    : <Navigate to="/onboarding" />
              }
            />
          
          {/* Onboarding route */}
            <Route
              path="/onboarding"
              element={
                currentUser
                  ? currentUser.onboardingCompleted
                    ? <Navigate to="/dashboard" />
                    : <Onboarding />
                  : <Navigate to="/login" />
              }
            />
          
          {/* Client portal route */}
          <Route path="/portal/:clientId" element={<ClientPortal />} />
          
          {/* Protected routes */}
            <Route
              path="/"
              element={
                currentUser
                  ? currentUser.onboardingCompleted
                    ? <Layout />
                    : <Navigate to="/onboarding" />
                  : <Navigate to="/login" />
              }
            >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="files" element={<Files />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="project-request" element={<ProjectRequest />} />
            <Route path="project-requests" element={<ProjectRequestManagement />} />
          </Route>
        </Routes>
      </div>
    </NotificationProvider>
  );
}

export default App;
