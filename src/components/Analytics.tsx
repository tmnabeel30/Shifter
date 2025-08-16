import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign,
  Activity
} from 'lucide-react';
import { getClients } from '../firebase/clients';
import { getFiles } from '../firebase/files';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
  totalRevenue: number;
  totalClients: number;
  totalProjects: number;
  totalInvoices: number;
  monthlyRevenue: { month: string; revenue: number }[];
  clientGrowth: { month: string; clients: number }[];
  projectStatus: { status: string; count: number }[];
  fileUploads: { month: string; uploads: number }[];
}

  function Analytics() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalClients: 0,
    totalProjects: 0,
    totalInvoices: 0,
    monthlyRevenue: [],
    clientGrowth: [],
    projectStatus: [],
    fileUploads: []
  });
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const { currentUser } = useAuth();

  useEffect(() => {
      const fetchAnalyticsData = async () => {
        if (!currentUser) return;
        try {
          setIsLoading(true);
        
        // Fetch real data from Firebase
          const clients = await getClients(currentUser.id);
        const files = await getFiles();
        
        // Calculate analytics from real data
        const totalClients = clients.length;
        const totalFiles = files.length;
        
        // Mock data for demonstration (in real app, this would come from Firestore)
        const mockData: AnalyticsData = {
          totalRevenue: 45600,
          totalClients,
          totalProjects: 12,
          totalInvoices: 24,
          monthlyRevenue: [
            { month: 'Jan', revenue: 8500 },
            { month: 'Feb', revenue: 9200 },
            { month: 'Mar', revenue: 7800 },
            { month: 'Apr', revenue: 10500 },
            { month: 'May', revenue: 9600 },
            { month: 'Jun', revenue: 12000 },
          ],
          clientGrowth: [
            { month: 'Jan', clients: 8 },
            { month: 'Feb', clients: 12 },
            { month: 'Mar', clients: 15 },
            { month: 'Apr', clients: 18 },
            { month: 'May', clients: 22 },
            { month: 'Jun', clients: totalClients },
          ],
          projectStatus: [
            { status: 'Active', count: 8 },
            { status: 'Completed', count: 3 },
            { status: 'On Hold', count: 1 },
          ],
          fileUploads: [
            { month: 'Jan', uploads: 45 },
            { month: 'Feb', uploads: 52 },
            { month: 'Mar', uploads: 38 },
            { month: 'Apr', uploads: 67 },
            { month: 'May', uploads: 73 },
            { month: 'Jun', uploads: totalFiles },
          ],
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
    }, [timeRange, currentUser]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRevenueGrowth = () => {
    if (analyticsData.monthlyRevenue.length < 2) return 0;
    const current = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 1].revenue;
    const previous = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 2].revenue;
    return ((current - previous) / previous) * 100;
  };

  const getClientGrowth = () => {
    if (analyticsData.clientGrowth.length < 2) return 0;
    const current = analyticsData.clientGrowth[analyticsData.clientGrowth.length - 1].clients;
    const previous = analyticsData.clientGrowth[analyticsData.clientGrowth.length - 2].clients;
    return ((current - previous) / previous) * 100;
  };

  const renderBarChart = (data: { month: string; revenue?: number; clients?: number; uploads?: number }[], title: string, color: string) => {
    const maxValue = Math.max(...data.map(d => d.revenue || d.clients || d.uploads || 0));
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-end space-x-2 h-32">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t"
                style={{
                  height: `${((item.revenue || item.clients || item.uploads || 0) / maxValue) * 100}%`,
                  backgroundColor: color,
                }}
              />
              <span className="text-xs text-gray-500 mt-1">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: { status: string; count: number }[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const circumference = 2 * Math.PI * 60; // radius = 60
                const strokeDasharray = (percentage / 100) * circumference;
                const strokeDashoffset = circumference - strokeDasharray;
                
                return (
                  <circle
                    key={index}
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transformOrigin: '64px 64px',
                      transform: `rotate(${index * 90}deg)`,
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-900">{total}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-600">{item.status}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your business performance and insights.</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights.</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
              <p className={`text-sm ${getRevenueGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getRevenueGrowth() >= 0 ? '+' : ''}{getRevenueGrowth().toFixed(1)}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalClients}</p>
              <p className={`text-sm ${getClientGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getClientGrowth() >= 0 ? '+' : ''}{getClientGrowth().toFixed(1)}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalProjects}</p>
              <p className="text-sm text-gray-500">3 completed this month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalInvoices}</p>
              <p className="text-sm text-gray-500">18 paid, 6 pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          {renderBarChart(analyticsData.monthlyRevenue, 'Monthly Revenue', '#10B981')}
        </div>

        <div className="card">
          {renderBarChart(analyticsData.clientGrowth, 'Client Growth', '#3B82F6')}
        </div>

        <div className="card">
          {renderPieChart(analyticsData.projectStatus, 'Project Status')}
        </div>

        <div className="card">
          {renderBarChart(analyticsData.fileUploads, 'File Uploads', '#8B5CF6')}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New client "TechCorp Inc." added</span>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Invoice #INV-003 paid ($2,500)</span>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">5 files uploaded to "Website Redesign" project</span>
            <span className="text-xs text-gray-400">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Project "Brand Identity" completed</span>
            <span className="text-xs text-gray-400">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

