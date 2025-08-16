import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Project, docToProject } from '../firebase/projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setProjects(snapshot.docs.map(docToProject));
    });

    return unsubscribe;
  }, []);

  return projects;
}

