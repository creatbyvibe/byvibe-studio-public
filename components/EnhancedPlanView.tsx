'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
  risks?: Risk[] | string;
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

type TabType = 'overview' | 'tasks' | 'roadmap' | 'architecture' | 'tech' | 'code' | 'deployment' | 'cost';

interface EnhancedPlanViewProps {
  plan: PlanResult;
}

export default function EnhancedPlanView({ plan }: EnhancedPlanViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Load and render Mermaid diagram
  useEffect(() => {
    if (activeTab === 'architecture' && plan.architecture_diagram && mermaidRef.current) {
      // Clear previous content
      mermaidRef.current.innerHTML = '';
      
      const loadMermaid = async () => {
        try {
          // Dynamically import mermaid (only on client side)
          if (typeof window === 'undefined') return;
          
          const mermaidModule = await import('mermaid');
          const mermaid = mermaidModule.default;
          
          // Initialize mermaid
          mermaid.initialize({ 
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              primaryColor: '#3b82f6',
              primaryTextColor: '#fff',
              primaryBorderColor: '#60a5fa',
              lineColor: '#9ca3af',
              secondaryColor: '#1e293b',
              tertiaryColor: '#0f172a',
            }
          });

          // Create a unique ID for this diagram
          const diagramId = `mermaid-diagram-${Date.now()}`;
          
          // Render the diagram
          const { svg } = await mermaid.render(diagramId, plan.architecture_diagram!);
          
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          // Fallback to code display
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<pre class="text-xs text-gray-400 font-mono whitespace-pre-wrap overflow-x-auto p-4">${plan.architecture_diagram}</pre>`;
          }
        }
      };

      loadMermaid();
    }
  }, [activeTab, plan.architecture_diagram]);

  const tabs: { id: TabType; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks', badge: plan.tasks?.length },
    { id: 'roadmap', label: 'Roadmap', badge: plan.roadmap?.length },
    { id: 'architecture', label: 'Architecture' },
    { id: 'tech', label: 'Tech Stack', badge: plan.tech_comparison?.length },
    { id: 'code', label: 'Code Preview', badge: plan.code_preview?.files.length },
    { id: 'deployment', label: 'Deployment' },
    { id: 'cost', label: 'Cost' },
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 border border-border text-xs bg-surface/50">
        <div className="p-3 border-r border-border">
          <div className="text-gray-500 uppercase mb-1">Difficulty</div>
          <div className="text-white font-semibold">{plan.difficulty || '-'}</div>
        </div>
        <div className="p-3 border-r border-border">
          <div className="text-gray-500 uppercase mb-1">Time Est.</div>
          <div className="text-white font-semibold">{plan.time_est || '-'}</div>
        </div>
        <div className="p-3">
          <div className="text-gray-500 uppercase mb-1">Stack</div>
          <div className="text-blue-400 truncate">{plan.tech_stack || '-'}</div>
        </div>
      </div>

      {plan.risks && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Risks</div>
          {Array.isArray(plan.risks) ? (
            plan.risks.map((risk, idx) => (
              <div key={idx} className={`p-3 border rounded ${
                risk.severity === 'High' ? 'border-red-500/50 bg-red-900/10' :
                risk.severity === 'Medium' ? 'border-yellow-500/50 bg-yellow-900/10' :
                'border-blue-500/50 bg-blue-900/10'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{risk.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    risk.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                    risk.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{risk.description}</p>
                <p className="text-[10px] text-gray-500">Mitigation: {risk.mitigation}</p>
              </div>
            ))
          ) : (
            <div className="p-3 border border-red-900/30 bg-red-900/10 text-red-400 text-xs rounded">
              {plan.risks}
            </div>
          )}
        </div>
      )}

      {plan.file_tree && (
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">File Structure</div>
          <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap bg-black p-3 rounded border border-border overflow-x-auto">
            {plan.file_tree}
          </pre>
        </div>
      )}

      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Generated Context</div>
        <div className="text-gray-400 text-xs whitespace-pre-wrap leading-relaxed bg-black p-3 rounded border border-border max-h-[200px] overflow-y-auto custom-scrollbar">
          {plan.cursor_prompt || '-'}
        </div>
      </div>
    </div>
  );

  const renderTasks = () => {
    if (!plan.tasks || plan.tasks.length === 0) {
      return <div className="text-xs text-gray-500 text-center py-8">No task breakdown available.</div>;
    }

    const tasksByPhase = plan.tasks.reduce((acc, task, idx) => {
      if (!acc[task.phase]) acc[task.phase] = [];
      acc[task.phase].push({ ...task, index: idx });
      return acc;
    }, {} as Record<string, (Task & { index: number })[]>);

    return (
      <div className="space-y-6">
        {Object.entries(tasksByPhase).map(([phase, tasks]) => (
          <div key={phase}>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{phase}</div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.index} className="p-3 border border-border bg-surface/30 rounded">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{task.title}</span>
                    <span className="text-[10px] text-gray-500">{task.estimated_hours}h</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{task.description}</p>
                  {task.dependencies.length > 0 && (
                    <div className="text-[10px] text-gray-500">
                      Depends on: {task.dependencies.map(d => `Task ${d + 1}`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRoadmap = () => {
    if (!plan.roadmap || plan.roadmap.length === 0) {
      return <div className="text-xs text-gray-500 text-center py-8">No roadmap available.</div>;
    }

    return (
      <div className="space-y-4">
        {plan.roadmap.map((item, idx) => (
          <div key={idx} className="border-l-2 border-blue-500/50 pl-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-400">Week {item.week}</span>
              <span className="text-xs font-semibold text-white">{item.milestone}</span>
            </div>
            <ul className="space-y-1">
              {item.deliverables.map((deliverable, dIdx) => (
                <li key={dIdx} className="text-xs text-gray-400 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
            {item.dependencies.length > 0 && (
              <div className="text-[10px] text-gray-500 mt-2">
                Depends on: Week {item.dependencies.join(', Week ')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderArchitecture = () => {
    if (!plan.architecture_diagram) {
      return <div className="text-xs text-gray-500 text-center py-8">No architecture diagram available.</div>;
    }

    return (
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">System Architecture</div>
        <div ref={mermaidRef} className="bg-black p-4 rounded border border-border min-h-[300px] flex items-center justify-center">
          {/* Mermaid will render here or fallback to code */}
        </div>
        <div className="mt-3 p-3 bg-surface/30 border border-border rounded">
          <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap overflow-x-auto">
            {plan.architecture_diagram}
          </pre>
        </div>
      </div>
    );
  };

  const renderTechComparison = () => {
    if (!plan.tech_comparison || plan.tech_comparison.length === 0) {
      return <div className="text-xs text-gray-500 text-center py-8">No tech comparison available.</div>;
    }

    return (
      <div className="space-y-6">
        {plan.tech_comparison.map((comparison, idx) => (
          <div key={idx}>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{comparison.category}</div>
            <div className="space-y-3">
              {comparison.options.map((option, oIdx) => (
                <div key={oIdx} className={`p-4 border rounded ${
                  option.recommendation === 'Recommended' 
                    ? 'border-green-500/50 bg-green-900/10' 
                    : 'border-border bg-surface/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{option.name}</span>
                    {option.recommendation === 'Recommended' && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded">Recommended</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="text-[10px] text-green-400 uppercase mb-1">Pros</div>
                      <ul className="space-y-1">
                        {option.pros.map((pro, pIdx) => (
                          <li key={pIdx} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[10px] text-red-400 uppercase mb-1">Cons</div>
                      <ul className="space-y-1">
                        {option.cons.map((con, cIdx) => (
                          <li key={cIdx} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">-</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCodePreview = () => {
    if (!plan.code_preview || !plan.code_preview.files || plan.code_preview.files.length === 0) {
      return <div className="text-xs text-gray-500 text-center py-8">No code preview available.</div>;
    }

    return (
      <div className="space-y-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Language: <span className="text-blue-400">{plan.code_preview.language}</span>
        </div>
        {plan.code_preview.files.map((file, idx) => (
          <div key={idx} className="border border-border rounded overflow-hidden">
            <div className="bg-surface/50 px-3 py-2 border-b border-border">
              <div className="text-xs font-mono text-gray-400">{file.path}</div>
              <div className="text-[10px] text-gray-500 mt-1">{file.description}</div>
            </div>
            <pre className="text-xs text-gray-300 font-mono p-3 bg-black overflow-x-auto custom-scrollbar">
              {file.snippet}
            </pre>
          </div>
        ))}
      </div>
    );
  };

  const renderDeployment = () => {
    if (!plan.deployment) {
      return <div className="text-xs text-gray-500 text-center py-8">No deployment plan available.</div>;
    }

    return (
      <div className="space-y-4">
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Strategy</div>
          <div className="text-sm text-white font-semibold">{plan.deployment.strategy}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Infrastructure</div>
          <div className="text-xs text-gray-400">{plan.deployment.infrastructure}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Steps</div>
          <ol className="space-y-2">
            {plan.deployment.steps.map((step, idx) => (
              <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-blue-400 font-semibold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="p-3 bg-blue-900/10 border border-blue-500/30 rounded">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Cost Estimate</div>
          <div className="text-sm text-white">{plan.deployment.cost_estimate}</div>
        </div>
      </div>
    );
  };

  const renderCost = () => {
    if (!plan.cost_breakdown) {
      return <div className="text-xs text-gray-500 text-center py-8">No cost breakdown available.</div>;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-border bg-surface/30 rounded">
            <div className="text-xs text-gray-500 uppercase mb-1">Development</div>
            <div className="text-sm text-white font-semibold">{plan.cost_breakdown.development}</div>
          </div>
          <div className="p-3 border border-border bg-surface/30 rounded">
            <div className="text-xs text-gray-500 uppercase mb-1">Infrastructure (Monthly)</div>
            <div className="text-sm text-white font-semibold">{plan.cost_breakdown.infrastructure}</div>
          </div>
          <div className="p-3 border border-border bg-surface/30 rounded">
            <div className="text-xs text-gray-500 uppercase mb-1">Maintenance (Monthly)</div>
            <div className="text-sm text-white font-semibold">{plan.cost_breakdown.maintenance}</div>
          </div>
          <div className="p-3 border border-blue-500/50 bg-blue-900/10 rounded">
            <div className="text-xs text-blue-400 uppercase mb-1">Total (First Year)</div>
            <div className="text-lg text-white font-bold">{plan.cost_breakdown.total_first_year}</div>
          </div>
        </div>
        {plan.cost_breakdown.notes && (
          <div className="p-3 bg-surface/30 border border-border rounded">
            <div className="text-xs text-gray-500">{plan.cost_breakdown.notes}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border bg-surface/30 px-2 pt-2 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'architecture' && renderArchitecture()}
        {activeTab === 'tech' && renderTechComparison()}
        {activeTab === 'code' && renderCodePreview()}
        {activeTab === 'deployment' && renderDeployment()}
        {activeTab === 'cost' && renderCost()}
      </div>
    </div>
  );
}
