interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLIC_KEY: string
  [key: string]: any
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
