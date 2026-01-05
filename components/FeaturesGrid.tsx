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
    <section id="features" className="py-12 md:py-20 px-4 md:px-6 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 border-b border-border pb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">The Vibe AI System</h2>
          <p className="text-text-muted text-sm">
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
                <h3 className="text-white font-medium mb-3">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
