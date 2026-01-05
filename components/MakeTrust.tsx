'use client'

import { Code2, Cloud, GitBranch, Sparkles, Zap, Shield, Globe } from 'lucide-react'

interface Tool {
  name: string
  icon: React.ReactNode
  category: 'AI' | 'Infrastructure' | 'Development'
  description: string
}

const tools: Tool[] = [
  {
    name: 'Gemini',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'AI',
    description: 'AI-powered code generation and architecture design assistance'
  },
  {
    name: 'Cursor',
    icon: <Code2 className="w-6 h-6" />,
    category: 'AI',
    description: 'AI-first IDE for intelligent code completion and refactoring'
  },
  {
    name: 'Cloudflare',
    icon: <Cloud className="w-6 h-6" />,
    category: 'Infrastructure',
    description: 'Global CDN and edge deployment for lightning-fast performance'
  },
  {
    name: 'GitHub',
    icon: <GitBranch className="w-6 h-6" />,
    category: 'Development',
    description: 'Version control and automated CI/CD pipeline management'
  },
  {
    name: 'Supabase',
    icon: <Shield className="w-6 h-6" />,
    category: 'Infrastructure',
    description: 'Backend-as-a-Service for database and authentication'
  },
  {
    name: 'Next.js',
    icon: <Zap className="w-6 h-6" />,
    category: 'Development',
    description: 'React framework for production-ready static site generation'
  },
  {
    name: 'Vercel',
    icon: <Globe className="w-6 h-6" />,
    category: 'Infrastructure',
    description: 'Deployment platform (via Cloudflare Pages alternative)'
  }
]

export default function MakeTrust() {
  const aiTools = tools.filter(t => t.category === 'AI')
  const devTools = tools.filter(t => t.category === 'Development')
  const infraTools = tools.filter(t => t.category === 'Infrastructure')

  return (
    <section className="bg-white border-t border-gray-100 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built with Trusted Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're transparent about our stack. Here's what powers byvibe.ai and how each tool contributes to building better products.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* AI Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI & Code Generation
              </h3>
              {aiTools.map((tool, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Development Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                Development
              </h3>
              {devTools.map((tool, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infrastructure Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-purple-600" />
                Infrastructure
              </h3>
              {infraTools.map((tool, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              We believe in transparency. Every tool we use helps us build faster, smarter, and more reliably.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
