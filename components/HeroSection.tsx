'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoCarousel from './VideoCarousel';

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
        setMessage('Successfully joined waitlist!');
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

export default function HeroSection() {
  return (
    <div className="relative z-10 pt-16 md:pt-24 pb-16 px-4 md:px-6 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 max-w-xl"
        >
          {/* Brand Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-colors cursor-default"
          >
            <Heart className="w-3 h-3 fill-current" />
            Create by Vibe, Share the Joy
          </motion.div>

          {/* Vertical Stacked Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            The<br />
            Engineering<br />
            <span className="text-gray-600">Brain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-text-muted leading-relaxed font-light border-l-2 border-white/10 pl-6"
          >
            An orchestration layer for <strong>Vibe Coding</strong>.<br />
            We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.
          </motion.p>

          <div id="waitlist-form" className="pt-6 max-w-sm">
            <WaitlistForm />
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
