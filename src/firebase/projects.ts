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
  QueryDocumentSnapshot,
  where
} from 'firebase/firestore';
import { db } from './config';

export interface Project {
  id: string;
  clientId?: string;
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
  clientId?: string;
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

const LOCAL_STORAGE_KEY = 'shifter_projects';

const loadLocalProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Ignore errors
  }
};

export const docToProject = (
  docSnap: QueryDocumentSnapshot<DocumentData>
): Project => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    clientId: data.clientId || '',
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

export const getProjects = async (clientId?: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = clientId
      ? query(
          projectsRef,
          where('clientId', '==', clientId),
          orderBy('createdAt', 'desc')
        )
      : query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    const projects = loadLocalProjects();
    return clientId ? projects.filter(p => p.clientId === clientId) : projects;
  }
};

export const addProject = async (project: ProjectInput): Promise<Project> => {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...project,
      clientId: project.clientId || '',
      status: project.status || 'planning',
      progress: project.progress || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...project,
      clientId: project.clientId || '',
      status: project.status || 'planning',
      progress: project.progress || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding project:', error);
    const localProject: Project = {
      id: `local-${Date.now()}`,
      clientId: project.clientId || '',
      name: project.name,
      clientName: project.clientName,
      description: project.description,
      status: project.status || 'planning',
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress || 0,
      budget: project.budget,
      teamMembers: project.teamMembers,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const existing = loadLocalProjects();
    existing.unshift(localProject);
    saveLocalProjects(existing);
    return localProject;
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
    const projects = loadLocalProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...project } as Project;
      saveLocalProjects(projects);
    }
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    const projects = loadLocalProjects().filter(p => p.id !== projectId);
    saveLocalProjects(projects);
  }
};

