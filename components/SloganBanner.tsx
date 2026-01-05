'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const slogans = [
  'Create by Vibe, Share the Joy',
  'Engineering Rigor Meets AI Creativity',
  'From Vibe to Deployable Architecture',
];

export default function SloganBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slogans.length);
    }, 4000); // 每4秒切换一次

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full border-b border-border bg-background/40 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-400 fill-current animate-pulse" />
          <div className="relative h-5 md:h-6 w-full max-w-md overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-red-400 uppercase tracking-widest whitespace-nowrap"
              >
                {slogans[currentIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-1">
            {slogans.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-red-400 w-3' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
