'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toolsData, Tool } from '@/data/tools';
import ToolModal from './ToolModal';
import * as LucideIcons from 'lucide-react';

const slogans = [
  'Create by Vibe, Share the Joy',
  'Engineering Rigor Meets AI Creativity',
  'From Vibe to Deployable Architecture',
];

export default function SloganBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slogans.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
    return IconComponent;
  };

  // 悬停状态
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="relative w-full border-b border-border bg-background/40 backdrop-blur-sm overflow-hidden">
        {/* Slogan 部分 */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-400 fill-current animate-pulse" />
            <div className="relative h-5 md:h-6 w-full max-w-md overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-red-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {slogans[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex gap-1">
              {slogans.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-1 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-red-400 w-3' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 工具图标横向滚动部分 */}
        <div 
          className="relative overflow-hidden border-t border-border/50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={scrollContainerRef}
            className={`flex items-center gap-8 md:gap-12 py-3 md:py-4 scrollbar-hide tool-scroll-container ${
              isHovered ? 'pause-scroll' : ''
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* 重复工具列表以实现无缝循环 */}
            {[...toolsData, ...toolsData, ...toolsData].map((tool, index) => {
              const IconComponent = getIcon(tool.icon);
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
