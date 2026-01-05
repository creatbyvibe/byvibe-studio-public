'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Github, Chrome, BookOpen, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    // 检查 URL 参数
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    const orcidId = params.get('orcid_id');
    const orcidName = params.get('orcid_name');
    const orcidEmail = params.get('orcid_email');
    const verified = params.get('verified');

    if (urlError) {
      setError(getErrorMessage(urlError));
    }

    if (orcidId && orcidName && orcidEmail) {
      // 预填充 ORCID 信息
      setEmail(decodeURIComponent(orcidEmail));
      setName(decodeURIComponent(orcidName));
      setIsLogin(false);
      setMessage(`检测到 ORCID 账户 (${orcidId})，请完成注册以关联账户。`);
    }

    if (verified === 'true') {
      setMessage('邮箱验证成功！请登录。');
      setIsLogin(true);
    }

    // 检查是否已登录
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const getErrorMessage = (errorCode: string): string => {
    const errorMap: { [key: string]: string } = {
      'orcid_auth_failed': 'ORCID 认证失败，请重试',
      'no_code': '缺少认证代码',
      'config_missing': '系统配置错误',
      'token_exchange_failed': 'ORCID token 交换失败',
      'user_info_failed': '获取用户信息失败',
      'orcid_callback_error': 'ORCID 回调处理错误',
    };
    return errorMap[errorCode] || '认证过程中出现错误';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // 登录
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage('登录成功！正在跳转...');
          setTimeout(() => {
            router.push('/');
          }, 1000);
        }
      } else {
        // 注册
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // 检查是否需要邮箱验证
          if (data.user.email_confirmed_at) {
            setMessage('注册成功！正在跳转...');
            setTimeout(() => {
              router.push('/');
            }, 1500);
          } else {
            setMessage('注册成功！请检查邮箱并点击验证链接以激活账户。');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
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
      setError(err.message || '登录失败，请重试');
      setIsLoading(false);
    }
  };

  const handleORCID = () => {
    setError('');
    setIsLoading(true);
    
    const clientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
    if (!clientId) {
      setError('ORCID 登录未配置，请联系管理员');
      setIsLoading(false);
      return;
    }

    const redirectUri = `${window.location.origin}/auth/orcid/callback`;
    const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${clientId}&response_type=code&scope=/authenticate&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = orcidAuthUrl;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      setMessage('密码重置链接已发送到您的邮箱，请查收。');
      setShowResetPassword(false);
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || '发送密码重置邮件失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-surface border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-black border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">
                {isLogin ? '登录' : '注册'}
              </h1>
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isLogin ? '登录以继续使用 ByVibe' : '创建账户以解锁全部功能'}
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {!isLogin && (
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    姓名（可选）
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-black border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-black border border-border rounded px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  密码
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
                    className="w-full bg-black border border-border rounded px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-sm">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '处理中...' : isLogin ? '登录' : '注册'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-gray-500 uppercase">或</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5 text-white" />
                <span className="text-white font-medium">使用 Google 登录</span>
              </button>

              <button
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Github className="w-5 h-5 text-white" />
                <span className="text-white font-medium">使用 GitHub 登录</span>
              </button>

              <button
                onClick={handleORCID}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white font-medium">使用 ORCID 登录</span>
              </button>
            </div>

            {/* Password Reset */}
            {isLogin && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  忘记密码？
                </button>
              </div>
            )}

            {showResetPassword && (
              <form onSubmit={handleResetPassword} className="mt-4 p-4 bg-black/50 border border-border rounded space-y-3">
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-background border border-border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isLoading ? '发送中...' : '发送重置链接'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetEmail('');
                    }}
                    className="px-4 py-2 bg-surface border border-border rounded text-white hover:bg-surface/80 transition-colors text-sm"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setMessage('');
                  setShowResetPassword(false);
                }}
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                {isLogin ? (
                  <>
                    还没有账户？<span className="text-blue-400">注册</span>
                  </>
                ) : (
                  <>
                    已有账户？<span className="text-blue-400">登录</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
