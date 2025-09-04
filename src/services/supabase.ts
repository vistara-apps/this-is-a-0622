import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'
import { supabaseConfig } from '../config'
import { User, Project, Sample, LibrarySample } from '../types'
import { APIResponse } from '../types/api'

class SupabaseService {
  private client: SupabaseClient

  constructor() {
    this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey)
  }

  // Authentication methods
  async signUp(email: string, password: string): Promise<APIResponse<User>> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password
      })

      if (error) {
        return {
          success: false,
          error: {
            code: 'SIGNUP_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: {
            code: 'NO_USER_DATA',
            message: 'No user data returned from signup'
          }
        }
      }

      // Create user profile
      const userProfile = await this.createUserProfile(data.user)
      
      return {
        success: true,
        data: userProfile
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNUP_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown signup error',
          details: error
        }
      }
    }
  }

  async signIn(email: string, password: string): Promise<APIResponse<User>> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return {
          success: false,
          error: {
            code: 'SIGNIN_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: {
            code: 'NO_USER_DATA',
            message: 'No user data returned from signin'
          }
        }
      }

      const userProfile = await this.getUserProfile(data.user.id)
      
      return {
        success: true,
        data: userProfile
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNIN_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown signin error',
          details: error
        }
      }
    }
  }

  async signOut(): Promise<APIResponse<void>> {
    try {
      const { error } = await this.client.auth.signOut()

      if (error) {
        return {
          success: false,
          error: {
            code: 'SIGNOUT_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNOUT_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown signout error',
          details: error
        }
      }
    }
  }

  async getCurrentUser(): Promise<APIResponse<User | null>> {
    try {
      const { data: { user }, error } = await this.client.auth.getUser()

      if (error) {
        return {
          success: false,
          error: {
            code: 'GET_USER_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      if (!user) {
        return {
          success: true,
          data: null
        }
      }

      const userProfile = await this.getUserProfile(user.id)
      
      return {
        success: true,
        data: userProfile
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_USER_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown get user error',
          details: error
        }
      }
    }
  }

  // User profile methods
  private async createUserProfile(supabaseUser: SupabaseUser): Promise<User> {
    const userProfile: Omit<User, 'userId'> = {
      email: supabaseUser.email!,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data, error } = await this.client
      .from('users')
      .insert([{ ...userProfile, user_id: supabaseUser.id }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`)
    }

    return {
      userId: data.user_id,
      email: data.email,
      subscriptionTier: data.subscription_tier,
      paymentInfo: data.payment_info,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  private async getUserProfile(userId: string): Promise<User> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      throw new Error(`Failed to get user profile: ${error.message}`)
    }

    return {
      userId: data.user_id,
      email: data.email,
      subscriptionTier: data.subscription_tier,
      paymentInfo: data.payment_info,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  // Project methods
  async createProject(project: Omit<Project, 'projectId' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<Project>> {
    try {
      const { data, error } = await this.client
        .from('projects')
        .insert([{
          user_id: project.userId,
          track_title: project.trackTitle,
          audio_file_url: project.audioFileUrl,
          status: project.status,
          metadata: project.metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: {
            code: 'CREATE_PROJECT_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: this.mapProjectFromDB(data)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_PROJECT_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown create project error',
          details: error
        }
      }
    }
  }

  async getProject(projectId: string): Promise<APIResponse<Project>> {
    try {
      const { data, error } = await this.client
        .from('projects')
        .select('*')
        .eq('project_id', projectId)
        .single()

      if (error) {
        return {
          success: false,
          error: {
            code: 'GET_PROJECT_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: this.mapProjectFromDB(data)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_PROJECT_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown get project error',
          details: error
        }
      }
    }
  }

  async getUserProjects(userId: string): Promise<APIResponse<Project[]>> {
    try {
      const { data, error } = await this.client
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          success: false,
          error: {
            code: 'GET_USER_PROJECTS_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: data.map(this.mapProjectFromDB)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_USER_PROJECTS_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown get user projects error',
          details: error
        }
      }
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<APIResponse<Project>> {
    try {
      const { data, error } = await this.client
        .from('projects')
        .update({
          track_title: updates.trackTitle,
          audio_file_url: updates.audioFileUrl,
          status: updates.status,
          metadata: updates.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId)
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: {
            code: 'UPDATE_PROJECT_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: this.mapProjectFromDB(data)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_PROJECT_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown update project error',
          details: error
        }
      }
    }
  }

  // Sample methods
  async createSample(sample: Omit<Sample, 'sampleId' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<Sample>> {
    try {
      const { data, error } = await this.client
        .from('samples')
        .insert([{
          project_id: sample.projectId,
          original_track: sample.originalTrack,
          identified_owner: sample.identifiedOwner,
          clearance_status: sample.clearanceStatus,
          license_doc_url: sample.licenseDocUrl,
          confidence: sample.confidence,
          start_time: sample.startTime,
          end_time: sample.endTime,
          metadata: sample.metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: {
            code: 'CREATE_SAMPLE_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: this.mapSampleFromDB(data)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_SAMPLE_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown create sample error',
          details: error
        }
      }
    }
  }

  async getProjectSamples(projectId: string): Promise<APIResponse<Sample[]>> {
    try {
      const { data, error } = await this.client
        .from('samples')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          success: false,
          error: {
            code: 'GET_PROJECT_SAMPLES_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: data.map(this.mapSampleFromDB)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_PROJECT_SAMPLES_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown get project samples error',
          details: error
        }
      }
    }
  }

  async updateSample(sampleId: string, updates: Partial<Sample>): Promise<APIResponse<Sample>> {
    try {
      const { data, error } = await this.client
        .from('samples')
        .update({
          clearance_status: updates.clearanceStatus,
          license_doc_url: updates.licenseDocUrl,
          identified_owner: updates.identifiedOwner,
          metadata: updates.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('sample_id', sampleId)
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: {
            code: 'UPDATE_SAMPLE_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: this.mapSampleFromDB(data)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_SAMPLE_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown update sample error',
          details: error
        }
      }
    }
  }

  // Sample library methods
  async getLibrarySamples(filters?: {
    genre?: string[]
    mood?: string[]
    clearanceType?: string[]
    search?: string
  }): Promise<APIResponse<LibrarySample[]>> {
    try {
      let query = this.client
        .from('library_samples')
        .select('*')

      if (filters?.genre?.length) {
        query = query.overlaps('genre', filters.genre)
      }

      if (filters?.mood?.length) {
        query = query.overlaps('mood', filters.mood)
      }

      if (filters?.clearanceType?.length) {
        query = query.in('clearance_type', filters.clearanceType)
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,artist.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        return {
          success: false,
          error: {
            code: 'GET_LIBRARY_SAMPLES_ERROR',
            message: error.message,
            details: error
          }
        }
      }

      return {
        success: true,
        data: data.map(this.mapLibrarySampleFromDB)
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_LIBRARY_SAMPLES_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown get library samples error',
          details: error
        }
      }
    }
  }

  // Helper methods to map database objects to TypeScript interfaces
  private mapProjectFromDB(data: any): Project {
    return {
      projectId: data.project_id,
      userId: data.user_id,
      trackTitle: data.track_title,
      audioFileUrl: data.audio_file_url,
      status: data.status,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  private mapSampleFromDB(data: any): Sample {
    return {
      sampleId: data.sample_id,
      projectId: data.project_id,
      originalTrack: data.original_track,
      identifiedOwner: data.identified_owner,
      clearanceStatus: data.clearance_status,
      licenseDocUrl: data.license_doc_url,
      confidence: data.confidence,
      startTime: data.start_time,
      endTime: data.end_time,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  private mapLibrarySampleFromDB(data: any): LibrarySample {
    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      genre: data.genre,
      mood: data.mood,
      bpm: data.bpm,
      key: data.key,
      duration: data.duration,
      audioUrl: data.audio_url,
      previewUrl: data.preview_url,
      clearanceType: data.clearance_type,
      licensePrice: data.license_price,
      tags: data.tags,
      createdAt: data.created_at
    }
  }
}

export const supabaseService = new SupabaseService()
export default supabaseService
