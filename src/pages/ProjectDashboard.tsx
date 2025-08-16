import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task, addTask, docToTask } from '../firebase/tasks';
import { getClients, Client } from '../firebase/clients';
import { useAuth } from '../contexts/AuthContext';

interface TaskForm {
  title: string;
  assigneeId: string;
  dueDate: string;
}

function ProjectDashboard() {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>();

  useEffect(() => {
    if (!projectId) return;
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('projectId', '==', projectId), orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setTasks(snapshot.docs.map(docToTask));
    });
    return unsubscribe;
  }, [projectId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentUser) return;
      const list = await getClients(currentUser.id);
      setEmployees(list);
    };
    fetchEmployees();
  }, [currentUser]);

  const onSubmit = async (data: TaskForm) => {
    if (!projectId) return;
    const assignee = employees.find(e => e.id === data.assigneeId);
    try {
      await addTask({
        projectId,
        title: data.title,
        assigneeId: data.assigneeId,
        assigneeName: assignee?.name || '',
        dueDate: data.dueDate,
      });
      toast.success('Task created');
      reset();
      setShowForm(false);
    } catch {
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          {currentUser?.role === 'employer' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          )}
        </div>

        {showForm && currentUser?.role === 'employer' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register('title', { required: true })}
                className="input-field"
                placeholder="Task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">Title is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select
                {...register('assigneeId', { required: true })}
                className="input-field"
              >
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              {errors.assigneeId && (
                <p className="mt-1 text-sm text-red-600">Assignee is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                {...register('dueDate', { required: true })}
                className="input-field"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">Due date is required</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Task
              </button>
            </div>
          </form>
        )}

        {tasks.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assigneeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{task.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No tasks for this project.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectDashboard;
