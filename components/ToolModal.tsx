'use client';

import { useEffect } from 'react';
import { X, ExternalLink, FileCode, Terminal, Shield } from 'lucide-react';
import { Tool } from '@/data/tools';
import * as LucideIcons from 'lucide-react';

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

export default function ToolModal({ tool, onClose }: ToolModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
    return IconComponent;
  };

  const IconComponent = getIcon(tool.icon);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-200"
      style={{ opacity: 1 }}
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border w-full max-w-2xl mx-4 rounded-lg shadow-2xl overflow-hidden transform scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-black border-b border-border px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold">{tool.name}</h3>
              <span className="text-[10px] font-mono text-gray-500 uppercase">{tool.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <p className="text-text-muted text-sm leading-relaxed mb-6">{tool.desc}</p>

          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="p-4 bg-black border border-border rounded">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                Best For
              </label>
              <p className="text-xs text-white">{tool.bestFor}</p>
            </div>
            <div className="p-4 bg-black border border-border rounded">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                Integration Depth
              </label>
              <div className="flex items-center gap-1 text-green-500 text-xs font-mono">
                Full Payload Generation
              </div>
            </div>
          </div>

          {/* ByVibe Capabilities (Payloads) */}
          <div className="mt-6 pt-6 border-t border-border">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
              ByVibe Generated Payloads
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-900/10 text-blue-400 text-[10px] rounded border border-blue-900/30 flex items-center gap-1">
                <FileCode className="w-3 h-3" /> AI Rules Context
              </span>
              <span className="px-2 py-1 bg-blue-900/10 text-blue-400 text-[10px] rounded border border-blue-900/30 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Vibe Prompt Optimization
              </span>
              <span className="px-2 py-1 bg-blue-900/10 text-blue-400 text-[10px] rounded border border-blue-900/30 flex items-center gap-1">
                <Shield className="w-3 h-3" /> AI Guardrails
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
