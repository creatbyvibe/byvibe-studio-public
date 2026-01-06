'use client';

import { Mail, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { toolsData } from '@/data/tools';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onViewChange: (view: 'home' | 'directory') => void;
  onWaitlistClick: () => void;
}

export default function Navbar({ onViewChange, onWaitlistClick }: NavbarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.refresh();
  };

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
          <a
            href="/"
            className="cursor-pointer select-none group flex items-center"
          >
            <span className="text-xl font-bold tracking-tighter text-white group-hover:text-blue-400 transition-colors">
              byvibe<span className="text-gray-500 font-normal group-hover:text-blue-400/50">.ai</span>
            </span>
          </a>

          <a
            href="mailto:make@byvibe.ai"
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors border-l border-white/10 pl-6 group tracking-tight"
          >
            <Mail className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
            <span>make@byvibe.ai</span>
          </a>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex gap-10 text-[13px] font-medium text-text-muted tracking-wide">
          <a
            href="/"
            className="hover:text-white transition-colors uppercase"
          >
            Product
          </a>
          <button
            onClick={() => onViewChange('directory')}
            className="hover:text-white transition-colors flex items-center gap-1.5 group uppercase relative"
          >
            Integrations
            <span className="bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0.5 rounded border border-blue-500/20 group-hover:border-blue-500/50 transition-colors font-mono">
              {toolsData.length}+
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </button>
          <a
            href="/governance"
            className="hover:text-white transition-colors uppercase"
          >
            Governance
          </a>
        </div>

        {/* Right CTA / User Menu */}
        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/studio')}
              className="text-xs md:text-sm px-4 py-2 rounded-full btn-highlight transition-all transform hover:scale-105"
            >
              Studio
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-xs md:text-sm px-4 py-2 rounded-full bg-surface border border-border hover:bg-surface/80 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      router.push('/studio');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-black transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Go to Studio</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-black transition-colors"
                  >
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-black transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/auth')}
              className="text-xs md:text-sm px-4 py-2 rounded-full bg-surface border border-border text-white hover:bg-surface/80 transition-colors"
            >
              Sign In / Sign Up
            </button>
            <button
              onClick={onWaitlistClick}
              className="text-xs md:text-sm px-6 py-2 rounded-full btn-highlight transition-all transform hover:scale-105"
            >
              Join Waitlist
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
