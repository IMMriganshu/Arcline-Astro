import React, { useState } from 'react';
import { useAdmin, type AdminView } from './adminContext';
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Menu as MenuIcon,
  Compass,
  PanelBottom,
  Image as ImageIcon,
  Settings,
  History,
  LogOut,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Clock,
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({ children }) => {
  const {
    user,
    role,
    activeView,
    setActiveView,
    signOut,
    toasts,
    removeToast,
    deployStatus,
    publishSite,
    isConfigured,
  } = useAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: { id: AdminView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'pages', label: 'Pages & Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'articles', label: 'Articles & Hub', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'navigation', label: 'Header & Menu', icon: <Compass className="w-4 h-4" /> },
    { id: 'footer', label: 'Footer & Links', icon: <PanelBottom className="w-4 h-4" /> },
    { id: 'revisions', label: 'Audit & History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex font-urbanist selection:bg-[#8DC541] selection:text-black">
      {/* =========================================
          DESKTOP SIDEBAR
      ========================================= */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#0D0D11] border-r border-white/8 shrink-0 select-none">
        {/* Brand identity header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
              <img
                src="/images/seelutions%20new%20updatedLogo.png"
                alt="Arcline Mark"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">Arcline CMS</span>
              <span className="text-[10px] text-neutral-400 block font-mono">v1.2.0 • Headless</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Content Architecture
          </div>
          {navigationItems.map((item) => {
            const isActive = activeView === item.id || (activeView === 'page-edit' && item.id === 'pages') || (activeView === 'article-edit' && item.id === 'articles');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8DC541]/10 text-[#8DC541] border border-[#8DC541]/25 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User profile & Sign Out Footer */}
        <div className="p-4 border-t border-white/8 bg-[#09090C]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-white block truncate">
                  {user?.email || 'Administrator'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#8DC541] capitalize">
                  <Shield className="w-2.5 h-2.5" />
                  {role} Access
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Storage: {isConfigured ? 'Supabase' : 'Local Fallback'}</span>
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          </div>
        </div>
      </aside>

      {/* =========================================
          MAIN VIEWPORT & TOPBAR
      ========================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-20 bg-[#0D0D11]/80 backdrop-blur-md border-b border-white/8 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>CMS</span>
                <span>/</span>
                <span className="text-white capitalize font-medium">{activeView.replace('-', ' ')}</span>
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight capitalize">
                {activeView === 'dashboard' && 'Editorial Overview'}
                {activeView === 'pages' && 'Pages & Content Hierarchy'}
                {activeView === 'page-edit' && 'Visual Section Editor'}
                {activeView === 'articles' && 'Articles & Content Hub'}
                {activeView === 'article-edit' && 'Editorial Studio'}
                {activeView === 'media' && 'Digital Asset Repository'}
                {activeView === 'navigation' && 'Global Header Architecture'}
                {activeView === 'footer' && 'Footer & Legal Information'}
                {activeView === 'revisions' && 'Audit Trails & Revisions'}
                {activeView === 'settings' && 'Site-Wide Global Settings'}
              </h1>
            </div>
          </div>

          {/* Action buttons on topbar */}
          <div className="flex items-center gap-3">
            {/* Live website link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-200 border border-white/10 transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>

            {/* Global Publish Button */}
            <button
              type="button"
              onClick={publishSite}
              disabled={deployStatus.state === 'publishing'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8DC541] to-[#78a837] text-[#050505] text-xs font-bold shadow-md shadow-[#8DC541]/15 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {deployStatus.state === 'publishing' ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Publish Live Site</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Global Deployment Banner (if publishing or recently published) */}
        {deployStatus.state !== 'idle' && (
          <div className={`px-4 sm:px-8 py-2 text-xs flex items-center justify-between border-b ${
            deployStatus.state === 'publishing'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
              : deployStatus.state === 'published'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {deployStatus.state === 'publishing' && <Clock className="w-3.5 h-3.5 animate-spin" />}
              {deployStatus.state === 'published' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              {deployStatus.state === 'failed' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
              <span>{deployStatus.message}</span>
            </div>
            {deployStatus.lastPublishedAt && (
              <span className="font-mono text-[10px] opacity-80">
                {new Date(deployStatus.lastPublishedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* =========================================
          MOBILE DRAWER
      ========================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#0D0D11] border-r border-white/10 flex flex-col p-6 z-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/8">
              <span className="font-bold text-white">Arcline CMS</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 flex-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    activeView === item.id ? 'bg-[#8DC541]/15 text-[#8DC541]' : 'text-neutral-400'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-white/8">
              <button
                type="button"
                onClick={signOut}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TOAST NOTIFICATION STACK
      ========================================= */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border text-xs flex items-center justify-between gap-3 backdrop-blur-lg animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-[#0E1F12]/95 border-emerald-500/30 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-[#230F12]/95 border-red-500/30 text-red-200'
                : 'bg-[#121217]/95 border-white/15 text-neutral-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span>{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
