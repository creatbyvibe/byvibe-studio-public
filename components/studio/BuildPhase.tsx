'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Loader2, RefreshCw, Download, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Artifact, ProjectPhase } from '@/types/supabase';

interface BuildPhaseProps {
  projectId: string;
  artifact: Artifact | undefined;
  scopeContext: any;
  stackContext: any;
  designContext: any;
  onArtifactUpdate: () => void;
}

interface CodeFile {
  path: string;
  content: string;
  language: string;
}

interface BuildContent {
  fileTree: any;
  files: CodeFile[];
  instructions: string;
  generatedAt?: string;
}

export default function BuildPhase({ projectId, artifact, scopeContext, stackContext, designContext, onArtifactUpdate }: BuildPhaseProps) {
  const [content, setContent] = useState<BuildContent>({
    fileTree: {},
    files: [],
    instructions: '',
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (artifact?.content) {
      const parsed = artifact.content as unknown as BuildContent;
      setContent(parsed);
      // Expand all paths by default
      if (parsed.files) {
        const paths = new Set<string>();
        parsed.files.forEach(file => {
          const parts = file.path.split('/');
          for (let i = 1; i < parts.length; i++) {
            paths.add(parts.slice(0, i).join('/'));
          }
        });
        setExpandedPaths(paths);
      }
    }
  }, [artifact]);

  const handleGenerate = async () => {
    if (!scopeContext || !stackContext) {
      alert('请先完成 Scope 和 Stack 阶段');
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/studio/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          scope: scopeContext,
          stack: stackContext,
          design: designContext?.diagram || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setContent({
        fileTree: data.fileTree || {},
        files: data.files || [],
        instructions: data.instructions || '',
        generatedAt: new Date().toISOString(),
      });

      // Expand all paths
      if (data.files) {
        const paths = new Set<string>();
        data.files.forEach((file: CodeFile) => {
          const parts = file.path.split('/');
          for (let i = 1; i < parts.length; i++) {
            paths.add(parts.slice(0, i).join('/'));
          }
        });
        setExpandedPaths(paths);
      }
    } catch (error: any) {
      console.error('Error generating code:', error);
      alert(`生成代码失败: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const artifactData = {
        project_id: projectId,
        phase: 'build' as ProjectPhase,
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

      // Update project status to completed
      await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', projectId);

      onArtifactUpdate();
    } catch (error) {
      console.error('Error saving build:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleLock = async () => {
    if (!artifact || !content.files || content.files.length === 0) {
      alert('请先生成并保存代码');
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
      console.error('Error locking build:', error);
      alert('锁定失败，请重试');
    } finally {
      setLocking(false);
    }
  };

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFileTree = (tree: any, prefix = ''): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    
    Object.keys(tree).forEach((key) => {
      const path = prefix ? `${prefix}/${key}` : key;
      const value = tree[key];
      
      if (typeof value === 'string') {
        // It's a file
        const file = content.files.find(f => f.path === path);
        const isSelected = selectedFile === path;
        elements.push(
          <div
            key={path}
            onClick={() => setSelectedFile(path)}
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-surface/50 ${
              isSelected ? 'bg-blue-500/20 border border-blue-500/30' : ''
            }`}
          >
            <FileCode className="w-3 h-3 text-text-muted" />
            <span className="text-sm text-text-muted">{key}</span>
          </div>
        );
      } else {
        // It's a directory
        const isExpanded = expandedPaths.has(path);
        elements.push(
          <div key={path}>
            <div
              onClick={() => togglePath(path)}
              className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-surface/50"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-text-muted" />
              ) : (
                <ChevronRight className="w-3 h-3 text-text-muted" />
              )}
              <span className="text-sm text-white font-medium">{key}/</span>
            </div>
            {isExpanded && (
              <div className="ml-4">
                {renderFileTree(value, path)}
              </div>
            )}
          </div>
        );
      }
    });
    
    return elements;
  };

  const selectedFileContent = content.files.find(f => f.path === selectedFile);

  const handleExport = () => {
    if (!content.files || content.files.length === 0) {
      alert('没有可导出的文件');
      return;
    }

    // Create a zip-like structure as JSON
    const exportData = {
      project: projectId,
      files: content.files,
      instructions: content.instructions,
      generatedAt: content.generatedAt,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${projectId}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
                生成代码
              </>
            )}
          </button>
          {content.files.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded text-green-400 hover:bg-green-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              导出项目
            </button>
          )}
        </div>
      )}

      {content.files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* File Tree */}
          <div className="bg-background border border-border rounded p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-3">文件结构</h3>
            <div className="space-y-1">
              {renderFileTree(content.fileTree)}
            </div>
          </div>

          {/* File Content */}
          <div className="bg-background border border-border rounded p-4 max-h-[600px] overflow-y-auto">
            {selectedFileContent ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">{selectedFileContent.path}</h3>
                  <span className="text-xs text-text-dim">{selectedFileContent.language}</span>
                </div>
                <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap overflow-x-auto">
                  {selectedFileContent.content}
                </pre>
              </div>
            ) : (
              <div className="text-center py-16 text-text-muted">
                <p>选择一个文件查看内容</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {content.instructions && (
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            设置说明
          </label>
          <div className="bg-background border border-border rounded p-4">
            <pre className="text-sm text-text-muted whitespace-pre-wrap">
              {content.instructions}
            </pre>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isLocked && content.files.length > 0 && (
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
                  锁定项目
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
            <span className="text-sm font-medium">项目已完成</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            代码已生成并锁定，可以导出项目开始开发。
          </p>
        </div>
      )}
    </div>
  );
}
