import { useState, useEffect } from 'react';
import { Upload, Search, File as FileIcon, Folder, Download, Share2, Trash2, Eye } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  getFiles, 
  uploadFile, 
  deleteFile, 
  toggleFileSharing,
  type FileItem, 
  type FileUploadData 
} from '../firebase/files';

function Files() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const fetchedFiles = await getFiles();
        setFiles(fetchedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to load files');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(selected).map(async (file) => {
        const fileData: FileUploadData = {
          file,
          clientName: 'General', // In real app, this would come from a form
          projectName: 'General', // In real app, this would come from a form
          uploadedBy: currentUser?.name || 'Unknown User',
        };

        return await uploadFile(fileData);
      });

      const newFiles = await Promise.all(uploadPromises);
      setFiles([...newFiles, ...files]);
      toast.success(`${selected.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string, storagePath?: string) => {
    try {
      await deleteFile(fileId, storagePath);
      setFiles(files.filter(file => file.id !== fileId));
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleShare = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (file) {
        const newSharedStatus = !file.shared;
        await toggleFileSharing(fileId, newSharedStatus);
        setFiles(files.map(f => 
          f.id === fileId ? { ...f, shared: newSharedStatus } : f
        ));
        toast.success(`${file.shared ? 'Unshared' : 'Shared'} ${file.name}`);
      }
    } catch (error) {
      console.error('Error toggling file sharing:', error);
      toast.error('Failed to update file sharing');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'folder') {
      return <Folder className="h-8 w-8 text-blue-500" />;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileIcon className="h-8 w-8 text-red-500" />;
      case 'ai':
      case 'psd':
      case 'fig':
        return <FileIcon className="h-8 w-8 text-purple-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon className="h-8 w-8 text-green-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-8 w-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-8 w-8 text-green-600" />;
      default:
        return <FileIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          <p className="text-gray-600">Manage and share files with your employees.</p>
        </div>
        <label className="btn-primary flex items-center cursor-pointer">
          <Upload className="h-5 w-5 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Files'}
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Files List */}
      <div className="card">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading files...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No files found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(file.name, file.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">by {file.uploadedBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {file.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {file.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.uploadedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        file.shared 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {file.shared ? 'Shared' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={file.url}
                        download
                        className="text-green-600 hover:text-green-900"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleShare(file.id)}
                        className={`${file.shared ? 'text-orange-600 hover:text-orange-900' : 'text-blue-600 hover:text-blue-900'}`}
                        title={file.shared ? 'Unshare' : 'Share'}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id, file.storagePath)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
