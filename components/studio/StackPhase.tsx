'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Artifact, ProjectPhase } from '@/types/supabase';

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

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as StackContent;
      setContent(parsed);
    }
  }, [artifact]);

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
      console.error('Error saving stack:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!artifact) {
      alert('请先保存技术栈选择');
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
      console.error('Error locking stack:', error);
      alert('锁定失败，请重试');
    } finally {
      setLocking(false);
    }
  };

  const isLocked = artifact?.is_locked || false;

  return (
    <div className="space-y-6">
      {/* Frontend */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          前端框架
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
          后端框架
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
          数据库
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
          部署平台
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
          其他工具
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
            技术栈已确定，可以进入下一阶段设计架构。
          </p>
        </div>
      )}
    </div>
  );
}
