'use client';

import { useState, useEffect, useRef } from 'react';
// Icons removed - using text-only design
import { motion, useInView } from 'framer-motion';
import { useUsageLimit } from '@/lib/hooks/useUsageLimit';
import AuthModal from './AuthModal';
import ErrorModal from './ErrorModal';
import EnhancedPlanView from './EnhancedPlanView';

interface Risk {
  category: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

interface Task {
  phase: string;
  title: string;
  description: string;
  estimated_hours: number;
  dependencies: number[];
}

interface RoadmapItem {
  week: number;
  milestone: string;
  deliverables: string[];
  dependencies: number[];
}

interface TechOption {
  name: string;
  pros: string[];
  cons: string[];
  recommendation: 'Recommended' | 'Alternative';
}

interface TechComparison {
  category: string;
  options: TechOption[];
}

interface CodeFile {
  path: string;
  snippet: string;
  description: string;
}

interface Deployment {
  strategy: string;
  steps: string[];
  infrastructure: string;
  cost_estimate: string;
}

interface CostBreakdown {
  development: string;
  infrastructure: string;
  maintenance: string;
  total_first_year: string;
  notes: string;
}

interface PlanResult {
  difficulty: string;
  time_est: string;
  tech_stack: string;
  risks?: Risk[] | string; // Support both old format (string) and new format (array)
  tasks?: Task[];
  roadmap?: RoadmapItem[];
  architecture_diagram?: string;
  tech_comparison?: TechComparison[];
  code_preview?: {
    language: string;
    files: CodeFile[];
  };
  deployment?: Deployment;
  cost_breakdown?: CostBreakdown;
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
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  
  const { hasReachedLimit, remainingUsage, incrementUsage } = useUsageLimit();

  const polishVibe = async () => {
    if (!vibeInput || vibeInput.trim().length < 2) {
      setErrorModal({ isOpen: true, message: 'Please input some ideas first.' });
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
      setErrorModal({ isOpen: true, message: 'System Error: Polishing failed.' });
    } finally {
      setIsPolishing(false);
    }
  };

  const generatePlan = async () => {
    if (!vibeInput || vibeInput.trim().length < 2) {
      setErrorModal({ isOpen: true, message: 'Please input system requirements.' });
      return;
    }

    // Check usage limit
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

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a usage limit error
        if (response.status === 429 && data.code === 'USAGE_LIMIT_EXCEEDED') {
          setShowAuthModal(true);
          return;
        }
        throw new Error(data.error || 'Orchestration failed');
      }

      setPlan(data);
      setShowContent(true);
      
      // Increment usage count
      incrementUsage();
    } catch (error: any) {
      console.error('Orchestration Error:', error);
      setErrorModal({ isOpen: true, message: error.message || 'System Error: Orchestration failed.' });
      setShowContent(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const isLeftInView = useInView(leftContentRef, { once: true, margin: "-100px" });
  const isRightInView = useInView(rightContentRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-6 bg-surface border-b border-border relative overflow-hidden"
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-30"></div>
      
      {/* Glowing Transition from Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200px] pointer-events-none -z-0">
        <div className="w-full h-full bg-gradient-radial from-blue-500/5 via-blue-500/2 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column - Text Content */}
          <motion.div 
            ref={leftContentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isLeftInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 max-w-xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-mono text-blue-400 uppercase tracking-widest">
              FROM VIBE TO ARCHITECTURE
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-display tracking-tighter">
              Beyond Code.<br className="block" />
              Engineered Realities.
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed font-light tracking-tight">
              Stop passive watching. ByVibe transforms abstract prompts into rigorous PRDs, risk assessments, and executable roadmaps. Give your &apos;vibe&apos; an industrial-grade foundation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono text-text-muted">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                <span>Auto-PRD</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                <span>Risk Analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                <span>Architecture Mapping</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                <span>Tech-Stack Validation</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Console with Stacked Effect */}
          <motion.div 
            ref={rightContentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isRightInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full lg:max-w-2xl relative"
          >
            {/* Stacked Console Effect */}
            <div className="relative">
              {/* Background layers for stacked effect */}
              <div className="absolute -right-2 -bottom-2 w-full h-full bg-blue-500/5 border border-blue-500/10 rounded-lg -z-10"></div>
              <div className="absolute -right-1 -bottom-1 w-full h-full bg-blue-500/10 border border-blue-500/20 rounded-lg -z-10"></div>
              
              {/* Main Console */}
              <div className="relative bg-background border border-border rounded-lg shadow-2xl overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col ring-1 ring-white/5 console-spotlight">
                <div className="bg-black border-b border-border px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
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
                          Free trial exhausted. Please sign in to continue.
                        </div>
                      )}
                      {!hasReachedLimit && remainingUsage > 0 && (
                        <div className="text-xs text-gray-500 text-center">
                          Free attempts remaining: {remainingUsage}
                        </div>
                      )}
                      <button
                        onClick={generatePlan}
                        disabled={isGenerating}
                        className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Generate Plan
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
                        <EnhancedPlanView plan={plan} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // User can continue after successful login
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />
    </section>
  );
}
