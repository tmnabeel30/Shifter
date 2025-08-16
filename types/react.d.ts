declare namespace React {
  type FC<P = any> = (props: P) => any
  type ReactNode = any
  type FormEvent = any
  type ChangeEvent<T = any> = any
  type CSSProperties = any
  function useState<T = any>(initial: T): [T, (value: T) => void]
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
