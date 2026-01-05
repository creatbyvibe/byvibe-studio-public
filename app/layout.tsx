import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://byvibe.ai'),
  title: {
    default: 'ByVibe - The AI Engineering Brain',
    template: '%s | ByVibe',
  },
  description: 'An orchestration layer for Vibe Coding. We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.',
  keywords: [
    'AI coding',
    'Vibe Coding',
    'AI engineering',
    'AI orchestration',
    'code generation',
    'AI workflow',
    'software architecture',
    'AI development',
    'natural language programming',
    'AI tools',
  ],
  authors: [{ name: 'ByVibe Team' }],
  creator: 'ByVibe',
  publisher: 'ByVibe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ByVibe',
    title: 'ByVibe - The AI Engineering Brain',
    description: 'An orchestration layer for Vibe Coding. We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ByVibe - The AI Engineering Brain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ByVibe - The AI Engineering Brain',
    description: 'An orchestration layer for Vibe Coding. We inject engineering rigor into AI workflows.',
    images: ['/og-image.png'],
    creator: '@byvibe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 可以添加 Google Search Console 验证
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background text-text-muted antialiased min-h-screen flex flex-col relative overflow-x-hidden font-sans selection:bg-blue-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
