'use client';

// Cloudflare Pages 要求动态路由导出 edge runtime（即使客户端组件也会在 Edge 上运行）
export const runtime = 'edge';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { shouldUseDevMode, getDevUser } from '@/lib/dev-mode';

const phases: { id: ProjectPhase; label: string; description: string }[] = [
  { id: 'scope', label: 'Scope', description: 'Define project scope' },
  { id: 'stack', label: 'Stack', description: 'Choose technology stack' },
  { id: 'design', label: 'Design', description: 'Design architecture' },
  { id: 'build', label: 'Build', description: 'Generate code' },
];

export default function StudioWorkspace() {
  const { user, loading: authLoading } = useAuth();
  const devMode = shouldUseDevMode();
  // 始终提供一个稳定的 devUser，避免在渲染/类型检查中出现 null 分支
  const devUser = getDevUser();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [currentPhase, setCurrentPhase] = useState<ProjectPhase>('scope');
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  // 用包含“登录态”的 key 作为初始化标记，避免 user 从 null -> 有值后被误判“已初始化”
  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!devMode && !authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user?.id, authLoading, devMode]);

  const fetchProject = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H3',location:'app/studio/[id]/page.tsx:fetchProject:start',message:'fetchProject start',data:{projectId:projectId||'',userId:user?.id?String(user.id).slice(0,8):''},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProject(data);
      setLoading(false); // 只在 project 加载完成后设置 loading=false

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H3',location:'app/studio/[id]/page.tsx:fetchProject:ok',message:'fetchProject ok',data:{hasData:!!data},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
    } catch (error) {
      console.error('Error fetching project:', error);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H6',location:'app/studio/[id]/page.tsx:fetchProject:error',message:'fetchProject error',data:{projectId:projectId||'',userId:user?.id?String(user.id).slice(0,8):'',errorName:(error as any)?.name?String((error as any).name):'',errorMessage:(error as any)?.message?String((error as any).message).slice(0,180):''},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      setLoading(false);
      router.push('/studio');
    }
  }, [projectId, user?.id, router]);

  const fetchArtifacts = useCallback(async () => {
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
    }
    // 移除 finally 里的 setLoading(false)，由 fetchProject 统一控制 loading 状态
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H1',location:'app/studio/[id]/page.tsx:fetchArtifacts:done',message:'fetchArtifacts done',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
  }, [projectId]);

  useEffect(() => {
    const authKey = devMode ? `dev:${devUser.id}` : (user?.id ? `authed:${String(user.id).slice(0, 8)}` : 'anon');
    const initKey = `${projectId}:${authKey}`;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H5',location:'app/studio/[id]/page.tsx:useEffect:enter',message:'workspace effect enter',data:{projectId:projectId||'',initialized:String(initializedRef.current||''),devMode,authLoading,hasUser:!!user,userId:user?.id?String(user.id).slice(0,8):''},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log

    // 如果 initKey 变化，重置初始化标记
    if (initializedRef.current !== initKey) {
      initializedRef.current = initKey;

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H2',location:'app/studio/[id]/page.tsx:useEffect:init',message:'workspace init effect',data:{projectId:projectId||'',devMode,authLoading,hasUser:!!user,userId:user?.id?String(user.id).slice(0,8):''},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      
      if (devMode && projectId) {
        // 开发模式：使用模拟数据
        setProject({
          id: projectId,
          name: projectId.startsWith('dev-project') ? '示例项目' : '开发项目',
          description: '这是一个示例项目，用于展示 Studio 功能',
          status: 'in_progress',
          user_id: devUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Project);
        setArtifacts([]);
        setLoading(false);
        return;
      }

      if (!devMode && user && projectId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H6',location:'app/studio/[id]/page.tsx:useEffect:triggerFetch',message:'triggering fetchProject/fetchArtifacts',data:{projectId:projectId||'',userId:user?.id?String(user.id).slice(0,8):''},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log

        fetchProject();
        fetchArtifacts();
      } else if (!devMode && !authLoading && !user) {
        // 如果认证检查完成但没有用户，停止 loading
        setLoading(false);
      }
    } else {
      // initializedRef.current === initKey 时，不会再次初始化
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H5',location:'app/studio/[id]/page.tsx:useEffect:skip',message:'workspace init skipped (same initKey)',data:{projectId:projectId||'',initKey,devMode,authLoading,hasUser:!!user,userId:user?.id?String(user.id).slice(0,8):''},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
    }
  }, [projectId, devMode, user?.id, authLoading, fetchProject, fetchArtifacts, devUser.id]);

  const getArtifactForPhase = (phase: ProjectPhase) => {
    return artifacts.find(a => a.phase === phase);
  };

  // 添加超时处理，避免无限 loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((!devMode && authLoading) || loading) {
        console.warn('Loading timeout, forcing stop');
        setLoading(false);
      }
    }, 10000); // 10秒超时

    return () => clearTimeout(timeout);
  }, [authLoading, loading, devMode]);

  if ((!devMode && authLoading) || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-text-muted mb-2">Loading...</div>
          <div className="text-xs text-text-dim">
            {authLoading ? 'Checking authentication...' : 'Loading project...'}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'studio-black-20260106',hypothesisId:'H1',location:'app/studio/[id]/page.tsx:render:noProject',message:'rendered with project=null',data:{loading,authLoading,devMode,hasUser:!!user},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar onViewChange={() => {}} onWaitlistClick={() => {}} />
        <main className="flex-1 pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <div className="rounded-xl border border-border bg-surface/40 p-6">
              <div className="text-white font-semibold mb-1">Project unavailable</div>
              <div className="text-sm text-text-muted">
                {showAuthModal
                  ? 'Please sign in to access this workspace.'
                  : 'This project does not exist, or you do not have access.'}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => router.push('/studio')}
                  className="px-4 py-2 rounded bg-surface hover:bg-surface/70 text-white text-sm transition-colors"
                >
                  Back to Studio
                </button>
                {!devMode && !user && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  // 双重检查：防止竞态条件导致 project 在渲染时变为 null
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar onViewChange={() => {}} onWaitlistClick={() => {}} />
        <main className="flex-1 pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <div className="rounded-xl border border-border bg-surface/40 p-6">
              <div className="text-white font-semibold mb-1">Loading project...</div>
              <div className="text-sm text-text-muted">
                Please wait while we load your project.
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
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
                <h1 className="text-xl font-bold text-white">{project.name || 'Untitled Project'}</h1>
                {project.description && (
                  <p className="text-sm text-text-muted">{project.description}</p>
                )}
              </div>
            </div>

            {/* Phase Navigation */}
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                    style={{ 
                      width: `${(phases.filter((_, i) => getArtifactForPhase(phases[i].id)?.is_locked).length / phases.length) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-xs text-text-muted font-medium whitespace-nowrap">
                  {phases.filter((_, i) => getArtifactForPhase(phases[i].id)?.is_locked).length} / {phases.length} Complete
                </span>
              </div>

              {/* Phase Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {phases.map((phase, index) => {
                  const artifact = getArtifactForPhase(phase.id);
                  const isActive = currentPhase === phase.id;
                  const isCompleted = artifact && artifact.is_locked;
                  const hasArtifact = !!artifact;
                  const isAccessible = index === 0 || getArtifactForPhase(phases[index - 1].id)?.is_locked;
                  const prevPhase = index > 0 ? phases[index - 1] : null;
                  const prevArtifact = prevPhase ? getArtifactForPhase(prevPhase.id) : null;
                  const needsPrevPhase = !isAccessible && prevPhase;

                  return (
                    <button
                      key={phase.id}
                      onClick={() => {
                        if (!isAccessible && needsPrevPhase) {
                          // Show tooltip or modal about needing to complete previous phase
                          return;
                        }
                        setCurrentPhase(phase.id);
                      }}
                      disabled={!isAccessible}
                      title={!isAccessible && needsPrevPhase ? `Complete ${prevPhase.label} phase first` : ''}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded transition-all whitespace-nowrap min-w-[140px] ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                          : isCompleted
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
                          : isAccessible
                          ? 'bg-surface border border-border text-text-muted hover:text-white hover:border-gray-600 hover:bg-surface/80'
                          : 'bg-surface/30 border border-border/30 text-gray-600 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {/* Status Indicator */}
                      <div className="flex items-center gap-1.5">
                        {isCompleted ? (
                          <Lock className="w-4 h-4" />
                        ) : hasArtifact ? (
                          <div className="w-4 h-4 rounded-full border-2 border-yellow-400" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{phase.label}</span>
                        <span className="text-[10px] opacity-75 mt-0.5">{phase.description}</span>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                      )}

                      {/* Locked Badge */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Phase Status Info */}
              {(() => {
                const currentIndex = phases.findIndex(p => p.id === currentPhase);
                const isCurrentAccessible = currentIndex === 0 || getArtifactForPhase(phases[currentIndex - 1].id)?.is_locked;
                const prevPhase = currentIndex > 0 ? phases[currentIndex - 1] : null;
                
                if (currentIndex > 0 && !isCurrentAccessible && prevPhase) {
                  return (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium">
                          Complete the {prevPhase.label} phase first to unlock {phases.find(p => p.id === currentPhase)?.label}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Left Sidebar */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="border border-border bg-surface rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-white mb-3">AI Assistant</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-background border border-border rounded text-sm text-text-muted">
                    <p className="mb-2">💡 <strong>Gemini Suggestions:</strong></p>
                    <p>
                      {currentPhase === 'scope' && 'Describe your project idea, including core features, target users, and use cases.'}
                      {currentPhase === 'stack' && 'Choose the appropriate technology stack based on your project requirements. I\'ll provide suggestions based on your choices.'}
                      {currentPhase === 'design' && 'Let me generate the project architecture diagram for you. You can review and adjust the architecture design.'}
                      {currentPhase === 'build' && 'Ready to generate code! I\'ll create a complete project structure based on the previous design.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Console */}
              <div className="border border-border bg-surface rounded-lg p-4 h-[400px] flex flex-col">
                <h3 className="text-sm font-bold text-white mb-3">Chat</h3>
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

      {/* Dev Mode Banner */}
      {devMode && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <span className="font-semibold">🔧 开发模式</span>
              <span className="text-yellow-300/80">已启用 - 使用模拟数据预览功能</span>
            </div>
            <div className="text-xs text-yellow-300/60">
              用户: {devUser.email} | 项目: {project?.name}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {!devMode && showAuthModal && (
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
