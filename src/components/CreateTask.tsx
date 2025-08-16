import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { addTask } from '../firebase/tasks';
import { getClients, type Client } from '../firebase/clients';

interface TaskForm {
  title: string;
  assigneeId: string;
  timeLimit: string;
}

function CreateTask() {
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  const { register, handleSubmit, reset, setValue } = useForm<TaskForm>();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentUser) return;
      const list = await getClients(currentUser.id);
      setEmployees(list);
    };
    fetchEmployees();
  }, [currentUser]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: TaskForm) => {
    const assignee = employees.find(e => e.id === data.assigneeId);
    let ms = 0;
    switch (data.timeLimit) {
      case '5h':
        ms = 5 * 60 * 60 * 1000;
        break;
      case '1d':
        ms = 24 * 60 * 60 * 1000;
        break;
      case '2d':
        ms = 2 * 24 * 60 * 60 * 1000;
        break;
      default:
        ms = 0;
    }
    const dueDate = new Date(Date.now() + ms).toISOString();
    try {
      await addTask({
        projectId: 'general',
        title: data.title,
        assigneeId: data.assigneeId,
        assigneeName: assignee?.name || '',
        dueDate,
      });
      toast.success('Task created successfully!');
      setShowForm(false);
      reset();
    } catch {
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Task</h1>
          <p className="text-gray-600">Assign tasks to employees.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">New Task</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
                {...register('title', { required: 'Task title is required' })}
                className="input-field"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                {...register('assigneeId', { required: 'Employee is required' })}
                className="input-field"
                onChange={(e) => setValue('assigneeId', e.target.value)}
              >
                <option value="">Select employee</option>
                {filteredEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time Limit</label>
              <select
                {...register('timeLimit', { required: 'Time limit is required' })}
                className="input-field"
              >
                <option value="">Select time limit</option>
                <option value="5h">5 hours</option>
                <option value="1d">1 day</option>
                <option value="2d">2 days</option>
              </select>
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
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateTask;
