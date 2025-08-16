import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  FolderOpen, 
  Upload,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Briefcase,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const { logout, currentUser } = useAuth();

  // Navigation items based on user role
  const getNavigation = () => {
    if (currentUser?.role === 'client') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Project Requests', href: '/project-request', icon: Briefcase },
        { name: 'Employees', href: '/employees', icon: Users },
        { name: 'My Projects', href: '/projects', icon: FolderOpen },
        { name: 'Files', href: '/files', icon: Upload },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
      ];
    } else if (currentUser?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Project Requests', href: '/project-requests', icon: Briefcase },
        { name: 'Employees', href: '/employees', icon: Users },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
        { name: 'Invoices', href: '/invoices', icon: FileText },
        { name: 'Files', href: '/files', icon: Upload },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
      ];
    } else {
      // Default navigation for employees/freelancers
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Invoices', href: '/invoices', icon: FileText },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
        { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Files', href: '/files', icon: Upload },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
      ];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Shifter</h1>
              {currentUser?.role && (
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                  currentUser.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : currentUser.role === 'client'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {currentUser.role}
                </span>
              )}
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="mr-3 flex-shrink-0 h-6 w-6" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
