'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BuildLogEntry {
  status: 'live' | 'building'
  title: string
  date?: string
}

const buildLogs: BuildLogEntry[] = [
  {
    status: 'live',
    title: 'Project Initiated. Waitlist & Database Connected.',
    date: 'Today',
  },
  {
    status: 'building',
    title: 'AI Architecture Module (Phase 1)',
  },
]

export default function BuildLog() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Building in Public
      </h2>

      <div className="relative">
        {/* 时间轴竖线 */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {buildLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative flex items-start gap-4"
            >
              {/* 状态指示器 */}
              <div className="relative z-10 flex-shrink-0">
                {log.status === 'live' ? (
                  <motion.div
                    className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center backdrop-blur-sm"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(34, 197, 94, 0.7)',
                        '0 0 0 10px rgba(34, 197, 94, 0)',
                        '0 0 0 0 rgba(34, 197, 94, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </motion.div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  </div>
                )}
              </div>

              {/* 内容卡片 */}
              <motion.div
                className={cn(
                  'flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-lg',
                  'hover:shadow-xl transition-all duration-300'
                )}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded',
                      log.status === 'live'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {log.status === 'live' ? '🟢 Live' : '🟡 Building'}
                  </span>
                  {log.date && (
                    <span className="text-xs text-gray-500">{log.date}</span>
                  )}
                </div>
                <p className="text-gray-900 font-medium">{log.title}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
