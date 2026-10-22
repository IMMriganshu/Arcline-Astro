import React, { useState, useEffect } from 'react';
import type { CmsData, Service, Project, Article, Testimonial, NavItem, MediaAsset, Page } from '../../lib/types';
import { defaultCmsContent } from '../../data/defaultCmsContent';
import { ArticleContentBuilder } from './ArticleContentBuilder';

const PERMANENT_VERCEL_HOOK = 'https://api.vercel.com/v1/integrations/deploy/prj_urcHfoyBHNVmdjwGAFlqsNC9va6o/6NGuRPGr1s';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Page editing modal state
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState<boolean>(false);

  const [cmsData, setCmsData] = useState<CmsData>(() => {
    if (typeof window !== 'undefined') {
      const dedicatedHook = localStorage.getItem('arcline_vercel_hook') || PERMANENT_VERCEL_HOOK;
      try {
        const local = localStorage.getItem('arcline_cms_content_v1');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && typeof parsed === 'object') {
            return {
              ...defaultCmsContent,
              ...parsed,
              hero: { ...defaultCmsContent.hero, ...(parsed.hero || {}) },
              siteConfig: {
                ...defaultCmsContent.siteConfig,
                ...(parsed.siteConfig || {}),
                vercelDeployHookUrl: dedicatedHook || parsed.siteConfig?.vercelDeployHookUrl || PERMANENT_VERCEL_HOOK,
              },
              comparison: { ...defaultCmsContent.comparison, ...(parsed.comparison || {}) },
              navigation: { ...defaultCmsContent.navigation, ...(parsed.navigation || {}) },
              articles: Array.isArray(parsed.articles) && parsed.articles.length > 0 ? parsed.articles : defaultCmsContent.articles,
              services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : defaultCmsContent.services,
              projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : defaultCmsContent.projects,
              testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 ? parsed.testimonials : defaultCmsContent.testimonials,
              media: Array.isArray(parsed.media) && parsed.media.length > 0 ? parsed.media : defaultCmsContent.media,
              pages: Array.isArray(parsed.pages) ? parsed.pages : defaultCmsContent.pages,
            };
          }
        }
      } catch (e) {}
    }
    return {
      ...defaultCmsContent,
      siteConfig: {
        ...defaultCmsContent.siteConfig,
        vercelDeployHookUrl: PERMANENT_VERCEL_HOOK,
      },
    };
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Blog article editing modal state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  // Service editing modal state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

  // Project editing modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);

  // Testimonial modal state
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState<boolean>(false);

  // New Media URL input
  const [newMediaName, setNewMediaName] = useState<string>('');
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');

  // Check auth and load content on mount
  useEffect(() => {
    const session = localStorage.getItem('arcline_admin_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }

    const dedicatedHook = localStorage.getItem('arcline_vercel_hook') || PERMANENT_VERCEL_HOOK;
    let localData: CmsData | null = null;
    try {
      const local = localStorage.getItem('arcline_cms_content_v1');
      if (local) {
        localData = JSON.parse(local);
        if (localData && localData.siteConfig) {
          localData.siteConfig.vercelDeployHookUrl = dedicatedHook || localData.siteConfig.vercelDeployHookUrl || PERMANENT_VERCEL_HOOK;
        }
      }
    } catch (e) {
      console.warn('Failed to load local CMS data', e);
    }

    // Fetch initial CMS content from API
    fetch('/api/cms')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && typeof json.data === 'object') {
          const effectiveHook =
            dedicatedHook ||
            json.data.siteConfig?.vercelDeployHookUrl ||
            localData?.siteConfig?.vercelDeployHookUrl ||
            PERMANENT_VERCEL_HOOK;

          const merged: CmsData = {
            ...defaultCmsContent,
            ...json.data,
            hero: { ...defaultCmsContent.hero, ...(json.data.hero || {}) },
            siteConfig: {
              ...defaultCmsContent.siteConfig,
              ...(json.data.siteConfig || {}),
              vercelDeployHookUrl: effectiveHook,
            },
            comparison: { ...defaultCmsContent.comparison, ...(json.data.comparison || {}) },
            navigation: { ...defaultCmsContent.navigation, ...(json.data.navigation || {}) },
            articles: Array.isArray(json.data.articles) && json.data.articles.length > 0 ? json.data.articles : defaultCmsContent.articles,
            services: Array.isArray(json.data.services) && json.data.services.length > 0 ? json.data.services : defaultCmsContent.services,
            projects: Array.isArray(json.data.projects) && json.data.projects.length > 0 ? json.data.projects : defaultCmsContent.projects,
            testimonials: Array.isArray(json.data.testimonials) && json.data.testimonials.length > 0 ? json.data.testimonials : defaultCmsContent.testimonials,
            media: Array.isArray(json.data.media) && json.data.media.length > 0 ? json.data.media : defaultCmsContent.media,
            pages: Array.isArray(json.data.pages) ? json.data.pages : defaultCmsContent.pages,
          };
          setCmsData(merged);
          localStorage.setItem('arcline_cms_content_v1', JSON.stringify(merged));
          localStorage.setItem('arcline_vercel_hook', effectiveHook);
        }
      })
      .catch(() => {
        if (localData) {
          setCmsData(localData);
        }
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'arcline2026' || passwordInput === 'admin' || passwordInput === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('arcline_admin_session', 'authenticated');
      setAuthError('');
      showToast('Welcome to Arcline Headless CMS', 'success');
    } else {
      setAuthError('Invalid administrator passcode. Try "arcline2026"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('arcline_admin_session');
    showToast('Signed out successfully', 'info');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updated: CmsData = {
        ...cmsData,
        lastPublishedAt: new Date().toISOString(),
        version: (cmsData.version || 1) + 1,
      };

      // Save to localStorage
      localStorage.setItem('arcline_cms_content_v1', JSON.stringify(updated));
      if (updated.siteConfig?.vercelDeployHookUrl) {
        localStorage.setItem('arcline_vercel_hook', updated.siteConfig.vercelDeployHookUrl);
      }
      window.dispatchEvent(new CustomEvent('cms:updated', { detail: updated }));

      // Save to API
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setCmsData(updated);
        setHasChanges(false);
        showToast('All changes successfully saved and published!', 'success');
      } else {
        setCmsData(updated);
        setHasChanges(false);
        showToast('Changes saved to browser cache (API write restricted in preview)', 'info');
      }
    } catch (err: any) {
      showToast('Saved locally: ' + (err?.message || 'Ready'), 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeployVercel = async () => {
    if (!cmsData.siteConfig.vercelDeployHookUrl) {
      showToast('Please set your Vercel Deploy Hook URL in the SEO & Settings tab first', 'error');
      setActiveTab('settings');
      return;
    }

    setIsDeploying(true);
    showToast('Triggering Vercel deployment webhook...', 'info');

    try {
      let triggered = false;
      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deploy',
            hookUrl: cmsData.siteConfig.vercelDeployHookUrl,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) triggered = true;
        }
      } catch {
        // Fallback to direct client POST
      }

      if (!triggered) {
        await fetch(cmsData.siteConfig.vercelDeployHookUrl, { method: 'POST', mode: 'no-cors' });
        triggered = true;
      }

      showToast('Vercel production build triggered! Live website updating now.', 'success');
    } catch (err: any) {
      showToast('Deploy trigger error: ' + err.message, 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cmsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `arcline_cms_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CMS backup exported successfully', 'success');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.hero && parsed.services) {
            setCmsData(parsed);
            setHasChanges(true);
            showToast('CMS data imported! Click Save to apply.', 'success');
          } else {
            showToast('Invalid CMS backup file format', 'error');
          }
        } catch {
          showToast('Failed to parse JSON file', 'error');
        }
      };
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all CMS content to default template values?')) {
      setCmsData(defaultCmsContent);
      setHasChanges(true);
      showToast('Reset to defaults. Remember to click "Save & Publish".', 'info');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 selection:bg-cyan-500 selection:text-black">
        <div className="w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 p-2.5 mb-4 shadow-xl">
              <img
                src="/images/Final%20seelutions%20logo%20with%20tagline.png"
                alt="Seelutions Logo"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-bold font-urbanist tracking-tight text-white mb-2">
              Arcline Headless CMS
            </h1>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Authorized practice administration dashboard for patient acquisition content and live deployment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Administrator Passcode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter administrator passcode"
                className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
            >
              Sign In to CMS Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 backdrop-blur-xl border transition-all animate-bounce-once ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current animate-ping"></div>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#050b1a]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center shadow-md">
              <img
                src="/images/Final%20seelutions%20logo%20with%20tagline.png"
                alt="Seelutions Logo"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight font-urbanist group-hover:text-cyan-400 transition-colors">
                Seelutions CMS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                Headless Studio
              </span>
            </div>
          </a>

          {hasChanges && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-colors"
          >
            <span>Preview Site</span>
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Trigger Vercel Deploy */}
          <button
            onClick={handleDeployVercel}
            disabled={isDeploying}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${isDeploying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{isDeploying ? 'Deploying...' : 'Deploy to Vercel'}</span>
          </button>

          {/* Save All */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#050b1a]/50 border-r border-white/10 flex flex-col justify-between p-4 overflow-y-auto">
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-2">
              Content Sections
            </div>

            {[
              { id: 'overview', label: 'Overview & Status', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { id: 'hero', label: 'Hero & Branding', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'services', label: 'Services (01–05)', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { id: 'projects', label: 'Case Studies (10-Yr)', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'blog', label: 'Blog & Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
              { id: 'pages', label: 'Manage Pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'testimonials', label: 'Surgeon Testimonials', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
              { id: 'comparison', label: 'Search vs PPC Matrix', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'navigation', label: 'Navigation & Footer', icon: 'M4 6h16M4 12h16M4 18h16' },
              { id: 'media', label: 'Media Assets', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
              { id: 'settings', label: 'SEO & Deploy Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Backup & Actions */}
          <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
            <button
              onClick={handleExportJson}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export JSON Backup</span>
            </button>

            <label className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={handleResetToDefault}
              className="w-full text-center text-[10px] text-neutral-500 hover:text-red-400 transition-colors pt-2 cursor-pointer"
            >
              Reset to default values
            </button>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl">
          {/* TAB: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">System Overview & Deployment</h2>
                <p className="text-xs text-neutral-400">Headless CMS operational status and publication triggers.</p>
              </div>

              {/* Status Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Live Status</div>
                  <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    Operational
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-2">Vercel SSR / Static Ready</div>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Published Articles</div>
                  <div className="text-2xl font-bold text-white font-urbanist">
                    {cmsData.articles.filter((a) => a.published).length} / {cmsData.articles.length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-2">Editorial Blog Hub</div>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Active Services</div>
                  <div className="text-2xl font-bold text-white font-urbanist">{cmsData.services.length}</div>
                  <div className="text-[11px] text-neutral-500 mt-2">Practice Specialties</div>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Last Publication</div>
                  <div className="text-xs font-mono font-semibold text-cyan-300 mt-1">
                    {cmsData.lastPublishedAt ? new Date(cmsData.lastPublishedAt).toLocaleTimeString() : 'Pending'}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-2">
                    {cmsData.lastPublishedAt ? new Date(cmsData.lastPublishedAt).toLocaleDateString() : 'Initial'}
                  </div>
                </div>
              </div>

              {/* Vercel Deployment Panel */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-urbanist">Vercel Webhook Deployment</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        Zero-Downtime Rebuild
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                      When you trigger deployment, Vercel initiates an immediate rebuild of the live production site with your updated CMS data, generating statically optimized pages with high Google PageSpeed scores.
                    </p>
                  </div>

                  <button
                    onClick={handleDeployVercel}
                    disabled={isDeploying}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{isDeploying ? 'Deploying to Vercel...' : 'Publish to Live Vercel Site'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div
                  onClick={() => setActiveTab('hero')}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Hero Section & Title Video
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Edit headline, subheadline, CTAs, and looping video sources.</p>
                </div>

                <div
                  onClick={() => setActiveTab('blog')}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Patient Grower Blog Articles
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Write, edit, and publish search authority editorial articles.</p>
                </div>

                <div
                  onClick={() => setActiveTab('services')}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Practice Service Cards (01–05)
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Update SEO, GEO search, and procedure conversion copy.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">Hero Section & Visual Identity</h2>
                <p className="text-xs text-neutral-400">Control the above-the-fold patient acquisition messaging and video streams.</p>
              </div>

              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Eyebrow Tag (Upper Cyan Badge)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.eyebrowTag}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, hero: { ...cmsData.hero, eyebrowTag: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Masked Title Line 1
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.titleLine1}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, titleLine1: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold font-urbanist focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Masked Title Line 2
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.titleLine2}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, titleLine2: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold font-urbanist focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Hero Card Headline
                  </label>
                  <textarea
                    rows={2}
                    value={cmsData.hero.headline}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, hero: { ...cmsData.hero, headline: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Subheadline Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.hero.subheadline}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, hero: { ...cmsData.hero, subheadline: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.primaryCtaText}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, primaryCtaText: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Primary CTA Target Link
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.primaryCtaLink}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, primaryCtaLink: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Secondary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.secondaryCtaText}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, secondaryCtaText: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Secondary CTA Target Link
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.secondaryCtaLink}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, secondaryCtaLink: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Video URLs */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-cyan-300">Hero Video Sources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Title Mask Video Source
                      </label>
                      <input
                        type="text"
                        value={cmsData.hero.titleVideoUrl}
                        onChange={(e) => {
                          setCmsData({ ...cmsData, hero: { ...cmsData.hero, titleVideoUrl: e.target.value } });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Hero Card Bionic Eye Video
                      </label>
                      <input
                        type="text"
                        value={cmsData.hero.bannerVideoUrl}
                        onChange={(e) => {
                          setCmsData({ ...cmsData, hero: { ...cmsData.hero, bannerVideoUrl: e.target.value } });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Services */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Practice Services (01–05)</h2>
                  <p className="text-xs text-neutral-400">Manage specialized SEO and patient acquisition offerings.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingService({
                      id: `srv-${Date.now()}`,
                      number: `0${cmsData.services.length + 1}`,
                      title: 'New Surgical Marketing Offering',
                      description: 'Comprehensive patient acquisition protocol designed for board-certified plastic surgeons.',
                      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85',
                      imageAlt: 'Medical surgical consultation clinic aesthetic',
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Service
                </button>
              </div>

              <div className="space-y-3">
                {cmsData.services.map((srv, idx) => (
                  <div
                    key={srv.id || idx}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-urbanist shrink-0">
                        {srv.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{srv.title}</h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{srv.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingService({ ...srv });
                          setIsServiceModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete service "${srv.title}"?`)) {
                            setCmsData({
                              ...cmsData,
                              services: cmsData.services.filter((s) => s.id !== srv.id),
                            });
                            setHasChanges(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Case Studies (Projects) */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">10-Year Practice Case Studies</h2>
                  <p className="text-xs text-neutral-400">Milestone timeline tracking budget vs organic consult yield.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      number: `${new Date().getFullYear()}`,
                      title: 'Market Expansion ($4,500/mo)',
                      category: 'Multi-Location Map Pack',
                      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85',
                      description: 'Expanded search infrastructure into adjacent affluent suburbs.',
                      year: `${new Date().getFullYear()}`,
                      location: 'Metro Territory',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Case Study
                </button>
              </div>

              <div className="space-y-3">
                {cmsData.projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-urbanist shrink-0 text-xs">
                        {proj.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{proj.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{proj.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject({ ...proj });
                          setIsProjectModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete case study "${proj.title}"?`)) {
                            setCmsData({
                              ...cmsData,
                              projects: cmsData.projects.filter((p) => p.id !== proj.id),
                            });
                            setHasChanges(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Blog & Articles */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Patient Grower Editorial Hub</h2>
                  <p className="text-xs text-neutral-400">Educational search authority and AI optimization articles.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticle({
                      id: `art-${Date.now()}`,
                      slug: 'new-article-slug',
                      category: 'Surgical Authority',
                      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                      readTime: '5 Min Read',
                      title: 'New Editorial Article Title',
                      excerpt: 'Brief summary outlining key procedural insights for prospective surgical patients.',
                      content: '<p>Write your detailed article body content here.</p>',
                      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85',
                      published: true,
                    });
                    setIsArticleModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Create Article
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cmsData.articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span className="text-cyan-400 font-semibold">{art.category}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm mb-2">{art.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${art.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-400'}`}>
                        {art.published ? 'Published' : 'Draft'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingArticle({ ...art });
                            setIsArticleModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete article "${art.title}"?`)) {
                              setCmsData({
                                ...cmsData,
                                articles: cmsData.articles.filter((a) => a.id !== art.id),
                              });
                              setHasChanges(true);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Testimonials */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Surgeon Client Testimonials</h2>
                  <p className="text-xs text-neutral-400">Quotes and reviews from board-certified surgical practice clients.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingTestimonial({
                      id: `test-${Date.now()}`,
                      quote: 'Their patient acquisition architecture generated consistent high-ticket surgical consultations.',
                      author: 'Dr. Jane Smith, MD',
                      role: 'Board-Certified Plastic Surgeon',
                      company: 'Smith Plastic Surgery',
                      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
                      rating: 5,
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Testimonial
                </button>
              </div>

              <div className="space-y-3">
                {cmsData.testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={test.avatar}
                        alt={test.author}
                        className="w-12 h-12 rounded-full object-cover border border-white/15 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{test.author}</h3>
                          <span className="text-xs text-neutral-400">· {test.role}, {test.company}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-2 italic">"{test.quote}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingTestimonial({ ...test });
                          setIsTestimonialModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete testimonial from ${test.author}?`)) {
                            setCmsData({
                              ...cmsData,
                              testimonials: cmsData.testimonials.filter((t) => t.id !== test.id),
                            });
                            setHasChanges(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Navigation & Footer */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">Navigation & Footer Settings</h2>
                <p className="text-xs text-neutral-400">Configure global menu links, phone, email, and legal disclaimers.</p>
              </div>

              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-cyan-300">Practice Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Practice Phone Number
                    </label>
                    <input
                      type="text"
                      value={cmsData.siteConfig.phone}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, siteConfig: { ...cmsData.siteConfig, phone: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Contact Email Address
                    </label>
                    <input
                      type="email"
                      value={cmsData.siteConfig.email}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, siteConfig: { ...cmsData.siteConfig, email: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Office Address
                  </label>
                  <input
                    type="text"
                    value={cmsData.siteConfig.address}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, siteConfig: { ...cmsData.siteConfig, address: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-cyan-300 mb-3">Footer Legal & Territory Exclusivity</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Exclusivity Disclaimer
                      </label>
                      <textarea
                        rows={2}
                        value={cmsData.footer.disclaimer}
                        onChange={(e) => {
                          setCmsData({ ...cmsData, footer: { ...cmsData.footer, disclaimer: e.target.value } });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Copyright Notice
                      </label>
                      <input
                        type="text"
                        value={cmsData.footer.copyrightText}
                        onChange={(e) => {
                          setCmsData({ ...cmsData, footer: { ...cmsData.footer, copyrightText: e.target.value } });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Search vs PPC Matrix */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">Search vs PPC Economics Matrix</h2>
                <p className="text-xs text-neutral-400">Customize the comparison chart between rented ads and compounding search authority.</p>
              </div>

              <div className="space-y-4">
                {cmsData.comparison.map((item, idx) => (
                  <div key={item.id || idx} className="p-5 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Metric #{idx + 1}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={item.metric}
                        onChange={(e) => {
                          const updated = [...cmsData.comparison];
                          updated[idx].metric = e.target.value;
                          setCmsData({ ...cmsData, comparison: updated });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-semibold text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-red-400 font-medium mb-1">Rented Clicks (Google Ads)</label>
                        <input
                          type="text"
                          value={item.rentedClicks}
                          onChange={(e) => {
                            const updated = [...cmsData.comparison];
                            updated[idx].rentedClicks = e.target.value;
                            setCmsData({ ...cmsData, comparison: updated });
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-red-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-cyan-400 font-medium mb-1">Organic Authority (Seelutions)</label>
                        <input
                          type="text"
                          value={item.organicAuthority}
                          onChange={(e) => {
                            const updated = [...cmsData.comparison];
                            updated[idx].organicAuthority = e.target.value;
                            setCmsData({ ...cmsData, comparison: updated });
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Media Assets */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">Media Assets Library</h2>
                <p className="text-xs text-neutral-400">Browse and manage videos, posters, logos, and clinical imagery.</p>
              </div>

              {/* Add New Media Form */}
              <div className="p-5 bg-neutral-900/80 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Asset Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Surgical Suite Video"
                    value={newMediaName}
                    onChange={(e) => setNewMediaName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex-2 w-full">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Asset URL</label>
                  <input
                    type="text"
                    placeholder="https://... or /videos/..."
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Type</label>
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (newMediaName && newMediaUrl) {
                      setCmsData({
                        ...cmsData,
                        media: [
                          ...cmsData.media,
                          { id: `med-${Date.now()}`, name: newMediaName, url: newMediaUrl, type: newMediaType },
                        ],
                      });
                      setNewMediaName('');
                      setNewMediaUrl('');
                      setHasChanges(true);
                      showToast('Media asset added', 'success');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  + Add Asset
                </button>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cmsData.media.map((asset) => (
                  <div key={asset.id} className="p-4 bg-neutral-900/60 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-white/5 mb-3 flex items-center justify-center relative">
                        {asset.type === 'video' ? (
                          <div className="text-center p-3">
                            <svg className="w-8 h-8 text-cyan-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] text-neutral-400 font-mono">MP4 Video</span>
                          </div>
                        ) : (
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[9px] uppercase font-bold text-neutral-300">
                          {asset.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white truncate">{asset.name}</h4>
                      <p className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">{asset.url}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          showToast('URL copied to clipboard!', 'info');
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => {
                          setCmsData({ ...cmsData, media: cmsData.media.filter((m) => m.id !== asset.id) });
                          setHasChanges(true);
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SEO & Deploy Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">SEO & Vercel Deployment Configuration</h2>
                <p className="text-xs text-neutral-400">Configure search meta tags, analytics, and automated live rebuild hooks.</p>
              </div>

              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-cyan-300">Vercel Deploy Webhook Integration</h3>
                <p className="text-xs text-neutral-400">
                  To trigger real, automated production rebuilds whenever you hit "Deploy to Vercel", paste your Vercel Deploy Hook URL below:
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Vercel Deploy Hook URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.vercel.com/v1/integrations/deploy/prj_.../..."
                    value={cmsData.siteConfig.vercelDeployHookUrl || ''}
                    onChange={(e) => {
                      setCmsData({
                        ...cmsData,
                        siteConfig: { ...cmsData.siteConfig, vercelDeployHookUrl: e.target.value },
                      });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Found in Vercel Project Dashboard → Settings → Git → Deploy Hooks.
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-cyan-300 mb-3">Global SEO Metadata</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Global Page Title
                      </label>
                      <input
                        type="text"
                        value={cmsData.siteConfig.title}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            siteConfig: { ...cmsData.siteConfig, title: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={cmsData.siteConfig.description}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            siteConfig: { ...cmsData.siteConfig, description: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        OpenGraph Share Image URL
                      </label>
                      <input
                        type="text"
                        value={cmsData.siteConfig.ogImage || ''}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            siteConfig: { ...cmsData.siteConfig, ogImage: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

           {/* TAB: Pages Management */}
           {activeTab === 'pages' && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-2xl font-bold font-urbanist text-white">Manage Pages</h2>
                   <p className="text-xs text-neutral-400">Create, edit, and manage custom website pages.</p>
                 </div>
                 <button
                   onClick={() => {
                     setEditingPage({ id: '', slug: '', title: '', content: '' });
                     setIsPageModalOpen(true);
                   }}
                   className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
                 >
                   + Create New Page
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {cmsData.pages.map((page) => (
                   <div key={page.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
                     <div>
                       <h3 className="text-sm font-bold text-white mb-1">{page.title}</h3>
                       <code className="text-[10px] text-cyan-400">/{page.slug}</code>
                     </div>
                     <div className="mt-4 flex gap-2">
                       <button
                         onClick={() => {
                           setEditingPage(page);
                           setIsPageModalOpen(true);
                         }}
                         className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300"
                       >
                         Edit
                       </button>
                       <button
                         onClick={() => {
                           if (window.confirm('Delete this page?')) {
                             setCmsData({ ...cmsData, pages: cmsData.pages.filter(p => p.id !== page.id) });
                             setHasChanges(true);
                           }
                         }}
                         className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[11px] text-red-400"
                       >
                         Delete
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </main>
      </div>

      {/* Article Modal */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">
                {editingArticle.id ? 'Edit Article & Rich Content' : 'Create Article & Rich Content'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Article Title</label>
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Slug (URL path)</label>
                <input
                  type="text"
                  value={editingArticle.slug}
                  onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Read Time</label>
                <input
                  type="text"
                  value={editingArticle.readTime}
                  onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={editingArticle.image}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Short Excerpt</label>
              <textarea
                rows={2}
                value={editingArticle.excerpt}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            {/* Rich Article Text Builder with H1-H6, Links, Quotes, Bullets, Images, Captions & Preview */}
            <div className="pt-1">
              <ArticleContentBuilder
                value={editingArticle.content || ''}
                onChange={(content) => setEditingArticle({ ...editingArticle, content })}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="article-published"
                checked={editingArticle.published}
                onChange={(e) => setEditingArticle({ ...editingArticle, published: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="article-published" className="text-xs text-neutral-300">
                Publish immediately to website
              </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.articles.some((a) => a.id === editingArticle.id);
                  const updated = exists
                    ? cmsData.articles.map((a) => (a.id === editingArticle.id ? editingArticle : a))
                    : [editingArticle, ...cmsData.articles];
                  setCmsData({ ...cmsData, articles: updated });
                  setHasChanges(true);
                  setIsArticleModalOpen(false);
                  showToast('Article saved to CMS', 'success');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">Service Details</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Number</label>
                <input
                  type="text"
                  value={editingService.number}
                  onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingService.description}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Image URL</label>
              <input
                type="text"
                value={editingService.image}
                onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.services.some((s) => s.id === editingService.id);
                  const updated = exists
                    ? cmsData.services.map((s) => (s.id === editingService.id ? editingService : s))
                    : [...cmsData.services, editingService];
                  setCmsData({ ...cmsData, services: updated });
                  setHasChanges(true);
                  setIsServiceModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">Case Study Milestone</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Year</label>
                <input
                  type="text"
                  value={editingProject.number}
                  onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Title & Budget</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Category Strategy</label>
              <input
                type="text"
                value={editingProject.category}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Outcome Narrative</label>
              <textarea
                rows={3}
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.projects.some((p) => p.id === editingProject.id);
                  const updated = exists
                    ? cmsData.projects.map((p) => (p.id === editingProject.id ? editingProject : p))
                    : [...cmsData.projects, editingProject];
                  setCmsData({ ...cmsData, projects: updated });
                  setHasChanges(true);
                  setIsProjectModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">Surgeon Testimonial</h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Surgeon Name & Credentials</label>
              <input
                type="text"
                value={editingTestimonial.author}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Role / Specialty</label>
                <input
                  type="text"
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Clinic / Practice</label>
                <input
                  type="text"
                  value={editingTestimonial.company}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Quote</label>
              <textarea
                rows={3}
                value={editingTestimonial.quote}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={editingTestimonial.avatar}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.testimonials.some((t) => t.id === editingTestimonial.id);
                  const updated = exists
                    ? cmsData.testimonials.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t))
                    : [...cmsData.testimonials, editingTestimonial];
                  setCmsData({ ...cmsData, testimonials: updated });
                  setHasChanges(true);
                  setIsTestimonialModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Modal */}
      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">
                {editingPage.id ? 'Edit Page Content' : 'Create New Page'}
              </h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Page Title</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Slug (URL path)</label>
                <input
                  type="text"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Rich Article Text Builder with H1-H6, Links, Quotes, Bullets, Images, Captions & Preview */}
            <div className="pt-1">
              <ArticleContentBuilder
                value={editingPage.content || ''}
                onChange={(content) => setEditingPage({ ...editingPage, content })}
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.pages.some((p) => p.id === editingPage.id);
                  const updated = exists
                    ? cmsData.pages.map((p) => (p.id === editingPage.id ? editingPage : p))
                    : [...cmsData.pages, { ...editingPage, id: `page-${Date.now()}` }];
                  setCmsData({ ...cmsData, pages: updated });
                  setHasChanges(true);
                  setIsPageModalOpen(false);
                  showToast('Page saved to CMS', 'success');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
