'use client';

export default function EcosystemLogos() {
  // 使用带文字的品牌 logo，更容易识别
  const logos = [
    {
      name: 'OpenAI',
      href: 'https://openai.com',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.911 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.182a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .511 4.91 6.046 6.046 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.998-2.9 6.056 6.056 0 0 0-.748-7.073zm-9.022 12.608a4.476 4.476 0 0 1-2.876-1.04l.142-.08 4.778-2.758a.795.795 0 0 0 .393-.681v-6.737l2.02 1.169a1.546 1.546 0 0 1 .831 1.32v6.375a4.524 4.524 0 0 1-5.288 2.434zm-5.004-1.911a4.525 4.525 0 0 1-1.288-6.103l.144.083 4.774 2.758a.795.795 0 0 0 .787 0l5.84-3.371v2.337a1.545 1.545 0 0 1-.777 1.332l-5.522 3.19a4.546 4.546 0 0 1-3.958-.226zm-3.187-5.342a4.523 4.523 0 0 1 2.373-5.776l.144-.083 2.937 1.696-2.84 1.639a1.562 1.562 0 0 0-.762 1.352v6.378l-2.546-1.481a4.523 4.523 0 0 1 .596-3.115zm6.925-8.995a4.476 4.476 0 0 1 2.876 1.04l-.142.08-4.778 2.759a.795.795 0 0 0-.393.68v6.737l-2.02-1.168a1.546 1.546 0 0 1-.831-1.32V5.748a4.524 4.524 0 0 1 5.288-2.434zm9.126 6.138l-.144-.083-4.774-2.758a.795.795 0 0 0-.787 0l-5.84 3.371V5.595a1.545 1.545 0 0 1 .777-1.332l5.522-3.19a4.546 4.546 0 0 1 3.958.226 4.525 4.525 0 0 1 1.288 6.103zm1.066 6.472l-.144.083-2.937-1.696 2.84-1.639a1.562 1.562 0 0 0 .762-1.352v-6.378l2.546 1.482a4.523 4.523 0 0 1-.596 3.115 4.523 4.523 0 0 1-2.471 2.385z"/>
          </svg>
          <span className="text-sm font-medium">OpenAI</span>
        </div>
      ),
    },
    {
      name: 'Vercel',
      href: 'https://vercel.com',
      logo: (
        <svg viewBox="0 0 283 64" fill="currentColor" className="h-5 w-auto">
          <path d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/>
        </svg>
      ),
    },
    {
      name: 'Cursor',
      href: 'https://cursor.sh',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M10.0002 4L10 18L13 15L15.5 20L17.5 19L15 14H19.0002L10.0002 4Z"/>
          </svg>
          <span className="text-sm font-semibold">Cursor</span>
        </div>
      ),
    },
    {
      name: 'Supabase',
      href: 'https://supabase.com',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 109 113" fill="currentColor" className="h-5 w-5">
            <path d="M63.7076 110.284C52.8503 116.311 46.083 112.328 44.267 103.423L25.5875 28.6678C23.7715 19.7633 28.8477 14.2061 39.705 8.17899L55.3995 0L84.2035 15.3148C93.0608 21.3419 99.8281 25.3252 101.644 34.2297L108.531 64.6715C110.347 73.576 105.271 79.1332 94.4132 85.1603L63.7076 110.284Z"/>
            <path d="M63.7076 110.284C52.8503 116.311 46.083 112.328 44.267 103.423L25.5875 28.6678C23.7715 19.7633 28.8477 14.2061 39.705 8.17899L55.3995 0L84.2035 15.3148C93.0608 21.3419 99.8281 25.3252 101.644 34.2297L108.531 64.6715C110.347 73.576 105.271 79.1332 94.4132 85.1603L63.7076 110.284Z" fill="url(#paint0_linear_supabase)"/>
            <path d="M44.3675 45.1047C43.9852 46.3105 44.2124 47.6138 44.9635 48.6087L60.0159 68.7869C60.767 69.7818 61.9999 70.3012 63.2634 70.1314L82.1208 67.8564C83.3843 67.6866 84.4999 66.8478 85.0665 65.6337L94.5692 43.7273C96.6537 39.4 94.8125 34.1603 90.4852 32.0758C90.4852 32.0758 73.9815 23.3632 66.1842 19.3094C58.3868 15.2556 52.8503 19.7633 52.8503 19.7633C48.523 21.8478 46.6818 27.0875 48.7663 31.4148L44.3675 45.1047Z"/>
            <defs>
              <linearGradient id="paint0_linear_supabase" x1="53.75" y1="0" x2="53.75" y2="113" gradientUnits="userSpaceOnUse">
                <stop stopColor="#249361"/>
                <stop offset="1" stopColor="#3ECF8E"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="text-sm font-medium">Supabase</span>
        </div>
      ),
    },
    {
      name: 'Cloudflare',
      href: 'https://cloudflare.com',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 105 35" fill="currentColor" className="h-5 w-auto">
            <path d="M96.1 12.3c-.9-3.8-4.3-6.6-8.4-6.6-3.2 0-6.1 1.8-7.6 4.4-.7-.2-1.5-.3-2.3-.3-4.4 0-8 3.6-8 8 0 1.2.3 2.3.7 3.3H32.4c-4.9 0-8.9 4-8.9 8.9s4 8.9 8.9 8.9h66.9c7.2 0 13.1-5.9 13.1-13.1-.1-7-5.6-12.8-12.6-13.3l-3.7-.2zM48 24.3h-4.3v-4.1c0-2.3 1.3-3.3 4-3.3h.3v-3.7h-.6c-4.6 0-7.3 2.1-7.3 6.9v4.2h-2.5v3.7h2.5v10.3h4.6V28h3.7l.6-3.7z"/>
          </svg>
          <span className="text-sm font-medium">Cloudflare</span>
        </div>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-sm font-medium">GitHub</span>
        </div>
      ),
    },
    {
      name: 'Google',
      href: 'https://deepmind.google/technologies/gemini/',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 272 92" fill="currentColor" className="h-5 w-auto">
            <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.94 0-12.35 5.71-12.35 13.52 0 7.73 5.41 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
            <path d="M225 3v65h-9.5V3h9.5z"/>
            <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          </svg>
        </div>
      ),
    },
    {
      name: 'Anthropic',
      href: 'https://www.anthropic.com',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-sm font-semibold">Anthropic</span>
        </div>
      ),
    },
    {
      name: 'Replicate',
      href: 'https://replicate.com',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-sm font-semibold">Replicate</span>
        </div>
      ),
    },
    {
      name: 'Together AI',
      href: 'https://together.ai',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-sm font-semibold">Together AI</span>
        </div>
      ),
    },
    {
      name: 'v0.dev',
      href: 'https://v0.dev',
      logo: (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">v0</span>
          <span className="text-xs text-gray-500">.dev</span>
        </div>
      ),
    },
    {
      name: 'Windsurf',
      href: 'https://codeium.com/windsurf',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-sm font-semibold">Windsurf</span>
        </div>
      ),
    },
    {
      name: 'Lovable',
      href: 'https://lovable.dev',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-sm font-semibold">Lovable</span>
        </div>
      ),
    },
    {
      name: 'Bolt.new',
      href: 'https://bolt.new',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
          </svg>
          <span className="text-sm font-semibold">Bolt.new</span>
        </div>
      ),
    },
    {
      name: 'Stability AI',
      href: 'https://stability.ai',
      logo: (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-sm font-semibold">Stability AI</span>
        </div>
      ),
    },
  ];

  // 计算响应式列数，确保最后一行对齐
  // 15个logo，在不同屏幕尺寸下的最佳排列
  // 移动端: 2列 (7行，最后一行1个) -> 改为3列 (5行，最后一行0个)
  // 平板: 3列 (5行，最后一行0个) -> 改为4列 (4行，最后一行3个)
  // 桌面: 5列 (3行，最后一行0个) -> 改为6列 (3行，最后一行3个)
  // 大屏: 6列 (3行，最后一行3个) -> 保持

  return (
    <section className="border-b border-border bg-surface/50 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
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
              <div className="flex items-center justify-center mb-2 text-gray-400 group-hover:text-white transition-colors scale-110">
                {logo.logo}
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
