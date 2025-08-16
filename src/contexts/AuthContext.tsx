import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserRole: (role: UserRole) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, name: string, role: UserRole = 'freelancer') {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', result.user.uid);
    const customUser: User = {
      id: result.user.uid,
      email: result.user.email || '',
      name,
      role,
      permissions: [],
      createdAt: new Date(),
      onboardingCompleted: false,
      onboardingStep: 1,
    };
    await setDoc(userRef, {
      email: customUser.email,
      name: customUser.name,
      role: customUser.role,
      permissions: customUser.permissions,
      createdAt: serverTimestamp(),
      onboardingCompleted: false,
      onboardingStep: 1,
    });
    setCurrentUser(customUser);
    return customUser;
  }

  async function login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', result.user.uid);
    const snapshot = await getDoc(userRef);

    let customUser: User;
    if (snapshot.exists()) {
      const data = snapshot.data();
      customUser = {
        id: result.user.uid,
        email: data.email || '',
        name: data.name || result.user.displayName || 'User',
        role: data.role || 'freelancer',
        permissions: data.permissions || [],
        createdAt: data.createdAt?.toDate?.() || new Date(),
        onboardingCompleted: data.onboardingCompleted || false,
        onboardingStep: data.onboardingStep || 1,
      };
    } else {
      customUser = {
        id: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || 'User',
        role: 'freelancer',
        permissions: [],
        createdAt: new Date(),
        onboardingCompleted: false,
        onboardingStep: 1,
      };
      await setDoc(userRef, {
        email: customUser.email,
        name: customUser.name,
        role: customUser.role,
        permissions: customUser.permissions,
        createdAt: serverTimestamp(),
        onboardingCompleted: false,
        onboardingStep: 1,
      });
    }
    setCurrentUser(customUser);
    return customUser;
  }

  function logout() {
    return signOut(auth).then(() => {
      setCurrentUser(null);
    });
  }

  async function updateUserRole(role: UserRole) {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { role });
      setCurrentUser({ ...currentUser, role });
    }
  }

  async function completeOnboarding() {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { onboardingCompleted: true, onboardingStep: 5 });
      setCurrentUser({
        ...currentUser,
        onboardingCompleted: true,
        onboardingStep: 5,
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const customUser: User = {
            id: firebaseUser.uid,
            email: data.email || '',
            name: data.name || firebaseUser.displayName || 'User',
            role: data.role || 'freelancer',
            permissions: data.permissions || [],
            createdAt: data.createdAt?.toDate?.() || new Date(),
            onboardingCompleted: data.onboardingCompleted || false,
            onboardingStep: data.onboardingStep || 1,
          };
          setCurrentUser(customUser);
        } else {
          const customUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'freelancer',
            permissions: [],
            createdAt: new Date(),
            onboardingCompleted: false,
            onboardingStep: 1,
          };
          await setDoc(userRef, {
            email: customUser.email,
            name: customUser.name,
            role: customUser.role,
            permissions: customUser.permissions,
            createdAt: serverTimestamp(),
            onboardingCompleted: false,
            onboardingStep: 1,
          });
          setCurrentUser(customUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    updateUserRole,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

