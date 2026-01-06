'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Lock, Loader2, RefreshCw, Download, Eye, Code, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Artifact, ProjectPhase } from '@/types/supabase';
import ErrorModal from '@/components/ErrorModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ErrorHandler } from '@/lib/utils/error-handler';

interface DesignPhaseProps {
  projectId: string;
  artifact: Artifact | undefined;
  scopeContext: any;
  stackContext: any;
  onArtifactUpdate: () => void;
}

interface DesignContent {
  diagram: string;
  description: string;
  components: string[];
  dataFlow: string;
  systemDiagram?: string;
  dataFlowDiagram?: string;
  deploymentDiagram?: string;
}

type ViewType = 'system' | 'dataflow' | 'deployment' | 'code';

export default function DesignPhase({ projectId, artifact, scopeContext, stackContext, onArtifactUpdate }: DesignPhaseProps) {
  const [content, setContent] = useState<DesignContent>({
    diagram: '',
    description: '',
    components: [],
    dataFlow: '',
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [activeView, setActiveView] = useState<ViewType>('system');
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as DesignContent;
      setContent(parsed);
    }
  }, [artifact]);

  // Render Mermaid diagram
  useEffect(() => {
    if (content.diagram && mermaidRef.current && typeof window !== 'undefined' && activeView !== 'code') {
      const renderMermaid = async () => {
        try {
          setMermaidError(null);
          const mermaidModule = await import('mermaid');
          const mermaid = mermaidModule.default;
          
          mermaidRef.current!.innerHTML = '';
          
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

          const diagramId = `mermaid-diagram-${Date.now()}`;
          const { svg } = await mermaid.render(diagramId, content.diagram);
          
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (error: any) {
          console.error('Mermaid rendering error:', error);
          setMermaidError(error.message || 'Failed to render diagram');
        }
      };

      renderMermaid();
    }
  }, [content.diagram, activeView]);

  const handleGenerate = async (viewType?: ViewType) => {
    if (!scopeContext || !stackContext) {
      setErrorModal({ isOpen: true, message: 'Please complete the Scope and Stack phases first.' });
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/studio/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          scope: scopeContext,
          stack: stackContext,
          viewType: viewType || activeView,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setContent((prev) => ({
        ...prev,
        diagram: data.diagram,
        [viewType === 'dataflow' ? 'dataFlowDiagram' : viewType === 'deployment' ? 'deploymentDiagram' : 'systemDiagram']: data.diagram,
      }));
    } catch (error: any) {
      const appError = ErrorHandler.handleFetchError(error, 'DesignPhase.generate');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleValidate = async () => {
    if (!content.diagram) {
      setErrorModal({ isOpen: true, message: 'Please generate a diagram first.' });
      return;
    }

    try {
      setValidating(true);
      const response = await fetch('/api/studio/validate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagram: content.diagram,
          scope: scopeContext,
          stack: stackContext,
        }),
      });

      const data = await response.json();
      setValidationResult(data);
    } catch (error: any) {
      const appError = ErrorHandler.handleFetchError(error, 'DesignPhase.validate');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setValidating(false);
    }
  };

  const getCurrentDiagram = (): string => {
    if (activeView === 'dataflow' && content.dataFlowDiagram) {
      return content.dataFlowDiagram;
    }
    if (activeView === 'deployment' && content.deploymentDiagram) {
      return content.deploymentDiagram;
    }
    if (activeView === 'system' && content.systemDiagram) {
      return content.systemDiagram;
    }
    return content.diagram || '';
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const artifactData = {
        project_id: projectId,
        phase: 'design' as ProjectPhase,
        content: content,
        is_locked: false,
      };

      if (artifact) {
        const { error } = await supabase
          .from('artifacts')
          .update(artifactData)
          .eq('id', artifact.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('artifacts')
          .insert(artifactData);

        if (error) throw error;
      }

      onArtifactUpdate();
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'DesignPhase.save');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!artifact || !content.diagram) {
      setErrorModal({ isOpen: true, message: 'Please generate and save the architecture diagram first.' });
      return;
    }

    setConfirmModal({ isOpen: true });
  };

  const confirmLock = async () => {
    if (!artifact) return;

    try {
      setLocking(true);
      const { error } = await supabase
        .from('artifacts')
        .update({ is_locked: true })
        .eq('id', artifact.id);

      if (error) throw error;

      onArtifactUpdate();
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'DesignPhase.lock');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setLocking(false);
    }
  };

  const isLocked = artifact?.is_locked || false;

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      {!isLocked && (
        <div className="flex gap-2 border-b border-border">
          {[
            { id: 'system' as ViewType, label: 'System Architecture', icon: Layers },
            { id: 'dataflow' as ViewType, label: 'Data Flow', icon: Eye },
            { id: 'deployment' as ViewType, label: 'Deployment', icon: Download },
            { id: 'code' as ViewType, label: 'Code View', icon: Code },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
                activeView === view.id
                  ? 'text-white border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              <view.icon className="w-3.5 h-3.5 inline mr-1" />
              {view.label}
            </button>
          ))}
        </div>
      )}

      {/* Generate Buttons */}
      {!isLocked && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleGenerate('system')}
            disabled={generating || !scopeContext || !stackContext}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Generate System Diagram
              </>
            )}
          </button>
          {activeView === 'dataflow' && (
            <button
              onClick={() => handleGenerate('dataflow')}
              disabled={generating || !scopeContext || !stackContext}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Generate Data Flow
                </>
              )}
            </button>
          )}
          {activeView === 'deployment' && (
            <button
              onClick={() => handleGenerate('deployment')}
              disabled={generating || !scopeContext || !stackContext}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Generate Deployment
                </>
              )}
            </button>
          )}
          {content.diagram && (
            <button
              onClick={handleValidate}
              disabled={validating}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {validating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Validate Architecture
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Validation Results */}
      {validationResult && (
        <div className={`p-4 rounded border ${
          validationResult.valid 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {validationResult.valid ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            )}
            <span className={`text-sm font-semibold ${
              validationResult.valid ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {validationResult.valid ? 'Architecture Validated' : 'Validation Warnings'}
            </span>
          </div>
          {validationResult.summary && (
            <p className="text-xs text-text-muted mb-2">{validationResult.summary}</p>
          )}
          {validationResult.warnings && validationResult.warnings.length > 0 && (
            <ul className="text-xs text-yellow-300/80 list-disc list-inside space-y-1">
              {validationResult.warnings.map((warning: string, idx: number) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Diagram Display */}
      {getCurrentDiagram() && (
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            {activeView === 'system' && 'System Architecture Diagram'}
            {activeView === 'dataflow' && 'Data Flow Diagram'}
            {activeView === 'deployment' && 'Deployment Diagram'}
            {activeView === 'code' && 'Mermaid Code'}
          </label>
          
          {activeView === 'code' ? (
            <div className="bg-background border border-border rounded p-4">
              <div className="mt-4">
                <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap overflow-x-auto">
                  {getCurrentDiagram()}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-background border border-border rounded p-4 overflow-x-auto">
              <div ref={mermaidRef} className="min-h-[300px] flex items-center justify-center">
                {mermaidError && (
                  <div className="text-red-400 text-sm">{mermaidError}</div>
                )}
              </div>
            </div>
          )}
          
          <p className="text-xs text-text-dim mt-2">
            {activeView === 'code' 
              ? 'Mermaid diagram code. Copy and paste into any Mermaid-compatible editor.'
              : 'This Mermaid diagram can be rendered in editors that support Mermaid (such as GitHub, Notion, etc.)'
            }
          </p>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Architecture Notes
        </label>
        <textarea
          value={content.description}
          onChange={(e) => setContent({ ...content, description: e.target.value })}
          disabled={isLocked}
          placeholder="Describe key architectural decisions and design rationale..."
          className="w-full h-32 bg-background border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 resize-none"
        />
      </div>

      {/* Actions */}
      {!isLocked && content.diagram && (
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
          {artifact && (
            <button
              onClick={handleLock}
              disabled={locking}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {locking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Locking...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Lock & Proceed to Next Phase
                </>
              )}
            </button>
          )}
        </div>
      )}

      {isLocked && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 text-green-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Phase Locked</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Architecture design is finalized. You can proceed to the next phase to generate code.
          </p>
        </div>
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmLock}
        title="Lock Phase"
        message="This phase will be locked and cannot be edited. Are you sure you want to continue?"
        confirmText="Lock"
        cancelText="Cancel"
        confirmVariant="primary"
      />
    </div>
  );
}
