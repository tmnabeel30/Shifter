import { auth } from './config';
import { signInAnonymously } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth object:', auth);
    console.log('Auth config:', auth.config);
    
    // Try to sign in anonymously to test connection
    const result = await signInAnonymously(auth);
    console.log('Firebase connection successful!', result);
    
    // Sign out immediately
    await auth.signOut();
    console.log('Test completed successfully');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};


