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

export interface Client {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  portalUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

// Convert Firestore document to Client object
const docToClient = (docSnap: QueryDocumentSnapshot<DocumentData>): Client => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ownerId: data.ownerId || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    company: data.company || '',
    portalUrl: data.portalUrl || '',
    status: data.status || 'active',
    createdAt: data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0],
  };
};

// Get all clients for a user
export const getClients = async (userId: string): Promise<Client[]> => {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToClient);
  } catch (error) {
    console.error('Error fetching clients:', error);
    // Return an empty list in offline or error scenarios
    return [];
  }
};

// Add a new client
export const addClient = async (clientData: ClientFormData, ownerId: string): Promise<Client> => {
  try {
    const clientsRef = collection(db, 'clients');
    const portalUrl = `https://shifter.com/portal/client${Date.now()}`;

    const docRef = await addDoc(clientsRef, {
      ...clientData,
      ownerId,
      portalUrl,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Return the created client
    return {
      id: docRef.id,
      ownerId,
      ...clientData,
      portalUrl,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding client:', error);
    throw new Error('Failed to add client');
  }
};

// Update a client
export const updateClient = async (clientId: string, clientData: ClientFormData): Promise<void> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw new Error('Failed to update client');
  }
};

// Delete a client
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw new Error('Failed to delete client');
  }
};

// Update client status
export const updateClientStatus = async (clientId: string, status: 'active' | 'inactive'): Promise<void> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating client status:', error);
    throw new Error('Failed to update client status');
  }
};




