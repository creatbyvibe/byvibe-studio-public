'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Project, Artifact, ProjectPhase } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ChatConsole from '@/components/studio/ChatConsole';
import ScopePhase from '@/components/studio/ScopePhase';
import StackPhase from '@/components/studio/StackPhase';
import DesignPhase from '@/components/studio/DesignPhase';
import BuildPhase from '@/components/studio/BuildPhase';

const phases: { id: ProjectPhase; label: string; description: string }[] = [
  { id: 'scope', label: 'Scope', description: '定义项目范围' },
  { id: 'stack', label: 'Stack', description: '选择技术栈' },
  { id: 'design', label: 'Design', description: '设计架构' },
  { id: 'build', label: 'Build', description: '生成代码' },
];

export default function StudioWorkspace() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [currentPhase, setCurrentPhase] = useState<ProjectPhase>('scope');
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user && projectId) {
      fetchProject();
      fetchArtifacts();
    }
  }, [user, projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/studio');
    }
  };

  const fetchArtifacts = async () => {
    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setArtifacts(data || []);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArtifactForPhase = (phase: ProjectPhase) => {
    return artifacts.find(a => a.phase === phase);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
      
      <Navbar onViewChange={() => {}} onWaitlistClick={() => {}} />

      <main className="flex-1 pt-20 pb-12">
        {/* Header */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.push('/studio')}
                className="p-2 hover:bg-surface rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-text-muted" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{project.name}</h1>
                {project.description && (
                  <p className="text-sm text-text-muted">{project.description}</p>
                )}
              </div>
            </div>

            {/* Phase Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {phases.map((phase, index) => {
                const artifact = getArtifactForPhase(phase.id);
                const isActive = currentPhase === phase.id;
                const isCompleted = artifact && artifact.is_locked;
                const isAccessible = index === 0 || getArtifactForPhase(phases[index - 1].id)?.is_locked;

                return (
                  <button
                    key={phase.id}
                    onClick={() => isAccessible && setCurrentPhase(phase.id)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-2 px-4 py-2 rounded transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : isCompleted
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : isAccessible
                        ? 'bg-surface border border-border text-text-muted hover:text-white hover:border-gray-600'
                        : 'bg-surface/50 border border-border/50 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{phase.label}</span>
                    <span className="text-xs opacity-75">({phase.description})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Left Sidebar */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="border border-border bg-surface rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-white mb-3">AI 助手</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-background border border-border rounded text-sm text-text-muted">
                    <p className="mb-2">💡 <strong>Gemini 建议：</strong></p>
                    <p>
                      {currentPhase === 'scope' && '请描述你的项目想法，包括核心功能、目标用户和使用场景。'}
                      {currentPhase === 'stack' && '根据项目需求，选择合适的技术栈。我会根据你的选择提供建议。'}
                      {currentPhase === 'design' && '让我为你生成项目架构图。你可以查看并调整架构设计。'}
                      {currentPhase === 'build' && '准备生成代码！我会根据前面的设计创建完整的项目结构。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Console */}
              <div className="border border-border bg-surface rounded-lg p-4 h-[400px] flex flex-col">
                <h3 className="text-sm font-bold text-white mb-3">对话</h3>
                <ChatConsole
                  projectId={projectId}
                  phase={currentPhase}
                  context={{
                    project: project,
                    scope: getArtifactForPhase('scope')?.content,
                    stack: getArtifactForPhase('stack')?.content,
                  }}
                />
              </div>
            </div>

            {/* Right Canvas */}
            <div className="min-h-[600px]">
              <div className="border border-border bg-surface rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {phases.find(p => p.id === currentPhase)?.label}
                  </h2>
                  <p className="text-sm text-text-muted">
                    {phases.find(p => p.id === currentPhase)?.description}
                  </p>
                </div>

                {/* Phase-specific content */}
                {currentPhase === 'scope' && (
                  <ScopePhase
                    projectId={projectId}
                    artifact={getArtifactForPhase('scope')}
                    onArtifactUpdate={fetchArtifacts}
                  />
                )}
                {currentPhase === 'stack' && (
                  <StackPhase
                    projectId={projectId}
                    artifact={getArtifactForPhase('stack')}
                    scopeContext={getArtifactForPhase('scope')?.content}
                    onArtifactUpdate={fetchArtifacts}
                  />
                )}
                {currentPhase === 'design' && (
                  <DesignPhase
                    projectId={projectId}
                    artifact={getArtifactForPhase('design')}
                    scopeContext={getArtifactForPhase('scope')?.content}
                    stackContext={getArtifactForPhase('stack')?.content}
                    onArtifactUpdate={fetchArtifacts}
                  />
                )}
                {currentPhase === 'build' && (
                  <BuildPhase
                    projectId={projectId}
                    artifact={getArtifactForPhase('build')}
                    scopeContext={getArtifactForPhase('scope')?.content}
                    stackContext={getArtifactForPhase('stack')?.content}
                    designContext={getArtifactForPhase('design')?.content}
                    onArtifactUpdate={fetchArtifacts}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            if (!user) {
              router.push('/studio');
            }
          }}
        />
      )}
    </div>
  );
}
