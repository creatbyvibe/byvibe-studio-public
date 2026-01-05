/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // 品牌 Slogan（主品牌）
        'brand-slogan': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'brand-slogan-md': ['1rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        // 产品 Slogan（产品标题）
        'product-slogan': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'product-slogan-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'product-slogan-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'product-slogan-xl': ['5.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      colors: {
        background: '#050505',
        surface: '#0F0F0F',
        border: '#27272a',
        'text-main': '#E5E7EB',
        'text-muted': '#9CA3AF',
        'text-dim': '#6B7280',
        'brand-red': '#ef4444',
      },
      borderRadius: {
        'card': '0.5rem',      // 8px - 卡片圆角
        'button': '0.375rem',  // 6px - 按钮圆角
        'input': '0.375rem',   // 6px - 输入框圆角
      },
      spacing: {
        'card-sm': '1rem',     // 16px - 小卡片内边距
        'card-md': '1.5rem',   // 24px - 中等卡片内边距
        'card-lg': '2rem',     // 32px - 大卡片内边距
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
}
