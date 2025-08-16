import { useAuth } from '../contexts/AuthContext';
import { mockTasks, Task } from '../data/mockTasks';

function Tasks() {
  const { currentUser } = useAuth();
  const userTasks: Task[] = mockTasks.filter(t => t.assignee === currentUser?.name);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
      <div className="card">
        {userTasks.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.projectId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{task.status.replace('-', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No tasks assigned.</p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
