/**
 * Supabase Database Types
 * Generated types for ByVibe Studio tables
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'draft' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      artifacts: {
        Row: {
          id: string
          project_id: string
          phase: 'scope' | 'stack' | 'design' | 'build'
          content: Json
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase: 'scope' | 'stack' | 'design' | 'build'
          content?: Json
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase?: 'scope' | 'stack' | 'design' | 'build'
          content?: Json
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
      }
      ip_usage: {
        Row: {
          id: string
          ip_address: string
          usage_count: number
          last_used_at: string
          created_at: string
        }
        Insert: {
          id?: string
          ip_address: string
          usage_count?: number
          last_used_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          ip_address?: string
          usage_count?: number
          last_used_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Artifact = Database['public']['Tables']['artifacts']['Row']
export type ArtifactInsert = Database['public']['Tables']['artifacts']['Insert']
export type ArtifactUpdate = Database['public']['Tables']['artifacts']['Update']

export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
export type WaitlistInsert = Database['public']['Tables']['waitlist']['Insert']
export type WaitlistUpdate = Database['public']['Tables']['waitlist']['Update']

export type IpUsage = Database['public']['Tables']['ip_usage']['Row']
export type IpUsageInsert = Database['public']['Tables']['ip_usage']['Insert']
export type IpUsageUpdate = Database['public']['Tables']['ip_usage']['Update']

export type ProjectPhase = 'scope' | 'stack' | 'design' | 'build'
export type ProjectStatus = 'draft' | 'in_progress' | 'completed'
