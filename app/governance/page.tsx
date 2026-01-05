'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FileText, Scale, BookOpen, Shield, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';

// Regulations & Policies
const regulations = [
  {
    id: 1,
    region: 'EUROPEAN UNION',
    title: 'EU AI Act',
    description: 'The EU AI Act comprehensively regulates the development and use of artificial intelligence, representing the world\'s first comprehensive AI regulatory framework.',
    link: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    date: 'March 2024',
    category: 'Regulation',
  },
  {
    id: 2,
    region: 'UNITED STATES',
    title: 'AI Executive Order',
    description: 'The U.S. AI Executive Order aims to ensure the safe, secure, and trustworthy development of AI.',
    link: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',
    date: 'October 2023',
    category: 'Executive Order',
  },
  {
    id: 3,
    region: 'CHINA',
    title: 'Interim Measures for the Management of Generative Artificial Intelligence Services',
    description: 'China\'s regulatory measures for generative AI services require AI service providers to fulfill obligations such as security assessments and content review.',
    link: 'http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm',
    date: 'July 2023',
    category: 'Departmental Regulation',
  },
  {
    id: 4,
    region: 'CHINA',
    title: 'AI Ethics Governance Guidelines (Shanghai)',
    description: 'Shanghai pioneered the "Ethical Impact Assessment" system, requiring AI enterprises to submit ethical risk reports before product launch, focusing on assessing risks such as data privacy, algorithmic bias, and content security.',
    link: 'https://www.umcn.cc/home/article/detail/id/46.html',
    date: 'July 2025',
    category: 'Local Guideline',
  },
  {
    id: 5,
    region: 'UNITED STATES',
    title: 'Algorithmic Accountability Act',
    description: 'The Algorithmic Accountability Act requires companies to assess the impact of their automated systems to ensure fairness and transparency.',
    link: 'https://www.congress.gov/bill/116th-congress/house-bill/2231',
    date: '2019',
    category: 'Act',
  },
];

// Ethical Guidelines
const ethicsPrinciples = [
  {
    id: 1,
    organization: 'UNESCO',
    title: 'Recommendation on the Ethics of Artificial Intelligence',
    description: 'UNESCO\'s AI ethics recommendation emphasizes core principles such as transparency, accountability, and privacy protection.',
    link: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics',
    principles: ['Transparency', 'Accountability', 'Privacy Protection', 'Fairness', 'Human Dignity'],
  },
  {
    id: 2,
    organization: 'IEEE',
    title: 'Ethically Aligned Design',
    description: 'IEEE\'s ethical design standards and guidelines for AI systems provide a framework for ethical AI design.',
    link: 'https://ethicsinaction.ieee.org/',
    principles: ['Human Well-being', 'Accountability', 'Transparency', 'Education & Awareness'],
  },
  {
    id: 3,
    organization: 'Montreal Declaration',
    title: 'Montreal Declaration for Responsible AI',
    description: 'Proposes ethical principles for the development and use of artificial intelligence, emphasizing responsible development.',
    link: 'https://www.montrealdeclaration-responsibleai.com/',
    principles: ['Well-being', 'Autonomy', 'Justice', 'Privacy', 'Knowledge'],
  },
  {
    id: 4,
    organization: 'China',
    title: 'Governance Principles for New Generation Artificial Intelligence',
    description: 'Governance principles and framework released by China\'s National Governance Committee for New Generation Artificial Intelligence.',
    link: 'https://www.most.gov.cn/kjbgz/201906/t20190617_147107.html',
    principles: ['Harmony & Friendliness', 'Fairness & Justice', 'Inclusiveness & Sharing', 'Privacy Respect', 'Safety & Controllability'],
  },
];

// Research Papers
const researchPapers = [
  {
    id: 1,
    title: 'Worldwide AI Ethics: a review of 200 guidelines and recommendations for AI governance',
    authors: 'Anna Jobin, Marcello Ienca, Effy Vayena',
    journal: 'arXiv',
    year: '2022',
    description: 'A meta-analysis of 200 AI governance policies and ethical guidelines worldwide, identifying 17 commonly recognized principles.',
    link: 'https://arxiv.org/abs/2206.11922',
    category: 'Meta-Analysis',
    license: 'CC BY 4.0',
  },
  {
    id: 2,
    title: 'AI Ethics: An Empirical Study on the Views of Practitioners and Lawmakers',
    authors: 'Various Authors',
    journal: 'arXiv',
    year: '2022',
    description: 'A study surveying 99 AI practitioners and lawmakers from 20 countries, exploring AI ethics principles and related challenges.',
    link: 'https://arxiv.org/abs/2207.01493',
    category: 'Empirical Study',
    license: 'CC BY 4.0',
  },
  {
    id: 3,
    title: 'The Evolution of Governance Paradigms for Open-Source AI: Ethics-Technology Co-Construction',
    authors: 'East China Normal University Research Team',
    journal: 'Journal of East China Normal University (Philosophy and Social Sciences)',
    year: '2025',
    description: 'Explores the evolution of governance paradigms for open-source AI in terms of ethics-technology co-construction.',
    link: 'https://xbzs.ecnu.edu.cn/CN/10.16382/j.cnki.1000-5579.2025.04.002',
    category: 'Theoretical Research',
    license: 'Academic Journal',
  },
  {
    id: 4,
    title: 'Development of AI Ethics Principles and Governance Technologies in China',
    authors: 'Chinese Academy of Engineering',
    journal: 'Engineering',
    year: '2024',
    description: 'Explores the current state and challenges of AI ethics principles and governance technology development in China.',
    link: 'https://www.engineering.org.cn/engi/CN/1159917544754700874',
    category: 'Review',
    license: 'Academic Journal',
  },
];

// Open Access Journals
const openAccessJournals = [
  {
    id: 1,
    name: 'Journal of Artificial Intelligence Research (JAIR)',
    description: 'An open-access peer-reviewed journal published by AI Access Foundation, covering research across all areas of artificial intelligence.',
    link: 'https://www.jair.org/',
    focus: 'AI Research',
  },
  {
    id: 2,
    name: 'Journal of Machine Learning Research (JMLR)',
    description: 'Covers the latest research in machine learning, fully open access.',
    link: 'https://www.jmlr.org/',
    focus: 'Machine Learning',
  },
  {
    id: 3,
    name: 'AI & Society',
    description: 'A quarterly journal published by Springer, covering all aspects of artificial intelligence and its impact on society.',
    link: 'https://link.springer.com/journal/146',
    focus: 'AI & Society',
  },
  {
    id: 4,
    name: 'arXiv AI Ethics',
    description: 'A collection of AI ethics-related preprint papers on arXiv, open access.',
    link: 'https://arxiv.org/list/cs.AI/recent',
    focus: 'AI Ethics',
  },
];

type TabType = 'regulations' | 'ethics' | 'research' | 'journals';

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('regulations');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://byvibe.ai';

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Governance & Legislation',
    description: 'Comprehensive collection of AI governance regulations, ethical guidelines, and research papers.',
    url: `${baseUrl}/governance`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...regulations.map((reg, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            headline: reg.title,
            description: reg.description,
            url: reg.link,
          },
        })),
      ],
    },
  };

  return (
    <>
      <StructuredData />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
      
      <Navbar 
        onViewChange={(view) => {
          if (view === 'home') {
            window.location.href = '/';
          } else if (view === 'directory') {
            window.location.href = '/?view=directory';
          }
        }} 
        onWaitlistClick={() => {
          window.location.href = '/#waitlist-form';
        }} 
      />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 border-b border-border bg-gradient-to-b from-background to-surface/30">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">
              <Shield className="w-3 h-3" />
              Global AI Governance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              AI Governance & Legislation
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-6">
              A comprehensive collection of global AI governance regulations, ethical guidelines, and high-quality open-access research to promote responsible artificial intelligence development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 px-4 md:px-6 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
            <button
              onClick={() => setActiveTab('regulations')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors flex items-center gap-2 ${
                activeTab === 'regulations'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <Scale className="w-4 h-4" />
              Regulations & Policies
            </button>
            <button
              onClick={() => setActiveTab('ethics')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors flex items-center gap-2 ${
                activeTab === 'ethics'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              Ethical Guidelines
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors flex items-center gap-2 ${
                activeTab === 'research'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Research Papers
            </button>
            <button
              onClick={() => setActiveTab('journals')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors flex items-center gap-2 ${
                activeTab === 'journals'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Open Access Journals
            </button>
          </div>

          {/* Regulations Tab */}
          {activeTab === 'regulations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regulations.map((regulation, index) => (
                <motion.div
                  key={regulation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 border border-border bg-surface rounded hover:border-blue-500/30 transition-all group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                      {regulation.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                      {regulation.category}
                    </span>
                    <span className="text-[10px] text-gray-600">{regulation.date}</span>
                  </div>
                  <h3 className="text-white font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {regulation.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">
                    {regulation.description}
                  </p>
                  <a
                    href={regulation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-auto pt-3 border-t border-border"
                  >
                    <span>View Original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}

          {/* Ethics Tab */}
          {activeTab === 'ethics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ethicsPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 border border-border bg-surface rounded hover:border-blue-500/30 transition-all group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                      {principle.organization}
                    </span>
                  </div>
                  <h3 className="text-white font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {principle.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">
                    {principle.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {principle.principles.map((p, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 bg-black/50 text-gray-400 border border-border rounded"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <a
                    href={principle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-auto pt-3 border-t border-border"
                  >
                    <span>View Original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}

          {/* Research Tab */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              {researchPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 border border-border bg-surface rounded hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded">
                          {paper.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                          {paper.license}
                        </span>
                        <span className="text-[10px] text-gray-600">{paper.year}</span>
                      </div>
                      <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        {paper.authors} · {paper.journal}
                      </p>
                      <p className="text-sm text-text-muted leading-relaxed mb-4">
                        {paper.description}
                      </p>
                    </div>
                  </div>
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors pt-3 border-t border-border"
                  >
                    <span>查看原文</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}

          {/* Journals Tab */}
          {activeTab === 'journals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openAccessJournals.map((journal, index) => (
                <motion.div
                  key={journal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 border border-border bg-surface rounded hover:border-blue-500/30 transition-all group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                      {journal.focus}
                    </span>
                  </div>
                  <h3 className="text-white font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {journal.name}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">
                    {journal.description}
                  </p>
                  <a
                    href={journal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-auto pt-3 border-t border-border"
                  >
                    <span>Visit Journal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Copyright Notice */}
      <section className="py-8 px-4 md:px-6 border-t border-border bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3 p-4 bg-black/50 border border-border rounded">
            <Globe className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-text-muted leading-relaxed">
              <p className="font-semibold text-white mb-2">Copyright Notice & Fair Use</p>
              <p className="mb-2">
                All content collected on this page comes from publicly accessible official sources, academic journals, and open-access research platforms. All republished content follows these principles:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                <li>All regulations and policy documents are linked to official sources, respecting original copyright</li>
                <li>Academic papers and research come from open-access journals or preprint platforms (such as arXiv), following open licenses such as CC BY</li>
                <li>All content clearly indicates source, author, and publication date</li>
                <li>This page is for educational and information dissemination purposes only, not for commercial use</li>
                <li>If you have any copyright questions about any content, please contact us: make@byvibe.ai</li>
              </ul>
              <p className="text-[10px] text-gray-600 mt-3">
                Last updated: January 2025 | ByVibe.ai is committed to promoting responsible artificial intelligence development
              </p>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </>
  );
}
