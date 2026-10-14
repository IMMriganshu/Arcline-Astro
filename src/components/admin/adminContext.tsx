import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase, getSupabaseConfig } from '../../lib/supabase';
import type { UserProfile, UserRole } from '../../lib/types';

export type AdminView =
  | 'dashboard'
  | 'pages'
  | 'page-edit'
  | 'articles'
  | 'article-edit'
  | 'navigation'
  | 'footer'
  | 'media'
  | 'settings'
  | 'revisions';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

interface AdminContextType {
  user: { email: string; id: string } | null;
  role: UserRole;
  isConfigured: boolean;
  activeView: AdminView;
  selectedId: string | null;
  toasts: ToastMessage[];
  deployStatus: {
    state: 'idle' | 'publishing' | 'published' | 'failed';
    message: string;
    lastPublishedAt: string | null;
  };
  setActiveView: (view: AdminView, id?: string | null) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  signOut: () => Promise<void>;
  setUserSession: (user: { email: string; id: string } | null, role: UserRole) => void;
  publishSite: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConfigured } = getSupabaseConfig();
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [role, setRole] = useState<UserRole>('admin');
  const [activeView, setActiveViewState] = useState<AdminView>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deployStatus, setDeployStatus] = useState<{
    state: 'idle' | 'publishing' | 'published' | 'failed';
    message: string;
    lastPublishedAt: string | null;
  }>({
    state: 'idle',
    message: '',
    lastPublishedAt: null,
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveView = (view: AdminView, id: string | null = null) => {
    setActiveViewState(view);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check Supabase session on mount
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      // In local development or pre-configuration mode, check for stored demo session
      const stored = localStorage.getItem('arcline_cms_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed.user);
          setRole(parsed.role || 'admin');
        } catch {
          // ignore
        }
      }
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email || 'admin@arcline.com', id: session.user.id });
        // Fetch role from profiles table
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.role) {
              setRole(data.role as UserRole);
            }
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || 'admin@arcline.com', id: session.user.id });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUserSession = (newUser: { email: string; id: string } | null, newRole: UserRole) => {
    setUser(newUser);
    setRole(newRole);
    if (newUser) {
      localStorage.setItem('arcline_cms_session', JSON.stringify({ user: newUser, role: newRole }));
    } else {
      localStorage.removeItem('arcline_cms_session');
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUserSession(null, 'editor');
    showToast('Signed out successfully', 'info');
  };

  const publishSite = async () => {
    setDeployStatus((prev) => ({ ...prev, state: 'publishing', message: 'Publishing site...' }));
    showToast('Publishing site changes...', 'info');

    try {
      // Direct deploy hook call if defined in client environment, or record in Supabase
      const deployHookUrl = (import.meta.env.PUBLIC_VERCEL_DEPLOY_HOOK_URL as string) || '';
      let success = true;
      let message = 'Published successfully. Content is saved to database.';

      if (deployHookUrl) {
        const res = await fetch(deployHookUrl, { method: 'POST' });
        if (res.ok) {
          message = 'Vercel build triggered. Live site will update in ~45 seconds.';
        } else {
          success = false;
          message = `Vercel deploy hook error (${res.status})`;
        }
      }

      const now = new Date().toISOString();
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('publication_logs').insert({
          target: 'site',
          status: success ? 'published' : 'failed',
          trigger_type: 'deploy_hook',
          message,
          created_at: now,
          finished_at: now,
        });
      }

      setDeployStatus({
        state: success ? 'published' : 'failed',
        message,
        lastPublishedAt: now,
      });

      if (success) {
        showToast(message, 'success');
      } else {
        showToast(message, 'error');
      }
    } catch (err: any) {
      setDeployStatus({
        state: 'failed',
        message: err.message || 'Publishing failed',
        lastPublishedAt: null,
      });
      showToast(`Publication failed: ${err.message}`, 'error');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        role,
        isConfigured,
        activeView,
        selectedId,
        toasts,
        deployStatus,
        setActiveView,
        showToast,
        removeToast,
        signOut,
        setUserSession,
        publishSite,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
