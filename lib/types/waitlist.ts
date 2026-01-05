export interface WaitlistEntry {
  id?: string
  email: string
  name?: string | null
  created_at?: string
}

export interface WaitlistResponse {
  success: boolean
  message?: string
  data?: WaitlistEntry
  error?: string
}
