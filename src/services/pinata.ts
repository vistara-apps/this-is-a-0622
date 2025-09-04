import { APIClient } from './api'
import { pinataConfig } from '../config'
import { 
  PinataUploadRequest, 
  PinataUploadResponse,
  PinataJSONUploadRequest,
  PinataListResponse,
  APIResponse 
} from '../types/api'
import { Document } from '../types'

class PinataService {
  private client: APIClient

  constructor() {
    this.client = new APIClient({
      baseUrl: pinataConfig.baseUrl,
      defaultHeaders: {
        'pinata_api_key': pinataConfig.apiKey,
        'pinata_secret_api_key': pinataConfig.secretKey
      },
      timeout: pinataConfig.timeout,
      retryAttempts: pinataConfig.retryAttempts,
      retryDelay: pinataConfig.retryDelay
    })
  }

  /**
   * Upload a file to IPFS via Pinata
   */
  async uploadFile(
    file: File,
    metadata?: {
      name?: string
      keyvalues?: Record<string, string>
    },
    onProgress?: (progress: number) => void
  ): Promise<APIResponse<PinataUploadResponse>> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      if (metadata) {
        const pinataMetadata = {
          name: metadata.name || file.name,
          keyvalues: metadata.keyvalues || {}
        }
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata))
      }

      // Use the uploadFile method from APIClient for progress tracking
      const response = await this.client.uploadFile<PinataUploadResponse>(
        '/pinning/pinFileToIPFS',
        file,
        metadata ? { pinataMetadata: JSON.stringify(metadata) } : undefined,
        onProgress
      )

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FILE_UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown file upload error',
          details: error
        }
      }
    }
  }

  /**
   * Upload JSON data to IPFS via Pinata
   */
  async uploadJSON(request: PinataJSONUploadRequest): Promise<APIResponse<PinataUploadResponse>> {
    try {
      const response = await this.client.post<PinataUploadResponse>('/pinning/pinJSONToIPFS', {
        pinataContent: request.pinataContent,
        pinataMetadata: request.pinataMetadata,
        pinataOptions: request.pinataOptions
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'JSON_UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown JSON upload error',
          details: error
        }
      }
    }
  }

  /**
   * Upload a license document and return IPFS hash
   */
  async uploadLicenseDocument(
    file: File,
    sampleId: string,
    projectId: string,
    onProgress?: (progress: number) => void
  ): Promise<APIResponse<Document>> {
    try {
      const metadata = {
        name: `license_${sampleId}_${file.name}`,
        keyvalues: {
          type: 'license_document',
          sampleId,
          projectId,
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      }

      const uploadResponse = await this.uploadFile(file, metadata, onProgress)

      if (!uploadResponse.success || !uploadResponse.data) {
        return uploadResponse
      }

      const document: Document = {
        id: uploadResponse.data.IpfsHash,
        name: file.name,
        type: this.getDocumentType(file.type),
        url: `https://gateway.pinata.cloud/ipfs/${uploadResponse.data.IpfsHash}`,
        size: uploadResponse.data.PinSize,
        uploadedAt: uploadResponse.data.Timestamp,
        ipfsHash: uploadResponse.data.IpfsHash,
        metadata: {
          sampleId,
          projectId,
          originalType: file.type
        }
      }

      return {
        success: true,
        data: document
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LICENSE_UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown license upload error',
          details: error
        }
      }
    }
  }

  /**
   * Upload DMCA evidence documents
   */
  async uploadDMCAEvidence(
    files: File[],
    noticeId: string,
    onProgress?: (progress: number) => void
  ): Promise<APIResponse<Document[]>> {
    try {
      const documents: Document[] = []
      let totalProgress = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const metadata = {
          name: `dmca_evidence_${noticeId}_${i}_${file.name}`,
          keyvalues: {
            type: 'dmca_evidence',
            noticeId,
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        }

        const fileProgress = (progress: number) => {
          const overallProgress = ((i * 100) + progress) / files.length
          totalProgress = overallProgress
          onProgress?.(overallProgress)
        }

        const uploadResponse = await this.uploadFile(file, metadata, fileProgress)

        if (!uploadResponse.success || !uploadResponse.data) {
          return {
            success: false,
            error: uploadResponse.error || {
              code: 'EVIDENCE_UPLOAD_ERROR',
              message: 'Failed to upload evidence file'
            }
          }
        }

        const document: Document = {
          id: uploadResponse.data.IpfsHash,
          name: file.name,
          type: this.getDocumentType(file.type),
          url: `https://gateway.pinata.cloud/ipfs/${uploadResponse.data.IpfsHash}`,
          size: uploadResponse.data.PinSize,
          uploadedAt: uploadResponse.data.Timestamp,
          ipfsHash: uploadResponse.data.IpfsHash,
          metadata: {
            noticeId,
            originalType: file.type
          }
        }

        documents.push(document)
      }

      return {
        success: true,
        data: documents
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EVIDENCE_UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown evidence upload error',
          details: error
        }
      }
    }
  }

  /**
   * Store clearance documentation as JSON
   */
  async storeClearanceData(
    sampleId: string,
    clearanceData: {
      licenseRequest: string
      negotiations: any[]
      finalAgreement?: string
      status: string
      timestamps: Record<string, string>
    }
  ): Promise<APIResponse<Document>> {
    try {
      const metadata = {
        name: `clearance_data_${sampleId}`,
        keyvalues: {
          type: 'clearance_data',
          sampleId,
          createdAt: new Date().toISOString()
        }
      }

      const uploadResponse = await this.uploadJSON({
        pinataContent: clearanceData,
        pinataMetadata: metadata
      })

      if (!uploadResponse.success || !uploadResponse.data) {
        return uploadResponse
      }

      const document: Document = {
        id: uploadResponse.data.IpfsHash,
        name: `Clearance Data - ${sampleId}`,
        type: 'text',
        url: `https://gateway.pinata.cloud/ipfs/${uploadResponse.data.IpfsHash}`,
        content: JSON.stringify(clearanceData, null, 2),
        size: uploadResponse.data.PinSize,
        uploadedAt: uploadResponse.data.Timestamp,
        ipfsHash: uploadResponse.data.IpfsHash,
        metadata: {
          sampleId,
          dataType: 'clearance'
        }
      }

      return {
        success: true,
        data: document
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CLEARANCE_DATA_ERROR',
          message: error instanceof Error ? error.message : 'Unknown clearance data error',
          details: error
        }
      }
    }
  }

  /**
   * List pinned files with optional filtering
   */
  async listPinnedFiles(
    filters?: {
      status?: 'pinned' | 'unpinned'
      metadata?: Record<string, string>
      pageLimit?: number
      pageOffset?: number
    }
  ): Promise<APIResponse<PinataListResponse>> {
    try {
      const params: Record<string, any> = {}

      if (filters?.status) {
        params.status = filters.status
      }

      if (filters?.metadata) {
        Object.entries(filters.metadata).forEach(([key, value]) => {
          params[`metadata[keyvalues][${key}]`] = value
        })
      }

      if (filters?.pageLimit) {
        params.pageLimit = filters.pageLimit
      }

      if (filters?.pageOffset) {
        params.pageOffset = filters.pageOffset
      }

      const response = await this.client.get<PinataListResponse>('/data/pinList', params)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LIST_FILES_ERROR',
          message: error instanceof Error ? error.message : 'Unknown list files error',
          details: error
        }
      }
    }
  }

  /**
   * Unpin a file from IPFS
   */
  async unpinFile(ipfsHash: string): Promise<APIResponse<void>> {
    try {
      const response = await this.client.delete(`/pinning/unpin/${ipfsHash}`)

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNPIN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown unpin error',
          details: error
        }
      }
    }
  }

  /**
   * Get file content from IPFS
   */
  async getFileContent(ipfsHash: string): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: 'FETCH_CONTENT_ERROR',
            message: `Failed to fetch content: ${response.statusText}`,
            statusCode: response.status
          }
        }
      }

      const contentType = response.headers.get('content-type')
      let content: any

      if (contentType?.includes('application/json')) {
        content = await response.json()
      } else if (contentType?.includes('text/')) {
        content = await response.text()
      } else {
        content = await response.blob()
      }

      return {
        success: true,
        data: content
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CONTENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown get content error',
          details: error
        }
      }
    }
  }

  /**
   * Test Pinata connection and authentication
   */
  async testAuthentication(): Promise<APIResponse<any>> {
    try {
      const response = await this.client.get('/data/testAuthentication')
      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_TEST_ERROR',
          message: error instanceof Error ? error.message : 'Unknown auth test error',
          details: error
        }
      }
    }
  }

  /**
   * Helper method to determine document type from MIME type
   */
  private getDocumentType(mimeType: string): 'pdf' | 'text' | 'audio' | 'image' {
    if (mimeType.includes('pdf')) return 'pdf'
    if (mimeType.includes('text')) return 'text'
    if (mimeType.includes('audio')) return 'audio'
    if (mimeType.includes('image')) return 'image'
    return 'text' // default
  }
}

export const pinataService = new PinataService()
export default pinataService
