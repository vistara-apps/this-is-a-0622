import { APIClient } from './api'
import { openaiConfig } from '../config'
import { 
  OpenAIAudioAnalysisRequest, 
  OpenAIAudioAnalysisResponse,
  OpenAITextGenerationRequest,
  OpenAITextGenerationResponse,
  APIResponse 
} from '../types/api'
import { Sample } from '../types'

class OpenAIService {
  private client: APIClient

  constructor() {
    this.client = new APIClient({
      baseUrl: openaiConfig.baseUrl,
      defaultHeaders: {
        'Authorization': `Bearer ${openaiConfig.apiKey}`,
        'OpenAI-Beta': 'assistants=v1'
      },
      timeout: openaiConfig.timeout,
      retryAttempts: openaiConfig.retryAttempts,
      retryDelay: openaiConfig.retryDelay
    })
  }

  /**
   * Analyze audio file to identify potential samples
   */
  async analyzeAudio(audioUrl: string, trackTitle?: string): Promise<APIResponse<Sample[]>> {
    try {
      // First, transcribe the audio to get text content
      const transcriptionResponse = await this.transcribeAudio(audioUrl)
      
      if (!transcriptionResponse.success || !transcriptionResponse.data) {
        return {
          success: false,
          error: {
            code: 'TRANSCRIPTION_FAILED',
            message: 'Failed to transcribe audio for analysis'
          }
        }
      }

      // Use GPT-4 to analyze the transcription and identify potential samples
      const analysisPrompt = this.buildSampleAnalysisPrompt(
        transcriptionResponse.data.text,
        trackTitle
      )

      const analysisResponse = await this.generateText({
        prompt: analysisPrompt,
        model: 'gpt-4',
        maxTokens: 2000,
        temperature: 0.3
      })

      if (!analysisResponse.success || !analysisResponse.data) {
        return {
          success: false,
          error: {
            code: 'ANALYSIS_FAILED',
            message: 'Failed to analyze audio content'
          }
        }
      }

      // Parse the AI response to extract sample information
      const samples = this.parseSampleAnalysis(analysisResponse.data.text)

      return {
        success: true,
        data: samples
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUDIO_ANALYSIS_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error
        }
      }
    }
  }

  /**
   * Transcribe audio file using OpenAI Whisper
   */
  async transcribeAudio(audioUrl: string): Promise<APIResponse<{ text: string }>> {
    try {
      // Download audio file first (in a real implementation, you'd handle this properly)
      const audioResponse = await fetch(audioUrl)
      const audioBlob = await audioResponse.blob()
      const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' })

      const formData = new FormData()
      formData.append('file', audioFile)
      formData.append('model', 'whisper-1')
      formData.append('response_format', 'json')

      const response = await fetch(`${openaiConfig.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiConfig.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: {
            code: 'TRANSCRIPTION_API_ERROR',
            message: errorData.error?.message || 'Transcription failed',
            statusCode: response.status
          }
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: { text: data.text }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TRANSCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown transcription error',
          details: error
        }
      }
    }
  }

  /**
   * Generate text using OpenAI GPT models
   */
  async generateText(request: OpenAITextGenerationRequest): Promise<APIResponse<OpenAITextGenerationResponse>> {
    try {
      const response = await this.client.post<any>('/chat/completions', {
        model: request.model || openaiConfig.model,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.maxTokens || openaiConfig.maxTokens,
        temperature: request.temperature || openaiConfig.temperature
      })

      if (!response.success || !response.data) {
        return response
      }

      const choice = response.data.choices?.[0]
      if (!choice) {
        return {
          success: false,
          error: {
            code: 'NO_RESPONSE',
            message: 'No response generated'
          }
        }
      }

      return {
        success: true,
        data: {
          text: choice.message.content,
          usage: response.data.usage || {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEXT_GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error
        }
      }
    }
  }

  /**
   * Generate license request template
   */
  async generateLicenseTemplate(
    sampleInfo: Sample,
    requestType: 'sync' | 'master' | 'both',
    intendedUse: string
  ): Promise<APIResponse<string>> {
    const prompt = `Generate a professional license request email template for the following sample clearance:

Sample Information:
- Original Track: ${sampleInfo.originalTrack}
- Artist: ${sampleInfo.metadata?.artist || 'Unknown'}
- Album: ${sampleInfo.metadata?.album || 'Unknown'}
- Year: ${sampleInfo.metadata?.year || 'Unknown'}
- Label: ${sampleInfo.metadata?.label || 'Unknown'}

Request Details:
- License Type: ${requestType}
- Intended Use: ${intendedUse}
- Sample Duration: ${sampleInfo.endTime - sampleInfo.startTime} seconds

Please create a professional, respectful email template that includes:
1. Proper greeting and introduction
2. Clear identification of the sample being requested
3. Specific license type and usage details
4. Professional closing
5. Placeholders for contact information

The tone should be professional and respectful, acknowledging the value of the original work.`

    return this.generateText({
      prompt,
      model: 'gpt-4',
      maxTokens: 1000,
      temperature: 0.5
    }).then(response => {
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.text
        }
      }
      return response
    })
  }

  /**
   * Generate DMCA counter-notice response
   */
  async generateDMCAResponse(
    noticeText: string,
    evidenceDescription: string,
    responseType: 'counter-notice' | 'takedown-acknowledgment' | 'dispute'
  ): Promise<APIResponse<string>> {
    const prompt = `Generate a professional DMCA ${responseType} response for the following takedown notice:

Original Notice:
${noticeText}

Evidence Available:
${evidenceDescription}

Please create a ${responseType} that includes:
1. Proper legal formatting and language
2. Reference to the original notice
3. Clear statement of position
4. Reference to available evidence
5. Appropriate legal disclaimers
6. Professional tone throughout

The response should be legally sound while being respectful and professional.`

    return this.generateText({
      prompt,
      model: 'gpt-4',
      maxTokens: 1500,
      temperature: 0.3
    }).then(response => {
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.text
        }
      }
      return response
    })
  }

  /**
   * Build prompt for sample analysis
   */
  private buildSampleAnalysisPrompt(transcription: string, trackTitle?: string): string {
    return `Analyze the following audio transcription to identify potential music samples. Look for:
1. Recognizable lyrics or melodies from existing songs
2. Distinctive instrumental patterns or riffs
3. Vocal samples or snippets
4. Beat patterns that might be sampled

Audio Transcription:
${transcription}

${trackTitle ? `Track Title: ${trackTitle}` : ''}

Please provide a JSON response with the following structure for each identified sample:
{
  "samples": [
    {
      "originalTrack": "Song Title by Artist",
      "confidence": 0.85,
      "startTime": 30.5,
      "endTime": 45.2,
      "metadata": {
        "artist": "Artist Name",
        "album": "Album Name",
        "year": 1995,
        "label": "Record Label"
      },
      "description": "Brief description of what was sampled"
    }
  ]
}

Only include samples you're reasonably confident about (confidence > 0.6). If no clear samples are identified, return an empty samples array.`
  }

  /**
   * Parse AI response to extract sample information
   */
  private parseSampleAnalysis(aiResponse: string): Sample[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return []
      }

      const parsed = JSON.parse(jsonMatch[0])
      const samples = parsed.samples || []

      return samples.map((sample: any, index: number) => ({
        sampleId: `sample_${Date.now()}_${index}`,
        projectId: '', // Will be set by the calling code
        originalTrack: sample.originalTrack || 'Unknown',
        identifiedOwner: sample.metadata?.artist || undefined,
        clearanceStatus: 'pending' as const,
        licenseDocUrl: undefined,
        confidence: sample.confidence || 0.5,
        startTime: sample.startTime || 0,
        endTime: sample.endTime || 0,
        metadata: {
          artist: sample.metadata?.artist,
          album: sample.metadata?.album,
          year: sample.metadata?.year,
          label: sample.metadata?.label,
          isrc: sample.metadata?.isrc
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Failed to parse sample analysis:', error)
      return []
    }
  }
}

export const openaiService = new OpenAIService()
export default openaiService
