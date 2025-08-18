import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

export interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: string;
}

export const updateUserProfile = async (
  userId: string,
  data: UserProfile,
  avatarFile?: File
): Promise<UserProfile> => {
  const updated: UserProfile = { ...data };
  if (avatarFile) {
    const avatarRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(avatarRef, avatarFile);
    updated.avatar = await getDownloadURL(avatarRef);
  }
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updated);
  return updated;
};
