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
  status: 'request-sent' | 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const LOCAL_STORAGE_KEY = 'shifter_clients';

const loadLocalClients = (): Client[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalClients = (clients: Client[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
  } catch {
    // Ignore write errors
  }
};

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
    status: data.status || 'request-sent',
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
    return loadLocalClients().filter(c => c.ownerId === userId);
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
      status: 'request-sent',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Return the created client
    return {
      id: docRef.id,
      ownerId,
      ...clientData,
      portalUrl,
      status: 'request-sent',
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding client:', error);
    // Fallback to local storage when Firestore isn't available
    const localClient: Client = {
      id: `local-${Date.now()}`,
      ownerId,
      ...clientData,
      portalUrl: `https://shifter.com/portal/client${Date.now()}`,
      status: 'request-sent',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const existing = loadLocalClients();
    existing.unshift(localClient);
    saveLocalClients(existing);
    return localClient;
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
    // Update local storage fallback
    const clients = loadLocalClients();
    const idx = clients.findIndex(c => c.id === clientId);
    if (idx !== -1) {
      clients[idx] = { ...clients[idx], ...clientData };
      saveLocalClients(clients);
    }
  }
};

// Delete a client
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    const clients = loadLocalClients().filter(c => c.id !== clientId);
    saveLocalClients(clients);
  }
};

// Update client status
export const updateClientStatus = async (
  clientId: string,
  status: 'request-sent' | 'active' | 'inactive'
): Promise<void> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating client status:', error);
     const clients = loadLocalClients();
     const idx = clients.findIndex(c => c.id === clientId);
     if (idx !== -1) {
       clients[idx].status = status;
       saveLocalClients(clients);
     }
  }
};




