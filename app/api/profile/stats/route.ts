import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/lib/utils/error-handler';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get project count
    const { count: projectCount, error: projectError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (projectError) {
      ErrorHandler.logError(projectError, 'ProfileStats.projects');
    }

    // Get artifacts count (fetch project ids first; .in expects an array)
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id);

    let artifactCountValue = 0;
    if (projects && projects.length > 0) {
      const projectIds = projects.map(p => p.id);
      const { count, error } = await supabase
        .from('artifacts')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds);
      
      if (!error && count !== null) {
        artifactCountValue = count;
      }
    }

    // Get account creation date
    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const daysSinceSignup = createdAt 
      ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Get recent projects (last 5)
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('id, name, status, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    // Get projects by status
    const { count: draftCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'draft');

    const { count: inProgressCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'in_progress');

    const { count: completedCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    return NextResponse.json({
      projectCount: projectCount || 0,
      artifactCount: artifactCountValue,
      daysSinceSignup,
      accountCreatedAt: createdAt?.toISOString() || null,
      recentProjects: recentProjects || [],
      projectStatus: {
        draft: draftCount || 0,
        inProgress: inProgressCount || 0,
        completed: completedCount || 0,
      },
    }, { status: 200 });
  } catch (error) {
    ErrorHandler.logError(error, 'ProfileStats');
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
