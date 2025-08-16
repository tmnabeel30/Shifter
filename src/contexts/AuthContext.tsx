import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserRole: (role: UserRole) => void;
  completeOnboarding: () => void;
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

  function signup(email: string, password: string, name: string, role: UserRole = 'freelancer') {
    return createUserWithEmailAndPassword(auth, email, password).then((result) => {
      // Create custom user object with role
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
      setCurrentUser(customUser);
    });
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      // For now, create a default user object
      // In a real app, you'd fetch user data from Firestore
      const customUser: User = {
        id: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || 'User',
        role: 'freelancer', // Default role
        permissions: [],
        createdAt: new Date(),
        onboardingCompleted: false,
        onboardingStep: 1,
      };
      setCurrentUser(customUser);
    });
  }

  function logout() {
    return signOut(auth).then(() => {
      setCurrentUser(null);
    });
  }

  function updateUserRole(role: UserRole) {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  }

  function completeOnboarding() {
    if (currentUser) {
      setCurrentUser({ 
        ...currentUser, 
        onboardingCompleted: true,
        onboardingStep: 5
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Create custom user object from Firebase user
        const customUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          role: 'freelancer', // Default role - in real app, fetch from Firestore
          permissions: [],
          createdAt: new Date(),
          onboardingCompleted: false,
          onboardingStep: 1,
        };
        setCurrentUser(customUser);
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
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

