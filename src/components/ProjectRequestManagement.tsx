import { useState, useEffect } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getProjectRequests,
  updateRequestStatus,
  ProjectRequest
} from '../firebase/projectRequests';

function ProjectRequestManagement() {
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await getProjectRequests();
      setProjectRequests(requests);
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: ProjectRequest['status']
  ) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      setProjectRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
      toast.success(`Project request ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update request status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredRequests = projectRequests.filter(request => {
    const matchesSearch = 
      request.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Request Management</h1>
          <p className="text-gray-600">Review and manage client project requests.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search project requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Project Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {request.projectName}
                </h3>
                <p className="text-sm text-gray-500">{request.clientName}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(request.status)}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                {request.category}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                {request.budget}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {request.timeline}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {request.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {skill}
                </span>
              ))}
              {request.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{request.skills.length - 3} more
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedRequest(request);
                  setShowDetails(true);
                }}
                className="text-blue-600 hover:text-blue-900 flex items-center"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </button>
              
              {request.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                    className="text-green-600 hover:text-green-900"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    className="text-red-600 hover:text-red-900"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedRequest.projectName}</h2>
                  <p className="text-gray-600">Submitted by {selectedRequest.clientName}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Client Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Client Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedRequest.clientName}</p>
                    <p><strong>Email:</strong> {selectedRequest.clientEmail}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{selectedRequest.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium">{selectedRequest.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="font-medium">{selectedRequest.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedRequest.description}</p>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Requirements */}
                {selectedRequest.additionalRequirements && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Additional Requirements</h3>
                    <p className="text-gray-700">{selectedRequest.additionalRequirements}</p>
                  </div>
                )}

                {/* Actions */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'rejected');
                        setShowDetails(false);
                      }}
                      className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'approved');
                        setShowDetails(false);
                      }}
                      className="btn-primary bg-green-600 hover:bg-green-700"
                    >
                      Approve Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectRequestManagement;
