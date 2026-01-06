import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type CookieOp =
  | { type: 'set'; name: string; value: string; options?: any }
  | { type: 'remove'; name: string; options?: any }

// 仅基于 env 判断（不依赖 lazy-init 状态）
export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return false
  const k = supabaseAnonKey.toLowerCase()
  if (k.startsWith('sb_secret_') || k.includes('service_role')) return false
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) return false
  return true
}

/**
 * Route handler / middleware 里的 Supabase Server Client（cookie-based）
 * - 用于 OAuth code→session 交换后写入 cookie
 * - 用于 API routes 读取用户 session（避免仅靠浏览器 localStorage）
 */
export function createServerClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars: string[] = []
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`)
  }

  const cookieOps: CookieOp[] = []

  const supabase = createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        cookieOps.push({ type: 'set', name, value, options })
      },
      remove(name, options) {
        cookieOps.push({ type: 'remove', name, options })
      },
    },
  })

  function applyCookies(response: NextResponse) {
    for (const op of cookieOps) {
      if (op.type === 'set') {
        response.cookies.set({ name: op.name, value: op.value, ...op.options })
      } else {
        response.cookies.set({ name: op.name, value: '', ...(op.options || {}), maxAge: 0 })
      }
    }
  }

  return { supabase, applyCookies }
}
