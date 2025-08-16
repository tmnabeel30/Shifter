import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  teamMembers: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectInput {
  name: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  teamMembers: string[];
  status?: Project['status'];
  progress?: number;
}

export const docToProject = (
  docSnap: QueryDocumentSnapshot<DocumentData>
): Project => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name || '',
    clientName: data.clientName || '',
    description: data.description || '',
    status: data.status || 'planning',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    progress: data.progress || 0,
    budget: data.budget || 0,
    teamMembers: data.teamMembers || [],
    createdAt:
      data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0],
  };
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const addProject = async (project: ProjectInput): Promise<Project> => {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...project,
      status: project.status || 'planning',
      progress: project.progress || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...project,
      status: project.status || 'planning',
      progress: project.progress || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding project:', error);
    throw new Error('Failed to add project');
  }
};

export const updateProject = async (
  projectId: string,
  project: Partial<ProjectInput>
): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...project,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};

