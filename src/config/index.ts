import { AppConfig } from '../types'

// Environment variables with fallbacks
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`)
  }
  return value || ''
}

// Main application configuration
export const config: AppConfig = {
  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  
  // Supabase Configuration
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
  
  // OpenAI Configuration
  openaiApiKey: getEnvVar('VITE_OPENAI_API_KEY', ''),
  
  // Pinata IPFS Configuration
  pinataApiKey: getEnvVar('VITE_PINATA_API_KEY', ''),
  pinataSecretKey: getEnvVar('VITE_PINATA_SECRET_KEY', ''),
  
  // Airstack Configuration
  airstackApiKey: getEnvVar('VITE_AIRSTACK_API_KEY', ''),
  
  // Stripe Configuration
  stripePublishableKey: getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY', ''),
  
  // File Upload Configuration
  maxFileSize: 100 * 1024 * 1024, // 100MB
  supportedAudioFormats: [
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
    'audio/flac',
    'audio/webm'
  ],
  
  // Feature Flags
  features: {
    sampleIdentification: true,
    clearanceProcess: true,
    dmcaProtection: true,
    sampleLibrary: true,
    subscriptions: true
  }
}

// Service-specific configurations
export const openaiConfig = {
  baseUrl: 'https://api.openai.com/v1',
  apiKey: config.openaiApiKey,
  timeout: 60000,
  retryAttempts: 3,
  retryDelay: 1000,
  model: 'gpt-4',
  maxTokens: 2000,
  temperature: 0.7
}

export const supabaseConfig = {
  url: config.supabaseUrl,
  anonKey: config.supabaseAnonKey,
  serviceRoleKey: getEnvVar('VITE_SUPABASE_SERVICE_ROLE_KEY')
}

export const pinataConfig = {
  baseUrl: 'https://api.pinata.cloud',
  apiKey: config.pinataApiKey,
  secretKey: config.pinataSecretKey,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  jwt: getEnvVar('VITE_PINATA_JWT')
}

export const airstackConfig = {
  baseUrl: 'https://api.airstack.xyz/gql',
  apiKey: config.airstackApiKey,
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000
}

export const stripeConfig = {
  baseUrl: 'https://api.stripe.com/v1',
  apiKey: getEnvVar('VITE_STRIPE_SECRET_KEY', ''),
  publishableKey: config.stripePublishableKey,
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
  webhookSecret: getEnvVar('VITE_STRIPE_WEBHOOK_SECRET')
}

// Subscription tier configurations
export const subscriptionTiers = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      sampleSearches: 5,
      projectsPerMonth: 2,
      dmcaSupport: false,
      legalConsultation: false,
      prioritySupport: false
    }
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: getEnvVar('VITE_STRIPE_PRO_PRICE_ID', ''),
    features: {
      sampleSearches: -1, // unlimited
      projectsPerMonth: -1, // unlimited
      dmcaSupport: true,
      legalConsultation: false,
      prioritySupport: true
    }
  },
  artist: {
    name: 'Artist Bundle',
    price: 49,
    priceId: getEnvVar('VITE_STRIPE_ARTIST_PRICE_ID', ''),
    features: {
      sampleSearches: -1, // unlimited
      projectsPerMonth: -1, // unlimited
      dmcaSupport: true,
      legalConsultation: true,
      prioritySupport: true
    }
  }
}

// Audio processing configuration
export const audioConfig = {
  maxDuration: 600, // 10 minutes in seconds
  sampleRate: 44100,
  bitDepth: 16,
  channels: 2,
  analysisChunkSize: 30, // seconds
  confidenceThreshold: 0.7
}

// DMCA configuration
export const dmcaConfig = {
  responseTimeLimit: 14, // days
  evidenceRetentionPeriod: 365, // days
  supportedPlatforms: [
    'YouTube',
    'SoundCloud',
    'Spotify',
    'Apple Music',
    'Bandcamp',
    'DistroKid',
    'CD Baby',
    'TuneCore'
  ]
}

// Development mode checks
export const isDevelopment = import.meta.env.MODE === 'development'
export const isProduction = import.meta.env.MODE === 'production'

// Validation function to check if all required config is present
export const validateConfig = (): { isValid: boolean; missingKeys: string[] } => {
  const requiredKeys = [
    'supabaseUrl',
    'supabaseAnonKey'
  ]
  
  const missingKeys: string[] = []
  
  requiredKeys.forEach(key => {
    if (!config[key as keyof AppConfig]) {
      missingKeys.push(key)
    }
  })
  
  // Warn about optional but recommended keys
  const recommendedKeys = [
    'openaiApiKey',
    'stripePublishableKey'
  ]
  
  recommendedKeys.forEach(key => {
    if (!config[key as keyof AppConfig]) {
      console.warn(`Recommended configuration key ${key} is missing. Some features may not work.`)
    }
  })
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  }
}

// Initialize configuration validation
if (isDevelopment) {
  const validation = validateConfig()
  if (!validation.isValid) {
    console.error('Configuration validation failed. Missing keys:', validation.missingKeys)
  }
}

export default config
