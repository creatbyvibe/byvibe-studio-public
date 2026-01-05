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
      // Pre-fill ORCID information
      setEmail(decodeURIComponent(orcidEmail));
      setName(decodeURIComponent(orcidName));
      setIsLogin(false);
      setMessage(`ORCID account detected (${orcidId}). Please complete registration to link your account.`);
    }

    if (verified === 'true') {
      setMessage('Email verified successfully! Please sign in.');
      setIsLogin(true);
    }

    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const getErrorMessage = (errorCode: string): string => {
    const errorMap: { [key: string]: string } = {
      'orcid_auth_failed': 'ORCID authentication failed, please try again',
      'no_code': 'Missing authentication code',
      'config_missing': 'System configuration error',
      'token_exchange_failed': 'ORCID token exchange failed',
      'user_info_failed': 'Failed to fetch user information',
      'orcid_callback_error': 'ORCID callback processing error',
    };
    return errorMap[errorCode] || 'An error occurred during authentication';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage('Sign in successful! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 1000);
        }
      } else {
        // Sign up
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
          // Check if email verification is needed
          if (data.user.email_confirmed_at) {
            setMessage('Registration successful! Redirecting...');
            setTimeout(() => {
              router.push('/');
            }, 1500);
          } else {
            setMessage('Registration successful! Please check your email and click the verification link to activate your account.');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed, please try again');
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
    setError('');
    setIsLoading(true);
    
    const clientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
    if (!clientId) {
      setError('ORCID sign in is not configured, please contact administrator');
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

      setMessage('Password reset link has been sent to your email. Please check your inbox.');
      setShowResetPassword(false);
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
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
                {isLogin ? 'Sign In' : 'Sign Up'}
              </h1>
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isLogin ? 'Sign in to continue using ByVibe' : 'Create an account to unlock all features'}
            </p>
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
                    className="w-full bg-black border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
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
                    className="w-full bg-black border border-border rounded px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
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
            <div className="space-y-3">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Sign in with Google</span>
              </button>

              <button
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Github className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Sign in with GitHub</span>
              </button>

              <button
                onClick={handleORCID}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-border rounded hover:bg-surface transition-colors disabled:opacity-50"
              >
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Sign in with ORCID</span>
              </button>
            </div>

            {/* Password Reset */}
            {isLogin && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {showResetPassword && (
              <form onSubmit={handleResetPassword} className="mt-4 p-4 bg-black/50 border border-border rounded space-y-3">
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Email
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetEmail('');
                    }}
                    className="px-4 py-2 bg-surface border border-border rounded text-white hover:bg-surface/80 transition-colors text-sm"
                  >
                    Cancel
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
        </div>
      </motion.div>
    </div>
  );
}
