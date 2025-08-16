import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">Client Portal</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationBell />
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <span className="text-sm text-gray-700">{currentUser?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;




