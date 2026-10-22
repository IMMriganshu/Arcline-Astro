import React, { useState } from 'react';
import type { CmsData, Page, HeroContent, AboutContent, ProjectCtaContent, VideoShowcaseContent, Service, Project, Testimonial, ComparisonItem } from '../../lib/types';
import { ArticleContentBuilder } from './ArticleContentBuilder';

interface PageSectionBuilderProps {
  page: Page;
  cmsData: CmsData;
  onSave: (updatedPage: Page, updatedCmsData: CmsData) => void;
  onClose: () => void;
}

export function PageSectionBuilder({ page, cmsData, onSave, onClose }: PageSectionBuilderProps) {
  // Working local copies
  const [currentPage, setCurrentPage] = useState<Page>({ ...page });
  const [localHero, setLocalHero] = useState<HeroContent>({ ...cmsData.hero });
  const [localAbout, setLocalAbout] = useState<AboutContent>({
    badge: cmsData.aboutContent?.badge || "About Us",
    title: cmsData.aboutContent?.title || "380% Retainer Growth over 10 Years",
    subtitle: cmsData.aboutContent?.subtitle || "How Dr. Ryan Diepenbrock (Diepenbrock Facial Cosmetic Surgery — Fort Wayne, IN) Scaled to Regional Market Dominance Across a Decade of Digital Shift.",
    description: cmsData.aboutContent?.description || "In an industry where practices fire marketing agencies every 6 to 12 months, Dr. Diepenbrock has trusted our search and patient acquisition architecture for a decade. By evolving renewedlook.com from basic local search in 2016 to modern AI Search (AEO) and high-converting procedure hubs today, his monthly reinvestment grew nearly 4x—driven entirely by compounding patient consult revenue.",
    image: cmsData.aboutContent?.image || "/images/Eyeball-BC.webp",
    timelineTitle: cmsData.aboutContent?.timelineTitle || "Growth Timeline & Retainer Expansion",
    timelineSubtitle: cmsData.aboutContent?.timelineSubtitle || "A decade-long trajectory of expanding partnership and compounding patient consult revenue.",
    milestones: cmsData.aboutContent?.milestones || [
      { yearBudget: "2016 • $1,000/mo", text: "Foundational Local Search & Core Pages" },
      { yearBudget: "2018 • $1,500/mo", text: "Procedure Page Architecture & Gallery UX" },
      { yearBudget: "2021 • $3,000/mo", text: "Mobile-First Conversion & Map Pack Expansion" },
      { yearBudget: "2024–Present • $3,800/mo", text: "Generative AI Search (GEO) & Entity Dominance" },
    ],
  });
  const [localCta, setLocalCta] = useState<ProjectCtaContent>({
    badge: cmsData.projectCta?.badge || "PRACTICE DIGITAL AUDIT",
    headline: cmsData.projectCta?.headline || "Is Your Practice Visible in Modern AI & Google Search?",
    description: cmsData.projectCta?.description || "Claim a customized, 3-minute video analysis of your practice's digital footprint. We'll walk through your site, identify where high-ticket patient consults are leaking to local competitors, and show you how to fix it.",
    buttonText: cmsData.projectCta?.buttonText || "Request Your Free 3-Minute Practice Audit",
    buttonLink: cmsData.projectCta?.buttonLink || "#contact",
    backgroundImage: cmsData.projectCta?.backgroundImage || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2100&q=85",
  });
  const [localServices, setLocalServices] = useState<Service[]>([...cmsData.services]);
  const [localProjects, setLocalProjects] = useState<Project[]>([...cmsData.projects]);
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([...cmsData.testimonials]);
  const [localComparison, setLocalComparison] = useState<ComparisonItem[]>([...cmsData.comparison]);
  const [localVideo, setLocalVideo] = useState<VideoShowcaseContent>({
    videoUrl: cmsData.videoShowcase?.videoUrl || "/videos/eyeball-showcase.mp4",
    titleVideoUrl: cmsData.videoShowcase?.titleVideoUrl || "/videos/title-video.mp4",
    posterUrl: cmsData.videoShowcase?.posterUrl || "/images/home-hero-image.webp",
  });

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

  // Sections definition by page
  const sectionsList = [
    ...(isHome ? [
      { id: 'hero', name: 'Hero & Masked Typography', icon: '⚡', description: 'Headline, subheadline, CTAs and video masks' },
      { id: 'about', name: 'About Us & Practice Growth', icon: '🏢', description: 'Editorial narrative, eyeball aesthetic & retainer milestones' },
      { id: 'comparison', name: 'Search vs PPC Matrix', icon: '⚖️', description: 'Rented clicks vs owned search authority comparison' },
      { id: 'services', name: 'Selected Services (01–05)', icon: '💼', description: '5 core surgical acquisition services and descriptions' },
      { id: 'projects', name: '10-Year Case Study Timeline', icon: '📈', description: 'Practice growth trajectory from 2016 to modern AI search' },
      { id: 'video', name: 'Architectural Video Showcase', icon: '🎥', description: 'Cinematic looping showcase video and modal player' },
      { id: 'testimonials', name: 'Surgeon Testimonials', icon: '⭐️', description: 'Client reviews, credentials, star ratings & quotes' },
      { id: 'blog', name: 'Patient Grower Editorial', icon: '📰', description: 'AI search & practice economics intelligence articles' },
      { id: 'cta', name: 'Practice Digital Audit CTA', icon: '🎯', description: 'Dark high-conversion audit consultation banner' },
    ] : []),
    ...(isAbout ? [
      { id: 'about', name: 'About Narrative & Statement', icon: '🏢', description: '380% retainer growth statement and surgical story' },
      { id: 'about-timeline', name: 'Retainer Growth Milestones', icon: '📈', description: 'A decade of evolving partnership milestones' },
      { id: 'cta', name: 'Consultation CTA Banner', icon: '🎯', description: 'Digital audit call to action' },
    ] : []),
    ...(isServices ? [
      { id: 'services-header', name: 'Capabilities Header', icon: '💼', description: 'Services overview headline and intro' },
      { id: 'services', name: 'Services Offerings (01–05)', icon: '🛠️', description: 'The 5 surgical marketing and search service pillars' },
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
    { id: 'body', name: 'Custom Page Body (Rich Text)', icon: '📝', description: 'Semantic HTML, headers, images, captions and prose block' },
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
      comparison: localComparison,
      videoShowcase: localVideo,
      pages: cmsData.pages.map((p) => (p.id === currentPage.id ? currentPage : p)),
    };
    onSave(currentPage, updatedCmsData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-xl flex flex-col overflow-hidden text-neutral-100">
      {/* Top WordPress-Style Header */}
      <header className="h-16 px-6 bg-[#050b1a] border-b border-white/10 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            WP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-urbanist">{currentPage.title}</h2>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                /{currentPage.slug}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">WordPress-Style Section-Wise Page Content Builder</p>
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

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {/* Save Page button */}
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

      {/* Main Builder Body: Left Sections Navigator + Right Section Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sections Sidebar (Gutenberg / Elementor block outline style) */}
        <aside className="w-80 bg-[#050b1a]/70 border-r border-white/10 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Page Structure &amp; Sections
            </span>
            <p className="text-xs text-neutral-400 mt-0.5">Click any section to edit its content</p>
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

        {/* Right Content Editor / Live Preview Container */}
        <main className="flex-1 overflow-y-auto bg-[#030712] p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Active Section Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Editing Section
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                          Visual Aesthetic Image URL
                        </label>
                        <input
                          type="text"
                          value={localAbout.image}
                          onChange={(e) => {
                            setLocalAbout({ ...localAbout, image: e.target.value });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                        />
                      </div>
                    </div>

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
                          Milestones List ({localAbout.milestones.length})
                        </label>
                        {localAbout.milestones.map((m, mIdx) => (
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
                    <div className="p-4 bg-neutral-100 rounded-xl space-y-2">
                      <h3 className="font-bold text-sm uppercase">{localAbout.timelineTitle}</h3>
                      {localAbout.milestones.map((m, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-white rounded-lg text-xs font-medium">
                          <span className="font-bold text-cyan-700">{m.yearBudget}</span>
                          <span>{m.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: SERVICES SECTION */}
            {(activeSectionId === 'services' || activeSectionId === 'services-header') && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {localServices.map((srv, idx) => (
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
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={srv.image}
                          onChange={(e) => {
                            const updated = [...localServices];
                            updated[idx].image = e.target.value;
                            setLocalServices(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: CASE STUDY TIMELINE */}
            {(activeSectionId === 'projects' || activeSectionId === 'projects-header') && (
              <div className="space-y-4">
                {localProjects.map((proj, idx) => (
                  <div key={proj.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-mono font-bold text-amber-400">Milestone {proj.number}</span>
                      <span className="text-xs text-neutral-500">{proj.year}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Year Tag</label>
                        <input
                          type="text"
                          value={proj.number}
                          onChange={(e) => {
                            const updated = [...localProjects];
                            updated[idx].number = e.target.value;
                            setLocalProjects(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Title &amp; Budget</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...localProjects];
                            updated[idx].title = e.target.value;
                            setLocalProjects(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Category Strategy</label>
                      <input
                        type="text"
                        value={proj.category}
                        onChange={(e) => {
                          const updated = [...localProjects];
                          updated[idx].category = e.target.value;
                          setLocalProjects(updated);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Outcome Narrative</label>
                      <textarea
                        rows={2}
                        value={proj.description}
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
            )}

            {/* SECTION 5: COMPARISON MATRIX */}
            {activeSectionId === 'comparison' && (
              <div className="space-y-4">
                {localComparison.map((comp, idx) => (
                  <div key={comp.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Evaluation Metric</label>
                      <input
                        type="text"
                        value={comp.metric}
                        onChange={(e) => {
                          const updated = [...localComparison];
                          updated[idx].metric = e.target.value;
                          setLocalComparison(updated);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-red-400 mb-1">Traditional (Rented Clicks)</label>
                        <input
                          type="text"
                          value={comp.rentedClicks}
                          onChange={(e) => {
                            const updated = [...localComparison];
                            updated[idx].rentedClicks = e.target.value;
                            setLocalComparison(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-red-500/20 rounded-xl text-red-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Seelutions (Organic &amp; AI Authority)</label>
                        <input
                          type="text"
                          value={comp.organicAuthority}
                          onChange={(e) => {
                            const updated = [...localComparison];
                            updated[idx].organicAuthority = e.target.value;
                            setLocalComparison(updated);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-black/50 border border-emerald-500/20 rounded-xl text-emerald-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 6: TESTIMONIALS */}
            {activeSectionId === 'testimonials' && (
              <div className="space-y-4">
                {localTestimonials.map((t, idx) => (
                  <div key={t.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
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
                    Description Paragraph
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
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Button Link
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

            {/* SECTION 8: VIDEO SHOWCASE */}
            {activeSectionId === 'video' && (
              <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Video Showcase MP4 URL
                  </label>
                  <input
                    type="text"
                    value={localVideo.videoUrl}
                    onChange={(e) => {
                      setLocalVideo({ ...localVideo, videoUrl: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Video Poster Image URL
                  </label>
                  <input
                    type="text"
                    value={localVideo.posterUrl}
                    onChange={(e) => {
                      setLocalVideo({ ...localVideo, posterUrl: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* SECTION 9: RICH CUSTOM HTML / EDITORIAL BODY */}
            {activeSectionId === 'body' && (
              <div className="space-y-4">
                <div className="p-4 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-xs text-neutral-300">
                  Use this WordPress-style Rich Article Builder to craft and format custom semantic sections, headings (H1–H6), blockquotes, lists, images with captions, and hyperlinks.
                </div>
                <ArticleContentBuilder
                  value={currentPage.content || ''}
                  onChange={(content) => {
                    setCurrentPage({ ...currentPage, content });
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
