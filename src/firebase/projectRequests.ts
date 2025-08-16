import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';

export interface ProjectRequest {
  id: string;
  projectName: string;
  description: string;
  budget: string;
  timeline: string;
  category: string;
  skills: string[];
  additionalRequirements: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  createdAt: string;
}

export interface ProjectRequestInput {
  projectName: string;
  description: string;
  budget: string;
  timeline: string;
  category: string;
  skills: string[];
  additionalRequirements: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
}

const docToProjectRequest = (docSnap: QueryDocumentSnapshot<DocumentData>): ProjectRequest => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    projectName: data.projectName || '',
    description: data.description || '',
    budget: data.budget || '',
    timeline: data.timeline || '',
    category: data.category || '',
    skills: data.skills || [],
    additionalRequirements: data.additionalRequirements || '',
    clientId: data.clientId || '',
    clientName: data.clientName || '',
    clientEmail: data.clientEmail || '',
    status: data.status || 'pending',
    createdAt:
      data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
  };
};

export const addProjectRequest = async (
  request: ProjectRequestInput
): Promise<ProjectRequest> => {
  try {
    const requestsRef = collection(db, 'projectRequests');
    const docRef = await addDoc(requestsRef, {
      ...request,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding project request:', error);
    throw new Error('Failed to add project request');
  }
};

export const getProjectRequests = async (): Promise<ProjectRequest[]> => {
  try {
    const requestsRef = collection(db, 'projectRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToProjectRequest);
  } catch (error) {
    console.error('Error fetching project requests:', error);
    return [];
  }
};

export const updateRequestStatus = async (
  requestId: string,
  status: ProjectRequest['status']
): Promise<void> => {
  try {
    const requestRef = doc(db, 'projectRequests', requestId);
    await updateDoc(requestRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    throw new Error('Failed to update request status');
  }
};

export const deleteProjectRequest = async (requestId: string): Promise<void> => {
  try {
    const requestRef = doc(db, 'projectRequests', requestId);
    await deleteDoc(requestRef);
  } catch (error) {
    console.error('Error deleting project request:', error);
    throw new Error('Failed to delete project request');
  }
};

