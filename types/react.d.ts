declare module 'react' {
  export const FC: any
  export const ReactNode: any
  export function useState(initial: any): any
  export function useEffect(effect: any, deps?: any): void
  const React: any
  export default React
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
