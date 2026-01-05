import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ByVibe - The AI Engineering Brain',
  description: 'An orchestration layer for Vibe Coding. We inject engineering rigor into AI workflows, ensuring your natural language compiles into scalable products.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-background text-text-muted antialiased min-h-screen flex flex-col relative overflow-x-hidden font-sans selection:bg-blue-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
