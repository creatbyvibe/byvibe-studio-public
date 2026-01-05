'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Scale, BookOpen, Shield, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// 法规与政策
const regulations = [
  {
    id: 1,
    region: 'EUROPEAN UNION',
    title: 'EU AI Act',
    description: '欧盟人工智能法案，全面规范人工智能的开发和使用，是全球首个全面的AI法规框架。',
    link: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    date: '2024年3月',
    category: '法规',
  },
  {
    id: 2,
    region: 'UNITED STATES',
    title: 'AI Executive Order',
    description: '美国人工智能行政命令，旨在确保AI的安全、可靠和可信发展。',
    link: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',
    date: '2023年10月',
    category: '行政命令',
  },
  {
    id: 3,
    region: 'CHINA',
    title: '生成式人工智能服务管理暂行办法',
    description: '中国对生成式人工智能服务的监管措施，要求AI服务提供者履行安全评估、内容审核等义务。',
    link: 'http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm',
    date: '2023年7月',
    category: '部门规章',
  },
  {
    id: 4,
    region: 'CHINA',
    title: '人工智能伦理治理指引（上海）',
    description: '上海首创"伦理影响评估"制度，要求AI企业在产品上线前提交伦理风险报告，重点评估数据隐私、算法偏见和内容安全等风险。',
    link: 'https://www.umcn.cc/home/article/detail/id/46.html',
    date: '2025年7月',
    category: '地方性指引',
  },
  {
    id: 5,
    region: 'UNITED STATES',
    title: 'Algorithmic Accountability Act',
    description: '算法问责法案，要求公司评估其自动化系统的影响，确保公平性和透明度。',
    link: 'https://www.congress.gov/bill/116th-congress/house-bill/2231',
    date: '2019年',
    category: '法案',
  },
];

// 伦理准则
const ethicsPrinciples = [
  {
    id: 1,
    organization: 'UNESCO',
    title: '人工智能伦理建议书',
    description: '联合国教科文组织发布的AI伦理建议书，强调透明性、责任制和隐私保护等核心原则。',
    link: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics',
    principles: ['透明性', '责任制', '隐私保护', '公平性', '人类尊严'],
  },
  {
    id: 2,
    organization: 'IEEE',
    title: 'Ethically Aligned Design',
    description: 'IEEE发布的人工智能伦理设计标准和指南，为AI系统的伦理设计提供框架。',
    link: 'https://ethicsinaction.ieee.org/',
    principles: ['人类福祉', '责任', '透明度', '教育和意识'],
  },
  {
    id: 3,
    organization: 'Montreal Declaration',
    title: '蒙特利尔人工智能伦理宣言',
    description: '提出了人工智能开发和使用的伦理原则，强调负责任的发展。',
    link: 'https://www.montrealdeclaration-responsibleai.com/',
    principles: ['福祉', '自主性', '正义', '隐私', '知识'],
  },
  {
    id: 4,
    organization: 'China',
    title: '新一代人工智能治理原则',
    description: '中国国家新一代人工智能治理专业委员会发布的治理原则和框架。',
    link: 'https://www.most.gov.cn/kjbgz/201906/t20190617_147107.html',
    principles: ['和谐友好', '公平公正', '包容共享', '尊重隐私', '安全可控'],
  },
];

// 开源期刊研究
const researchPapers = [
  {
    id: 1,
    title: 'Worldwide AI Ethics: a review of 200 guidelines and recommendations for AI governance',
    authors: 'Anna Jobin, Marcello Ienca, Effy Vayena',
    journal: 'arXiv',
    year: '2022',
    description: '对全球200份AI治理政策和伦理指南的元分析，识别了17项普遍认可的原则。',
    link: 'https://arxiv.org/abs/2206.11922',
    category: '元分析',
    license: 'CC BY 4.0',
  },
  {
    id: 2,
    title: 'AI Ethics: An Empirical Study on the Views of Practitioners and Lawmakers',
    authors: 'Various Authors',
    journal: 'arXiv',
    year: '2022',
    description: '调查99位来自20个国家的AI从业者和立法者的研究，探讨了AI伦理原则和相关挑战。',
    link: 'https://arxiv.org/abs/2207.01493',
    category: '实证研究',
    license: 'CC BY 4.0',
  },
  {
    id: 3,
    title: '开源人工智能"伦理－技术共构"的治理范式演进',
    authors: '华东师范大学研究团队',
    journal: '华东师范大学学报（哲学社会科学版）',
    year: '2025',
    description: '探讨了开源AI在伦理与技术共构方面的治理范式演进。',
    link: 'https://xbzs.ecnu.edu.cn/CN/10.16382/j.cnki.1000-5579.2025.04.002',
    category: '理论研究',
    license: '学术期刊',
  },
  {
    id: 4,
    title: '中国人工智能伦理原则及治理技术发展',
    authors: '中国工程院',
    journal: 'Engineering',
    year: '2024',
    description: '探讨了中国在人工智能伦理原则和治理技术发展方面的现状和挑战。',
    link: 'https://www.engineering.org.cn/engi/CN/1159917544754700874',
    category: '综述',
    license: '学术期刊',
  },
];

// 优质开源期刊
const openAccessJournals = [
  {
    id: 1,
    name: 'Journal of Artificial Intelligence Research (JAIR)',
    description: '由AI Access Foundation出版的开放获取同行评审期刊，涵盖人工智能各领域的研究。',
    link: 'https://www.jair.org/',
    focus: 'AI研究',
  },
  {
    id: 2,
    name: 'Journal of Machine Learning Research (JMLR)',
    description: '涵盖机器学习领域的最新研究，完全开放获取。',
    link: 'https://www.jmlr.org/',
    focus: '机器学习',
  },
  {
    id: 3,
    name: 'AI & Society',
    description: '由Springer出版的季刊，涵盖人工智能及其对社会影响的各个方面。',
    link: 'https://link.springer.com/journal/146',
    focus: 'AI与社会',
  },
  {
    id: 4,
    name: 'arXiv AI Ethics',
    description: 'arXiv上的AI伦理相关预印本论文集合，开放获取。',
    link: 'https://arxiv.org/list/cs.AI/recent',
    focus: 'AI伦理',
  },
];

type TabType = 'regulations' | 'ethics' | 'research' | 'journals';

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('regulations');

  return (
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
              汇集全球AI治理法规、伦理准则和优质开源研究，促进负责任的人工智能发展。
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
              法规与政策
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
              伦理准则
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
              研究论文
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
              开源期刊
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
                    <span>查看原文</span>
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
                    <span>查看原文</span>
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
                    <span>访问期刊</span>
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
              <p className="font-semibold text-white mb-2">版权声明与合理使用</p>
              <p className="mb-2">
                本页面收集的内容均来自公开可访问的官方来源、学术期刊和开放获取研究平台。所有转载内容均遵循以下原则：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                <li>所有法规和政策文件均链接至官方发布源，尊重原始版权</li>
                <li>学术论文和研究均来自开放获取（Open Access）期刊或预印本平台（如arXiv），遵循CC BY等开放许可协议</li>
                <li>所有内容均明确标注来源、作者和发布日期</li>
                <li>本页面仅用于教育和信息传播目的，不用于商业用途</li>
                <li>如对任何内容的版权有疑问，请联系我们：make@byvibe.ai</li>
              </ul>
              <p className="text-[10px] text-gray-600 mt-3">
                最后更新：2025年1月 | ByVibe.ai 致力于促进负责任的人工智能发展
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
