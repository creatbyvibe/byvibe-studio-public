'use client'

import { useState } from 'react'
import { ExternalLink, Star, TrendingUp } from 'lucide-react'
import { toolsData } from '@/data/tools'

// 工具数据需要迁移到新的位置
// 暂时从旧位置导入，后续可以迁移

export default function ToolShowcase() {
  const [selectedTool, setSelectedTool] = useState(0)
  
  // 获取精选工具（前3个）
  const featuredTools = toolsData.slice(0, 3)
  
  const currentTool = featuredTools[selectedTool] || featuredTools[0]

  return (
    <div className="h-full flex flex-col">
      {/* Tool Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-700">热门工具</span>
        </div>
        <div className="flex gap-1">
          {featuredTools.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedTool(index)}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                selectedTool === index ? 'bg-blue-600 w-4' : 'bg-gray-300'
              }`}
              aria-label={`切换到工具 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Tool Content */}
      <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
        <div className="space-y-4">
          {/* Tool Name & Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentTool.name}
                </h3>
              </div>
              <p className="text-sm text-gray-500">{currentTool.category}</p>
            </div>
          </div>

          {/* Tool Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentTool.desc}
          </p>

          {/* Tool Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {currentTool.bestFor}
            </div>
          </div>

          {/* Tool Link */}
          <a
            href={currentTool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            了解更多
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
