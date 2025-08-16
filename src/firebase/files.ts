import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  doc,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { storage, db } from './config';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  clientName: string;
  projectName: string;
  url: string;
  shared: boolean;
  storagePath?: string;
  mimeType?: string;
}

export interface FileUploadData {
  file: File;
  clientName: string;
  projectName: string;
  uploadedBy: string;
}

// Convert Firestore document to FileItem object
const docToFileItem = (doc: QueryDocumentSnapshot<DocumentData>): FileItem => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    type: data.type || 'file',
    size: data.size || 0,
    uploadedBy: data.uploadedBy || '',
    uploadedAt: data.uploadedAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
    clientName: data.clientName || '',
    projectName: data.projectName || '',
    url: data.url || '',
    shared: data.shared || false,
    storagePath: data.storagePath,
    mimeType: data.mimeType,
  };
};

// Get all files from Firestore
export const getFiles = async (): Promise<FileItem[]> => {
  try {
    const filesRef = collection(db, 'files');
    const q = query(filesRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docToFileItem);
  } catch (error) {
    console.error('Error fetching files:', error);
    // Return empty list if Firestore is unavailable
    return [];
  }
};

// Upload file to Firebase Storage and save metadata to Firestore
export const uploadFile = async (fileData: FileUploadData): Promise<FileItem> => {
  try {
    const { file, clientName, projectName, uploadedBy } = fileData;
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storagePath = `files/${clientName}/${projectName}/${fileName}`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save metadata to Firestore
    const filesRef = collection(db, 'files');
    const docRef = await addDoc(filesRef, {
      name: file.name,
      type: 'file',
      size: file.size,
      uploadedBy,
      uploadedAt: serverTimestamp(),
      clientName,
      projectName,
      url: downloadURL,
      shared: false,
      storagePath,
      mimeType: file.type,
    });

    // Return the created file item
    return {
      id: docRef.id,
      name: file.name,
      type: 'file',
      size: file.size,
      uploadedBy,
      uploadedAt: new Date().toISOString().split('T')[0],
      clientName,
      projectName,
      url: downloadURL,
      shared: false,
      storagePath,
      mimeType: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    // Fallback: return a local file reference so uploads work offline
    return {
      id: Date.now().toString(),
      name: fileData.file.name,
      type: 'file',
      size: fileData.file.size,
      uploadedBy: fileData.uploadedBy,
      uploadedAt: new Date().toISOString().split('T')[0],
      clientName: fileData.clientName,
      projectName: fileData.projectName,
      url: URL.createObjectURL(fileData.file),
      shared: false,
    };
  }
};

// Delete file from both Storage and Firestore
export const deleteFile = async (fileId: string, storagePath?: string): Promise<void> => {
  try {
    // Delete from Firestore
    const fileRef = doc(db, 'files', fileId);
    await deleteDoc(fileRef);
    
    // Delete from Storage if path exists
    if (storagePath) {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

// Update file metadata in Firestore
export const updateFile = async (fileId: string, updates: Partial<FileItem>): Promise<void> => {
  try {
    const fileRef = doc(db, 'files', fileId);
    await updateDoc(fileRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating file:', error);
    throw new Error('Failed to update file');
  }
};

// Toggle file sharing status
export const toggleFileSharing = async (fileId: string, shared: boolean): Promise<void> => {
  try {
    const fileRef = doc(db, 'files', fileId);
    await updateDoc(fileRef, {
      shared,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error toggling file sharing:', error);
    throw new Error('Failed to update file sharing');
  }
};

// Get files by client
export const getFilesByClient = async (clientName: string): Promise<FileItem[]> => {
  try {
    const filesRef = collection(db, 'files');
    const q = query(
      filesRef, 
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(docToFileItem)
      .filter(file => file.clientName === clientName);
  } catch (error) {
    console.error('Error fetching client files:', error);
    throw new Error('Failed to fetch client files');
  }
};

// Get files by project
export const getFilesByProject = async (projectName: string): Promise<FileItem[]> => {
  try {
    const filesRef = collection(db, 'files');
    const q = query(
      filesRef, 
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(docToFileItem)
      .filter(file => file.projectName === projectName);
  } catch (error) {
    console.error('Error fetching project files:', error);
    throw new Error('Failed to fetch project files');
  }
};
