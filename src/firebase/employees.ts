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

export interface Employee {
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

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const LOCAL_STORAGE_KEY = 'shifter_employees';

const loadLocalEmployees = (): Employee[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalEmployees = (employees: Employee[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  } catch {
    // Ignore write errors
  }
};

// Convert Firestore document to Employee object
const docToEmployee = (docSnap: QueryDocumentSnapshot<DocumentData>): Employee => {
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

// Get all employees for a user
export const getEmployees = async (userId: string): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToEmployee);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return loadLocalEmployees().filter(e => e.ownerId === userId);
  }
};

// Add a new employee
export const addEmployee = async (employeeData: EmployeeFormData, ownerId: string): Promise<Employee> => {
  try {
    const employeesRef = collection(db, 'employees');
    const portalUrl = `https://shifter.com/portal/employee${Date.now()}`;

    const docRef = await addDoc(employeesRef, {
      ...employeeData,
      ownerId,
      portalUrl,
      status: 'request-sent',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Return the created employee
    return {
      id: docRef.id,
      ownerId,
      ...employeeData,
      portalUrl,
      status: 'request-sent',
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error adding employee:', error);
    // Fallback to local storage when Firestore isn't available
    const localEmployee: Employee = {
      id: `local-${Date.now()}`,
      ownerId,
      ...employeeData,
      portalUrl: `https://shifter.com/portal/employee${Date.now()}`,
      status: 'request-sent',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const existing = loadLocalEmployees();
    existing.unshift(localEmployee);
    saveLocalEmployees(existing);
    return localEmployee;
  }
};

// Update an employee
export const updateEmployee = async (employeeId: string, employeeData: EmployeeFormData): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    await updateDoc(employeeRef, {
      ...employeeData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    // Update local storage fallback
    const employees = loadLocalEmployees();
    const idx = employees.findIndex(e => e.id === employeeId);
    if (idx !== -1) {
      employees[idx] = { ...employees[idx], ...employeeData };
      saveLocalEmployees(employees);
    }
  }
};

// Delete an employee
export const deleteEmployee = async (employeeId: string): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    await deleteDoc(employeeRef);
  } catch (error) {
    console.error('Error deleting employee:', error);
    const employees = loadLocalEmployees().filter(e => e.id !== employeeId);
    saveLocalEmployees(employees);
  }
};

// Update employee status
export const updateEmployeeStatus = async (
  employeeId: string,
  status: 'request-sent' | 'active' | 'inactive'
): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    await updateDoc(employeeRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating employee status:', error);
     const employees = loadLocalEmployees();
     const idx = employees.findIndex(e => e.id === employeeId);
     if (idx !== -1) {
       employees[idx].status = status;
       saveLocalEmployees(employees);
     }
  }
};




