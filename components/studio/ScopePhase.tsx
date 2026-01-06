'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Unlock, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
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
  // Default test content for quick testing
  const defaultContent: ScopeContent = {
    description: 'A habit tracker app that uses AI to remind and motivate users to build good habits. Users can set daily goals, track progress, and receive personalized AI suggestions.',
    coreFeatures: [
      'Daily habit tracking with visual progress indicators',
      'AI-powered reminders and motivation messages',
      'Personalized habit recommendations based on user behavior',
      'Social sharing and community challenges'
    ],
    targetUsers: 'Young professionals aged 25-35 who want to build consistent habits, students who need help with time management, and anyone looking to improve their daily routines.',
    useCases: [
      'User sets a goal to drink 8 glasses of water daily and receives AI reminders',
      'User tracks morning meditation streak and gets encouragement when maintaining consistency',
      'User receives personalized suggestions for new habits based on their current patterns'
    ],
    successCriteria: 'Users consistently use the app for more than 30 days, completing at least 80% of their set goals. User retention rate above 60% after 3 months. Average user completes 3+ habits per day.'
  };

  const [content, setContent] = useState<ScopeContent>(defaultContent);
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [showAIParser, setShowAIParser] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as ScopeContent;
      setContent(parsed);
    } else {
      // If no artifact, use default test content
      setContent(defaultContent);
    }
  }, [artifact]);

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

  const handleAIParse = async () => {
    if (!rawInput.trim() || rawInput.trim().length < 10) {
      setValidationErrors({ aiInput: 'Please enter at least 10 characters for AI parsing' });
      return;
    }

    setParsing(true);
    setValidationErrors({});

    try {
      const response = await fetch('/api/studio/parse-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: rawInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse scope');
      }

      // Merge parsed data with existing content (preserve user edits)
      setContent({
        description: data.description || content.description || '',
        coreFeatures: data.coreFeatures && data.coreFeatures.length > 0 
          ? data.coreFeatures 
          : (content.coreFeatures.length > 0 && content.coreFeatures[0] ? content.coreFeatures : ['']),
        targetUsers: data.targetUsers || content.targetUsers || '',
        useCases: data.useCases && data.useCases.length > 0 
          ? data.useCases 
          : (content.useCases.length > 0 && content.useCases[0] ? content.useCases : ['']),
        successCriteria: data.successCriteria || content.successCriteria || '',
      });

      setRawInput('');
      setShowAIParser(false);
      
      // Auto-validate after parsing
      setTimeout(() => {
        validateContent();
      }, 100);
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'ScopePhase.parse');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setParsing(false);
    }
  };

  const validateContent = (): boolean => {
    const errors: Record<string, string> = {};

    // Description validation
    if (!content.description.trim()) {
      errors.description = 'Project description is required';
    } else if (content.description.trim().length < 20) {
      errors.description = 'Description should be at least 20 characters (currently ' + content.description.trim().length + ')';
    } else if (content.description.trim().length > 2000) {
      errors.description = 'Description is too long (max 2000 characters)';
    }

    // Core features validation
    const validFeatures = content.coreFeatures.filter(f => f.trim().length > 0);
    if (validFeatures.length === 0) {
      errors.coreFeatures = 'At least one core feature is required';
    } else if (validFeatures.length < 2) {
      errors.coreFeatures = 'Consider adding more features (at least 2-3 recommended)';
    } else {
      // Check feature quality
      const shortFeatures = validFeatures.filter(f => f.trim().length < 5);
      if (shortFeatures.length > 0) {
        errors.coreFeatures = 'Some features are too brief. Please provide more detail.';
      }
    }

    // Target users validation
    if (!content.targetUsers.trim()) {
      errors.targetUsers = 'Target users description is required';
    } else if (content.targetUsers.trim().length < 10) {
      errors.targetUsers = 'Please provide a more detailed description of target users (at least 10 characters)';
    }

    // Use cases validation
    const validUseCases = content.useCases.filter(u => u.trim().length > 0);
    if (validUseCases.length === 0) {
      errors.useCases = 'At least one use case is required';
    } else if (validUseCases.length < 2) {
      errors.useCases = 'Consider adding more use cases (at least 2-3 recommended)';
    } else {
      // Check use case quality
      const shortUseCases = validUseCases.filter(u => u.trim().length < 10);
      if (shortUseCases.length > 0) {
        errors.useCases = 'Some use cases are too brief. Please provide more detail.';
      }
    }

    // Success criteria validation
    if (!content.successCriteria.trim()) {
      errors.successCriteria = 'Success criteria is required';
    } else if (content.successCriteria.trim().length < 20) {
      errors.successCriteria = 'Success criteria should be more detailed (at least 20 characters)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateContent()) {
      setErrorModal({ 
        isOpen: true, 
        message: 'Please fix validation errors before saving' 
      });
      return;
    }

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

      setValidationErrors({});
      onArtifactUpdate();
    } catch (error) {
      const appError = ErrorHandler.handleFetchError(error, 'ScopePhase.save');
      setErrorModal({ isOpen: true, message: appError.message });
    } finally {
      setSaving(false);
    }
  };

  const isLocked = artifact?.is_locked || false;
  const isComplete = validateContent();

  return (
    <div className="space-y-6">
      {/* AI Parser Section */}
      {!isLocked && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">AI-Assisted Scope Parsing</h3>
            </div>
            <button
              onClick={() => setShowAIParser(!showAIParser)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showAIParser ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showAIParser && (
            <div className="space-y-3">
              <textarea
                value={rawInput}
                onChange={(e) => {
                  setRawInput(e.target.value);
                  if (validationErrors.aiInput) {
                    setValidationErrors({ ...validationErrors, aiInput: '' });
                  }
                }}
                placeholder="Paste your project description here... AI will automatically extract core features, target users, use cases, and success criteria."
                className="w-full h-32 bg-black border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 resize-none"
              />
              {validationErrors.aiInput && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.aiInput}
                </p>
              )}
              <button
                onClick={handleAIParse}
                disabled={parsing || !rawInput.trim()}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                {parsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Parse with AI
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Project Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content.description}
          onChange={(e) => {
            setContent({ ...content, description: e.target.value });
            if (validationErrors.description) {
              setValidationErrors({ ...validationErrors, description: '' });
            }
          }}
          disabled={isLocked}
          placeholder="Describe your project idea... e.g., A habit tracker app that uses AI to remind and motivate users..."
          className={`w-full h-32 bg-background border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none disabled:opacity-50 resize-none ${
            validationErrors.description 
              ? 'border-red-500/50 focus:border-red-500/50' 
              : 'border-border focus:border-blue-500/50'
          }`}
        />
        {validationErrors.description ? (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.description}
          </p>
        ) : (
          <p className="text-xs text-text-dim mt-1">
            Describe the core concept, goals, and value proposition of the project
          </p>
        )}
      </div>

      {/* Core Features */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Core Features <span className="text-red-400">*</span>
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
        {validationErrors.coreFeatures && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.coreFeatures}
          </p>
        )}
      </div>

      {/* Target Users */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Target Users <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={content.targetUsers}
          onChange={(e) => {
            setContent({ ...content, targetUsers: e.target.value });
            if (validationErrors.targetUsers) {
              setValidationErrors({ ...validationErrors, targetUsers: '' });
            }
          }}
          disabled={isLocked}
          placeholder="e.g., Young people who want to build good habits, professionals who need time management..."
          className={`w-full bg-background border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none disabled:opacity-50 ${
            validationErrors.targetUsers 
              ? 'border-red-500/50 focus:border-red-500/50' 
              : 'border-border focus:border-blue-500/50'
          }`}
        />
        {validationErrors.targetUsers && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.targetUsers}
          </p>
        )}
      </div>

      {/* Use Cases */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Use Cases <span className="text-red-400">*</span>
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
        {validationErrors.useCases && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.useCases}
          </p>
        )}
      </div>

      {/* Success Criteria */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Success Criteria <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content.successCriteria}
          onChange={(e) => {
            setContent({ ...content, successCriteria: e.target.value });
            if (validationErrors.successCriteria) {
              setValidationErrors({ ...validationErrors, successCriteria: '' });
            }
          }}
          disabled={isLocked}
          placeholder="e.g., Users can consistently use the app for more than 30 days, completing at least 80% of set goals..."
          className={`w-full h-24 bg-background border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none disabled:opacity-50 resize-none ${
            validationErrors.successCriteria 
              ? 'border-red-500/50 focus:border-red-500/50' 
              : 'border-border focus:border-blue-500/50'
          }`}
        />
        {validationErrors.successCriteria ? (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.successCriteria}
          </p>
        ) : (
          <p className="text-xs text-text-dim mt-1">
            Define measurable success criteria for your project
          </p>
        )}
      </div>

      {/* Validation Summary */}
      {!isLocked && Object.keys(validationErrors).length > 0 && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">Please fix the following issues:</span>
          </div>
          <ul className="text-xs text-yellow-300/80 list-disc list-inside space-y-1">
            {Object.values(validationErrors).map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Completion Status */}
      {!isLocked && isComplete && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">All required fields are filled. You can save and proceed.</span>
          </div>
        </div>
      )}

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
