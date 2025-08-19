import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task, docToTask, getTasksForUser } from '../firebase/tasks';

export function useTasks(userId?: string, isEmployer = false) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch with offline fallback
    getTasksForUser(userId, isEmployer)
      .then(setTasks)
      .catch(() => {
        setTasks([]);
      });

    const tasksRef = collection(db, 'tasks');
    const q = isEmployer
      ? query(tasksRef, where('ownerId', '==', userId), orderBy('dueDate', 'asc'))
      : query(tasksRef, where('assigneeId', '==', userId), orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setTasks(snapshot.docs.map(docToTask));
      },
      () => {
        // Ignore errors here – initial fetch already handled fallback
      }
    );

    return unsubscribe;
  }, [userId, isEmployer]);

  return tasks;
}

