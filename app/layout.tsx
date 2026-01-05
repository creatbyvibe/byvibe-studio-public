import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ByVibe.ai - Building in Public',
  description: 'Join the waitlist for ByVibe.ai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
