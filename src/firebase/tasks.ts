import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  ownerId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskInput {
  projectId: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  ownerId: string;
  status?: Task['status'];
  dueDate: string;
}

const LOCAL_STORAGE_KEY = 'shifter_tasks';

const loadLocalTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore write errors
  }
};

export const docToTask = (
  docSnap: QueryDocumentSnapshot<DocumentData>
): Task => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    projectId: data.projectId || '',
    title: data.title || '',
    assigneeId: data.assigneeId || '',
    assigneeName: data.assigneeName || '',
    ownerId: data.ownerId || '',
    status: data.status || 'todo',
    dueDate: data.dueDate || '',
    createdAt:
      data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0],
  };
};

export const getTasksForUser = async (
  userId?: string,
  isEmployer = false
): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = isEmployer
      ? query(tasksRef, where('ownerId', '==', userId), orderBy('dueDate', 'asc'))
      : query(tasksRef, where('assigneeId', '==', userId), orderBy('dueDate', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToTask);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    const tasks = loadLocalTasks();
    return isEmployer
      ? tasks.filter(t => t.ownerId === userId)
      : tasks.filter(t => t.assigneeId === userId);
  }
};

export const addTask = async (task: TaskInput): Promise<Task> => {
  try {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...task,
      status: task.status || 'todo',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...task,
      status: task.status || 'todo',
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding task:', error);
    const localTask: Task = {
      id: `local-${Date.now()}`,
      projectId: task.projectId,
      title: task.title,
      assigneeId: task.assigneeId,
      assigneeName: task.assigneeName,
      ownerId: task.ownerId,
      status: task.status || 'todo',
      dueDate: task.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const existing = loadLocalTasks();
    existing.unshift(localTask);
    saveLocalTasks(existing);
    return localTask;
  }
};

export const updateTask = async (
  taskId: string,
  data: Partial<TaskInput>
): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    const tasks = loadLocalTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      tasks[idx] = {
        ...tasks[idx],
        ...data,
        updatedAt: new Date().toISOString().split('T')[0],
      } as Task;
      saveLocalTasks(tasks);
    }
  }
};

export const updateTaskStatus = async (
  taskId: string,
  status: Task['status']
): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    const tasks = loadLocalTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      tasks[idx].status = status;
      tasks[idx].updatedAt = new Date().toISOString().split('T')[0];
      saveLocalTasks(tasks);
    }
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    const tasks = loadLocalTasks().filter(t => t.id !== taskId);
    saveLocalTasks(tasks);
  }
};

