'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('请输入有效的邮箱地址')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.toLowerCase().trim() }])

      if (error) {
        // 重复邮箱错误
        if (error.code === '23505') {
          setStatus('error')
          setErrorMessage('你已经在名单里了')
        } else {
          setStatus('error')
          setErrorMessage('出了一点问题，请稍后再试')
        }
        return
      }

      // 成功
      setStatus('success')
      setEmail('')
      
      // 3秒后重置状态
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } catch (err) {
      setStatus('error')
      setErrorMessage('出了一点问题，请稍后再试')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 玻璃拟态背景 */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* 输入框容器 */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入你的邮箱地址"
                  disabled={status === 'loading'}
                  className={cn(
                    "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl",
                    "text-white placeholder:text-white/40",
                    "focus:outline-none focus:ring-2 focus:ring-vibe-purple/50 focus:border-vibe-purple/50",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    // 焦点光环效果
                    "focus:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  )}
                />
                {/* 焦点光环动画 */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  initial={false}
                  animate={{
                    boxShadow: status === 'idle' 
                      ? '0 0 0 0 rgba(124, 58, 237, 0)' 
                      : '0 0 20px rgba(124, 58, 237, 0.3)'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* 提交按钮 */}
              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                whileHover={{ scale: status !== 'loading' && status !== 'success' ? 1.05 : 1 }}
                whileTap={{ scale: status !== 'loading' && status !== 'success' ? 0.95 : 1 }}
                className={cn(
                  "px-6 py-3.5 bg-vibe-purple hover:bg-vibe-purple-light",
                  "text-white font-medium rounded-xl",
                  "flex items-center gap-2",
                  "transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-lg shadow-vibe-purple/20",
                  "hover:shadow-xl hover:shadow-vibe-purple/30"
                )}
              >
                <AnimatePresence mode="wait">
                  {status === 'loading' && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  )}
                  {(status === 'idle' || status === 'error') && (
                    <motion.div
                      key="arrow"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="hidden sm:inline">
                  {status === 'loading' ? '提交中...' : status === 'success' ? '已加入' : '加入'}
                </span>
              </motion.button>
            </div>

            {/* 状态消息 */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex items-center gap-2 text-green-400"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    加入成功！欢迎来到 Vibe Coding 的世界。
                  </p>
                </motion.div>
              )}

              {status === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex items-center gap-2 text-red-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.form>
    </div>
  )
}
