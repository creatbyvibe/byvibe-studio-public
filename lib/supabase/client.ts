import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 延迟初始化，避免构建时检查环境变量
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  // 如果已经初始化，直接返回
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 构建时如果没有环境变量，创建一个占位客户端（不会真正使用）
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // 服务端构建时，返回一个占位客户端
      supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key')
      return supabaseInstance
    }
    // 客户端运行时，抛出错误
    throw new Error('Missing Supabase environment variables')
  }

  // 正常情况，创建真实的客户端
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// 导出时延迟初始化
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
}) as SupabaseClient
