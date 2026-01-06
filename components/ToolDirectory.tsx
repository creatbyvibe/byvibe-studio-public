'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toolsData, Tool } from '@/data/tools';
import ToolModal from './ToolModal';
import { getIconComponent } from '@/lib/utils/icon-utils';

type SortOption = 'name' | 'category' | 'featured';

export default function ToolDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  const categories = useMemo(() => {
    return ['All', ...new Set(toolsData.map((t) => t.category))];
  }, []);

  const filteredTools = useMemo(() => {
    let filtered = toolsData.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.bestFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFeatured = !showFeaturedOnly || tool.featured === true;
      const matchesNew = !showNewOnly || tool.new === true;
      
      return matchesCategory && matchesSearch && matchesFeatured && matchesNew;
    });

    // 排序
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, activeCategory, sortBy, showFeaturedOnly, showNewOnly]);


  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 border-b border-border bg-gradient-to-b from-background to-surface/30">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              {toolsData.length} AI Tools Integrated
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-display tracking-tighter">
              AI Integrations Library
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-6 font-light tracking-tight">
              Curated AI toolchain. ByVibe generates optimized payloads for every tool here, ensuring seamless integration and maximum productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-text-dim">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24+ Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>8 Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Full Integration</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Directory */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display tracking-tighter">AI Integrations Library</h2>
              <p className="text-text-muted text-sm font-light tracking-tight">
                Curated AI toolchain. ByVibe generates optimized payloads for every tool here.
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-text-dim">
                <span>{filteredTools.length} tools available</span>
                {showFeaturedOnly && (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Star className="w-3 h-3" /> Featured only
                  </span>
                )}
                {showNewOnly && (
                  <span className="flex items-center gap-1 text-green-400">
                    <Sparkles className="w-3 h-3" /> New only
                  </span>
                )}
              </div>
            </div>
            {/* Search & Filter */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools, tags, use cases..."
                  className="w-full bg-surface border border-border rounded px-4 py-2 pl-9 text-sm text-white focus:outline-none focus:border-white/40 placeholder:text-gray-600"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-surface/50 border border-border rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Filters:</span>
            </div>
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1.5 ${
                showFeaturedOnly
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                  : 'bg-surface border-border text-gray-500 hover:text-white'
              }`}
            >
              <Star className="w-3 h-3" />
              Featured
            </button>
            <button
              onClick={() => setShowNewOnly(!showNewOnly)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1.5 ${
                showNewOnly
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : 'bg-surface border-border text-gray-500 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              New
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-surface border border-border rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/40"
              >
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded border transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-surface border-border text-gray-500 hover:text-white hover:border-gray-600'
                }`}
              >
                {cat}
                {activeCategory === cat && activeCategory !== 'All' && (
                  <span className="ml-2 text-[10px]">({toolsData.filter(t => t.category === cat).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm mb-2">No tools found</p>
              <p className="text-gray-600 text-xs">Try adjusting your filters</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
            {filteredTools.map((tool, index) => {
              const IconComponent = getIconComponent(tool.icon);
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
                    <div className="flex items-center gap-1.5">
                      {tool.featured && (
                        <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                      {tool.new && (
                        <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-gray-600 uppercase border border-border px-1.5 py-0.5 rounded">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{tool.desc}</p>
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tool.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-[9px] text-gray-600 bg-black/50 border border-border px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-blue-400 font-mono mt-2">
                    {tool.bestFor}
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </>
  );
}
