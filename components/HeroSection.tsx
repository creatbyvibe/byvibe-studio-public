'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoCarousel from './VideoCarousel';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthModal from './AuthModal';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Successfully joined waitlist! Check your email for a welcome message.');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="work@email.com"
          required
          disabled={isSubmitting}
          className="flex-1 bg-surface border border-border rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 focus:ring-0 transition-colors text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-md text-sm whitespace-nowrap btn-highlight font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '...' : 'Request Access'}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-xs ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </>
  );
}

function StartBuildingButton() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = () => {
    if (user) {
      router.push('/studio');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="block w-full px-6 py-3 rounded-md text-sm font-bold text-center bg-white text-black hover:bg-gray-200 transition-colors"
      >
        Start Building →
      </button>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => router.push('/studio')}
        />
      )}
    </>
  );
}

export default function HeroSection() {
  return (
    <div className="relative z-10 pt-12 md:pt-20 pb-12 md:pb-16 px-4 md:px-6 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 max-w-xl"
        >
          {/* Brand Tag - Removed, now in SloganBanner */}

          {/* 产品 Slogan - 产品标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-product-slogan md:text-product-slogan-md lg:text-product-slogan-lg xl:text-product-slogan-xl font-bold text-white"
          >
            The<br className="block" />
            Engineering<br className="block" />
            <span className="text-gray-600">Brain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg text-text-muted leading-relaxed font-light border-l-2 border-white/10 pl-6"
          >
            An orchestration layer for <strong>Vibe Coding</strong>.<br className="hidden md:block" />
            <span className="md:inline hidden"> </span>
            We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.
          </motion.p>

          <div id="waitlist-form" className="pt-6 max-w-sm space-y-4">
            <WaitlistForm />
            <StartBuildingButton />
            <p className="mt-4 text-[10px] text-text-dim font-mono uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Batch #3 Enrollment Open
            </p>
          </div>
        </motion.div>

        {/* Right Column: Vertical Video Switcher */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <VideoCarousel />
        </motion.div>
      </div>
    </div>
  );
}
