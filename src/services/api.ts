import { APIRequest, APIResponse, APIError, RateLimitError } from '../types/api'

// Base API client class
export class APIClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor(config: {
    baseUrl: string
    defaultHeaders?: Record<string, string>
    timeout?: number
    retryAttempts?: number
    retryDelay?: number
  }) {
    this.baseUrl = config.baseUrl
    this.defaultHeaders = config.defaultHeaders || {}
    this.timeout = config.timeout || 15000
    this.retryAttempts = config.retryAttempts || 3
    this.retryDelay = config.retryDelay || 1000
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async makeRequest<T>(
    request: APIRequest,
    attempt: number = 1
  ): Promise<APIResponse<T>> {
    const url = new URL(request.endpoint, this.baseUrl)
    
    // Add query parameters
    if (request.params) {
      Object.entries(request.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    const headers = {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...request.headers
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), request.timeout || this.timeout)

    try {
      const response = await fetch(url.toString(), {
        method: request.method,
        headers,
        body: request.data ? JSON.stringify(request.data) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      if (!response.ok) {
        const error: APIError = {
          code: responseData.code || `HTTP_${response.status}`,
          message: responseData.message || response.statusText,
          details: responseData.details,
          statusCode: response.status
        }

        // Handle rate limiting
        if (response.status === 429) {
          const rateLimitError: RateLimitError = {
            ...error,
            retryAfter: parseInt(response.headers.get('Retry-After') || '60'),
            limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
            remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
            resetTime: parseInt(response.headers.get('X-RateLimit-Reset') || '0')
          }

          // Retry after rate limit delay if we have attempts left
          if (attempt < this.retryAttempts) {
            await this.delay(rateLimitError.retryAfter * 1000)
            return this.makeRequest<T>(request, attempt + 1)
          }

          return {
            success: false,
            error: rateLimitError
          }
        }

        // Retry on server errors
        if (response.status >= 500 && attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt)
          return this.makeRequest<T>(request, attempt + 1)
        }

        return {
          success: false,
          error
        }
      }

      return {
        success: true,
        data: responseData.data || responseData,
        meta: {
          requestId: response.headers.get('X-Request-ID') || '',
          timestamp: new Date().toISOString(),
          processingTime: 0,
          rateLimit: {
            limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
            remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
            resetTime: parseInt(response.headers.get('X-RateLimit-Reset') || '0')
          }
        }
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        // Handle network errors and timeouts
        if (error.name === 'AbortError') {
          const timeoutError: APIError = {
            code: 'TIMEOUT',
            message: 'Request timed out',
            details: { timeout: request.timeout || this.timeout }
          }

          return {
            success: false,
            error: timeoutError
          }
        }

        // Retry on network errors
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt)
          return this.makeRequest<T>(request, attempt + 1)
        }

        const networkError: APIError = {
          code: 'NETWORK_ERROR',
          message: error.message,
          details: error
        }

        return {
          success: false,
          error: networkError
        }
      }

      const unknownError: APIError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        details: error
      }

      return {
        success: false,
        error: unknownError
      }
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'GET',
      params,
      headers
    })
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'POST',
      data,
      headers
    })
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'PUT',
      data,
      headers
    })
  }

  async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'PATCH',
      data,
      headers
    })
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'DELETE',
      headers
    })
  }

  // File upload helper
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<APIResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      })
    }

    const url = new URL(endpoint, this.baseUrl)
    const headers = {
      ...this.defaultHeaders
    }
    // Don't set Content-Type for FormData, let browser set it with boundary

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        try {
          const responseData = JSON.parse(xhr.responseText)

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              data: responseData.data || responseData,
              meta: {
                requestId: xhr.getResponseHeader('X-Request-ID') || '',
                timestamp: new Date().toISOString(),
                processingTime: 0
              }
            })
          } else {
            const error: APIError = {
              code: responseData.code || `HTTP_${xhr.status}`,
              message: responseData.message || xhr.statusText,
              details: responseData.details,
              statusCode: xhr.status
            }

            resolve({
              success: false,
              error
            })
          }
        } catch (parseError) {
          const error: APIError = {
            code: 'PARSE_ERROR',
            message: 'Failed to parse response',
            details: parseError
          }

          resolve({
            success: false,
            error
          })
        }
      })

      xhr.addEventListener('error', () => {
        const error: APIError = {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred during file upload'
        }

        resolve({
          success: false,
          error
        })
      })

      xhr.addEventListener('timeout', () => {
        const error: APIError = {
          code: 'TIMEOUT',
          message: 'File upload timed out'
        }

        resolve({
          success: false,
          error
        })
      })

      xhr.open('POST', url.toString())
      xhr.timeout = this.timeout

      // Set headers
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-type') {
          xhr.setRequestHeader(key, value)
        }
      })

      xhr.send(formData)
    })
  }
}

// Create default API client instance
export const apiClient = new APIClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000
})

export default apiClient
