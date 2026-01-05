'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Coming Soon</h2>
                <p className="text-xs text-gray-500 mt-1">We're building something amazing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-text-muted leading-relaxed">
                We're working hard to bring you the full Studio experience. The registration and core features are currently under active development.
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                Join our waitlist to be the first to know when we launch, and get early access to all features.
              </p>
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => {
                    onClose();
                    // Scroll to waitlist form
                    setTimeout(() => {
                      const waitlistForm = document.getElementById('waitlist-form');
                      if (waitlistForm) {
                        waitlistForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors text-sm"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
