// Core entity types based on PRD data model
export interface User {
  userId: string
  email: string
  subscriptionTier: 'free' | 'pro' | 'artist'
  paymentInfo?: {
    customerId: string
    subscriptionId?: string
    paymentMethodId?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Project {
  projectId: string
  userId: string
  trackTitle: string
  audioFileUrl: string
  status: 'analyzing' | 'identified' | 'clearing' | 'cleared' | 'disputed'
  createdAt: string
  updatedAt: string
  metadata?: {
    duration?: number
    fileSize?: number
    format?: string
    bitrate?: number
  }
}

export interface Sample {
  sampleId: string
  projectId: string
  originalTrack: string
  identifiedOwner?: string
  clearanceStatus: 'pending' | 'requested' | 'negotiating' | 'cleared' | 'denied'
  licenseDocUrl?: string
  confidence: number
  startTime: number
  endTime: number
  metadata?: {
    artist?: string
    album?: string
    year?: number
    label?: string
    isrc?: string
  }
  createdAt: string
  updatedAt: string
}

// Document types
export interface Document {
  id: string
  name: string
  type: 'pdf' | 'text' | 'audio' | 'image'
  url: string
  content?: string
  size?: number
  uploadedAt: string
  ipfsHash?: string
  metadata?: Record<string, any>
}

// DMCA related types
export interface DMCANotice {
  id: string
  userId: string
  projectId?: string
  platform: string
  noticeText: string
  receivedAt: string
  status: 'received' | 'reviewing' | 'responding' | 'resolved' | 'escalated'
  responseGenerated?: string
  evidenceDocuments: Document[]
  createdAt: string
  updatedAt: string
}

// Sample library types
export interface LibrarySample {
  id: string
  title: string
  artist: string
  genre: string[]
  mood: string[]
  bpm?: number
  key?: string
  duration: number
  audioUrl: string
  previewUrl: string
  clearanceType: 'royalty-free' | 'easy-clear' | 'standard-clear'
  licensePrice?: number
  tags: string[]
  createdAt: string
}

// Subscription and payment types
export interface Subscription {
  id: string
  userId: string
  tier: 'free' | 'pro' | 'artist'
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
}

// API response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// Form types
export interface SampleIdentificationForm {
  audioFile?: File
  audioUrl?: string
  trackTitle?: string
  artistName?: string
}

export interface LicenseRequestForm {
  sampleId: string
  requestType: 'sync' | 'master' | 'both'
  intendedUse: string
  distributionPlatforms: string[]
  expectedReleaseDate: string
  contactEmail: string
  additionalNotes?: string
}

export interface DMCAResponseForm {
  noticeId: string
  responseType: 'counter-notice' | 'takedown-acknowledgment' | 'dispute'
  explanation: string
  evidenceDocuments: string[]
  contactInfo: {
    name: string
    email: string
    phone?: string
    address: string
  }
}

// Component prop types
export interface AudioUploaderProps {
  onFileSelect: (file: File) => void
  onUrlSubmit: (url: string) => void
  variant?: 'default' | 'dragAndDrop'
  acceptedFormats?: string[]
  maxFileSize?: number
  className?: string
}

export interface SampleInfoCardProps {
  sample: Sample
  variant?: 'idle' | 'identified' | 'cleared'
  onClearanceRequest?: (sampleId: string) => void
  onViewDetails?: (sampleId: string) => void
  className?: string
}

export interface LicenseFormProps {
  sample: Sample
  variant?: 'request' | 'confirmation'
  onSubmit: (data: LicenseRequestForm) => void
  onCancel?: () => void
  className?: string
}

export interface DMCAAlertProps {
  notice: DMCANotice
  variant?: 'received' | 'resolved'
  onRespond?: (noticeId: string) => void
  onViewDetails?: (noticeId: string) => void
  className?: string
}

// Hook return types
export interface UseSampleAnalysisReturn {
  analyzeAudio: (file: File | string) => Promise<Sample[]>
  isAnalyzing: boolean
  error: string | null
  progress: number
}

export interface UseClearanceProcessReturn {
  requestClearance: (data: LicenseRequestForm) => Promise<void>
  generateTemplate: (sampleId: string) => Promise<string>
  uploadDocument: (file: File, sampleId: string) => Promise<string>
  isLoading: boolean
  error: string | null
}

export interface UseDMCAProtectionReturn {
  submitResponse: (data: DMCAResponseForm) => Promise<void>
  generateResponse: (noticeId: string) => Promise<string>
  uploadEvidence: (files: File[]) => Promise<string[]>
  isLoading: boolean
  error: string | null
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchFilters {
  query?: string
  genre?: string[]
  mood?: string[]
  clearanceType?: string[]
  bpmRange?: [number, number]
  durationRange?: [number, number]
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

export interface ValidationError {
  field: string
  message: string
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string
  supabaseUrl: string
  supabaseAnonKey: string
  openaiApiKey: string
  pinataApiKey: string
  pinataSecretKey: string
  airstackApiKey: string
  stripePublishableKey: string
  maxFileSize: number
  supportedAudioFormats: string[]
  features: {
    sampleIdentification: boolean
    clearanceProcess: boolean
    dmcaProtection: boolean
    sampleLibrary: boolean
    subscriptions: boolean
  }
}
