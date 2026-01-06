'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Loader2, Check, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Artifact, ProjectPhase } from '@/types/supabase';
import ErrorModal from '@/components/ErrorModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ErrorHandler } from '@/lib/utils/error-handler';

interface StackPhaseProps {
  projectId: string;
  artifact: Artifact | undefined;
  scopeContext: any;
  onArtifactUpdate: () => void;
}

interface StackContent {
  frontend: string[];
  backend: string[];
  database: string[];
  deployment: string[];
  additional: string[];
}

const techOptions = {
  frontend: [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Remix',
    'Astro', 'Solid.js', 'Qwik', 'Vanilla JS'
  ],
  backend: [
    'Node.js', 'Python (FastAPI)', 'Python (Django)', 'Go', 'Rust',
    'Java (Spring)', 'Ruby on Rails', 'PHP (Laravel)', 'C# (.NET)'
  ],
  database: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
    'Supabase', 'Firebase', 'PlanetScale', 'Neon'
  ],
  deployment: [
    'Vercel', 'Cloudflare Pages', 'Netlify', 'AWS', 'Google Cloud',
    'Railway', 'Render', 'Fly.io', 'Docker'
  ],
  additional: [
    'TypeScript', 'Tailwind CSS', 'Prisma', 'tRPC', 'GraphQL',
    'WebSockets', 'Stripe', 'Auth0', 'Sentry'
  ],
};

export default function StackPhase({ projectId, artifact, scopeContext, onArtifactUpdate }: StackPhaseProps) {
  const [content, setContent] = useState<StackContent>({
    frontend: [],
    backend: [],
    database: [],
    deployment: [],
    additional: [],
  });
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [validating, setValidating] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as StackContent;
      setContent(parsed);
    }
  }, [artifact]);

  useEffect(() => {
    // Auto-validate when content changes (debounced)
    const timeoutId = setTimeout(() => {
      if (Object.values(content).some(arr => arr.length > 0)) {
        validateStack();
      }
    }, 1000); // Debounce validation by 1 second

    return () => clearTimeout(timeoutId);
  }, [content]);

  const loadRecommendations = async () => {
    if (!scopeContext) {
      setErrorModal({ isOpen: true, message: 'Please complete the Scope phase first to get recommendations.' });
      return;
    }

    setLoadingRecommendations(true);
    try {
      const response = await fetch('/api/studio/recommend-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: scopeContext }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendations(data);
      setShowRecommendations(true);
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'StackPhase.recommendations');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const validateStack = async () => {
    setValidating(true);
    try {
      const response = await fetch('/api/studio/validate-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stack: content,
          scope: scopeContext,
        }),
      });

      const data = await response.json();
      setValidationResult(data);
    } catch (error) {
      // Validation errors are non-critical
      console.error('Validation error:', error);
    } finally {
      setValidating(false);
    }
  };

  const applyRecommendation = (category: keyof StackContent, techName: string) => {
    if (artifact?.is_locked) return;
    
    if (!content[category].includes(techName)) {
      toggleTech(category, techName);
    }
  };

  const toggleTech = (category: keyof StackContent, tech: string) => {
    if (artifact?.is_locked) return;
    
    setContent((prev) => {
      const current = prev[category];
      const newList = current.includes(tech)
        ? current.filter((t) => t !== tech)
        : [...current, tech];
      return { ...prev, [category]: newList };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const artifactData = {
        project_id: projectId,
        phase: 'stack' as ProjectPhase,
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
      const appError = ErrorHandler.handleFetchError(error, 'StackPhase.save');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!artifact) {
      setErrorModal({ isOpen: true, message: 'Please save the technology stack selection first.' });
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
      const appError = ErrorHandler.handleFetchError(error, 'StackPhase.lock');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setLocking(false);
    }
  };

  const isLocked = artifact?.is_locked || false;
  const hasSelection = Object.values(content).some(arr => arr.length > 0);

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      {!isLocked && scopeContext && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">AI Stack Recommendations</h3>
            </div>
            <button
              onClick={loadRecommendations}
              disabled={loadingRecommendations}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:text-blue-400/50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              {loadingRecommendations ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </div>
          
          {recommendations && showRecommendations && (
            <div className="space-y-4 mt-4">
              {recommendations.summary && (
                <div className="p-3 bg-black/50 border border-border rounded text-sm text-text-muted">
                  {recommendations.summary}
                </div>
              )}
              
              {Object.entries(recommendations.recommendations || {}).map(([category, items]: [string, any]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-white mb-2 capitalize">{category}</h4>
                  <div className="space-y-2">
                    {Array.isArray(items) && items.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-black/50 border border-border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{item.name}</span>
                          <button
                            onClick={() => applyRecommendation(category as keyof StackContent, item.name)}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mb-2">{item.reason}</p>
                        {item.pros && item.pros.length > 0 && (
                          <div className="text-xs">
                            <span className="text-green-400">Pros:</span>
                            <ul className="list-disc list-inside text-text-muted ml-2">
                              {item.pros.map((pro: string, pIdx: number) => (
                                <li key={pIdx}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {recommendations.compatibility?.warnings && recommendations.compatibility.warnings.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold">Compatibility Notes</span>
                  </div>
                  <ul className="text-xs text-yellow-300/80 list-disc list-inside space-y-1">
                    {recommendations.compatibility.warnings.map((warning: string, idx: number) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Validation Warnings */}
      {validationResult && validationResult.warnings && validationResult.warnings.length > 0 && (
        <div className={`p-4 rounded ${
          validationResult.valid 
            ? 'bg-yellow-500/10 border border-yellow-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className={`flex items-center gap-2 text-sm mb-2 ${
            validationResult.valid ? 'text-yellow-400' : 'text-red-400'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">
              {validationResult.valid ? 'Stack Validation Warnings' : 'Stack Validation Issues'}
            </span>
          </div>
          <ul className={`text-xs space-y-2 ${
            validationResult.valid ? 'text-yellow-300/80' : 'text-red-300/80'
          }`}>
            {validationResult.warnings.map((warning: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`mt-0.5 ${
                  warning.severity === 'high' ? 'text-red-400' :
                  warning.severity === 'medium' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>•</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{warning.message}</span>
                    {warning.severity && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        warning.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        warning.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {warning.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {warning.suggestion && (
                    <div className={`mt-0.5 ${
                      validationResult.valid ? 'text-yellow-400/70' : 'text-red-400/70'
                    }`}>
                      💡 {warning.suggestion}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Components */}
      {validationResult && validationResult.missing && validationResult.missing.length > 0 && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
            <Info className="w-4 h-4" />
            <span className="font-semibold">Recommended Additions</span>
          </div>
          <ul className="text-xs text-blue-300/80 space-y-2">
            {validationResult.missing.map((item: any, idx: number) => {
              const category = item.category as keyof StackContent;
              const techExists = techOptions[category]?.includes(item.item);
              return (
                <li key={idx} className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="font-medium text-white">{item.item}</span>
                    <span className="text-blue-400/60 ml-2">({item.category})</span>
                    <div className="text-blue-400/70 mt-0.5">{item.reason}</div>
                  </div>
                  {techExists && (
                    <button
                      onClick={() => applyRecommendation(category, item.item)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                    >
                      Add
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {validationResult && validationResult.recommendations && validationResult.recommendations.length > 0 && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
          <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">AI Recommendations</span>
          </div>
          <ul className="text-xs text-purple-300/80 space-y-2">
            {validationResult.recommendations.map((rec: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <div>
                  <span className="font-medium">{rec.action}: {rec.item}</span>
                  <div className="text-purple-400/70 mt-0.5">{rec.reason}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Success */}
      {validationResult && validationResult.valid && hasSelection && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">Stack validated successfully</span>
          </div>
        </div>
      )}
      {/* Frontend */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          Frontend Framework
        </label>
        <div className="flex flex-wrap gap-2">
          {techOptions.frontend.map((tech) => {
            const isSelected = content.frontend.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech('frontend', tech)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded border text-sm transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    : 'bg-background text-text-muted border-border hover:border-gray-600'
                } disabled:opacity-50`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Backend */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          Backend Framework
        </label>
        <div className="flex flex-wrap gap-2">
          {techOptions.backend.map((tech) => {
            const isSelected = content.backend.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech('backend', tech)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded border text-sm transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    : 'bg-background text-text-muted border-border hover:border-gray-600'
                } disabled:opacity-50`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Database */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          Database
        </label>
        <div className="flex flex-wrap gap-2">
          {techOptions.database.map((tech) => {
            const isSelected = content.database.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech('database', tech)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded border text-sm transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    : 'bg-background text-text-muted border-border hover:border-gray-600'
                } disabled:opacity-50`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deployment */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          Deployment Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {techOptions.deployment.map((tech) => {
            const isSelected = content.deployment.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech('deployment', tech)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded border text-sm transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    : 'bg-background text-text-muted border-border hover:border-gray-600'
                } disabled:opacity-50`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          Additional Tools
        </label>
        <div className="flex flex-wrap gap-2">
          {techOptions.additional.map((tech) => {
            const isSelected = content.additional.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech('additional', tech)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded border text-sm transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    : 'bg-background text-text-muted border-border hover:border-gray-600'
                } disabled:opacity-50`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {!isLocked && (
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
            Technology stack is finalized. You can proceed to the next phase to design the architecture.
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
