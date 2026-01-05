'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Loader2, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Artifact, ProjectPhase } from '@/types/supabase';

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

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as DesignContent;
      setContent(parsed);
    }
  }, [artifact]);

  const handleGenerate = async () => {
    if (!scopeContext || !stackContext) {
      alert('请先完成 Scope 和 Stack 阶段');
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
        throw new Error(data.error || '生成失败');
      }

      setContent((prev) => ({
        ...prev,
        diagram: data.diagram,
      }));
    } catch (error: any) {
      console.error('Error generating design:', error);
      alert(`生成架构图失败: ${error.message}`);
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
      console.error('Error saving design:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!artifact || !content.diagram) {
      alert('请先生成并保存架构图');
      return;
    }

    if (!confirm('锁定后此阶段将无法编辑，确定要继续吗？')) return;

    try {
      setLocking(true);
      const { error } = await supabase
        .from('artifacts')
        .update({ is_locked: true })
        .eq('id', artifact.id);

      if (error) throw error;

      onArtifactUpdate();
    } catch (error) {
      console.error('Error locking design:', error);
      alert('锁定失败，请重试');
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
                生成中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                生成架构图
              </>
            )}
          </button>
        </div>
      )}

      {/* Diagram Display */}
      {content.diagram && (
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            架构图 (Mermaid)
          </label>
          <div className="bg-background border border-border rounded p-4">
            <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap overflow-x-auto">
              {content.diagram}
            </pre>
          </div>
          <p className="text-xs text-text-dim mt-2">
            此 Mermaid 图表可以在支持 Mermaid 的编辑器中渲染（如 GitHub、Notion 等）
          </p>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          架构说明
        </label>
        <textarea
          value={content.description}
          onChange={(e) => setContent({ ...content, description: e.target.value })}
          disabled={isLocked}
          placeholder="描述架构设计的关键决策和设计思路..."
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
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存
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
                  锁定中...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  锁定并进入下一阶段
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
            <span className="text-sm font-medium">此阶段已锁定</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            架构设计已确定，可以进入下一阶段生成代码。
          </p>
        </div>
      )}
    </div>
  );
}
