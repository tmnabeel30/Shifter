declare module 'react-router-dom'
declare module 'lucide-react'
declare module 'react-hot-toast'
declare module 'react-hook-form' {
  export function useForm<T = any>(...args: any[]): any
}
declare module '@stripe/stripe-js'
declare module '@stripe/react-stripe-js'
declare module 'react-dom/client'

declare module 'react/jsx-runtime' {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
}

declare module 'firebase/app'
declare module 'firebase/auth'
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
}
declare module 'firebase/storage'
declare module 'date-fns'
