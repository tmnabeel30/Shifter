import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalEmployees: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
}

interface RecentActivity {
  id: string;
  type: 'invoice' | 'project' | 'employee';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
}

function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Mock data - in real app, fetch from Firebase
    setStats({
      totalEmployees: 12,
      totalInvoices: 45,
      totalRevenue: 28450,
      pendingInvoices: 8,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'invoice',
        title: 'Invoice #INV-001',
        description: 'Website redesign project',
        date: '2024-01-15',
        status: 'completed',
      },
      {
        id: '2',
        type: 'project',
        title: 'Mobile App Development',
        description: 'Phase 2 completed',
        date: '2024-01-14',
        status: 'completed',
      },
      {
        id: '3',
        type: 'employee',
        title: 'New Employee Added',
        description: 'TechCorp Inc.',
        date: '2024-01-13',
        status: 'pending',
      },
      {
        id: '4',
        type: 'invoice',
        title: 'Invoice #INV-002',
        description: 'Logo design project',
        date: '2024-01-12',
        status: 'overdue',
      },
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'project':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'employee':
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {currentUser?.name}! Here's what's happening with your {currentUser?.role === 'employer' ? 'projects' : 'business'}.
        </p>
      </div>

      {/* Role-specific Quick Actions */}
      {currentUser?.role === 'employer' && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Ready to start a new project?</h3>
              <p className="text-blue-700 mt-1">Submit a project request and your employer will review it.</p>
            </div>
            <Link
              to="/project-request"
              className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project Request
            </Link>
          </div>
        </div>
      )}

      {currentUser?.role === 'admin' && (
        <div className="card bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Admin Dashboard</h3>
              <p className="text-purple-700 mt-1">Manage all projects, employees, and platform settings.</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/projects"
                className="btn-secondary border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Projects
              </Link>
              <Link
                to="/project-requests"
                className="btn-secondary border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Project Requests
              </Link>
              <Link
                to="/employees"
                className="btn-secondary border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Employees
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingInvoices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {getTypeIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(activity.status)}
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


