import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { Task, updateTaskStatus } from '../firebase/tasks';

function Tasks() {
  const { currentUser } = useAuth();
  const tasks: Task[] = useTasks(
    currentUser?.id,
    currentUser?.role === 'employer'
  );

  const handleStatusChange = async (
    task: Task,
    status: Task['status']
  ) => {
    if (currentUser?.id !== task.assigneeId) {
      toast.error('Only the assigned user can update this task');
      return;
    }

    try {
      await updateTaskStatus(task.id, status);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {currentUser?.role === 'employer' ? 'All Tasks' : 'My Tasks'}
      </h1>
      <div className="card">
        {tasks.length ? (
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
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.projectId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const statusOptions: Task['status'][] = [
                          'todo',
                          'in-progress',
                          'review',
                          'done',
                        ];
                        const value = statusOptions.indexOf(task.status);
                        if (currentUser?.id === task.assigneeId) {
                          return (
                            <input
                              type="range"
                              min={0}
                              max={statusOptions.length - 1}
                              step={1}
                              value={value}
                              onChange={(e) =>
                                handleStatusChange(
                                  task,
                                  statusOptions[Number(e.target.value)]
                                )
                              }
                              className="w-full"
                            />
                          );
                        }
                        return (
                          <input
                            type="range"
                            min={0}
                            max={statusOptions.length - 1}
                            step={1}
                            value={value}
                            disabled
                            className="w-full"
                          />
                        );
                      })()}
                    </td>
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
