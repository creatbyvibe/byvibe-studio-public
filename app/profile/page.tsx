'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Settings, BarChart3, 
  Github, Chrome, BookOpen, LogOut, 
  CheckCircle, XCircle, Loader2, Eye, EyeOff,
  Calendar, FolderOpen, FileCode
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import ErrorModal from '@/components/ErrorModal';

interface UserStats {
  projectCount: number;
  artifactCount: number;
  daysSinceSignup: number;
  accountCreatedAt: string | null;
  recentProjects?: Array<{
    id: string;
    name: string;
    status: string;
    updated_at: string;
  }>;
  projectStatus?: {
    draft: number;
    inProgress: number;
    completed: number;
  };
}

interface ConnectedAccount {
  provider: string;
  connected: boolean;
  email?: string;
}

type TabType = 'overview' | 'settings' | 'accounts';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  
  // Settings state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadUserData();
      loadStats();
      loadConnectedAccounts();
    }
  }, [user, authLoading, router]);

  const loadUserData = async () => {
    if (!user) return;

    setEmail(user.email || '');
    setName((user.user_metadata?.name as string) || user.email?.split('@')[0] || '');
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/profile/stats');
      if (response.ok) {
        const data = await response.json() as UserStats;
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConnectedAccounts = async () => {
    if (!user) return;

    // Get user's identities from Supabase
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser?.identities) {
      const accounts: ConnectedAccount[] = [
        {
          provider: 'email',
          connected: !!currentUser.email,
          email: currentUser.email || undefined,
        },
        {
          provider: 'google',
          connected: currentUser.identities.some(id => id.provider === 'google'),
        },
        {
          provider: 'github',
          connected: currentUser.identities.some(id => id.provider === 'github'),
        },
        {
          provider: 'orcid',
          connected: currentUser.identities.some(id => id.provider === 'orcid'),
        },
      ];
      setConnectedAccounts(accounts);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEmail(true);
    setError('');
    setMessage('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
      });

      if (updateError) throw updateError;

      setMessage('Email update request sent! Please check your new email for confirmation.');
    } catch (err: any) {
      setError(err.message || 'Failed to update email');
      setErrorModal({ isOpen: true, message: err.message || 'Failed to update email' });
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setUpdatingPassword(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      setErrorModal({ isOpen: true, message: err.message || 'Failed to update password' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleUpdateName = async () => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: name,
        },
      });

      if (updateError) throw updateError;

      setMessage('Name updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update name');
      setErrorModal({ isOpen: true, message: err.message || 'Failed to update name' });
    }
  };

  const handleConnectAccount = async (provider: 'google' | 'github' | 'orcid') => {
    try {
      if (provider === 'orcid') {
        const clientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
        if (!clientId) {
          setErrorModal({ isOpen: true, message: 'ORCID sign in is not configured' });
          return;
        }
        const redirectUri = `${window.location.origin}/auth/orcid/callback`;
        const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${clientId}&response_type=code&scope=/authenticate&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = orcidAuthUrl;
        return;
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?return_url=/profile`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setErrorModal({ isOpen: true, message: err.message || `Failed to connect ${provider}` });
    }
  };

  const handleDisconnectAccount = async (provider: string) => {
    // Note: Supabase doesn't provide a direct way to disconnect accounts
    // This would require custom implementation
    setErrorModal({ 
      isOpen: true, 
      message: 'Account disconnection is not available. Please contact support if needed.' 
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Chrome className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'orcid':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      case 'orcid':
        return 'ORCID';
      case 'email':
        return 'Email';
      default:
        return provider;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">
            Profile Settings
          </h1>
          <p className="text-text-muted">
            Manage your account settings and view usage statistics
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border mb-6">
          {[
            { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
            { id: 'settings' as TabType, label: 'Settings', icon: Settings },
            { id: 'accounts' as TabType, label: 'Connected Accounts', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-white border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-surface border border-border rounded-lg p-6 md:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4 font-display">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/50 border border-border rounded p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    <div className="text-white font-mono text-sm">{user.email}</div>
                  </div>
                  <div className="bg-black/50 border border-border rounded p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </div>
                    <div className="text-white text-sm">
                      {stats?.accountCreatedAt 
                        ? new Date(stats.accountCreatedAt).toLocaleDateString()
                        : 'N/A'}
                      {stats?.daysSinceSignup && ` (${stats.daysSinceSignup} days)`}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-4 font-display">Usage Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/50 border border-border rounded p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <FolderOpen className="w-4 h-4" />
                      Total Projects
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.projectCount || 0}</div>
                  </div>
                  <div className="bg-black/50 border border-border rounded p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <FileCode className="w-4 h-4" />
                      Artifacts
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.artifactCount || 0}</div>
                  </div>
                  <div className="bg-black/50 border border-border rounded p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <BarChart3 className="w-4 h-4" />
                      Account Age
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.daysSinceSignup || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">days</div>
                  </div>
                </div>

                {stats?.projectStatus && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Project Status</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                        <div className="text-xs text-yellow-400 mb-1">Draft</div>
                        <div className="text-xl font-bold text-white">{stats.projectStatus.draft}</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                        <div className="text-xs text-blue-400 mb-1">In Progress</div>
                        <div className="text-xl font-bold text-white">{stats.projectStatus.inProgress}</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                        <div className="text-xs text-green-400 mb-1">Completed</div>
                        <div className="text-xl font-bold text-white">{stats.projectStatus.completed}</div>
                      </div>
                    </div>
                  </div>
                )}

                {stats?.recentProjects && stats.recentProjects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Projects</h3>
                    <div className="space-y-2">
                      {stats.recentProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => router.push(`/studio/${project.id}`)}
                          className="bg-black/50 border border-border rounded p-3 hover:bg-black/70 hover:border-white/20 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-white font-medium">{project.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Updated {new Date(project.updated_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {project.status === 'completed' ? 'Completed' :
                               project.status === 'in_progress' ? 'In Progress' : 'Draft'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Name */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Display Name</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 bg-black border border-border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <button
                    onClick={handleUpdateName}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Email Address</h3>
                <form onSubmit={handleUpdateEmail} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black border border-border rounded px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={updatingEmail}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors flex items-center gap-2"
                  >
                    {updatingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Email
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  You will receive a confirmation email at the new address
                </p>
              </div>

              {/* Password */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      required
                      minLength={8}
                      className="w-full bg-black border border-border rounded px-4 py-2 pl-10 pr-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                      className="w-full bg-black border border-border rounded px-4 py-2 pl-10 pr-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors flex items-center gap-2"
                  >
                    {updatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                  </button>
                </form>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-sm">
                  {message}
                </div>
              )}
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Connected Accounts</h3>
              {connectedAccounts.map((account) => (
                <div
                  key={account.provider}
                  className="flex items-center justify-between p-4 bg-black/50 border border-border rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500">
                      {getProviderIcon(account.provider)}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {getProviderName(account.provider)}
                      </div>
                      {account.email && (
                        <div className="text-xs text-gray-500">{account.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {account.connected ? (
                      <>
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Connected
                        </span>
                        {account.provider !== 'email' && (
                          <button
                            onClick={() => handleDisconnectAccount(account.provider)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Disconnect
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnectAccount(account.provider as 'google' | 'github' | 'orcid')}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold rounded transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />
    </div>
  );
}
