import React, { useState } from 'react';
import type { CmsData, Page, HeroContent, AboutContent, ProjectCtaContent, VideoShowcaseContent, Service, Project, Testimonial, ComparisonItem, ComparisonSectionContent, MediaAsset, Article } from '../../lib/types';
import { defaultCmsContent } from '../../data/defaultCmsContent';
import { ArticleContentBuilder } from './ArticleContentBuilder';

interface PageSectionBuilderProps {
  page: Page;
  cmsData: CmsData;
  onSave: (updatedPage: Page, updatedCmsData: CmsData) => void;
  onClose: () => void;
}

function safeArray<T>(val: any, fallback: T[] = []): T[] {
  if (Array.isArray(val)) return [...val];
  if (val && typeof val === 'object') {
    const vals = Object.values(val) as T[];
    if (vals.length > 0) return vals;
  }
  return Array.isArray(fallback) ? [...fallback] : [];
}

/**
 * Interactive Media Library Picker Modal
 */
function MediaLibraryPickerModal({
  isOpen,
  onClose,
  mediaAssets,
  onSelect,
  onUploadNew,
}: {
  isOpen: boolean;
  onClose: () => void;
  mediaAssets: MediaAsset[];
  onSelect: (url: string) => void;
  onUploadNew?: (newAsset: MediaAsset) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaName, setNewMediaName] = useState('');

  if (!isOpen) return null;

  const filtered = mediaAssets.filter((m) => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-white">
      <div className="w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold font-urbanist text-white flex items-center gap-2">
              <span>🖼️</span> Media Assets Library Picker
            </h3>
            <p className="text-xs text-neutral-400">Select any media asset to attach to this section field</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="py-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-white/5">
          <input
            type="text"
            placeholder="Search media assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <div className="flex items-center gap-2">
            {(['all', 'image', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                  filterType === t
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add Custom Asset */}
        <div className="py-3 px-4 bg-black/40 border border-white/5 rounded-xl my-3 flex flex-col sm:flex-row gap-2 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-semibold text-neutral-400 mb-1">Asset Name</label>
            <input
              type="text"
              placeholder="e.g. New Clinical Suite Photo"
              value={newMediaName}
              onChange={(e) => setNewMediaName(e.target.value)}
              className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex-2 w-full">
            <label className="block text-[10px] font-semibold text-neutral-400 mb-1">Asset Image/Video URL</label>
            <input
              type="text"
              placeholder="/images/... or https://..."
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (newMediaUrl) {
                const asset: MediaAsset = {
                  id: `med-${Date.now()}`,
                  name: newMediaName || 'Custom Uploaded Asset',
                  url: newMediaUrl,
                  type: newMediaUrl.endsWith('.mp4') ? 'video' : 'image',
                };
                if (onUploadNew) onUploadNew(asset);
                onSelect(newMediaUrl);
                onClose();
              }
            }}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            + Use Custom URL
          </button>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2 pr-1">
          {filtered.map((asset) => (
            <button
              key={asset.id}
              onClick={() => {
                onSelect(asset.url);
                onClose();
              }}
              className="group p-2 bg-black/50 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/50 rounded-xl flex flex-col justify-between transition-all cursor-pointer text-left"
            >
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/80 border border-white/5 mb-2 relative flex items-center justify-center">
                {asset.type === 'video' ? (
                  <div className="text-center p-2">
                    <span className="text-2xl">🎬</span>
                    <p className="text-[9px] font-mono text-cyan-400 mt-1">MP4 Video</p>
                  </div>
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/home-hero-image.webp';
                    }}
                  />
                )}
                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] uppercase font-bold text-neutral-300">
                  {asset.type}
                </span>
              </div>
              <p className="font-bold text-xs text-white truncate group-hover:text-cyan-300">{asset.name}</p>
              <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{asset.url}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Dedicated Media Control Field Component (with thumbnail preview & library picker)
 */
function MediaControlField({
  label,
  value,
  onChange,
  mediaAssets,
  onAddMediaAsset,
  type = 'image',
  placeholder = '/images/... or https://...',
}: {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  mediaAssets: MediaAsset[];
  onAddMediaAsset?: (asset: MediaAsset) => void;
  type?: 'image' | 'video';
  placeholder?: string;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // File upload reader helper
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const resultUrl = evt.target?.result as string;
        if (resultUrl) {
          const newAsset: MediaAsset = {
            id: `med-${Date.now()}`,
            name: file.name,
            url: resultUrl,
            type: file.type.startsWith('video') ? 'video' : 'image',
          };
          if (onAddMediaAsset) onAddMediaAsset(newAsset);
          onChange(resultUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <span>{type === 'video' ? '🎬' : '🖼️'}</span>
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>📚 Media Library</span>
          </button>
          <label className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1">
            <span>📤 Upload File</span>
            <input
              type="file"
              accept={type === 'video' ? 'video/*' : 'image/*'}
              onChange={handleLocalFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* URL Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2 bg-black/60 border border-white/15 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
      />

      {/* Live Thumbnail / Media Preview Box */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-neutral-950/80 border border-white/10 rounded-xl overflow-hidden">
          <div className="w-20 h-14 rounded-lg overflow-hidden bg-black/80 border border-white/10 shrink-0 flex items-center justify-center relative">
            {type === 'video' || value.endsWith('.mp4') ? (
              <video src={value} className="w-full h-full object-cover" muted loop autoPlay />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/home-hero-image.webp';
                }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Live Media Asset Preview</p>
            <p className="text-xs font-mono text-neutral-300 truncate mt-0.5">{value}</p>
          </div>
        </div>
      )}

      {/* Modal */}
      <MediaLibraryPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        mediaAssets={mediaAssets}
        onSelect={(selectedUrl) => onChange(selectedUrl)}
        onUploadNew={(newAsset) => {
          if (onAddMediaAsset) onAddMediaAsset(newAsset);
        }}
      />
    </div>
  );
}

export function PageSectionBuilder({ page, cmsData, onSave, onClose }: PageSectionBuilderProps) {
  // Working local copies with safe fallbacks
  const [currentPage, setCurrentPage] = useState<Page>({ ...page });
  const [localHero, setLocalHero] = useState<HeroContent>(() => ({
    ...defaultCmsContent.hero,
    ...(cmsData?.hero || {}),
  }));
  const [localAbout, setLocalAbout] = useState<AboutContent>(() => {
    const base = cmsData?.aboutContent || defaultCmsContent.aboutContent || {
      badge: "About Us",
      title: "380% Retainer Growth over 10 Years",
      subtitle: "How Dr. Ryan Diepenbrock (Diepenbrock Facial Cosmetic Surgery — Fort Wayne, IN) Scaled to Regional Market Dominance Across a Decade of Digital Shift.",
      description: "In an industry where practices fire marketing agencies every 6 to 12 months, Dr. Diepenbrock has trusted our search and patient acquisition architecture for a decade.",
      image: "/images/Eyeball-BC.webp",
      timelineTitle: "Growth Timeline & Retainer Expansion",
      timelineSubtitle: "A decade-long trajectory of expanding partnership and compounding patient consult revenue.",
      milestones: [],
    };
    return {
      badge: base.badge || "About Us",
      title: base.title || "380% Retainer Growth over 10 Years",
      subtitle: base.subtitle || "",
      description: base.description || "",
      image: base.image || "/images/Eyeball-BC.webp",
      timelineTitle: base.timelineTitle || "Growth Timeline & Retainer Expansion",
      timelineSubtitle: base.timelineSubtitle || "",
      milestones: safeArray(base.milestones, defaultCmsContent.aboutContent?.milestones || []),
    };
  });
  const [localCta, setLocalCta] = useState<ProjectCtaContent>(() => ({
    ...defaultCmsContent.projectCta!,
    ...(cmsData?.projectCta || {}),
  }));
  const [localServices, setLocalServices] = useState<Service[]>(() => safeArray(cmsData?.services, defaultCmsContent.services));
  const [localProjects, setLocalProjects] = useState<Project[]>(() => safeArray(cmsData?.projects, defaultCmsContent.projects));
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>(() => safeArray(cmsData?.testimonials, defaultCmsContent.testimonials));
  const [localComparison, setLocalComparison] = useState<ComparisonItem[]>(() => safeArray(cmsData?.comparison, defaultCmsContent.comparison));
  const [localComparisonContent, setLocalComparisonContent] = useState<ComparisonSectionContent>(() => {
    const base = cmsData?.comparisonContent || defaultCmsContent.comparisonContent || {
      badge: "Rented Clicks vs. Owned Authority",
      headline: "Why Traditional Models Fail Plastic Surgeons",
      traditionalTitle: "Traditional Agencies (Rented Clicks)",
      traditionalItems: [],
      seelutionsTitle: "The seelutions Growth Blueprint",
      seelutionsItems: [],
    };
    return {
      badge: base.badge || "Rented Clicks vs. Owned Authority",
      headline: base.headline || "Why Traditional Models Fail Plastic Surgeons",
      traditionalTitle: base.traditionalTitle || "Traditional Agencies (Rented Clicks)",
      traditionalItems: safeArray(base.traditionalItems, defaultCmsContent.comparisonContent?.traditionalItems || []),
      seelutionsTitle: base.seelutionsTitle || "The seelutions Growth Blueprint",
      seelutionsItems: safeArray(base.seelutionsItems, defaultCmsContent.comparisonContent?.seelutionsItems || []),
    };
  });
  const [localArticles, setLocalArticles] = useState<Article[]>(() => safeArray(cmsData?.articles, defaultCmsContent.articles));
  const [localVideo, setLocalVideo] = useState<VideoShowcaseContent>(() => ({
    ...defaultCmsContent.videoShowcase!,
    ...(cmsData?.videoShowcase || {}),
  }));
  const [localMedia, setLocalMedia] = useState<MediaAsset[]>(() => safeArray(cmsData?.media, defaultCmsContent.media));

  // Active section selector
  const isHome = page.slug === 'home' || page.slug === '';
  const isAbout = page.slug === 'about';
  const isServices = page.slug === 'services';
  const isProjects = page.slug === 'projects';
  const isBlog = page.slug === 'blog';

  const defaultSection = isHome ? 'hero' : isAbout ? 'about' : isServices ? 'services' : isProjects ? 'projects' : isBlog ? 'blog' : 'body';
  const [activeSectionId, setActiveSectionId] = useState<string>(defaultSection);
  const [activeViewMode, setActiveViewMode] = useState<'editor' | 'preview'>('editor');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const handleAddNewMediaAsset = (asset: MediaAsset) => {
    setLocalMedia((prev) => [...prev, asset]);
    setHasChanges(true);
  };

  // Sections definition by page
  const sectionsList = [
    ...(isHome ? [
      { id: 'hero', name: 'Hero & Masked Typography', icon: '⚡', description: 'Headline, subheadline, CTAs, video masks and background media' },
      { id: 'about', name: 'About Us & Practice Growth', icon: '🏢', description: 'Editorial narrative, eyeball aesthetic & retainer milestones' },
      { id: 'comparison', name: 'Why Traditional Models Fail Plastic Surgeons', icon: '⚖️', description: 'COMPARING: Rented Clicks vs. Owned Authority & seelutions Growth Blueprint' },
      { id: 'services', name: 'Selected Services (01–05)', icon: '💼', description: '5 core surgical acquisition services, copy and cover images' },
      { id: 'projects', name: '10-Year Case Study Timeline', icon: '📈', description: 'Practice growth trajectory from 2016 to modern AI search' },
      { id: 'video', name: 'Architectural Video Showcase', icon: '🎥', description: 'Cinematic looping showcase video and poster frame media' },
      { id: 'testimonials', name: 'Surgeon Testimonials', icon: '⭐', description: 'Client reviews, credentials, star ratings & surgeon avatars' },
      { id: 'blog', name: 'Patient Grower Editorial', icon: '📰', description: 'AI search & practice economics intelligence articles' },
      { id: 'cta', name: 'Practice Digital Audit CTA', icon: '🎯', description: 'Dark high-conversion audit consultation banner & background image' },
    ] : []),
    ...(isAbout ? [
      { id: 'about', name: 'About Narrative & Aesthetic', icon: '🏢', description: 'Editorial narrative & visual aesthetic media' },
      { id: 'cta', name: 'Consultation CTA Banner', icon: '🎯', description: 'Digital audit call to action' },
    ] : []),
    ...(isServices ? [
      { id: 'services-header', name: 'Capabilities Header', icon: '💼', description: 'Services overview headline and intro' },
      { id: 'services', name: 'Services Offerings (01–05)', icon: '🛠️', description: 'The 5 surgical marketing service pillars and cover photos' },
      { id: 'cta', name: 'Consultation CTA Banner', icon: '🎯', description: 'Digital audit call to action' },
    ] : []),
    ...(isProjects ? [
      { id: 'projects-header', name: 'Case Study Overview', icon: '📈', description: '10-year practice case study headline' },
      { id: 'projects', name: 'Growth Milestones Grid', icon: '🏆', description: 'Year-by-year budget & procedure strategy milestones' },
      { id: 'cta', name: 'Consultation CTA Banner', icon: '🎯', description: 'Digital audit call to action' },
    ] : []),
    ...(isBlog ? [
      { id: 'blog-header', name: 'Publication Header', icon: '📰', description: 'Patient Grower publication intro and positioning' },
      { id: 'blog', name: 'Intelligence Articles', icon: '✍️', description: 'Editorial case studies and AI search articles' },
      { id: 'cta', name: 'Consultation CTA Banner', icon: '🎯', description: 'Digital audit call to action' },
    ] : []),
    { id: 'body', name: 'Custom Page Body (Rich Text & Media)', icon: '📝', description: 'Semantic HTML, headers, images, captions and media prose block' },
  ];

  const handleSaveAll = () => {
    const updatedCmsData: CmsData = {
      ...cmsData,
      hero: localHero,
      aboutContent: localAbout,
      projectCta: localCta,
      services: localServices,
      projects: localProjects,
      testimonials: localTestimonials,
      articles: localArticles,
      comparison: localComparison,
      comparisonContent: localComparisonContent,
      videoShowcase: localVideo,
      media: localMedia,
      pages: cmsData.pages.map((p) => (p.id === currentPage.id ? currentPage : p)),
    };
    onSave(currentPage, updatedCmsData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-xl flex flex-col overflow-hidden text-neutral-100 font-sans">
      {/* Top Header */}
      <header className="h-16 px-6 bg-[#050b1a] border-b border-white/10 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-auto flex items-center justify-center p-1">
            <img
              src="/images/seelutions%20Full%20Logo%20on%20White%20Background.png"
              alt="seelutions Logo"
              className="h-full w-auto object-contain filter brightness-0 invert"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-urbanist">{currentPage.title} Content &amp; Media</h2>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono">
                /{currentPage.slug}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">seelutions Section-Wise Page Content &amp; Media Assets Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'editor'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🧩 Section Form Editor
            </button>
            <button
              onClick={() => setActiveViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'preview'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              👁️ Live Section Preview
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Save Page &amp; Sections</span>
          </button>
        </div>
      </header>

      {/* Main Builder Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sections Sidebar */}
        <aside className="w-80 bg-[#050b1a]/70 border-r border-white/10 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              PAGE STRUCTURE &amp; SECTIONS
            </span>
            <p className="text-xs text-neutral-400 mt-0.5">Click any section to edit its content and media</p>
          </div>

          <div className="p-3 space-y-1.5">
            {sectionsList.map((sec, idx) => {
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 border ${
                    isActive
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/5'
                      : 'bg-white/[0.02] border-white/5 text-neutral-300 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="text-lg p-1 rounded-lg bg-black/40 border border-white/10 flex-shrink-0">
                    {sec.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-urbanist truncate text-white">
                        {sec.name}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500">#{idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {sec.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content & Media Editor */}
        <main className="flex-1 overflow-y-auto bg-[#030712] p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Active Section Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  EDITING SECTION
                </span>
                <h3 className="text-2xl font-bold font-urbanist text-white">
                  {sectionsList.find((s) => s.id === activeSectionId)?.name}
                </h3>
              </div>
              <span className="text-xs text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {sectionsList.find((s) => s.id === activeSectionId)?.icon} Active Block
              </span>
            </div>

            {/* SECTION 1: HERO SECTION */}
            {activeSectionId === 'hero' && (
              <div className="space-y-6">
                {activeViewMode === 'editor' ? (
                  <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Eyebrow Tag Badge
                      </label>
                      <input
                        type="text"
                        value={localHero.eyebrowTag}
                        onChange={(e) => {
                          setLocalHero({ ...localHero, eyebrowTag: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Masked Title Line 1
                        </label>
                        <input
                          type="text"
                          value={localHero.titleLine1}
                          onChange={(e) => {
                            setLocalHero({ ...localHero, titleLine1: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Masked Title Line 2
                        </label>
                        <input
                          type="text"
                          value={localHero.titleLine2}
                          onChange={(e) => {
                            setLocalHero({ ...localHero, titleLine2: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={localHero.headline}
                        onChange={(e) => {
                          setLocalHero({ ...localHero, headline: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Subheadline &amp; Value Proposition
                      </label>
                      <textarea
                        rows={3}
                        value={localHero.subheadline}
                        onChange={(e) => {
                          setLocalHero({ ...localHero, subheadline: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                      />
                    </div>

                    {/* HERO MEDIA CONTROLS */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        Hero Section Media &amp; Video Assets
                      </h4>

                      <MediaControlField
                        label="Hero Banner Poster Frame Image"
                        value={localHero.bannerPosterUrl || '/images/home-hero-image.webp'}
                        onChange={(url) => {
                          setLocalHero({ ...localHero, bannerPosterUrl: url });
                          setHasChanges(true);
                        }}
                        mediaAssets={localMedia}
                        onAddMediaAsset={handleAddNewMediaAsset}
                        type="image"
                      />

                      <MediaControlField
                        label="Hero Background Looping Video (MP4)"
                        value={localHero.bannerVideoUrl || '/videos/eyeball-showcase.mp4'}
                        onChange={(url) => {
                          setLocalHero({ ...localHero, bannerVideoUrl: url });
                          setHasChanges(true);
                        }}
                        mediaAssets={localMedia}
                        onAddMediaAsset={handleAddNewMediaAsset}
                        type="video"
                      />

                      <MediaControlField
                        label="Title Typography Mask Video (MP4)"
                        value={localHero.titleVideoUrl || '/videos/title-video.mp4'}
                        onChange={(url) => {
                          setLocalHero({ ...localHero, titleVideoUrl: url });
                          setHasChanges(true);
                        }}
                        mediaAssets={localMedia}
                        onAddMediaAsset={handleAddNewMediaAsset}
                        type="video"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Primary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={localHero.primaryCtaText}
                          onChange={(e) => {
                            setLocalHero({ ...localHero, primaryCtaText: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Primary CTA Link
                        </label>
                        <input
                          type="text"
                          value={localHero.primaryCtaLink}
                          onChange={(e) => {
                            setLocalHero({ ...localHero, primaryCtaLink: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Secondary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={localHero.secondaryCtaText}
                          onChange={(e) => {
                            setLocalHero({ ...localHero, secondaryCtaText: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Secondary CTA Link
                        </label>
                        <input
                          type="text"
                          value={localHero.secondaryCtaLink}
                          onChange={(e) => {
                            setLocalHero({ ...localHero, secondaryCtaLink: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black border border-white/15 rounded-2xl p-8 space-y-6">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                      {localHero.eyebrowTag}
                    </span>
                    <h1 className="text-5xl font-black text-white font-urbanist tracking-tighter uppercase">
                      {localHero.titleLine1} <br />
                      {localHero.titleLine2}
                    </h1>
                    <h2 className="text-2xl font-bold text-white max-w-2xl">{localHero.headline}</h2>
                    <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">{localHero.subheadline}</p>
                    <div className="flex gap-4 pt-2">
                      <span className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-full">
                        {localHero.primaryCtaText} &rarr;
                      </span>
                      <span className="px-5 py-2.5 bg-white/10 text-white font-medium text-xs rounded-full border border-white/20">
                        {localHero.secondaryCtaText}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: ABOUT SECTION */}
            {activeSectionId === 'about' && (
              <div className="space-y-6">
                {activeViewMode === 'editor' ? (
                  <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Section Label Badge
                      </label>
                      <input
                        type="text"
                        value={localAbout.badge}
                        onChange={(e) => {
                          setLocalAbout({ ...localAbout, badge: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                      />
                    </div>

                    {/* About Section Media Control */}
                    <MediaControlField
                      label="Dr. Diepenbrock Video Poster / Static Thumbnail"
                      value={localAbout.image || '/images/dr-diepenbrock-thumbnail.jpg'}
                      onChange={(url) => {
                        setLocalAbout({ ...localAbout, image: url });
                        setHasChanges(true);
                      }}
                      mediaAssets={localMedia}
                      onAddMediaAsset={handleAddNewMediaAsset}
                      type="image"
                    />

                    <MediaControlField
                      label="Dr. Diepenbrock Video Testimonial (MOV / MP4)"
                      value={localAbout.videoUrl || '/videos/Dr%20Diepenbrock%20Testimonial%20Video.mov'}
                      onChange={(url) => {
                        setLocalAbout({ ...localAbout, videoUrl: url });
                        setHasChanges(true);
                      }}
                      mediaAssets={localMedia}
                      onAddMediaAsset={handleAddNewMediaAsset}
                      type="video"
                    />

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Statement Title
                      </label>
                      <input
                        type="text"
                        value={localAbout.title}
                        onChange={(e) => {
                          setLocalAbout({ ...localAbout, title: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Subtitle / Doctor Case Study Attribution
                      </label>
                      <textarea
                        rows={2}
                        value={localAbout.subtitle}
                        onChange={(e) => {
                          setLocalAbout({ ...localAbout, subtitle: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Editorial Narrative Description
                      </label>
                      <textarea
                        rows={4}
                        value={localAbout.description}
                        onChange={(e) => {
                          setLocalAbout({ ...localAbout, description: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                      />
                    </div>

                    {/* Timeline Block Content */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <h4 className="text-sm font-bold text-cyan-300">Growth Timeline &amp; Retainer Expansion Block</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            Timeline Card Title
                          </label>
                          <input
                            type="text"
                            value={localAbout.timelineTitle}
                            onChange={(e) => {
                              setLocalAbout({ ...localAbout, timelineTitle: e.target.value });
                              setHasChanges(true);
                            }}
                            className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            Timeline Card Subtitle
                          </label>
                          <input
                            type="text"
                            value={localAbout.timelineSubtitle}
                            onChange={(e) => {
                              setLocalAbout({ ...localAbout, timelineSubtitle: e.target.value });
                              setHasChanges(true);
                            }}
                            className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                          Milestones List ({(localAbout.milestones || []).length})
                        </label>
                        {(localAbout.milestones || []).map((m, mIdx) => (
                          <div key={mIdx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-black/40 rounded-xl border border-white/10">
                            <div>
                              <input
                                type="text"
                                value={m.yearBudget}
                                onChange={(e) => {
                                  const updated = [...localAbout.milestones];
                                  updated[mIdx].yearBudget = e.target.value;
                                  setLocalAbout({ ...localAbout, milestones: updated });
                                  setHasChanges(true);
                                }}
                                className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-cyan-300 text-xs font-bold"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={m.text}
                                onChange={(e) => {
                                  const updated = [...localAbout.milestones];
                                  updated[mIdx].text = e.target.value;
                                  setLocalAbout({ ...localAbout, milestones: updated });
                                  setHasChanges(true);
                                }}
                                className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white text-black p-8 rounded-2xl space-y-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      {localAbout.badge}
                    </span>
                    <h2 className="text-3xl font-bold">{localAbout.title}</h2>
                    <p className="text-lg font-medium text-neutral-800">{localAbout.subtitle}</p>
                    <p className="text-neutral-600 text-sm leading-relaxed">{localAbout.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* SECTION: COMPARISON (WHY TRADITIONAL MODELS FAIL PLASTIC SURGEONS) */}
            {activeSectionId === 'comparison' && (
              <div className="space-y-6">
                {activeViewMode === 'editor' ? (
                  <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div>
                        <h3 className="text-sm font-bold text-cyan-300 font-urbanist flex items-center gap-2">
                          <span>⚖️</span>
                          <span>Why Traditional Models Fail Plastic Surgeons Content</span>
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Update comparison headlines, traditional vs seelutions points, and metric comparison table.
                        </p>
                      </div>
                    </div>

                    {/* Badge & Headline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Section Eyebrow Badge
                        </label>
                        <input
                          type="text"
                          value={localComparisonContent.badge}
                          onChange={(e) => {
                            setLocalComparisonContent({ ...localComparisonContent, badge: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                          placeholder="Rented Clicks vs. Owned Authority"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Section Main Headline
                        </label>
                        <input
                          type="text"
                          value={localComparisonContent.headline}
                          onChange={(e) => {
                            setLocalComparisonContent({ ...localComparisonContent, headline: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold"
                          placeholder="Why Traditional Models Fail Plastic Surgeons"
                        />
                      </div>
                    </div>

                    {/* Column 1: Traditional Agencies */}
                    <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                          <span>❌</span>
                          <span>Column 1: Traditional Models / Agencies Title</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...(localComparisonContent.traditionalItems || []),
                              { id: `trad-${Date.now()}`, title: 'New Flaw', description: 'Description of traditional model flaw' },
                            ];
                            setLocalComparisonContent({ ...localComparisonContent, traditionalItems: updated });
                            setHasChanges(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg cursor-pointer"
                        >
                          + Add Flaw Card
                        </button>
                      </div>

                      <input
                        type="text"
                        value={localComparisonContent.traditionalTitle}
                        onChange={(e) => {
                          setLocalComparisonContent({ ...localComparisonContent, traditionalTitle: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-xl text-white text-xs font-bold"
                        placeholder="Traditional Agencies (Rented Clicks)"
                      />

                      <div className="space-y-3">
                        {(localComparisonContent.traditionalItems || []).map((item, idx) => (
                          <div key={item.id || idx} className="p-3 bg-black/60 border border-red-500/20 rounded-xl space-y-2 relative group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-red-400 font-bold">Flaw #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = localComparisonContent.traditionalItems.filter((_, i) => i !== idx);
                                  setLocalComparisonContent({ ...localComparisonContent, traditionalItems: updated });
                                  setHasChanges(true);
                                }}
                                className="text-xs text-neutral-400 hover:text-red-400 cursor-pointer"
                                title="Remove item"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...localComparisonContent.traditionalItems];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setLocalComparisonContent({ ...localComparisonContent, traditionalItems: updated });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-semibold"
                              placeholder="Title (e.g. Rented Clicks)"
                            />
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const updated = [...localComparisonContent.traditionalItems];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setLocalComparisonContent({ ...localComparisonContent, traditionalItems: updated });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-neutral-300 text-xs leading-relaxed"
                              placeholder="Description..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: seelutions Model */}
                    <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                          <span>✨</span>
                          <span>Column 2: seelutions Blueprint Title</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...(localComparisonContent.seelutionsItems || []),
                              { id: `seel-${Date.now()}`, title: 'New Advantage', description: 'Description of seelutions advantage' },
                            ];
                            setLocalComparisonContent({ ...localComparisonContent, seelutionsItems: updated });
                            setHasChanges(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg cursor-pointer"
                        >
                          + Add Advantage Card
                        </button>
                      </div>

                      <input
                        type="text"
                        value={localComparisonContent.seelutionsTitle}
                        onChange={(e) => {
                          setLocalComparisonContent({ ...localComparisonContent, seelutionsTitle: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-xl text-white text-xs font-bold"
                        placeholder="The seelutions Growth Blueprint"
                      />

                      <div className="space-y-3">
                        {(localComparisonContent.seelutionsItems || []).map((item, idx) => (
                          <div key={item.id || idx} className="p-3 bg-black/60 border border-cyan-500/20 rounded-xl space-y-2 relative group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-cyan-400 font-bold">Advantage #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = localComparisonContent.seelutionsItems.filter((_, i) => i !== idx);
                                  setLocalComparisonContent({ ...localComparisonContent, seelutionsItems: updated });
                                  setHasChanges(true);
                                }}
                                className="text-xs text-neutral-400 hover:text-cyan-400 cursor-pointer"
                                title="Remove item"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...localComparisonContent.seelutionsItems];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setLocalComparisonContent({ ...localComparisonContent, seelutionsItems: updated });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-semibold"
                              placeholder="Title (e.g. Owned Search Equity)"
                            />
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const updated = [...localComparisonContent.seelutionsItems];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setLocalComparisonContent({ ...localComparisonContent, seelutionsItems: updated });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-neutral-300 text-xs leading-relaxed"
                              placeholder="Description..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metric Comparison Matrix */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            Side-by-Side Metric Comparison Table Rows
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Detailed line-by-line metrics comparing traditional models vs seelutions organic authority.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newRow: ComparisonItem = {
                              id: `comp-${Date.now()}`,
                              metric: 'New Comparison Metric',
                              rentedClicks: 'Traditional agency performance',
                              organicAuthority: 'seelutions performance',
                            };
                            setLocalComparison([...localComparison, newRow]);
                            setHasChanges(true);
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl cursor-pointer"
                        >
                          + Add Comparison Metric Row
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(localComparison || []).map((row, idx) => (
                          <div key={row.id || idx} className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <span className="text-xs font-bold font-mono text-cyan-400">Metric Row #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = localComparison.filter((_, i) => i !== idx);
                                  setLocalComparison(updated);
                                  setHasChanges(true);
                                }}
                                className="text-xs text-neutral-400 hover:text-red-400 cursor-pointer"
                              >
                                Delete Row
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                                  Metric Name
                                </label>
                                <input
                                  type="text"
                                  value={row.metric}
                                  onChange={(e) => {
                                    const updated = [...localComparison];
                                    updated[idx].metric = e.target.value;
                                    setLocalComparison(updated);
                                    setHasChanges(true);
                                  }}
                                  className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-semibold text-red-400 mb-1">
                                  Traditional Model
                                </label>
                                <input
                                  type="text"
                                  value={row.rentedClicks}
                                  onChange={(e) => {
                                    const updated = [...localComparison];
                                    updated[idx].rentedClicks = e.target.value;
                                    setLocalComparison(updated);
                                    setHasChanges(true);
                                  }}
                                  className="w-full px-3 py-1.5 bg-black/60 border border-red-500/30 rounded-lg text-neutral-200 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-semibold text-cyan-400 mb-1">
                                  seelutions Authority
                                </label>
                                <input
                                  type="text"
                                  value={row.organicAuthority}
                                  onChange={(e) => {
                                    const updated = [...localComparison];
                                    updated[idx].organicAuthority = e.target.value;
                                    setLocalComparison(updated);
                                    setHasChanges(true);
                                  }}
                                  className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded-lg text-neutral-200 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Preview Mode */
                  <div className="bg-neutral-950 text-white p-8 rounded-2xl border border-white/10 space-y-8">
                    <div className="text-center space-y-2">
                      <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                        {localComparisonContent.badge}
                      </span>
                      <h2 className="text-3xl font-black font-urbanist">{localComparisonContent.headline}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-red-400">{localComparisonContent.traditionalTitle}</h3>
                        <div className="space-y-3">
                          {(localComparisonContent.traditionalItems || []).map((item, idx) => (
                            <div key={idx} className="p-3 bg-black/40 rounded-xl">
                              <h4 className="font-bold text-xs text-white">{item.title}</h4>
                              <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-cyan-400">{localComparisonContent.seelutionsTitle}</h3>
                        <div className="space-y-3">
                          {(localComparisonContent.seelutionsItems || []).map((item, idx) => (
                            <div key={idx} className="p-3 bg-black/40 rounded-xl">
                              <h4 className="font-bold text-xs text-white">{item.title}</h4>
                              <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: SERVICES SECTION */}
            {(activeSectionId === 'services' || activeSectionId === 'services-header') && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {(localServices || []).map((srv, idx) => (
                    <div key={srv.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-mono font-bold text-cyan-400">Service #{srv.number}</span>
                        <span className="text-xs text-neutral-500">ID: {srv.id}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Number</label>
                          <input
                            type="text"
                            value={srv.number}
                            onChange={(e) => {
                              const updated = [...localServices];
                              updated[idx].number = e.target.value;
                              setLocalServices(updated);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Service Title</label>
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => {
                              const updated = [...localServices];
                              updated[idx].title = e.target.value;
                              setLocalServices(updated);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Service Media Image Picker */}
                      <MediaControlField
                        label={`Service #${srv.number} Cover Photo`}
                        value={srv.image || '/images/home-hero-image.webp'}
                        onChange={(url) => {
                          const updated = [...localServices];
                          updated[idx].image = url;
                          setLocalServices(updated);
                          setHasChanges(true);
                        }}
                        mediaAssets={localMedia}
                        onAddMediaAsset={handleAddNewMediaAsset}
                        type="image"
                      />

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={srv.description}
                          onChange={(e) => {
                            const updated = [...localServices];
                            updated[idx].description = e.target.value;
                            setLocalServices(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: PROJECTS / CASE STUDIES */}
            {(activeSectionId === 'projects' || activeSectionId === 'projects-header') && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {(localProjects || []).map((prj, idx) => (
                    <div key={prj.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-mono font-bold text-cyan-400">Case Study #{prj.number}</span>
                        <span className="text-xs text-neutral-500">{prj.category}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Case Title</label>
                          <input
                            type="text"
                            value={prj.title}
                            onChange={(e) => {
                              const updated = [...localProjects];
                              updated[idx].title = e.target.value;
                              setLocalProjects(updated);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Category / Surgery Focus</label>
                          <input
                            type="text"
                            value={prj.category}
                            onChange={(e) => {
                              const updated = [...localProjects];
                              updated[idx].category = e.target.value;
                              setLocalProjects(updated);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Project Case Cover Media Picker */}
                      <MediaControlField
                        label={`Case Study #${prj.number} Cover Image`}
                        value={prj.image || '/images/home-hero-image.webp'}
                        onChange={(url) => {
                          const updated = [...localProjects];
                          updated[idx].image = url;
                          setLocalProjects(updated);
                          setHasChanges(true);
                        }}
                        mediaAssets={localMedia}
                        onAddMediaAsset={handleAddNewMediaAsset}
                        type="image"
                      />

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Description / Growth Metric</label>
                        <textarea
                          rows={2}
                          value={prj.description}
                          onChange={(e) => {
                            const updated = [...localProjects];
                            updated[idx].description = e.target.value;
                            setLocalProjects(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: VIDEO SHOWCASE */}
            {activeSectionId === 'video' && (
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Architectural Video Showcase Media
                </h4>

                <MediaControlField
                  label="Showcase Video Poster Frame Image"
                  value={localVideo.posterUrl || '/images/home-hero-image.webp'}
                  onChange={(url) => {
                    setLocalVideo({ ...localVideo, posterUrl: url });
                    setHasChanges(true);
                  }}
                  mediaAssets={localMedia}
                  onAddMediaAsset={handleAddNewMediaAsset}
                  type="image"
                />

                <MediaControlField
                  label="Cinematic Showcase Video (MP4)"
                  value={localVideo.videoUrl || '/videos/eyeball-showcase.mp4'}
                  onChange={(url) => {
                    setLocalVideo({ ...localVideo, videoUrl: url });
                    setHasChanges(true);
                  }}
                  mediaAssets={localMedia}
                  onAddMediaAsset={handleAddNewMediaAsset}
                  type="video"
                />

                <MediaControlField
                  label="Title Mask Video (MP4)"
                  value={localVideo.titleVideoUrl || '/videos/title-video.mp4'}
                  onChange={(url) => {
                    setLocalVideo({ ...localVideo, titleVideoUrl: url });
                    setHasChanges(true);
                  }}
                  mediaAssets={localMedia}
                  onAddMediaAsset={handleAddNewMediaAsset}
                  type="video"
                />
              </div>
            )}

            {/* SECTION 6: TESTIMONIALS */}
            {activeSectionId === 'testimonials' && (
              <div className="space-y-4">
                {(localTestimonials || []).map((t, idx) => (
                  <div key={t.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Doctor Name &amp; Credentials</label>
                        <input
                          type="text"
                          value={t.author}
                          onChange={(e) => {
                            const updated = [...localTestimonials];
                            updated[idx].author = e.target.value;
                            setLocalTestimonials(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Role / Clinic</label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const updated = [...localTestimonials];
                            updated[idx].role = e.target.value;
                            setLocalTestimonials(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Surgeon Avatar Media Field */}
                    <MediaControlField
                      label={`Surgeon Avatar Photo (${t.author || 'Doctor'})`}
                      value={t.avatar || '/images/home-hero-image.webp'}
                      onChange={(url) => {
                        const updated = [...localTestimonials];
                        updated[idx].avatar = url;
                        setLocalTestimonials(updated);
                        setHasChanges(true);
                      }}
                      mediaAssets={localMedia}
                      onAddMediaAsset={handleAddNewMediaAsset}
                      type="image"
                    />

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Testimonial Quote</label>
                      <textarea
                        rows={2}
                        value={t.quote}
                        onChange={(e) => {
                          const updated = [...localTestimonials];
                          updated[idx].quote = e.target.value;
                          setLocalTestimonials(updated);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION: BLOG / PATIENT GROWER EDITORIAL */}
            {(activeSectionId === 'blog' || activeSectionId === 'blog-header') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <span>📰</span>
                      <span>Patient Grower Editorial Articles &amp; Media</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Update intelligence articles, editorial headlines, excerpts, and cover photos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newArt: Article = {
                        id: `art-${Date.now()}`,
                        slug: `new-article-${Date.now()}`,
                        category: 'Practice Growth',
                        date: 'Oct 2024',
                        readTime: '5 Min Read',
                        title: 'New Editorial Article Title',
                        excerpt: 'Article summary excerpt...',
                        content: '<h2>Article Section Title</h2><p>Article body content...</p>',
                        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85',
                        published: true,
                      };
                      setLocalArticles([...localArticles, newArt]);
                      setHasChanges(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-xl cursor-pointer"
                  >
                    + Add New Article
                  </button>
                </div>

                <div className="space-y-4">
                  {(localArticles || []).map((art, idx) => (
                    <div key={art.id || idx} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-mono font-bold text-cyan-400">Article #{idx + 1} ({art.slug})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = localArticles.filter((_, i) => i !== idx);
                            setLocalArticles(updated);
                            setHasChanges(true);
                          }}
                          className="text-xs text-neutral-400 hover:text-red-400 cursor-pointer"
                        >
                          Delete Article
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Article Headline / Title</label>
                          <input
                            type="text"
                            value={art.title}
                            onChange={(e) => {
                              const updated = [...localArticles];
                              updated[idx].title = e.target.value;
                              setLocalArticles(updated);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Category</label>
                          <input
                            type="text"
                            value={art.category}
                            onChange={(e) => {
                              const updated = [...localArticles];
                              updated[idx].category = e.target.value;
                              setLocalArticles(updated);
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Cover Photo Media Control */}
                      <MediaControlField
                        label={`Article #${idx + 1} Cover Image`}
                        value={art.image || '/images/home-hero-image.webp'}
                        onChange={(url) => {
                          const updated = [...localArticles];
                          updated[idx].image = url;
                          setLocalArticles(updated);
                          setHasChanges(true);
                        }}
                        mediaAssets={localMedia}
                        onAddMediaAsset={handleAddNewMediaAsset}
                        type="image"
                      />

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Excerpt Summary</label>
                        <textarea
                          rows={2}
                          value={art.excerpt}
                          onChange={(e) => {
                            const updated = [...localArticles];
                            updated[idx].excerpt = e.target.value;
                            setLocalArticles(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 7: PROJECT CTA */}
            {activeSectionId === 'cta' && (
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    CTA Badge Label
                  </label>
                  <input
                    type="text"
                    value={localCta.badge}
                    onChange={(e) => {
                      setLocalCta({ ...localCta, badge: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>

                {/* Consultation CTA Background Image Media Control */}
                <MediaControlField
                  label="Digital Audit Banner Background Image"
                  value={localCta.backgroundImage || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2100&q=85'}
                  onChange={(url) => {
                    setLocalCta({ ...localCta, backgroundImage: url });
                    setHasChanges(true);
                  }}
                  mediaAssets={localMedia}
                  onAddMediaAsset={handleAddNewMediaAsset}
                  type="image"
                />

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={localCta.headline}
                    onChange={(e) => {
                      setLocalCta({ ...localCta, headline: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Description &amp; Offer
                  </label>
                  <textarea
                    rows={3}
                    value={localCta.description}
                    onChange={(e) => {
                      setLocalCta({ ...localCta, description: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={localCta.buttonText}
                      onChange={(e) => {
                        setLocalCta({ ...localCta, buttonText: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Button Link Target
                    </label>
                    <input
                      type="text"
                      value={localCta.buttonLink}
                      onChange={(e) => {
                        setLocalCta({ ...localCta, buttonLink: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOM PAGE BODY (RICH TEXT & MEDIA EMBED) */}
            {activeSectionId === 'body' && (
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Custom Page Rich Text Body &amp; Media Embeds
                  </h4>
                  <span className="text-[10px] text-neutral-400">Semantic HTML and Media</span>
                </div>

                <ArticleContentBuilder
                  value={currentPage.content || ''}
                  onChange={(newContent) => {
                    setCurrentPage({ ...currentPage, content: newContent });
                    setHasChanges(true);
                  }}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
