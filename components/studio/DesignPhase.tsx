'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Loader2, RefreshCw, Download } from 'lucide-react';
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
}

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

  const handleGenerate = async () => {
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setContent((prev) => ({
        ...prev,
        diagram: data.diagram,
      }));
    } catch (error: any) {
      const appError = ErrorHandler.handleFetchError(error, 'DesignPhase.generate');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setGenerating(false);
    }
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
      {/* Generate Button */}
      {!isLocked && (
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
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
                Generate Architecture Diagram
              </>
            )}
          </button>
        </div>
      )}

      {/* Diagram Display */}
      {content.diagram && (
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Architecture Diagram (Mermaid)
          </label>
          <div className="bg-background border border-border rounded p-4">
            <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap overflow-x-auto">
              {content.diagram}
            </pre>
          </div>
          <p className="text-xs text-text-dim mt-2">
            This Mermaid diagram can be rendered in editors that support Mermaid (such as GitHub, Notion, etc.)
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
