'use client';

export default function EcosystemLogos() {
  // Logo configuration - using local images from public/logos/
  const logos = [
    {
      name: 'OpenAI',
      href: 'https://openai.com',
      imagePath: '/logos/openai.svg',
      fallbackColor: '#412991',
    },
    {
      name: 'Vercel',
      href: 'https://vercel.com',
      imagePath: '/logos/vercel.svg',
      fallbackColor: '#000000',
    },
    {
      name: 'Cursor',
      href: 'https://cursor.sh',
      imagePath: '/logos/cursor.svg',
      fallbackColor: '#000000',
    },
    {
      name: 'Supabase',
      href: 'https://supabase.com',
      imagePath: '/logos/supabase.svg',
      fallbackColor: '#3ECF8E',
    },
    {
      name: 'Cloudflare',
      href: 'https://cloudflare.com',
      imagePath: '/logos/cloudflare.svg',
      fallbackColor: '#F38020',
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      imagePath: '/logos/github.svg',
      fallbackColor: '#181717',
    },
    {
      name: 'Google',
      href: 'https://deepmind.google/technologies/gemini/',
      imagePath: '/logos/google.svg',
      fallbackColor: '#4285F4',
    },
    {
      name: 'Anthropic',
      href: 'https://www.anthropic.com',
      imagePath: '/logos/anthropic.svg',
      fallbackColor: '#D4A574',
    },
    {
      name: 'Replicate',
      href: 'https://replicate.com',
      imagePath: '/logos/replicate.svg',
      fallbackColor: '#FF6B35',
    },
    {
      name: 'Together AI',
      href: 'https://together.ai',
      imagePath: '/logos/togetherai.svg',
      fallbackColor: '#00B4D8',
    },
    {
      name: 'v0.dev',
      href: 'https://v0.dev',
      imagePath: '/logos/v0.svg',
      fallbackColor: '#000000',
    },
    {
      name: 'Windsurf',
      href: 'https://codeium.com/windsurf',
      imagePath: '/logos/codeium.svg',
      fallbackColor: '#6366F1',
    },
    {
      name: 'Lovable',
      href: 'https://lovable.dev',
      imagePath: '/logos/lovable.svg',
      fallbackColor: '#EF4444',
    },
    {
      name: 'Bolt.new',
      href: 'https://bolt.new',
      imagePath: '/logos/bolt.svg',
      fallbackColor: '#F59E0B',
    },
    {
      name: 'Stability AI',
      href: 'https://stability.ai',
      imagePath: '/logos/stabilityai.svg',
      fallbackColor: '#000000',
    },
  ];

  return (
    <section className="border-b border-border bg-surface/50 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center text-sm md:text-base font-mono text-gray-500 uppercase tracking-widest mb-10 md:mb-12">
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
                <img
                  src={logo.imagePath}
                  alt={`${logo.name} logo`}
                  className="h-full w-auto max-w-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback: show colored background if image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.logo-fallback');
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
              <span className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-white transition-colors text-center">
                {logo.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
