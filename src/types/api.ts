// OpenAI API types
export interface OpenAIAudioAnalysisRequest {
  audioUrl: string
  model?: string
  prompt?: string
}

export interface OpenAIAudioAnalysisResponse {
  samples: {
    originalTrack: string
    confidence: number
    startTime: number
    endTime: number
    metadata: {
      artist?: string
      album?: string
      year?: number
      label?: string
    }
  }[]
  processingTime: number
}

export interface OpenAITextGenerationRequest {
  prompt: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface OpenAITextGenerationResponse {
  text: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Supabase API types
export interface SupabaseAuthResponse {
  user: {
    id: string
    email: string
    created_at: string
    updated_at: string
  } | null
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  } | null
  error?: {
    message: string
    status: number
  }
}

export interface SupabaseQueryResponse<T> {
  data: T[] | null
  error: {
    message: string
    details: string
    hint: string
    code: string
  } | null
  count?: number
}

// Pinata IPFS API types
export interface PinataUploadRequest {
  file: File
  metadata?: {
    name?: string
    keyvalues?: Record<string, string>
  }
  options?: {
    cidVersion?: 0 | 1
    wrapWithDirectory?: boolean
  }
}

export interface PinataUploadResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate?: boolean
}

export interface PinataJSONUploadRequest {
  pinataContent: any
  pinataMetadata?: {
    name?: string
    keyvalues?: Record<string, string>
  }
  pinataOptions?: {
    cidVersion?: 0 | 1
    wrapWithDirectory?: boolean
  }
}

export interface PinataListResponse {
  count: number
  rows: {
    id: string
    ipfs_pin_hash: string
    size: number
    user_id: string
    date_pinned: string
    date_unpinned?: string
    metadata: {
      name?: string
      keyvalues?: Record<string, string>
    }
    regions: {
      regionId: string
      currentReplicationCount: number
      desiredReplicationCount: number
    }[]
  }[]
}

// Airstack API types
export interface AirstackQueryRequest {
  query: string
  variables?: Record<string, any>
}

export interface AirstackQueryResponse<T = any> {
  data: T
  error?: {
    message: string
    locations: {
      line: number
      column: number
    }[]
    path: string[]
  }[]
}

export interface AirstackTokenData {
  address: string
  name: string
  symbol: string
  type: string
  blockchain: string
  owner: {
    addresses: string[]
    domains: {
      name: string
      isPrimary: boolean
    }[]
    socials: {
      dappName: string
      profileName: string
      profileTokenId: string
      profileTokenAddress: string
      userAssociatedAddresses: string[]
    }[]
  }
  tokenNfts: {
    tokenId: string
    metaData: {
      name: string
      description: string
      image: string
      attributes: {
        trait_type: string
        value: string
      }[]
    }
  }[]
}

// Stripe API types
export interface StripeCustomerCreateRequest {
  email: string
  name?: string
  metadata?: Record<string, string>
}

export interface StripeCustomerResponse {
  id: string
  email: string
  name?: string
  created: number
  metadata: Record<string, string>
}

export interface StripeSubscriptionCreateRequest {
  customer: string
  items: {
    price: string
    quantity?: number
  }[]
  payment_behavior?: 'default_incomplete' | 'allow_incomplete' | 'error_if_incomplete'
  payment_settings?: {
    payment_method_types?: string[]
    save_default_payment_method?: 'on_subscription' | 'off'
  }
  expand?: string[]
}

export interface StripeSubscriptionResponse {
  id: string
  customer: string
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  items: {
    data: {
      id: string
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: 'day' | 'week' | 'month' | 'year'
          interval_count: number
        }
      }
    }[]
  }
  latest_invoice?: {
    id: string
    payment_intent?: {
      id: string
      client_secret: string
      status: string
    }
  }
}

export interface StripePaymentIntentCreateRequest {
  amount: number
  currency: string
  customer?: string
  metadata?: Record<string, string>
  payment_method_types?: string[]
}

export interface StripePaymentIntentResponse {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded'
  customer?: string
  metadata: Record<string, string>
}

export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: any
    previous_attributes?: any
  }
  created: number
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string
    idempotency_key?: string
  }
}

// Generic API error types
export interface APIError {
  code: string
  message: string
  details?: any
  statusCode?: number
}

export interface RateLimitError extends APIError {
  retryAfter: number
  limit: number
  remaining: number
  resetTime: number
}

// Request/Response wrapper types
export interface APIRequest<T = any> {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: T
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  timeout?: number
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: APIError
  meta?: {
    requestId: string
    timestamp: string
    processingTime: number
    rateLimit?: {
      limit: number
      remaining: number
      resetTime: number
    }
  }
}

// Service-specific configuration types
export interface ServiceConfig {
  baseUrl: string
  apiKey: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

export interface OpenAIConfig extends ServiceConfig {
  model: string
  maxTokens: number
  temperature: number
}

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export interface PinataConfig extends ServiceConfig {
  secretKey: string
  jwt?: string
}

export interface AirstackConfig extends ServiceConfig {
  // Airstack-specific config options
}

export interface StripeConfig extends ServiceConfig {
  publishableKey: string
  webhookSecret?: string
}
