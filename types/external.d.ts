declare module 'react-router-dom'
declare module 'lucide-react'
declare module 'react-hot-toast'
declare module 'react-hook-form' {
  export function useForm<T = any>(...args: any[]): any
}
declare module '@stripe/stripe-js' {
  export type StripeCardElementOptions = any
  export function loadStripe(...args: any[]): any
}
declare module '@stripe/react-stripe-js' {
  export const Elements: any
  export const CardElement: any
  export function useStripe(): any
  export function useElements(): any
}
declare module 'react-dom/client'

declare module 'react/jsx-runtime' {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
}

declare module 'firebase/app' {
  export const initializeApp: any
}
declare module 'firebase/auth' {
  export type User = any
  export const getAuth: any
  export const onAuthStateChanged: any
  export const signInWithEmailAndPassword: any
  export const createUserWithEmailAndPassword: any
  export const signOut: any
  export const signInAnonymously: any
}
declare module 'firebase/firestore' {
  export type DocumentData = any
  export type QueryDocumentSnapshot<T = any> = any
  export const collection: any
  export const doc: any
  export const addDoc: any
  export const updateDoc: any
  export const deleteDoc: any
  export const getDocs: any
  export const getDoc: any
  export const setDoc: any
  export const query: any
  export const orderBy: any
  export const where: any
  export const serverTimestamp: any
  export const onSnapshot: any
  export const getCountFromServer: any
  export const getFirestore: any
}
declare module 'firebase/storage'
declare module 'date-fns'
