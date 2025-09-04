// Application constants
export const APP_NAME = 'SampleFlow'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Clear Sample Rights, Effortlessly.'

// API endpoints
export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  SAMPLES: '/samples',
  USERS: '/users',
  SUBSCRIPTIONS: '/subscriptions',
  DMCA: '/dmca',
  LIBRARY: '/library',
  PAYMENTS: '/payments'
} as const

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_AUDIO_FORMATS: [
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
    'audio/flac',
    'audio/webm'
  ],
  SUPPORTED_DOCUMENT_FORMATS: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
} as const

// Sample analysis constants
export const SAMPLE_ANALYSIS = {
  MIN_CONFIDENCE: 0.6,
  MAX_DURATION: 600, // 10 minutes
  CHUNK_SIZE: 30, // seconds
  SUPPORTED_SAMPLE_RATES: [44100, 48000, 96000]
} as const

// Subscription tiers
export const SUBSCRIPTION_LIMITS = {
  free: {
    sampleSearches: 5,
    projectsPerMonth: 2,
    dmcaSupport: false,
    legalConsultation: false,
    prioritySupport: false
  },
  pro: {
    sampleSearches: -1, // unlimited
    projectsPerMonth: -1, // unlimited
    dmcaSupport: true,
    legalConsultation: false,
    prioritySupport: true
  },
  artist: {
    sampleSearches: -1, // unlimited
    projectsPerMonth: -1, // unlimited
    dmcaSupport: true,
    legalConsultation: true,
    prioritySupport: true
  }
} as const

// DMCA constants
export const DMCA = {
  RESPONSE_TIME_LIMIT: 14, // days
  EVIDENCE_RETENTION_PERIOD: 365, // days
  SUPPORTED_PLATFORMS: [
    'YouTube',
    'SoundCloud',
    'Spotify',
    'Apple Music',
    'Bandcamp',
    'DistroKid',
    'CD Baby',
    'TuneCore',
    'Deezer',
    'Amazon Music'
  ]
} as const

// Sample library constants
export const SAMPLE_LIBRARY = {
  GENRES: [
    'Hip Hop',
    'R&B',
    'Pop',
    'Rock',
    'Electronic',
    'Jazz',
    'Funk',
    'Soul',
    'Reggae',
    'Latin',
    'Classical',
    'Blues',
    'Country',
    'Folk',
    'World'
  ],
  MOODS: [
    'Energetic',
    'Chill',
    'Dark',
    'Uplifting',
    'Melancholic',
    'Aggressive',
    'Romantic',
    'Mysterious',
    'Nostalgic',
    'Triumphant',
    'Peaceful',
    'Intense'
  ],
  CLEARANCE_TYPES: [
    'royalty-free',
    'easy-clear',
    'standard-clear'
  ],
  BPM_RANGES: [
    { label: '60-80 BPM', min: 60, max: 80 },
    { label: '80-100 BPM', min: 80, max: 100 },
    { label: '100-120 BPM', min: 100, max: 120 },
    { label: '120-140 BPM', min: 120, max: 140 },
    { label: '140+ BPM', min: 140, max: 200 }
  ]
} as const

// UI constants
export const UI = {
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080
  }
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Please check your permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  UNSUPPORTED_FORMAT: 'File format is not supported.',
  QUOTA_EXCEEDED: 'You have exceeded your usage quota. Please upgrade your plan.',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  SUBSCRIPTION_REQUIRED: 'This feature requires an active subscription.'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Project created successfully!',
  SAMPLE_ANALYZED: 'Sample analysis completed successfully!',
  LICENSE_REQUESTED: 'License request sent successfully!',
  DOCUMENT_UPLOADED: 'Document uploaded successfully!',
  DMCA_RESPONSE_SENT: 'DMCA response submitted successfully!',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully!',
  PAYMENT_PROCESSED: 'Payment processed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
} as const

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sampleflow_auth_token',
  USER_PREFERENCES: 'sampleflow_user_preferences',
  RECENT_PROJECTS: 'sampleflow_recent_projects',
  SEARCH_HISTORY: 'sampleflow_search_history',
  THEME: 'sampleflow_theme'
} as const

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'h:mm a'
} as const

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const

// Audio processing constants
export const AUDIO_PROCESSING = {
  SAMPLE_RATES: [44100, 48000, 96000],
  BIT_DEPTHS: [16, 24, 32],
  CHANNELS: [1, 2], // mono, stereo
  MAX_DURATION: 600, // 10 minutes
  ANALYSIS_WINDOW: 2048,
  HOP_LENGTH: 512,
  CONFIDENCE_THRESHOLD: 0.7
} as const

// Payment constants
export const PAYMENT = {
  CURRENCIES: ['USD', 'EUR', 'GBP'],
  MINIMUM_AMOUNT: 1.00,
  MAXIMUM_AMOUNT: 10000.00,
  PROCESSING_FEE_PERCENTAGE: 2.9,
  PROCESSING_FEE_FIXED: 0.30
} as const

// Feature flags (can be overridden by config)
export const FEATURE_FLAGS = {
  SAMPLE_IDENTIFICATION: true,
  CLEARANCE_PROCESS: true,
  DMCA_PROTECTION: true,
  SAMPLE_LIBRARY: true,
  SUBSCRIPTIONS: true,
  BLOCKCHAIN_INTEGRATION: true,
  AI_ASSISTANCE: true,
  REAL_TIME_COLLABORATION: false,
  ADVANCED_ANALYTICS: false
} as const

// External service URLs
export const EXTERNAL_URLS = {
  SUPPORT: 'https://support.sampleflow.com',
  DOCUMENTATION: 'https://docs.sampleflow.com',
  PRIVACY_POLICY: 'https://sampleflow.com/privacy',
  TERMS_OF_SERVICE: 'https://sampleflow.com/terms',
  STATUS_PAGE: 'https://status.sampleflow.com',
  BLOG: 'https://blog.sampleflow.com'
} as const
