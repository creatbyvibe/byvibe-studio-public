'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');
  const type = searchParams.get('type') || 'signup';
  const email = searchParams.get('email') || '';
  const provider = searchParams.get('provider') || '';

  useEffect(() => {
    // If already logged in and verified, redirect to home
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && success) {
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    });
  }, [success, router]);

  const handleResendVerification = async () => {
    if (!email) {
      setResendError('Email address is required');
      return;
    }

    setIsResending(true);
    setResendError('');
    setResendMessage('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (resendError) {
        throw resendError;
      }

      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setResendError(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    const errorMap: { [key: string]: string } = {
      token_expired: 'This verification link has expired. Please request a new one.',
      verification_failed: 'Email verification failed. Please try again.',
      verification_error: 'An error occurred during verification. Please try again.',
      auth_failed: 'Authentication failed. Please try again.',
      no_code: 'Missing authentication code.',
      no_user_data: 'Unable to retrieve user data.',
      callback_error: 'An error occurred during authentication callback.',
      oauth_auth_failed: 'OAuth authentication failed.',
    };
    return errorMap[errorCode] || 'An error occurred. Please try again.';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-surface border border-border rounded-lg p-8 shadow-2xl"
      >
        {success ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2 font-display">Email Verified!</h1>

            <p className="text-text-muted mb-6">Your email address has been successfully verified.</p>

            {email && (
              <div className="bg-surface/50 border border-border rounded p-4 mb-6">
                <p className="text-sm text-text-muted mb-1">Verified email:</p>
                <p className="text-white font-mono text-sm">{email}</p>
              </div>
            )}

            <p className="text-sm text-text-muted mb-6">Redirecting you to the home page...</p>

            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Home
            </button>
          </div>
        ) : error ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
            >
              {error === 'token_expired' ? (
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2 font-display">
              Verification {error === 'token_expired' ? 'Expired' : 'Failed'}
            </h1>

            <p className="text-text-muted mb-6">{getErrorMessage(error)}</p>

            {type === 'signup' && (
              <div className="space-y-4">
                {email ? (
                  <>
                    <div className="bg-surface/50 border border-border rounded p-4">
                      <p className="text-sm text-text-muted mb-1">Email address:</p>
                      <p className="text-white font-mono text-sm">{email}</p>
                    </div>

                    <button
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Resend Verification Email
                        </>
                      )}
                    </button>

                    {resendMessage && (
                      <div className="p-3 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-sm">
                        {resendMessage}
                      </div>
                    )}

                    {resendError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm">
                        {resendError}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-surface/50 border border-border rounded p-4">
                    <p className="text-sm text-text-muted mb-4">
                      To resend the verification email, please go to the sign-in page and use the resend option.
                    </p>
                    <button
                      onClick={() => router.push('/auth')}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Go to Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

            {type === 'oauth' && (
              <button
                onClick={() => router.push('/auth')}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2 font-display">Verifying...</h1>
            <p className="text-text-muted">Please wait while we verify your email.</p>
          </div>
        )}
      </motion.div>
      {/* provider is read for completeness; keep it to avoid unused param churn */}
      {provider ? null : null}
    </div>
  );
}

