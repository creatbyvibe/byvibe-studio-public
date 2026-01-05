'use client';

import { Heart } from 'lucide-react';

export default function SloganBanner() {
  return (
    <div className="relative w-full border-b border-border bg-background/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-center gap-2.5">
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-400 fill-current animate-pulse flex-shrink-0" />
          <span className="text-brand-slogan md:text-brand-slogan-md font-medium text-red-400 tracking-wide text-center">
            Create by Vibe, Share the Joy
          </span>
        </div>
      </div>
    </div>
  );
}
