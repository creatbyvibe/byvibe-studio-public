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

function StartBuildingLink() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoonModal(true);
  };

  return (
    <>
      <a
        href="#"
        onClick={handleClick}
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors inline-block mt-2"
      >
        Start Building →
      </a>
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />
    </>
  );
}

export default function HeroSection() {
  return (
    <div className="relative z-10 pt-16 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 border-b border-border bg-background">
      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/20 via-purple-500/15 to-transparent blur-[120px] opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-red-500/15 via-pink-500/10 to-transparent blur-[120px] opacity-15"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center lg:items-start relative z-0">
        {/* Left Column - Strict Left Alignment */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 md:space-y-8 max-w-xl"
        >
          {/* Main H1 Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-product-slogan md:text-product-slogan-md lg:text-product-slogan-lg xl:text-product-slogan-xl font-bold text-white leading-tight font-display tracking-tighter mb-3 md:mb-4"
          >
            Create by Vibe,<br className="block" />
            Share the Joy
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 leading-tight font-display tracking-tight"
          >
            The<br className="block" />
            Engineering<br className="block" />
            <span className="text-gray-500">Brain.</span>
          </motion.h2>

          {/* Description - Lighter Gray */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg text-gray-400 leading-relaxed font-light tracking-tight"
          >
            An orchestration layer for <strong className="text-white">Vibe Coding</strong>.<br className="hidden md:block" />
            <span className="md:inline hidden"> </span>
            We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.
          </motion.p>

          {/* Email Form - Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            id="waitlist-form"
            className="pt-4 max-w-sm space-y-3"
          >
            <WaitlistForm />
            <StartBuildingLink />
            <p className="mt-4 text-[10px] text-text-dim font-mono uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              <span>Batch #3 Enrollment Open</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column: Video with Glow Effect */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative flex justify-center lg:justify-end lg:pt-2"
        >
          {/* Glow Effect Behind Video */}
          <div className="absolute inset-0 -z-10 bg-blue-500/20 blur-3xl rounded-full opacity-30"></div>
          <div className="relative">
            <VideoCarousel />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
