'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Project, Artifact, ProjectPhase } from '@/types/supabase';
import { useAuth } from '@/lib/hooks/useAuth';

interface StudioContextType {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  // Artifacts
  artifacts: Record<string, Artifact[]>; // projectId -> artifacts
  getArtifact: (projectId: string, phase: ProjectPhase) => Artifact | undefined;
  getArtifactContent: <T>(projectId: string, phase: ProjectPhase) => T | null;

  // Actions
  loadProjects: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project | null>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  loadArtifacts: (projectId: string) => Promise<void>;
  updateArtifact: (projectId: string, phase: ProjectPhase, content: unknown, isLocked?: boolean) => Promise<void>;
  
  setCurrentProject: (project: Project | null) => void;
  refresh: () => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [artifacts, setArtifacts] = useState<Record<string, Artifact[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all projects for the current user
  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load a specific project
  const loadProject = useCallback(async (projectId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setCurrentProject(data);
        // Also load artifacts for this project
        await loadArtifacts(projectId);
      }
    } catch (err: any) {
      console.error('Error loading project:', err);
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new project
  const createProject = useCallback(async (name: string, description?: string): Promise<Project | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          status: 'draft',
        })
        .select()
        .single();

      if (createError) throw createError;

      if (data) {
        setProjects((prev) => [data, ...prev]);
        setCurrentProject(data);
        return data;
      }

      return null;
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
      return null;
    }
  }, [user]);

  // Update a project
  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
      );

      if (currentProject?.id === projectId) {
        setCurrentProject((prev) => (prev ? { ...prev, ...updates } : null));
      }
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(err.message || 'Failed to update project');
    }
  }, [user, currentProject]);

  // Delete a project
  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) return;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setArtifacts((prev) => {
          const next = { ...prev };
          delete next[projectId];
          return next;
        });
      }
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
    }
  }, [user, currentProject]);

  // Load artifacts for a project
  const loadArtifacts = useCallback(async (projectId: string) => {
    if (!user) return;

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('artifacts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setArtifacts((prev) => ({
        ...prev,
        [projectId]: data || [],
      }));
    } catch (err: any) {
      console.error('Error loading artifacts:', err);
      setError(err.message || 'Failed to load artifacts');
    }
  }, [user]);

  // Update an artifact
  const updateArtifact = useCallback(async (
    projectId: string,
    phase: ProjectPhase,
    content: unknown,
    isLocked = false
  ) => {
    if (!user) return;

    try {
      setError(null);

      const projectArtifacts = artifacts[projectId] || [];
      const existingArtifact = projectArtifacts.find((a) => a.phase === phase);

      if (existingArtifact) {
        // Update existing artifact
        const { error: updateError } = await supabase
          .from('artifacts')
          .update({
            content,
            is_locked: isLocked,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingArtifact.id);

        if (updateError) throw updateError;
      } else {
        // Create new artifact
        const { error: insertError } = await supabase
          .from('artifacts')
          .insert({
            project_id: projectId,
            phase,
            content,
            is_locked: isLocked,
          });

        if (insertError) throw insertError;
      }

      // Reload artifacts
      await loadArtifacts(projectId);
    } catch (err: any) {
      console.error('Error updating artifact:', err);
      setError(err.message || 'Failed to update artifact');
    }
  }, [user, artifacts, loadArtifacts]);

  // Get artifact by phase
  const getArtifact = useCallback((projectId: string, phase: ProjectPhase): Artifact | undefined => {
    const projectArtifacts = artifacts[projectId] || [];
    return projectArtifacts.find((a) => a.phase === phase);
  }, [artifacts]);

  // Get artifact content (typed)
  const getArtifactContent = useCallback(<T,>(projectId: string, phase: ProjectPhase): T | null => {
    const artifact = getArtifact(projectId, phase);
    return artifact ? (artifact.content as T) : null;
  }, [getArtifact]);

  // Refresh all data
  const refresh = useCallback(async () => {
    await loadProjects();
    if (currentProject) {
      await loadArtifacts(currentProject.id);
    }
  }, [loadProjects, currentProject, loadArtifacts]);

  // Load projects when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
      setArtifacts({});
    }
  }, [user, loadProjects]);

  const value: StudioContextType = {
    projects,
    currentProject,
    loading,
    error,
    artifacts,
    getArtifact,
    getArtifactContent,
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    deleteProject,
    loadArtifacts,
    updateArtifact,
    setCurrentProject,
    refresh,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
