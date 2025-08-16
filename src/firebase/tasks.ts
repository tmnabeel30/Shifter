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
  status?: Task['status'];
  dueDate: string;
}

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
    status: data.status || 'todo',
    dueDate: data.dueDate || '',
    createdAt:
      data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0],
  };
};

export const getTasksForUser = async (userId: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('assigneeId', '==', userId), orderBy('dueDate', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToTask);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
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
    throw new Error('Failed to add task');
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
    throw new Error('Failed to update task');
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
    throw new Error('Failed to update task status');
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

