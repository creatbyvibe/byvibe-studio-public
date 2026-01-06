'use client';

import { ShieldCheck, FileJson, TerminalSquare } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'AI Governance',
    description:
      'Feasibility analysis before execution. The AI CTO validates your stack choices and Vibe complexity, preventing technical debt before it starts.',
  },
  {
    icon: FileJson,
    title: 'Living AI Specs',
    description:
      'Transforms abstract Vibes into concrete AI PRDs. Our system generates the "Living Spec" that keeps LLMs hallucination-free.',
  },
  {
    icon: TerminalSquare,
    title: 'AI Orchestration',
    description:
      'Direct integration context for Cursor, Manus, and Gemini. We provide the "Perfect AI Prompt" payload that ensures first-shot success.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-16 md:py-24 px-4 md:px-6 border-b border-border bg-background">
      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-radial from-purple-500/20 via-blue-500/15 to-transparent blur-[120px] opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-radial from-pink-500/15 via-red-500/10 to-transparent blur-[120px] opacity-15"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-0">
        <div className="mb-12 md:mb-16 border-b border-border pb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight font-display tracking-tighter">The Vibe AI System</h2>
          <p className="text-text-muted text-sm md:text-base leading-relaxed font-light tracking-tight">
            ByVibe structures your raw Vibe into a deployable AI Architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <div className="w-10 h-10 flex items-center justify-center border border-border bg-surface mb-4 md:mb-6 rounded group-hover:border-white/40 transition-colors">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold mb-3 font-display tracking-tight">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed font-light tracking-tight">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
