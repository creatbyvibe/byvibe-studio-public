'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toolsData, Tool } from '@/data/tools';
import ToolModal from './ToolModal';
import * as LucideIcons from 'lucide-react';

export default function ToolDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const categories = useMemo(() => {
    return ['All', ...new Set(toolsData.map((t) => t.category))];
  }, []);

  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
    return IconComponent;
  };

  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-6 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">AI Integrations Library</h2>
              <p className="text-text-muted text-sm">
                Curated AI toolchain. ByVibe generates optimized payloads for every tool here.
              </p>
            </div>
            {/* Search & Filter */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter AI tools..."
                  className="w-full bg-surface border border-border rounded px-4 py-2 pl-9 text-sm text-white focus:outline-none focus:border-white/40 placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white'
                    : 'bg-surface border-border text-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const IconComponent = getIcon(tool.icon);
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedTool(tool)}
                  whileHover={{ scale: 1.02 }}
                  className="tool-card bg-surface border border-border p-5 rounded cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-gray-600 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-600 uppercase border border-border px-1.5 py-0.5 rounded">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{tool.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </>
  );
}
