'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Unlock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Artifact, ProjectPhase } from '@/types/supabase';
import ErrorModal from '@/components/ErrorModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ErrorHandler } from '@/lib/utils/error-handler';

interface ScopePhaseProps {
  projectId: string;
  artifact: Artifact | undefined;
  onArtifactUpdate: () => void;
}

interface ScopeContent {
  description: string;
  coreFeatures: string[];
  targetUsers: string;
  useCases: string[];
  successCriteria: string;
}

export default function ScopePhase({ projectId, artifact, onArtifactUpdate }: ScopePhaseProps) {
  const [content, setContent] = useState<ScopeContent>({
    description: '',
    coreFeatures: [''],
    targetUsers: '',
    useCases: [''],
    successCriteria: '',
  });
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as ScopeContent;
      setContent(parsed);
    }
  }, [artifact]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const artifactData = {
        project_id: projectId,
        phase: 'scope' as ProjectPhase,
        content: content,
        is_locked: false,
      };

      if (artifact) {
        // Update existing
        const { error } = await supabase
          .from('artifacts')
          .update(artifactData)
          .eq('id', artifact.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('artifacts')
          .insert(artifactData);

        if (error) throw error;
      }

      onArtifactUpdate();
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'ScopePhase.save');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!artifact) {
      setErrorModal({ isOpen: true, message: 'Please save the project scope first.' });
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

      // Update project status
      await supabase
        .from('projects')
        .update({ status: 'in_progress' })
        .eq('id', projectId);

      onArtifactUpdate();
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'ScopePhase.lock');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setLocking(false);
    }
  };

  const addFeature = () => {
    setContent({ ...content, coreFeatures: [...content.coreFeatures, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...content.coreFeatures];
    newFeatures[index] = value;
    setContent({ ...content, coreFeatures: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = content.coreFeatures.filter((_, i) => i !== index);
    setContent({ ...content, coreFeatures: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const addUseCase = () => {
    setContent({ ...content, useCases: [...content.useCases, ''] });
  };

  const updateUseCase = (index: number, value: string) => {
    const newUseCases = [...content.useCases];
    newUseCases[index] = value;
    setContent({ ...content, useCases: newUseCases });
  };

  const removeUseCase = (index: number) => {
    const newUseCases = content.useCases.filter((_, i) => i !== index);
    setContent({ ...content, useCases: newUseCases.length > 0 ? newUseCases : [''] });
  };

  const isLocked = artifact?.is_locked || false;

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Project Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content.description}
          onChange={(e) => setContent({ ...content, description: e.target.value })}
          disabled={isLocked}
          placeholder="Describe your project idea... e.g., A habit tracker app that uses AI to remind and motivate users..."
          className="w-full h-32 bg-background border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 resize-none"
        />
        <p className="text-xs text-text-dim mt-1">
          Describe the core concept, goals, and value proposition of the project
        </p>
      </div>

      {/* Core Features */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Core Features
        </label>
        <div className="space-y-2">
          {content.coreFeatures.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                disabled={isLocked}
                placeholder={`Feature ${index + 1}...`}
                className="flex-1 bg-background border border-border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
              />
              {!isLocked && content.coreFeatures.length > 1 && (
                <button
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          {!isLocked && (
            <button
              onClick={addFeature}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Feature
            </button>
          )}
        </div>
      </div>

      {/* Target Users */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Target Users
        </label>
        <input
          type="text"
          value={content.targetUsers}
          onChange={(e) => setContent({ ...content, targetUsers: e.target.value })}
          disabled={isLocked}
          placeholder="e.g., Young people who want to build good habits, professionals who need time management..."
          className="w-full bg-background border border-border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
        />
      </div>

      {/* Use Cases */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Use Cases
        </label>
        <div className="space-y-2">
          {content.useCases.map((useCase, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={useCase}
                onChange={(e) => updateUseCase(index, e.target.value)}
                disabled={isLocked}
                placeholder={`Use case ${index + 1}...`}
                className="flex-1 bg-background border border-border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
              />
              {!isLocked && content.useCases.length > 1 && (
                <button
                  onClick={() => removeUseCase(index)}
                  className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          {!isLocked && (
            <button
              onClick={addUseCase}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Use Case
            </button>
          )}
        </div>
      </div>

      {/* Success Criteria */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Success Criteria
        </label>
        <textarea
          value={content.successCriteria}
          onChange={(e) => setContent({ ...content, successCriteria: e.target.value })}
          disabled={isLocked}
          placeholder="e.g., Users can consistently use the app for more than 30 days, completing at least 80% of set goals..."
          className="w-full h-24 bg-background border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 resize-none"
        />
      </div>

      {/* Actions */}
      {!isLocked && (
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving || !content.description.trim()}
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
              disabled={locking || !content.description.trim()}
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
            Project scope is finalized. You can proceed to the next phase to choose the technology stack.
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
