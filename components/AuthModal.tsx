'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Github, Chrome, BookOpen, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [isOpen]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      // 检查 Supabase 是否配置
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('placeholder') || 
          supabaseKey.includes('placeholder')) {
        setError('Supabase 未配置。请创建 .env.local 文件并配置 Supabase 环境变量。');
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage('登录成功！');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // 确保邮箱验证回跳到本站（否则依赖 Supabase Dashboard 的 Site URL 配置）
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              name: name || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Check if email verification is needed
          if (data.user.email_confirmed_at) {
            setError('');
            setMessage('注册成功！');
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 1500);
          } else {
            setError('');
            setMessage('注册成功！请检查您的邮箱并点击验证链接来激活账户。');
            // Don't auto-close, let user see the message
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // 提供更友好的错误信息
      let errorMessage = err.message || '操作失败，请重试';
      
      if (err.message?.includes('Supabase not configured') || 
          err.message?.includes('placeholder')) {
        errorMessage = 'Supabase 未配置。请创建 .env.local 文件并配置 Supabase 环境变量。';
      } else if (err.message?.includes('Invalid login credentials')) {
        errorMessage = '邮箱或密码错误，请重试';
      } else if (err.message?.includes('User already registered')) {
        errorMessage = '该邮箱已被注册，请直接登录';
      } else if (err.message?.includes('Password should be at least')) {
        errorMessage = '密码长度不足，请使用至少 6 个字符';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = '邮箱格式不正确，请检查后重试';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Sign in failed, please try again');
      setIsLoading(false);
    }
  };

  const handleORCID = () => {
    const clientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID || '';
    const redirectUri = `${window.location.origin}/auth/orcid/callback`;
    const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${clientId}&response_type=code&scope=/authenticate&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = orcidAuthUrl;
  };

  const handleWaitlist = () => {
    setShowWaitlist(true);
    // Scroll to waitlist form
    setTimeout(() => {
      onClose();
      const waitlistForm = document.getElementById('waitlist-form');
      if (waitlistForm) {
        waitlistForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isLogin ? 'Continue using ByVibe' : 'Create an account to unlock all features'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {!isLogin && (
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-black border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-black border border-border rounded px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-black border border-border rounded px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-xs">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-gray-500 uppercase">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">Sign in with Google</span>
              </button>

              <button
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Github className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">Sign in with GitHub</span>
              </button>

              <button
                onClick={handleORCID}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">Sign in with ORCID</span>
              </button>
            </div>

            {/* Waitlist Option */}
            <div className="pt-4 border-t border-border">
              <button
                onClick={handleWaitlist}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-white transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Or join the waitlist</span>
              </button>
            </div>

            {/* Toggle Login/Register */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                {isLogin ? (
                  <>
                    Don't have an account? <span className="text-blue-400">Sign Up</span>
                  </>
                ) : (
                  <>
                    Already have an account? <span className="text-blue-400">Sign In</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
