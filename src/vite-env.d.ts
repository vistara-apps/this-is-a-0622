/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_PINATA_API_KEY: string
  readonly VITE_PINATA_SECRET_KEY: string
  readonly VITE_PINATA_JWT: string
  readonly VITE_AIRSTACK_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_SECRET_KEY: string
  readonly VITE_STRIPE_WEBHOOK_SECRET: string
  readonly VITE_STRIPE_PRO_PRICE_ID: string
  readonly VITE_STRIPE_ARTIST_PRICE_ID: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
