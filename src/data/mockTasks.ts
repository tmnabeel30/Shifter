export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate: string;
}

export const mockTasks: Task[] = [
  {
    id: 't1',
    projectId: '1',
    title: 'Design homepage layout',
    assignee: 'Designer',
    status: 'in-progress',
    dueDate: '2024-02-10',
  },
  {
    id: 't2',
    projectId: '1',
    title: 'Implement responsive header',
    assignee: 'Developer',
    status: 'todo',
    dueDate: '2024-02-12',
  },
  {
    id: 't3',
    projectId: '2',
    title: 'Create mobile wireframes',
    assignee: 'Product Manager',
    status: 'review',
    dueDate: '2024-02-20',
  },
];
