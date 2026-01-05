'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle, Shield, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import ToolShowcase from '@/components/ToolShowcase'

type Status = 'idle' | 'loading' | 'success' | 'error'

const HeroSection = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
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
        if (error.code === '23505') {
          setStatus('error')
          setErrorMessage('该邮箱已订阅')
        } else {
          setStatus('error')
          setErrorMessage('订阅失败，请稍后重试')
        }
        return
      }

      setStatus('success')
      setEmail('')
      
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } catch (err) {
      setStatus('error')
      setErrorMessage('订阅失败，请稍后重试')
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-white pt-20 pb-32 lg:pt-32 lg:pb-40">
      {/* 背景装饰：细微的网格，增加工程感 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Column: Copywriting & CTA */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Build in Public: v0.1.0 Live
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              停止无效的 AI 焦虑，<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                开始真正的协作。
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-gray-600 leading-relaxed max-w-lg">
              byvibe.ai 致力于打造人与 AI 最优解的分工流。
              我们不直播写代码，我们只交付可用的生产力工具。
              <br/>
              <span className="text-sm text-gray-400 mt-2 block">
                * 订阅仅用于接收版本迭代通知，绝无垃圾邮件。
              </span>
            </p>

            {/* Email Form */}
            <div className="w-full max-w-md">
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="输入你的邮箱接收更新..."
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${status === 'success' ? 'bg-green-600' : 'bg-gray-900 hover:bg-gray-800'}
                  `}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      提交中...
                    </span>
                  ) : status === 'success' ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      已加入
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      获取更新
                      <ArrowRight size={18} />
                    </span>
                  )}
                </button>
              </form>
              
              {/* Error Message */}
              {status === 'error' && errorMessage && (
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              )}
              
              {/* Success Message */}
              {status === 'success' && (
                <p className="mt-2 text-sm text-green-600">订阅成功！我们会在有新版本时通知你。</p>
              )}
              
              <p className="mt-4 flex items-center text-xs text-gray-500">
                <Shield size={12} className="mr-1 text-gray-400" />
                数据安全保障，随时可一键退订。
              </p>
            </div>
          </div>

          {/* Right Column: Visual / Tool Placeholder */}
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
            {/* 装饰性光晕 */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-20 blur-lg"></div>
            
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              {/* Browser Header Simulation */}
              <div className="flex items-center border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-4 flex-1 rounded bg-white px-3 py-1 text-xs text-gray-400 text-center border border-gray-100">
                  byvibe.ai/tool-preview
                </div>
              </div>

              {/* Content Area - 工具展示组件 */}
              <div className="aspect-[4/3] bg-white">
                <ToolShowcase />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
