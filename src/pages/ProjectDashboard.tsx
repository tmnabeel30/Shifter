import { useParams } from 'react-router-dom';
import { mockTasks, Task } from '../data/mockTasks';

function ProjectDashboard() {
  const { projectId } = useParams();
  const projectTasks: Task[] = mockTasks.filter(t => t.projectId === projectId);
  const teamMembers = Array.from(new Set(projectTasks.map(t => t.assignee)));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
      <div className="card space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          {teamMembers.length ? (
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {teamMembers.map(member => (
                <li key={member} className="text-gray-700">{member}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No team members assigned.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tasks</h2>
          {projectTasks.length ? (
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
                  {projectTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{task.status.replace('-', ' ')}</td>
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
    </div>
  );
}

export default ProjectDashboard;
