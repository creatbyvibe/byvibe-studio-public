'use client';

import { useState } from 'react';
import { Terminal, Play, AlertTriangle, FileCode, Shield, Code } from 'lucide-react';
import { useUsageLimit } from '@/lib/hooks/useUsageLimit';
import AuthModal from './AuthModal';

interface PlanResult {
  difficulty: string;
  time_est: string;
  tech_stack: string;
  risks?: string;
  file_tree?: string;
  cursor_prompt: string;
}

export default function InteractiveConsole() {
  const [vibeInput, setVibeInput] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { hasReachedLimit, remainingUsage, incrementUsage } = useUsageLimit();

  const polishVibe = async () => {
    if (!vibeInput || vibeInput.trim().length < 2) {
      alert('Please input some ideas first.');
      return;
    }

    setIsPolishing(true);
    try {
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: vibeInput }),
      });

      if (!response.ok) throw new Error('Polishing failed');

      const data = await response.json();
      setVibeInput(data.refined || vibeInput);
    } catch (error) {
      console.error(error);
      alert('System Error: Polishing failed.');
    } finally {
      setIsPolishing(false);
    }
  };

  const generatePlan = async () => {
    if (!vibeInput || vibeInput.trim().length < 2) {
      alert('Please input system requirements.');
      return;
    }

    // 检查使用限制
    if (hasReachedLimit) {
      setShowAuthModal(true);
      return;
    }

    setIsGenerating(true);
    setShowContent(false);

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: vibeInput }),
      });

      if (!response.ok) throw new Error('Orchestration failed');

      const data = await response.json();
      setPlan(data);
      setShowContent(true);
      
      // 增加使用次数
      incrementUsage();
    } catch (error) {
      console.error('Orchestration Error:', error);
      alert('System Error: Orchestration failed.');
      setShowContent(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="flex-1 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-mono text-blue-400">
              <Code className="w-4 h-4" /> AI ENGINE v1.0
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Hands-on with<br className="block" />
              the Architect.
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed">
              Don't just watch videos. Experience how ByVibe breaks down complex ideas into executable engineering tasks.
            </p>
            <div className="flex gap-6 text-sm font-mono text-text-muted">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Auto-PRD</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Risk Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Column - Console with Stacked Effect */}
          <div className="flex-1 w-full lg:max-w-2xl relative">
            {/* Stacked Console Effect */}
            <div className="relative">
              {/* Background layers for stacked effect */}
              <div className="absolute -right-2 -bottom-2 w-full h-full bg-blue-500/5 border border-blue-500/10 rounded-lg -z-10"></div>
              <div className="absolute -right-1 -bottom-1 w-full h-full bg-blue-500/10 border border-blue-500/20 rounded-lg -z-10"></div>
              
              {/* Main Console */}
              <div className="relative bg-background border border-border rounded-lg shadow-2xl overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col ring-1 ring-white/5">
                <div className="bg-black border-b border-border px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Terminal className="w-4 h-4" />
                    <span>byvibe-cli</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-mono text-green-500">READY</span>
                  </div>
                </div>

                <div className="flex-1 p-0 flex flex-col font-mono">
                  <div className="p-5 md:p-6 border-b border-border bg-surface/50">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Input Vibe
                      </label>
                      <button
                        onClick={polishVibe}
                        disabled={isPolishing}
                        className="text-xs text-blue-400 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        [Refine]
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        id="vibeInput"
                        value={vibeInput}
                        onChange={(e) => setVibeInput(e.target.value)}
                        className="w-full bg-black border border-border rounded p-4 text-gray-300 resize-none focus:outline-none focus:border-gray-600 transition-colors min-h-[100px] placeholder:text-gray-600 placeholder:italic text-sm"
                        placeholder="// E.g., A minimalist habit tracker that roasts me via AI..."
                      />
                      {isPolishing && (
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                          <span className="text-sm text-blue-400 animate-pulse">&gt; Optimizing...</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-3">
                      {hasReachedLimit && (
                        <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-400 text-xs text-center">
                          ⚠️ 免费试用已用完，请登录继续使用
                        </div>
                      )}
                      {!hasReachedLimit && remainingUsage > 0 && (
                        <div className="text-xs text-gray-500 text-center">
                          剩余免费次数: {remainingUsage}
                        </div>
                      )}
                      <button
                        onClick={generatePlan}
                        disabled={isGenerating}
                        className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-4 h-4" /> Generate Plan
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 bg-black p-5 md:p-6 relative overflow-hidden flex flex-col">
                    <div className="flex-1 relative">
                      {!showContent && !isGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                          <span className="opacity-50 text-center text-sm">&gt; Awaiting Input...</span>
                        </div>
                      )}
                      {isGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
                          <span className="text-sm text-blue-400 font-mono thinking-dots">
                            &gt; Processing
                          </span>
                        </div>
                      )}
                      {showContent && plan && (
                        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar pb-2">
                          <div className="grid grid-cols-3 border border-border mb-4 text-xs bg-surface/50">
                            <div className="p-3 border-r border-border">
                              <div className="text-gray-500 uppercase mb-1">Diff</div>
                              <div className="text-white font-semibold">{plan.difficulty || '-'}</div>
                            </div>
                            <div className="p-3 border-r border-border">
                              <div className="text-gray-500 uppercase mb-1">Time</div>
                              <div className="text-white font-semibold">{plan.time_est || '-'}</div>
                            </div>
                            <div className="p-3">
                              <div className="text-gray-500 uppercase mb-1">Stack</div>
                              <div className="text-blue-400 truncate">{plan.tech_stack || '-'}</div>
                            </div>
                          </div>
                          {plan.risks && (
                            <div className="mb-4 p-3 border border-red-900/30 bg-red-900/10 text-red-400 text-sm flex gap-2 items-start rounded">
                              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                              <span>{plan.risks}</span>
                            </div>
                          )}
                          <div className="flex-1 border border-border bg-[#050505] p-4 relative group/code rounded">
                            <div className="text-blue-500/70 text-xs mb-3"># Generated Context</div>
                            <div className="text-gray-400 text-xs whitespace-pre-wrap leading-relaxed min-h-[150px] overflow-y-auto custom-scrollbar">
                              {plan.cursor_prompt || '-'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // 登录成功后可以继续使用
        }}
      />
    </section>
  );
}
