'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Project } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function StudioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  // Fetch projects
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!user || !newProjectName.trim()) return;

    try {
      setCreating(true);
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProjectName.trim(),
          user_id: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to the new project workspace
      router.push(`/studio/${data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('创建项目失败，请重试');
    } finally {
      setCreating(false);
      setShowNewProjectModal(false);
      setNewProjectName('');
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
      
      <Navbar onViewChange={() => {}} onWaitlistClick={() => {}} />

      <main className="flex-1 pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              My Projects
            </h1>
            <p className="text-text-muted">
              From Vibe to deployable architecture, start your next project
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewProjectModal(true)}
              className="h-48 border-2 border-dashed border-border bg-surface/30 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-surface/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Plus className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">
                Create New Project
              </span>
            </motion.button>

            {/* Project Cards */}
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(`/studio/${project.id}`)}
                className="h-48 border border-border bg-surface rounded-lg p-5 flex flex-col cursor-pointer hover:border-blue-500/30 hover:bg-surface/80 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FolderOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <h3 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                {project.description && (
                  <p className="text-xs text-text-muted line-clamp-2 mb-3 flex-1">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    project.status === 'completed' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : project.status === 'in_progress'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>
                    {project.status === 'completed' ? 'Completed' : project.status === 'in_progress' ? 'In Progress' : 'Draft'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-text-dim">
                    <Clock className="w-3 h-3" />
                    {formatDate(project.updated_at)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-text-muted mb-4">No projects yet</p>
              <p className="text-sm text-text-dim">Click the card above to create your first project</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newProjectName.trim()) {
                  handleCreateProject();
                }
                if (e.key === 'Escape') {
                  setShowNewProjectModal(false);
                }
              }}
              placeholder="Enter project name..."
              className="w-full bg-background border border-border rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="px-4 py-2 text-sm text-text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || creating}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            if (!user) {
              router.push('/');
            }
          }}
        />
      )}
    </div>
  );
}
