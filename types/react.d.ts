declare namespace React {
  type FC<P = any> = (props: P) => any
  type ReactNode = any
  type FormEvent = any
  type ChangeEvent<T = any> = { target: T }
  type CSSProperties = any
  const StrictMode: any
  function createContext<T = any>(defaultValue: T): any
  function useState<T = any>(initial: T): [T, (value: T | ((prev: T) => T)) => void]
  function useEffect(effect: any, deps?: any): void
  function useContext<T = any>(ctx: any): T
}

declare module 'react' {
  export = React
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
