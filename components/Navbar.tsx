'use client';

import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onViewChange: (view: 'home' | 'directory') => void;
  onWaitlistClick: () => void;
}

export default function Navbar({ onViewChange, onWaitlistClick }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-50 w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        {/* Left Side: Brand & Contact */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onViewChange('home')}
            className="cursor-pointer select-none group flex items-center"
          >
            <span className="text-xl font-bold tracking-tighter text-white group-hover:text-blue-400 transition-colors">
              byvibe<span className="text-gray-500 font-normal group-hover:text-blue-400/50">.ai</span>
            </span>
          </button>

          <a
            href="mailto:make@byvibe.ai"
            className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-500 hover:text-white transition-colors border-l border-white/10 pl-6 group"
          >
            <Mail className="w-3 h-3 group-hover:text-blue-400 transition-colors" />
            <span>make@byvibe.ai</span>
          </a>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex gap-10 text-[13px] font-medium text-text-muted tracking-wide">
          <button
            onClick={() => onViewChange('home')}
            className="hover:text-white transition-colors uppercase"
          >
            Product
          </button>
          <button
            onClick={() => onViewChange('directory')}
            className="hover:text-white transition-colors flex items-center gap-1.5 group uppercase"
          >
            Integrations
            <span className="bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0.5 rounded border border-blue-500/20 group-hover:border-blue-500/50 transition-colors font-mono">
              LIB
            </span>
          </button>
          <a
            href="#compliance"
            className="hover:text-white transition-colors uppercase"
          >
            Compliance
          </a>
        </div>

        {/* Right CTA */}
        <button
          onClick={onWaitlistClick}
          className="text-xs md:text-sm px-6 py-2 rounded-full btn-highlight transition-all transform hover:scale-105"
        >
          Join Waitlist
        </button>
      </div>
    </motion.nav>
  );
}
