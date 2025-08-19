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
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';

export interface Invoice {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceInput {
  employeeId: string;
  employeeName: string;
  amount: number;
  dueDate: string;
  invoiceNumber: string;
  status?: Invoice['status'];
}

const docToInvoice = (
  docSnap: QueryDocumentSnapshot<DocumentData>
): Invoice => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    employeeId: data.employeeId || '',
    employeeName: data.employeeName || '',
    amount: data.amount || 0,
    status: data.status || 'pending',
    dueDate: data.dueDate || '',
    invoiceNumber: data.invoiceNumber || '',
    createdAt:
      data.createdAt?.toDate?.()?.toISOString()?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0],
  };
};

export const getInvoices = async (
  userId?: string,
  role?: string
): Promise<Invoice[]> => {
  try {
    const invoicesRef = collection(db, 'invoices');
    const q =
      role === 'employee' && userId
        ? query(
            invoicesRef,
            where('employeeId', '==', userId),
            orderBy('createdAt', 'desc')
          )
        : query(invoicesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToInvoice);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const addInvoice = async (
  invoice: InvoiceInput
): Promise<Invoice> => {
  try {
    const invoicesRef = collection(db, 'invoices');
    const docRef = await addDoc(invoicesRef, {
      ...invoice,
      status: invoice.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      id: docRef.id,
      ...invoice,
      status: invoice.status || 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw new Error('Failed to add invoice');
  }
};

export const updateInvoiceStatus = async (
  invoiceId: string,
  status: Invoice['status']
): Promise<void> => {
  try {
    const invoiceRef = doc(db, 'invoices', invoiceId);
    await updateDoc(invoiceRef, { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw new Error('Failed to update invoice status');
  }
};

export const deleteInvoice = async (invoiceId: string): Promise<void> => {
  try {
    const invoiceRef = doc(db, 'invoices', invoiceId);
    await deleteDoc(invoiceRef);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error('Failed to delete invoice');
  }
};

