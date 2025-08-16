import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task, docToTask } from '../firebase/tasks';

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!userId) return;
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('assigneeId', '==', userId), orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setTasks(snapshot.docs.map(docToTask));
    });

    return unsubscribe;
  }, [userId]);

  return tasks;
}

