'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoCarousel from './VideoCarousel';
import ComingSoonModal from './ComingSoonModal';

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
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleClick = () => {
    // Show coming soon modal
    setShowComingSoonModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="block w-full px-6 py-3 rounded-md text-sm font-bold text-center bg-white text-black hover:bg-gray-200 transition-colors"
      >
        Start Building →
      </button>
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />
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

          {/* Product Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3 md:space-y-4"
          >
            <p className="text-xs md:text-sm lg:text-base text-red-400 font-medium tracking-wide leading-relaxed mb-2 md:mb-3">
              Create by Vibe, Share the Joy
            </p>
            <h1 className="text-product-slogan md:text-product-slogan-md lg:text-product-slogan-lg xl:text-product-slogan-xl font-bold text-white leading-tight">
              The<br className="block" />
              Engineering<br className="block" />
              <span className="text-gray-600">Brain.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg text-text-muted leading-relaxed font-light border-l-2 border-white/10 pl-6"
          >
            An orchestration layer for <strong className="text-white">Vibe Coding</strong>.<br className="hidden md:block" />
            <span className="md:inline hidden"> </span>
            We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.
          </motion.p>

          <div id="waitlist-form" className="pt-8 max-w-sm space-y-4">
            <WaitlistForm />
            <StartBuildingButton />
            <p className="mt-6 text-[10px] text-text-dim font-mono uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              <span>Batch #3 Enrollment Open</span>
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
