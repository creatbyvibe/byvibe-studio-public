'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toolsData, Tool } from '@/data/tools';
import ToolModal from './ToolModal';
import { getIconComponent } from '@/lib/utils/icon-utils';

export default function SloganBanner() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isHovered, setIsHovered] = useState(false);


  return (
    <>
      <div className="relative w-full border-b border-border bg-background/40 backdrop-blur-sm overflow-hidden">
        {/* 主品牌 Slogan - 固定显示 */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
            <span className="text-brand-slogan md:text-brand-slogan-md font-medium text-red-400 tracking-wide">
              Create by Vibe, Share the Joy
            </span>
          </div>
        </div>

        {/* 工具图标横向滚动部分 */}
        <div 
          className="relative overflow-hidden border-t border-border/50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex items-center gap-8 md:gap-12 py-3 md:py-4 scrollbar-hide tool-scroll-container ${
              isHovered ? 'pause-scroll' : ''
            }`}
          >
            {/* 重复工具列表以实现无缝循环 */}
            {[...toolsData, ...toolsData, ...toolsData].map((tool, index) => {
              const IconComponent = getIconComponent(tool.icon);
              return (
                <motion.button
                  key={`${tool.id}-${index}`}
                  onClick={() => setSelectedTool(tool)}
                  className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-surface/50 group flex-shrink-0 cursor-pointer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-surface border border-border rounded-lg group-hover:border-red-400/50 group-hover:bg-surface/80 transition-all">
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </div>
                  <span className="text-[9px] md:text-[10px] text-gray-500 group-hover:text-red-400 font-medium transition-colors whitespace-nowrap">
                    {tool.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
          
          {/* 渐变遮罩（左右两侧） */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* 工具详情 Modal */}
      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </>
  );
}
