import { useEffect, useState } from 'react';
import { CheckCircle, DollarSign, FileText, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Invoice, docToInvoice } from '../firebase/invoices';
import { Project, docToProject } from '../firebase/projects';
import { FileItem, docToFileItem } from '../firebase/files';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

function ClientPortal() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const invoicesRef = collection(db, 'invoices');
    const invoicesQuery = query(
      invoicesRef,
      where('employeeId', '==', currentUser.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeInvoices = onSnapshot(invoicesQuery, snapshot => {
      setInvoices(snapshot.docs.map(docToInvoice));
    });

    const projectsRef = collection(db, 'projects');
    const projectsQuery = query(
      projectsRef,
      where('clientId', '==', currentUser.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeProjects = onSnapshot(projectsQuery, snapshot => {
      setProjects(snapshot.docs.map(docToProject));
    });

    const filesRef = collection(db, 'files');
    const filesQuery = query(
      filesRef,
      where('clientId', '==', currentUser.id),
      where('shared', '==', true),
      orderBy('uploadedAt', 'desc')
    );
    const unsubscribeFiles = onSnapshot(filesQuery, snapshot => {
      setFiles(snapshot.docs.map(docToFileItem));
    });

    return () => {
      unsubscribeInvoices();
      unsubscribeProjects();
      unsubscribeFiles();
    };
  }, [currentUser]);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'invoices', name: 'Invoices' },
    { id: 'projects', name: 'Projects' },
    { id: 'files', name: 'Files' },
  ];

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const sharedFiles = files.length;

  const downloadInvoice = (invoice: Invoice) => {
    if ((invoice as any).url) {
      window.open((invoice as any).url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
        <p className="text-gray-600">Welcome to your client portal.</p>
      </div>

      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Invoiced</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ${totalInvoiced.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Active Projects</p>
                      <p className="text-2xl font-bold text-green-900">
                        {activeProjects}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Files Shared</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {sharedFiles}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <p className="text-gray-600">No recent activity.</p>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => downloadInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!invoices.length && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Projects</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!projects.length && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Files</h3>
              <ul className="divide-y divide-gray-200">
                {files.map(file => (
                  <li
                    key={file.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                  </li>
                ))}
                {!files.length && (
                  <li className="py-2 text-center text-sm text-gray-500">
                    No files found.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientPortal;
