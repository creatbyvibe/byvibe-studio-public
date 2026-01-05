import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 延迟初始化，避免构建时检查环境变量
let supabaseInstance: SupabaseClient | null = null
let isPlaceholder = false

function getSupabaseClient(): SupabaseClient | null {
  // 如果已经初始化，直接返回
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 如果没有环境变量，创建一个占位客户端（不会真正使用，但不会抛出错误）
  if (!supabaseUrl || !supabaseAnonKey) {
    // 无论是服务端还是客户端，都返回占位客户端，避免运行时错误
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key')
    isPlaceholder = true
    console.warn('Supabase environment variables are missing. Using placeholder client.')
    return supabaseInstance
  }

  // 正常情况，创建真实的客户端
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  isPlaceholder = false
  return supabaseInstance
}

// 检查是否是占位客户端
export function isSupabaseConfigured(): boolean {
  return !isPlaceholder && supabaseInstance !== null
}

// 导出时延迟初始化，优雅处理环境变量缺失
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    if (!client) {
      // 如果客户端不可用，返回一个安全的空函数
      return () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    }
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
}) as SupabaseClient
