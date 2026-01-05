'use client'

import { useState } from 'react'
import { ExternalLink, Star, TrendingUp } from 'lucide-react'
import { tools } from '@/data/tools'

// 工具数据需要迁移到新的位置
// 暂时从旧位置导入，后续可以迁移

export default function ToolShowcase() {
  const [selectedTool, setSelectedTool] = useState(0)
  
  // 获取精选工具（featured 或投票数最高的）
  const featuredTools = tools
    .filter(tool => tool.featured || tool.votes > 5000)
    .slice(0, 3)
  
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
                {currentTool.featured && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                    精选
                  </span>
                )}
                {currentTool.new && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                    新
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{currentTool.category}</p>
            </div>
          </div>

          {/* Tool Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentTool.description}
          </p>

          {/* Tool Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            {currentTool.rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {currentTool.rating}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>👍</span>
              <span className="font-medium">{currentTool.votes.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-500">
              {currentTool.pricing}
            </div>
          </div>

          {/* Tool Tags */}
          <div className="flex flex-wrap gap-2">
            {currentTool.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
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
