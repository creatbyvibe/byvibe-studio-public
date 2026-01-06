'use client';

import Image from 'next/image';

export default function EcosystemLogos() {
  // Logo configuration - using local images from public/logos/
  // isMonochrome: true for black/white logos that need invert filter
  // isMonochrome: false for colored logos that should display in original colors
  const logos = [
    {
      name: 'OpenAI',
      href: 'https://openai.com',
      imagePath: '/logos/openai.svg',
      fallbackColor: '#412991',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'Vercel',
      href: 'https://vercel.com',
      imagePath: '/logos/vercel.svg',
      fallbackColor: '#000000',
      isMonochrome: true, // Black logo
    },
    {
      name: 'Cursor',
      href: 'https://cursor.sh',
      imagePath: '/logos/cursor.svg',
      fallbackColor: '#000000',
      isMonochrome: true, // Black logo
    },
    {
      name: 'Supabase',
      href: 'https://supabase.com',
      imagePath: '/logos/supabase.svg',
      fallbackColor: '#3ECF8E',
      isMonochrome: false, // Colored logo (green)
    },
    {
      name: 'Cloudflare',
      href: 'https://cloudflare.com',
      imagePath: '/logos/cloudflare.svg',
      fallbackColor: '#F38020',
      isMonochrome: false, // Colored logo (orange)
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      imagePath: '/logos/github.svg',
      fallbackColor: '#181717',
      isMonochrome: true, // Black logo
    },
    {
      name: 'Google',
      href: 'https://deepmind.google/technologies/gemini/',
      imagePath: '/logos/google.svg',
      fallbackColor: '#4285F4',
      isMonochrome: false, // Colored logo (multi-color)
    },
    {
      name: 'Anthropic',
      href: 'https://www.anthropic.com',
      imagePath: '/logos/anthropic.svg',
      fallbackColor: '#D4A574',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'Replicate',
      href: 'https://replicate.com',
      imagePath: '/logos/replicate.svg',
      fallbackColor: '#FF6B35',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'Together AI',
      href: 'https://together.ai',
      imagePath: '/logos/togetherai.svg',
      fallbackColor: '#00B4D8',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'v0.dev',
      href: 'https://v0.dev',
      imagePath: '/logos/v0.svg',
      fallbackColor: '#000000',
      isMonochrome: true, // Black logo
    },
    {
      name: 'Windsurf',
      href: 'https://codeium.com/windsurf',
      imagePath: '/logos/codeium.svg',
      fallbackColor: '#6366F1',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'Lovable',
      href: 'https://lovable.dev',
      imagePath: '/logos/lovable.svg',
      fallbackColor: '#EF4444',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'Bolt.new',
      href: 'https://bolt.new',
      imagePath: '/logos/bolt.svg',
      fallbackColor: '#F59E0B',
      isMonochrome: false, // Colored logo
    },
    {
      name: 'Stability AI',
      href: 'https://stability.ai',
      imagePath: '/logos/stabilityai.svg',
      fallbackColor: '#000000',
      isMonochrome: true, // Black logo
    },
  ];

  return (
    <section className="border-b border-border bg-surface/50 py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center text-sm md:text-base font-display text-gray-500 uppercase tracking-widest mb-10 md:mb-12">
          Orchestrating the AI Ecosystem
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-4 md:gap-5 justify-items-center">
          {logos.map((logo, index) => (
            <a
              key={index}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center px-4 py-4 md:px-5 md:py-5 rounded-lg border border-border/30 bg-surface/20 hover:bg-surface/50 hover:border-border/80 hover:scale-110 transition-all duration-300 group w-full max-w-[140px] min-h-[100px] md:min-h-[120px]"
              aria-label={logo.name}
            >
              <div className="flex items-center justify-center mb-2 h-8 md:h-10 w-full relative">
                <Image
                  src={logo.imagePath}
                  alt={`${logo.name} logo`}
                  width={160}
                  height={48}
                  className={`h-full w-auto max-w-full object-contain transition-all duration-300 ${
                    logo.isMonochrome
                      ? 'filter brightness-0 invert opacity-70 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100'
                      : 'opacity-90 group-hover:opacity-100'
                  }`}
                  priority={index < 4}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100px, 160px"
                  onError={(e) => {
                    // Fallback: show colored background if image fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = (target.parentElement as HTMLElement)?.querySelector('.logo-fallback');
                    if (fallback) {
                      fallback.classList.remove('hidden');
                      (fallback as HTMLElement).style.backgroundColor = logo.fallbackColor;
                    }
                  }}
                />
                <div 
                  className="logo-fallback hidden h-8 w-8 md:h-10 md:w-10 rounded"
                  style={{ backgroundColor: logo.fallbackColor }}
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-white transition-colors text-center font-sans">
                {logo.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
