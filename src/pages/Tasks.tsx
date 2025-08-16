import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { Task, updateTaskStatus } from '../firebase/tasks';

function Tasks() {
  const { currentUser } = useAuth();
  const tasks: Task[] = useTasks(currentUser?.id);

  const handleStatusChange = async (
    taskId: string,
    status: Task['status']
  ) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
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
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as Task['status']
                          )
                        }
                        className="input-field capitalize"
                      >
                        <option value="todo">todo</option>
                        <option value="in-progress">in-progress</option>
                        <option value="review">review</option>
                        <option value="done">done</option>
                      </select>
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
