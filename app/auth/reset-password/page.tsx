'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, XCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'recovery';
  const code = searchParams.get('code');

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      const errorParam = searchParams.get('error');
      if (errorParam) {
        setError(getErrorMessage(errorParam));
        setIsValidatingToken(false);
        setTokenValid(false);
        return;
      }

      if (!token && !code) {
        setError('Missing reset token. Please request a new password reset link.');
        setIsValidatingToken(false);
        setTokenValid(false);
        return;
      }

      try {
        // If we have code, session should already be established by callback route
        // If we have token, we'll validate it when user submits
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session || code) {
          // Session exists or code will be handled on submit
          setTokenValid(true);
        } else if (token) {
          // Token-based verification (older format)
          // We'll validate when user submits the form
          setTokenValid(true);
        } else {
          throw new Error('Invalid reset token');
        }
      } catch (err: any) {
        setError(err.message || 'Invalid or expired reset token. Please request a new password reset link.');
        setTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token, code, searchParams]);

  const getErrorMessage = (errorCode: string): string => {
    const errorMap: { [key: string]: string } = {
      'token_expired': 'This password reset link has expired. Please request a new one.',
      'reset_failed': 'Password reset failed. Please try again.',
      'reset_error': 'An error occurred during password reset. Please try again.',
    };
    return errorMap[errorCode] || 'An error occurred. Please try again.';
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // If we have code, session should already be established
      // Otherwise, we need to verify the token first
      if (code) {
        // Session already established via exchangeCodeForSession
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) throw updateError;

        setSuccess(true);
        setTimeout(() => {
          router.push('/auth?message=password_reset_success');
        }, 2000);
      } else if (token) {
        // Token-based reset (older format)
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery',
        });

        if (verifyError) {
          if (verifyError.message?.includes('expired') || verifyError.message?.includes('invalid')) {
            throw new Error('This reset link has expired. Please request a new one.');
          }
          throw verifyError;
        }

        // After verification, update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) throw updateError;

        setSuccess(true);
        setTimeout(() => {
          router.push('/auth?message=password_reset_success');
        }, 2000);
      } else {
        throw new Error('Missing reset token');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Validating reset token...</p>
        </motion.div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-surface border border-border rounded-lg p-8 shadow-2xl text-center"
        >
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2 font-display">
            Invalid Reset Link
          </h1>
          
          <p className="text-text-muted mb-6">
            {error || 'This password reset link is invalid or has expired.'}
          </p>

          <button
            onClick={() => router.push('/auth')}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface border border-border rounded-lg p-8 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-2 font-display">
            Password Reset Successful!
          </h1>
          
          <p className="text-text-muted mb-6">
            Your password has been successfully updated. Redirecting to sign in...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-surface border border-border rounded-lg p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-display">
            Reset Password
          </h1>
          <p className="text-text-muted text-sm">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Enter new password"
                className="w-full bg-black border border-border rounded px-4 py-3 pl-10 pr-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm new password"
                className="w-full bg-black border border-border rounded px-4 py-3 pl-10 pr-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/auth')}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}
