import React, { useState } from 'react';
import type { CmsData, PageSeoMetadata, RedirectRule, GlobalSeoSettings, Article, Page } from '../../lib/types';

interface SeoManagerViewProps {
  cmsData: CmsData;
  setCmsData: React.Dispatch<React.SetStateAction<CmsData>>;
  setHasChanges: (hasChanges: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  userRole?: 'super' | 'admin';
}

export function SeoManagerView({
  cmsData,
  setCmsData,
  setHasChanges,
  showToast,
  userRole = 'admin',
}: SeoManagerViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pages' | 'articles' | 'previews' | 'redirects' | 'robots' | 'audit'>('pages');

  // Selected item state for page/article editor
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(cmsData.articles?.[0]?.id || '');

  // Redirect form state
  const [newFromPath, setNewFromPath] = useState('');
  const [newToPath, setNewToPath] = useState('');
  const [newRedirectType, setNewRedirectType] = useState<301 | 302>(301);

  // Health Audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    score: number;
    issues: { level: 'error' | 'warning' | 'info'; target: string; message: string; fixKey?: string }[];
    linkChecks: { url: string; source: string; status: 'ok' | 'broken' | 'warning'; detail: string }[];
  } | null>(null);

  // Helper to ensure pageSeoMap entry exists
  const getSeoForPage = (key: string): PageSeoMetadata => {
    return cmsData.pageSeoMap?.[key] || {
      title: cmsData.siteConfig?.title || '',
      description: cmsData.siteConfig?.description || '',
      canonicalUrl: `${cmsData.seoSettings?.siteUrl || 'https://seelutions.com'}${key === 'home' ? '/' : `/${key}`}`,
      ogTitle: cmsData.siteConfig?.title || '',
      ogDescription: cmsData.siteConfig?.description || '',
      ogImage: cmsData.siteConfig?.ogImage || '/images/home-hero-image.webp',
      twitterCard: 'summary_large_image',
      schemaType: key === 'services' ? 'MedicalProcedure' : key === 'blog' ? 'Article' : 'MedicalBusiness',
    };
  };

  const updatePageSeo = (key: string, updatedFields: Partial<PageSeoMetadata>) => {
    const current = getSeoForPage(key);
    const updatedMap = {
      ...(cmsData.pageSeoMap || {}),
      [key]: {
        ...current,
        ...updatedFields,
      },
    };
    setCmsData({
      ...cmsData,
      pageSeoMap: updatedMap,
    });
    setHasChanges(true);
  };

  // Helper to update article SEO
  const updateArticleSeo = (articleId: string, updatedFields: Partial<PageSeoMetadata>) => {
    const updatedArticles = (cmsData.articles || []).map((art) => {
      if (art.id === articleId) {
        const currentSeo = art.seo || {
          title: `${art.title} — seelutions Intelligence`,
          description: art.excerpt,
          canonicalUrl: `${cmsData.seoSettings?.siteUrl || 'https://seelutions.com'}/blog/${art.slug}`,
          ogTitle: art.title,
          ogDescription: art.excerpt,
          ogImage: art.image,
          twitterCard: 'summary_large_image',
          schemaType: 'Article' as const,
        };
        return {
          ...art,
          seo: { ...currentSeo, ...updatedFields },
        };
      }
      return art;
    });

    setCmsData({
      ...cmsData,
      articles: updatedArticles,
    });
    setHasChanges(true);
  };

  // Run SEO Health & Link Audit
  const runSeoAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const issues: { level: 'error' | 'warning' | 'info'; target: string; message: string; fixKey?: string }[] = [];
      const linkChecks: { url: string; source: string; status: 'ok' | 'broken' | 'warning'; detail: string }[] = [];

      const systemPages = [
        { key: 'home', name: 'Home Page (/)' },
        { key: 'about', name: 'About Page (/#about)' },
        { key: 'services', name: 'Services Page (/services)' },
        { key: 'projects', name: 'Case Studies (/projects)' },
        { key: 'blog', name: 'Blog Journal (/blog)' },
      ];

      // Audit System Pages
      systemPages.forEach((p) => {
        const seo = getSeoForPage(p.key);
        const tLen = seo.title?.length || 0;
        const dLen = seo.description?.length || 0;

        if (!seo.title || tLen === 0) {
          issues.push({ level: 'error', target: p.name, message: 'Missing Meta Title', fixKey: p.key });
        } else if (tLen < 30) {
          issues.push({ level: 'warning', target: p.name, message: `Meta Title too short (${tLen} chars, min 30 recommended)`, fixKey: p.key });
        } else if (tLen > 60) {
          issues.push({ level: 'warning', target: p.name, message: `Meta Title too long (${tLen} chars, max 60 recommended)`, fixKey: p.key });
        }

        if (!seo.description || dLen === 0) {
          issues.push({ level: 'error', target: p.name, message: 'Missing Meta Description', fixKey: p.key });
        } else if (dLen < 120) {
          issues.push({ level: 'warning', target: p.name, message: `Meta Description brief (${dLen} chars, min 120 recommended)`, fixKey: p.key });
        } else if (dLen > 160) {
          issues.push({ level: 'warning', target: p.name, message: `Meta Description long (${dLen} chars, max 160 recommended)`, fixKey: p.key });
        }

        if (!seo.ogImage) {
          issues.push({ level: 'warning', target: p.name, message: 'Missing OpenGraph Image', fixKey: p.key });
        }
      });

      // Audit Articles
      (cmsData.articles || []).forEach((art) => {
        const title = art.seo?.title || art.title;
        const desc = art.seo?.description || art.excerpt;

        if (title.length < 30) {
          issues.push({ level: 'warning', target: `Article: "${art.title}"`, message: `Title short (${title.length} chars)` });
        }
        if (!desc || desc.length < 100) {
          issues.push({ level: 'warning', target: `Article: "${art.title}"`, message: `Excerpt/description short (${desc?.length || 0} chars)` });
        }
        if (!art.image) {
          issues.push({ level: 'error', target: `Article: "${art.title}"`, message: 'Missing cover image for social cards' });
        }
      });

      // Scan Internal & External Links for potential broken targets
      const knownRoutes = ['/', '/#about', '/services', '/projects', '/blog', '/style-guide', '/404', '#contact', '#services', '#case-studies'];
      (cmsData.articles || []).forEach((a) => knownRoutes.push(`/blog/${a.slug}`));
      (cmsData.pages || []).forEach((pg) => knownRoutes.push(`/pages/${pg.slug}`));

      // Check navigation links
      (cmsData.navigation || []).forEach((nav) => {
        const isValid = knownRoutes.some((r) => nav.href === r || nav.href.startsWith('http') || nav.href.startsWith('#'));
        linkChecks.push({
          url: nav.href,
          source: `Navigation: ${nav.label}`,
          status: isValid ? 'ok' : 'warning',
          detail: isValid ? 'Valid site route or external target' : 'Unmapped relative path target',
        });
      });

      // Check media assets
      (cmsData.media || []).forEach((med) => {
        linkChecks.push({
          url: med.url,
          source: `Media Asset: ${med.name}`,
          status: med.url.startsWith('/') || med.url.startsWith('http') ? 'ok' : 'broken',
          detail: med.url.startsWith('/') || med.url.startsWith('http') ? 'Valid asset URL path' : 'Invalid relative asset format',
        });
      });

      // Calculate health score (100 - weighted errors)
      const errorCount = issues.filter((i) => i.level === 'error').length;
      const warnCount = issues.filter((i) => i.level === 'warning').length;
      const score = Math.max(10, Math.min(100, 100 - errorCount * 15 - warnCount * 5));

      setAuditResults({ score, issues, linkChecks });
      setIsAuditing(false);
      showToast('SEO Audit and Link Scan completed!', 'success');
    }, 600);
  };

  const selectedPageSeo = getSeoForPage(selectedPageKey);
  const activeArticle = (cmsData.articles || []).find((a) => a.id === selectedArticleId) || cmsData.articles?.[0];
  const activeArticleSeo = activeArticle?.seo || {
    title: activeArticle ? `${activeArticle.title} — seelutions Intelligence` : '',
    description: activeArticle?.excerpt || '',
    canonicalUrl: activeArticle ? `${cmsData.seoSettings?.siteUrl || 'https://seelutions.com'}/blog/${activeArticle.slug}` : '',
    ogTitle: activeArticle?.title || '',
    ogDescription: activeArticle?.excerpt || '',
    ogImage: activeArticle?.image || '/images/home-hero-image.webp',
    twitterCard: 'summary_large_image',
    schemaType: 'Article',
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-cyan-950/40 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-semibold tracking-wider uppercase">
              COMPLETE SEO MANAGEMENT SUITE
            </span>
          </div>
          <h2 className="text-2xl font-bold font-urbanist text-white">Search Engine Optimization & Social Sharing</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage custom meta titles, descriptions, canonical URLs, social share cards, JSON-LD schemas, sitemaps, robots.txt, and redirects.
          </p>
        </div>

        <button
          onClick={runSeoAudit}
          disabled={isAuditing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{isAuditing ? 'Scanning Site...' : 'Run SEO Audit & Link Scan'}</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/10">
        {[
          { id: 'pages', label: '📄 System Pages SEO', badge: '5 Pages' },
          { id: 'articles', label: '📝 Blog Articles SEO', badge: `${cmsData.articles?.length || 0} Posts` },
          { id: 'previews', label: '👁️ Live Social Cards Preview', badge: 'Preview' },
          { id: 'redirects', label: '🔄 URL Redirects Engine', badge: `${cmsData.redirects?.length || 0} Rules` },
          { id: 'robots', label: '🤖 Sitemap & Robots.txt', badge: 'Crawler' },
          { id: 'audit', label: '🩺 SEO Health & Link Audit', badge: auditResults ? `${auditResults.score}%` : 'Scan' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] text-neutral-400 font-mono">
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: SYSTEM PAGES SEO */}
      {activeSubTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Menu: Page Selector */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1 mb-2">Select Page</h3>
            {[
              { id: 'home', label: 'Home Page', route: '/' },
              { id: 'about', label: 'About Us', route: '/#about' },
              { id: 'services', label: 'Surgical Services', route: '/services' },
              { id: 'projects', label: 'Case Studies', route: '/projects' },
              { id: 'blog', label: 'Patient Grower Journal', route: '/blog' },
            ].map((pg) => {
              const pSeo = getSeoForPage(pg.id);
              const isSelected = selectedPageKey === pg.id;
              return (
                <button
                  key={pg.id}
                  onClick={() => setSelectedPageKey(pg.id)}
                  className={`w-full p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md'
                      : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{pg.label}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{pg.route}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{pSeo.title || 'No custom title set'}</p>
                </button>
              );
            })}
          </div>

          {/* Right Form: SEO Inputs for Selected Page */}
          <div className="lg:col-span-8 bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                  Editing SEO: <span className="text-white capitalize">{selectedPageKey} Page</span>
                </h3>
                <p className="text-xs text-neutral-400">Customize search snippet meta tags, canonical URL, and schema markup.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/20">
                Route: {selectedPageKey === 'home' ? '/' : `/${selectedPageKey}`}
              </span>
            </div>

            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Meta Title (&lt;title&gt;)
                </label>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    (selectedPageSeo.title?.length || 0) >= 30 && (selectedPageSeo.title?.length || 0) <= 60
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedPageSeo.title?.length || 0} / 60 chars (Recommended 30-60)
                </span>
              </div>
              <input
                type="text"
                value={selectedPageSeo.title || ''}
                onChange={(e) => updatePageSeo(selectedPageKey, { title: e.target.value })}
                placeholder="seelutions — Plastic Surgery Patient Acquisition & Search Authority"
                className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Meta Description
                </label>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    (selectedPageSeo.description?.length || 0) >= 120 && (selectedPageSeo.description?.length || 0) <= 160
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedPageSeo.description?.length || 0} / 160 chars (Recommended 120-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={selectedPageSeo.description || ''}
                onChange={(e) => updatePageSeo(selectedPageKey, { description: e.target.value })}
                placeholder="Be seen in search. Be chosen by high-ticket surgical patients. Specialized organic SEO and Map Pack dominance for board-certified plastic surgeons."
                className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Keywords & Canonical URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Meta Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={selectedPageSeo.keywords || ''}
                  onChange={(e) => updatePageSeo(selectedPageKey, { keywords: e.target.value })}
                  placeholder="plastic surgery seo, cosmetic surgeon marketing, medical search authority"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Canonical URL Override
                </label>
                <input
                  type="url"
                  value={selectedPageSeo.canonicalUrl || ''}
                  onChange={(e) => updatePageSeo(selectedPageKey, { canonicalUrl: e.target.value })}
                  placeholder="https://seelutions.com/services"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* OpenGraph Title & Social Share Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  OpenGraph Share Title (og:title)
                </label>
                <input
                  type="text"
                  value={selectedPageSeo.ogTitle || ''}
                  onChange={(e) => updatePageSeo(selectedPageKey, { ogTitle: e.target.value })}
                  placeholder="Same as Meta Title if blank"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  OpenGraph Share Image URL (og:image)
                </label>
                <input
                  type="text"
                  value={selectedPageSeo.ogImage || ''}
                  onChange={(e) => updatePageSeo(selectedPageKey, { ogImage: e.target.value })}
                  placeholder="/images/home-hero-image.webp"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Schema Type & Robots Directive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Schema.org Structured Data Type
                </label>
                <select
                  value={selectedPageSeo.schemaType || 'MedicalBusiness'}
                  onChange={(e) => updatePageSeo(selectedPageKey, { schemaType: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="MedicalBusiness">MedicalBusiness / Clinic</option>
                  <option value="MedicalProcedure">MedicalProcedure / Surgical</option>
                  <option value="MedicalWebPage">MedicalWebPage</option>
                  <option value="Organization">Organization / Agency</option>
                  <option value="LocalBusiness">LocalBusiness</option>
                  <option value="Article">Article / Publication</option>
                  <option value="Custom">Custom Raw JSON-LD</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/10 rounded-xl">
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">
                    Robots Indexing Directive
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {selectedPageSeo.noindex ? 'noindex, nofollow (Hidden from Search)' : 'index, follow (Indexed by Search Engines)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updatePageSeo(selectedPageKey, { noindex: !selectedPageSeo.noindex })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedPageSeo.noindex
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedPageSeo.noindex ? '🚫 NOINDEX' : '✅ INDEXED'}
                </button>
              </div>
            </div>

            {/* Custom JSON-LD Textarea if Custom chosen */}
            {selectedPageSeo.schemaType === 'Custom' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Raw Custom JSON-LD Schema
                </label>
                <textarea
                  rows={5}
                  value={selectedPageSeo.customSchemaJson || ''}
                  onChange={(e) => updatePageSeo(selectedPageKey, { customSchemaJson: e.target.value })}
                  placeholder='{\n  "@context": "https://schema.org",\n  "@type": "MedicalBusiness",\n  "name": "seelutions"\n}'
                  className="w-full p-3 bg-black/80 border border-white/15 rounded-xl text-cyan-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BLOG ARTICLES SEO */}
      {activeSubTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Article List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1 mb-2">Select Article</h3>
            {(cmsData.articles || []).map((art) => {
              const isSelected = selectedArticleId === art.id;
              const title = art.seo?.title || art.title;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`w-full p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md'
                      : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs truncate max-w-[180px]">{art.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">/blog/{art.slug}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{title}</p>
                </button>
              );
            })}
          </div>

          {/* Right Article SEO Editor */}
          {activeArticle && (
            <div className="lg:col-span-8 bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Editing Article SEO: <span className="text-white">{activeArticle.title}</span>
                  </h3>
                  <p className="text-xs text-neutral-400">Custom meta title, description, slug, and OpenGraph social share card.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/20">
                  /blog/{activeArticle.slug}
                </span>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Article Meta Title (&lt;title&gt;)
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      (activeArticleSeo.title?.length || 0) >= 30 && (activeArticleSeo.title?.length || 0) <= 60
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {activeArticleSeo.title?.length || 0} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={activeArticleSeo.title || ''}
                  onChange={(e) => updateArticleSeo(activeArticle.id, { title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Article Meta Description
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      (activeArticleSeo.description?.length || 0) >= 120 && (activeArticleSeo.description?.length || 0) <= 160
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {activeArticleSeo.description?.length || 0} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={activeArticleSeo.description || ''}
                  onChange={(e) => updateArticleSeo(activeArticle.id, { description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Slug & Canonical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={activeArticle.slug}
                    onChange={(e) => {
                      const updated = (cmsData.articles || []).map((art) =>
                        art.id === activeArticle.id ? { ...art, slug: e.target.value } : art
                      );
                      setCmsData({ ...cmsData, articles: updated });
                      setHasChanges(true);
                    }}
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Canonical URL Override
                  </label>
                  <input
                    type="url"
                    value={activeArticleSeo.canonicalUrl || ''}
                    onChange={(e) => updateArticleSeo(activeArticle.id, { canonicalUrl: e.target.value })}
                    placeholder={`https://seelutions.com/blog/${activeArticle.slug}`}
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Social Image & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    OpenGraph Share Image URL
                  </label>
                  <input
                    type="text"
                    value={activeArticleSeo.ogImage || activeArticle.image || ''}
                    onChange={(e) => updateArticleSeo(activeArticle.id, { ogImage: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Article Keywords
                  </label>
                  <input
                    type="text"
                    value={activeArticleSeo.keywords || ''}
                    onChange={(e) => updateArticleSeo(activeArticle.id, { keywords: e.target.value })}
                    placeholder="generative engine optimization, plastic surgery search"
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: SOCIAL CARDS LIVE PREVIEW */}
      {activeSubTab === 'previews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-neutral-900/60 p-4 border border-white/10 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Live Mock Preview Target Page:
            </span>
            <select
              value={selectedPageKey}
              onChange={(e) => setSelectedPageKey(e.target.value)}
              className="px-3 py-1.5 bg-black border border-white/20 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="home">Home Page (/)</option>
              <option value="about">About Us (/#about)</option>
              <option value="services">Services (/services)</option>
              <option value="projects">Case Studies (/projects)</option>
              <option value="blog">Blog Journal (/blog)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Google Search Snippet Preview */}
            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-blue-400 flex items-center gap-1.5">
                  <span>🔍</span> Google Search Snippet
                </span>
                <span className="text-[10px] font-mono text-neutral-500">google.com</span>
              </div>
              <div className="bg-[#202124] p-4 rounded-xl space-y-1 font-sans">
                <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-[9px] flex items-center justify-center font-bold text-cyan-300">S</span>
                  <span className="text-[#dadce0] text-xs">seelutions.com</span>
                  <span className="text-[#9aa0a6] text-[10px]">› {selectedPageKey === 'home' ? '' : selectedPageKey}</span>
                </div>
                <h4 className="text-[#8ab4f8] hover:underline text-base font-semibold leading-tight cursor-pointer line-clamp-1">
                  {selectedPageSeo.title || cmsData.siteConfig?.title}
                </h4>
                <p className="text-[#bdc1c6] text-xs leading-normal line-clamp-2">
                  {selectedPageSeo.description || cmsData.siteConfig?.description}
                </p>
              </div>
            </div>

            {/* X / Twitter Card Preview */}
            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-sky-400 flex items-center gap-1.5">
                  <span>🐦</span> X / Twitter Summary Card
                </span>
                <span className="text-[10px] font-mono text-neutral-500">x.com</span>
              </div>
              <div className="bg-black border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video w-full bg-neutral-900 relative">
                  <img
                    src={selectedPageSeo.ogImage || '/images/home-hero-image.webp'}
                    alt="Social Card"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] text-neutral-300 font-mono rounded">
                    seelutions.com
                  </span>
                </div>
                <div className="p-3 bg-neutral-950 space-y-1">
                  <p className="text-[11px] font-mono text-neutral-500 uppercase">seelutions.com</p>
                  <h5 className="text-xs font-bold text-white truncate">
                    {selectedPageSeo.ogTitle || selectedPageSeo.title || cmsData.siteConfig?.title}
                  </h5>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-snug">
                    {selectedPageSeo.ogDescription || selectedPageSeo.description || cmsData.siteConfig?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* LinkedIn / iMessage Card Preview */}
            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                  <span>💬</span> Slack / iMessage Share Card
                </span>
                <span className="text-[10px] font-mono text-neutral-500">OpenGraph</span>
              </div>
              <div className="bg-[#1e1e24] p-3.5 rounded-2xl border-l-4 border-cyan-400 space-y-2">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">seelutions Studio</p>
                <h5 className="text-xs font-bold text-white leading-snug">
                  {selectedPageSeo.ogTitle || selectedPageSeo.title}
                </h5>
                <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                  {selectedPageSeo.ogDescription || selectedPageSeo.description}
                </p>
                <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={selectedPageSeo.ogImage || '/images/home-hero-image.webp'}
                    alt="Card Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: URL REDIRECTS ENGINE */}
      {activeSubTab === 'redirects' && (
        <div className="space-y-6">
          {/* Add New Redirect Form */}
          <div className="p-5 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Create HTTP Redirect Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">From Request Path (Source)</label>
                <input
                  type="text"
                  placeholder="/old-services or /case-study"
                  value={newFromPath}
                  onChange={(e) => setNewFromPath(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">To Destination Path</label>
                <input
                  type="text"
                  placeholder="/services or /projects"
                  value={newToPath}
                  onChange={(e) => setNewToPath(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">HTTP Type</label>
                <select
                  value={newRedirectType}
                  onChange={(e) => setNewRedirectType(Number(e.target.value) as 301 | 302)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value={301}>301 Permanent</option>
                  <option value={302}>302 Temporary</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <button
                  onClick={() => {
                    if (newFromPath && newToPath) {
                      const newRule: RedirectRule = {
                        id: `red-${Date.now()}`,
                        fromPath: newFromPath.startsWith('/') ? newFromPath : `/${newFromPath}`,
                        toPath: newToPath,
                        type: newRedirectType,
                        active: true,
                        createdAt: new Date().toISOString(),
                      };
                      setCmsData({
                        ...cmsData,
                        redirects: [...(cmsData.redirects || []), newRule],
                      });
                      setNewFromPath('');
                      setNewToPath('');
                      setHasChanges(true);
                      showToast('Redirect rule added!', 'success');
                    }
                  }}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Active Redirect Rules Table */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left text-neutral-300">
              <thead className="bg-black/40 text-neutral-400 uppercase font-bold text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Source Path</th>
                  <th className="px-4 py-3">Destination Path</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(cmsData.redirects || []).map((rule) => (
                  <tr key={rule.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-cyan-300 font-bold">{rule.fromPath}</td>
                    <td className="px-4 py-3 font-mono text-white">{rule.toPath}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          const updated = (cmsData.redirects || []).map((r) =>
                            r.id === rule.id ? { ...r, active: !r.active } : r
                          );
                          setCmsData({ ...cmsData, redirects: updated });
                          setHasChanges(true);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          rule.active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400 border border-white/10'
                        }`}
                      >
                        {rule.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono">
                        HTTP {rule.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          const updated = (cmsData.redirects || []).filter((r) => r.id !== rule.id);
                          setCmsData({ ...cmsData, redirects: updated });
                          setHasChanges(true);
                          showToast('Redirect rule removed', 'info');
                        }}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SITEMAP & ROBOTS.TXT */}
      {activeSubTab === 'robots' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Robots.txt Configuration */}
          <div className="p-6 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Robots.txt Content</h3>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>View Live /robots.txt</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <textarea
              rows={8}
              value={
                cmsData.seoSettings?.robotsTxtContent ||
                'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://seelutions.com/sitemap.xml'
              }
              onChange={(e) => {
                setCmsData({
                  ...cmsData,
                  seoSettings: { ...(cmsData.seoSettings || {}), robotsTxtContent: e.target.value },
                });
                setHasChanges(true);
              }}
              className="w-full p-3.5 bg-black/80 border border-white/15 rounded-xl text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* XML Sitemap Status */}
          <div className="p-6 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Dynamic XML Sitemap</h3>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>View Live /sitemap.xml</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Canonical Site Domain:</span>
                <input
                  type="url"
                  value={cmsData.seoSettings?.siteUrl || 'https://seelutions.com'}
                  onChange={(e) => {
                    setCmsData({
                      ...cmsData,
                      seoSettings: { ...(cmsData.seoSettings || {}), siteUrl: e.target.value },
                    });
                    setHasChanges(true);
                  }}
                  className="px-3 py-1 bg-neutral-900 border border-white/20 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1 text-xs text-neutral-300">
                <p>✅ Automatically indexes 5 system pages (`/`, `/#about`, `/services`, `/projects`, `/blog`)</p>
                <p>✅ Indexes {(cmsData.articles || []).filter((a) => a.published).length} published blog articles</p>
                <p>✅ Dynamic XML headers with `application/xml` content-type</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: SEO HEALTH AUDIT & LINK SCANNER */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6">
          {!auditResults ? (
            <div className="p-12 text-center bg-neutral-900/60 border border-white/10 rounded-2xl space-y-4">
              <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">No Audit Results Yet</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Run the automated SEO Health & Broken Link Scanner to evaluate title lengths, meta descriptions, missing social images, and internal link health.
              </p>
              <button
                onClick={runSeoAudit}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Run Scan Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="p-6 bg-neutral-900/90 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full bg-black border-4 border-cyan-400 flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-black font-mono text-cyan-300">{auditResults.score}%</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-urbanist text-white">SEO Health & Quality Score</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {auditResults.score >= 90
                        ? 'Excellent! All core pages have high-quality titles, meta descriptions, and OpenGraph images.'
                        : 'Some pages or articles need meta title or description length adjustments.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-center">
                    <span className="block text-xs text-neutral-400 uppercase font-semibold">Errors</span>
                    <span className="text-lg font-bold text-red-400">
                      {auditResults.issues.filter((i) => i.level === 'error').length}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-center">
                    <span className="block text-xs text-neutral-400 uppercase font-semibold">Warnings</span>
                    <span className="text-lg font-bold text-amber-400">
                      {auditResults.issues.filter((i) => i.level === 'warning').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Identified Issues */}
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">Audited Issues & Recommendations</h3>
                {auditResults.issues.length === 0 ? (
                  <p className="text-xs text-emerald-400">🎉 Perfect score! No SEO issues found.</p>
                ) : (
                  <div className="space-y-2">
                    {auditResults.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              issue.level === 'error'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {issue.level}
                          </span>
                          <span className="font-bold text-white">{issue.target}:</span>
                          <span className="text-neutral-300">{issue.message}</span>
                        </div>

                        {issue.fixKey && (
                          <button
                            onClick={() => {
                              setSelectedPageKey(issue.fixKey!);
                              setActiveSubTab('pages');
                            }}
                            className="px-3 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Fix in Editor
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Link Scanner Report */}
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">Link & Route Health Scan</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {auditResults.linkChecks.map((chk, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-cyan-300">{chk.url}</span>
                        <span className="text-[10px] text-neutral-500 ml-2">({chk.source})</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">✅ {chk.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
