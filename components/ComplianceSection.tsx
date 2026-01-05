'use client';

import { ExternalLink } from 'lucide-react';

const complianceItems = [
  {
    region: 'EUROPEAN UNION',
    title: 'EU AI Act',
    description: 'Comprehensive regulation on artificial intelligence.',
    link: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
  },
  {
    region: 'UNITED STATES',
    title: 'AI Executive Order',
    description: 'Safe, Secure, and Trustworthy Development.',
    link: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',
  },
  {
    region: 'CHINA',
    title: 'Gen AI Measures',
    description: 'Measures for Generative AI Services.',
    link: 'http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm',
  },
];

export default function ComplianceSection() {
  return (
    <section id="compliance" className="py-12 md:py-20 px-4 md:px-6 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3 block">
              Global Standards
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">AI Governance & Legislation</h2>
            <p className="text-text-muted text-sm md:text-base mt-2 max-w-lg leading-relaxed">
              ByVibe architecture is built to align with emerging global AI safety standards.
            </p>
          </div>
          <a
            href="/governance"
            className="text-xs md:text-sm text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors whitespace-nowrap"
          >
            View Full Governance Page →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {complianceItems.map((item, index) => (
            <a
              key={index}
              href="/governance"
              className="p-6 border border-border bg-background rounded hover:border-blue-500/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                  {item.region}
                </span>
              </div>
              <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
              <p className="text-[10px] text-blue-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                View Details →
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
