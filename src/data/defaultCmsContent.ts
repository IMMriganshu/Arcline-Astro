import type { CmsData } from '../lib/types';

export const defaultCmsContent: CmsData = {
  version: 1,
  lastPublishedAt: new Date().toISOString(),
  siteConfig: {
    name: "seelutions",
    title: "seelutions — Patient Acquisition & Digital Authority Studio",
    description: "Specialized patient acquisition for plastic & facial cosmetic surgeons. Stop renting $35 clicks. We engineer long-term search authority.",
    email: "hello@seelutions.com",
    phone: "(555) 345-6789",
    address: "567 Jac Spruce Crescent, Montreal, QC H1A 2K3",
    estYear: "EST. 2010",
    ogImage: "/images/home-hero-image.webp",
    analyticsId: "G-XXXXXXXXXX",
    vercelDeployHookUrl: "https://api.vercel.com/v1/integrations/deploy/prj_urcHfoyBHNVmdjwGAFlqsNC9va6o/6NGuRPGr1s",
    headerCtaText: "Request Practice Audit",
    headerCtaLink: "#contact",
  },
  hero: {
    eyebrowTag: "PLASTIC SURGEON MARKETING AGENCY",
    titleLine1: "BE SEEN",
    titleLine2: "BE CHOSEN",
    headline: "Be Seen in Search. Be Chosen by High-Ticket Patients.",
    subheadline: "Stop renting $35 clicks. We engineer long-term search authority, Google Map Pack dominance, and AI search visibility that keeps board-certified surgical calendars booked—predictably and organically.",
    primaryCtaText: "Get Your Free 3-Minute Practice Audit",
    primaryCtaLink: "#contact",
    secondaryCtaText: "View the 10-Year Practice Case Study",
    secondaryCtaLink: "#case-studies",
    titleVideoUrl: "/videos/title-video.mp4",
    bannerVideoUrl: "/videos/eyeball-showcase.mp4",
    bannerPosterUrl: "/images/home-hero-image.webp?v=5",
  },
  navigation: [
    { id: "nav-1", label: "Home", href: "/" },
    { id: "nav-2", label: "About", href: "/#about" },
    {
      id: "nav-3",
      label: "Services",
      href: "/services",
      hasDropdown: true,
      children: [
        { id: "sub-1", label: "AI Search Visibility", href: "/services/ai-search-overviews/" },
        { id: "sub-2", label: "Local SEO & Google Maps", href: "/services/local-seo-google-maps/" },
        { id: "sub-3", label: "Web Design & Conversion Optimization", href: "/services/web-design-conversion-optimization/" },
        { id: "sub-4", label: "Google Ads & Paid Search", href: "/services/google-ads-paid-search/" },
      ],
    },
    { id: "nav-4", label: "Case Studies", href: "/projects" },
    { id: "nav-5", label: "Blog", href: "/#blog" },
    { id: "nav-6", label: "Schedule a Call", href: "/schedule-a-call" },
    { id: "nav-7", label: "Contact", href: "/contact" },
  ],
  services: [
    {
      id: "srv-1",
      number: "01",
      badge: "GET RECOMMENDED BY AI",
      title: "AI Search Visibility",
      description: "More patients now ask ChatGPT, Google's AI answers, and Perplexity, \"Who's the best facelift surgeon near me?\" We build the expert content, reviews, and consistent practice information these tools rely on, so your name is the one patients hear.",
      image: "/images/seelutions_AI_Search_Card_Graphic.png",
      imageAlt: "seelutions AI Search Visibility graphic showing ChatGPT recommendation for top facelift surgeon",
      href: "/services/ai-search-overviews/",
      buttonText: "Learn about AI search",
    },
    {
      id: "srv-2",
      number: "02",
      badge: "LOCAL MAP PACK DOMINANCE",
      title: "Local SEO & Google Maps",
      description: "We optimize your Google Business Profile, local citations, and schema markup so your practice occupies the top 3 local Map Pack spots for high-value surgical searches in your metro area.",
      image: "/images/service-local-seo.jpg",
      imageAlt: "seelutions Local SEO graphic showing Google Maps 3-Pack smartphone recommendation UI for top plastic surgeon",
      href: "/services/local-seo-google-maps/",
      buttonText: "Learn about Local SEO",
    },
    {
      id: "srv-3",
      number: "03",
      badge: "HIGH-CONVERTING PATIENT JOURNEY",
      title: "Web Design & Conversion Optimization",
      description: "Patients looking for high-ticket procedures don't fill out generic contact forms. We build procedure hubs, stunning aesthetics, and gallery layouts structured to drive long session durations and direct consultation requests.",
      image: "/images/service-web-design.jpg",
      imageAlt: "seelutions Web Design graphic showing luxury cosmetic surgery website gallery mobile UI",
      href: "/services/web-design-conversion-optimization/",
      buttonText: "Learn about Web Design & CRO",
    },
    {
      id: "srv-4",
      number: "04",
      badge: "SURGICAL INTENT ACQUISITION",
      title: "Google Ads & Paid Search",
      description: "Stop renting unprofitable $35 clicks. We deploy surgical-intent paid campaigns calibrated to capture patients actively searching for rhinoplasty, facelift, and breast augmentation in your specific geographic territory.",
      image: "/images/service-google-ads.jpg",
      imageAlt: "seelutions Google Ads graphic showing sponsored search ad result mobile UI for top plastic surgeon",
      href: "/services/google-ads-paid-search/",
      buttonText: "Learn about Paid Search",
    },
  ],
  projects: [
    {
      id: "proj-1",
      number: "2016",
      title: "Foundation ($1,000/mo)",
      category: "Facial Procedures Strategy",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85",
      description: "Launched foundational search infrastructure and local organic strategy targeting core facial procedures (Facelift, Rhinoplasty).",
      year: "2016",
      location: "Metro Area",
    },
    {
      id: "proj-2",
      number: "2018",
      title: "Procedure Architecture ($1,500/mo)",
      category: "Gallery & UX Optimization",
      image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85",
      description: "Expanded dedicated procedure hubs and optimized the before-and-after gallery user experience (UX) to increase engagement.",
      year: "2018",
      location: "Metro Area",
    },
    {
      id: "proj-3",
      number: "2021",
      title: "Local Dominance ($3,000/mo)",
      category: "Map Pack & Mobile Pathways",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=85",
      description: "Scaled Google Map Pack presence and built mobile-first conversion pathways as consult demand surged.",
      year: "2021",
      location: "Metro Area",
    },
    {
      id: "proj-4",
      number: "2024",
      title: "AI & Entity Search ($3,800/mo)",
      category: "GEO / AEO Optimization",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85",
      description: "Integrated modern AI Search optimization (GEO/AEO), securing top recommendation status across AI search engines while maintaining market dominance.",
      year: "2024–Present",
      location: "Metro Area",
    },
  ],
  testimonials: [
    {
      id: "test-1",
      quote: "I have no idea what you are doing, but just keep doing it. We are consistently hearing new patients say they found us on ChatGPT when they searched for Plastic Surgeon Near Me.",
      author: "Dr. Ryan Diepenbrock, DDS, FAACS",
      role: "Founder & Chief Facial Cosmetic Surgeon",
      company: "Diepenbrock Facial Cosmetic Surgery",
      avatar: "/assets/aistudio/Dr._Diepenbrock_162f955f.jpg",
      rating: 5,
    },
  ],
  articles: [
    {
      id: "art-1",
      slug: "how-chatgpt-perplexity-recommend-surgeons",
      category: "AI Search Optimization",
      date: "Oct 2024",
      readTime: "6 Min Read",
      title: "How ChatGPT, Perplexity, and Google AI Overviews select which plastic surgeon to recommend in your city.",
      excerpt: "Discover how large language models parse medical entity authority, local citations, and procedural schema to rank surgical practices in zero-click generative search results.",
      content: `<h2>The Shift from Traditional Search to Conversational AI</h2>
<p>Modern surgical patients no longer just browse ten blue links. High-net-worth prospective patients increasingly ask conversational AI agents like ChatGPT, Perplexity, and Google Gemini for targeted recommendations: <em>"Who is the best surgeon for a natural deep-plane facelift in Beverly Hills?"</em></p>

<h3>How Large Language Models Evaluate Medical Entities</h3>
<p>Unlike traditional keyword crawlers, LLMs rely on entity graphs, citation consensus, and academic/clinical credentials. Here are the three primary signals AI engines evaluate:</p>
<ul>
  <li><strong>Digital Entity Graph:</strong> Does your practice have clean Wikidata, Google Knowledge Graph, and schema.org MedicalBusiness data?</li>
  <li><strong>Citation Authority:</strong> Are you featured on independent editorial roundups, hospital affiliations, and board certification directories?</li>
  <li><strong>Procedural Semantic Depth:</strong> Does your site explain complex surgical nuances in structured, authoritative language?</li>
</ul>`,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85",
      published: true,
    },
    {
      id: "art-2",
      slug: "structuring-facelift-rhinoplasty-galleries",
      category: "Practice Conversion Economics",
      date: "Oct 2024",
      readTime: "8 Min Read",
      title: "Structuring facelift & rhinoplasty before/after galleries for maximum GA4 engagement and consult bookings.",
      excerpt: "Why high-net-worth patients looking for $20,000+ procedures abandon generic contact forms, and how immersive case studies drive qualified consultation requests.",
      content: `<h2>The Flaw in Traditional Patient Galleries</h2>
<p>Most cosmetic surgery galleries are designed like simple photo albums with static thumbnails and no narrative context. But prospective patients undergoing facial reconstruction or aesthetic enhancements are making an emotionally charged decision.</p>

<h3>The High-Conversion Gallery Framework</h3>
<p>To convert casual visitors into paid consults, case studies must present the patient's age, anatomical baseline, specific surgical technique employed, and recovery timeline.</p>`,
      image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85",
      published: true,
    },
    {
      id: "art-3",
      slug: "converting-injectable-patients-surgical-consults",
      category: "Med Spa Pipeline Growth",
      date: "Oct 2024",
      readTime: "5 Min Read",
      title: "Strategies for converting non-surgical injectable patients into high-margin surgical consults.",
      excerpt: "The exact automated referral workflows and cross-sell patient journeys that turn routine Botox and laser clients into lifelong surgical practice advocates.",
      content: `<h2>Unlocking the Latent Value in Your Med Spa</h2>
<p>Many plastic surgeons operate an attached med spa as a separate business unit. However, the most profitable practices build an intentional, automated bridge between non-invasive treatments and surgical consults.</p>`,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85",
      published: true,
    },
  ],
  pages: [
    {
      id: "page-home",
      slug: "home",
      title: "Home Page Content",
      content: "<h2>Welcome to seelutions</h2><p>Specialized patient acquisition and search authority engineering for plastic & facial cosmetic surgeons.</p>",
    },
    {
      id: "page-about",
      slug: "about",
      title: "About Page Content",
      content: "<h2>About seelutions</h2><p>We partner exclusively with one board-certified plastic or facial cosmetic surgical practice per metropolitan territory.</p>",
    },
    {
      id: "page-services",
      slug: "services",
      title: "Services Page Content",
      content: "<h2>Our Specialized Services</h2><p>Explore our comprehensive search authority, local Map Pack dominance, and generative AI search optimization pipelines.</p>",
    },
    {
      id: "page-projects",
      slug: "projects",
      title: "Case Study / Projects Page Content",
      content: "<h2>10-Year Practice Growth Case Study</h2><p>Transparent milestones and financial metrics from foundation to AI search dominance.</p>",
    },
    {
      id: "page-blog",
      slug: "blog",
      title: "Patient Grower Blog & Editorial Page Content",
      content: "<h2>Patient Grower Editorial</h2><p>Marketing intelligence and AI search strategy for practice owners.</p>",
    },
    {
      id: "page-local-seo",
      slug: "services/local-seo-google-maps",
      title: "Local SEO & Google Maps Page",
      content: "<h2>Local SEO & Google Map Pack Dominance</h2><p>Occupy the top 3 local Map Pack positions for high-value surgical intent searches in your metro area.</p>",
    },
    {
      id: "page-ai-search",
      slug: "services/ai-search-overviews",
      title: "AI Search & Overviews Page",
      content: "<h2>Generative Engine Optimization (GEO) & AI Search</h2><p>Position your practice as the cited authority in Google AI Overviews, ChatGPT, and generative search engines.</p>",
    },
    {
      id: "page-web-design",
      slug: "services/web-design-conversion-optimization",
      title: "Web Design & Conversion Optimization Page",
      content: "<h2>Bespoke Website Design & CRO</h2><p>Luxury, HIPAA-compliant websites designed to showcase surgical artistry and turn procedure research into booked consultations.</p>",
    },
    {
      id: "page-google-ads",
      slug: "services/google-ads-paid-search",
      title: "Google Ads & Paid Search Page",
      content: "<h2>Targeted Google Ads & Paid Search Acquisition</h2><p>Targeted, high-intent Google Ads campaigns engineered to fill your surgical calendar with qualified, high-ticket procedure consults.</p>",
    },
    {
      id: "page-schedule-call",
      slug: "schedule-a-call",
      title: "Schedule a Call Page",
      content: "<h2>Receive a free consultation & quote.</h2><p>Schedule a 20-30 min. discovery call today.</p>",
    },
    {
      id: "page-contact",
      slug: "contact",
      title: "Contact Page",
      content: "<h2>Let's Scale Your Surgical Practice</h2><p>Request a customized 3-minute video audit and strategy consultation.</p>",
    },
  ],
  comparison: [
    {
      id: "comp-1",
      metric: "Cost per High-Intent Lead",
      rentedClicks: "$180 – $350 per lead via Google Ads auction",
      organicAuthority: "$0 marginal cost per organic & AI search consult",
    },
    {
      id: "comp-2",
      metric: "Asset Longevity",
      rentedClicks: "Stops instantly the day you pause your ad budget",
      organicAuthority: "Permanent digital real estate that compounds over years",
    },
    {
      id: "comp-3",
      metric: "Patient Trust & Prestige",
      rentedClicks: "Recognized as a sponsored ad by savvy patients",
      organicAuthority: "Seen as the premier board-certified authority in your city",
    },
    {
      id: "comp-4",
      metric: "Generative AI Search Presence",
      rentedClicks: "Ignored by ChatGPT and Perplexity recommendations",
      organicAuthority: "Indexed as the top medical entity recommended by AI",
    },
  ],
  comparisonContent: {
    badge: "Why practices choose seelutions",
    headline: "Why Most Marketing Agencies Fall Short for Plastic and Facial Cosmetic Surgeons",
    traditionalTitle: "General marketing agencies",
    traditionalItems: [
      {
        id: "trad-1",
        title: "You blend in with everyone else",
        description: "Cookie-cutter branding and the same procedure descriptions, promises, and stock photos as every competitor. Patients can't tell you apart, so they pick on price or whoever shows up first.",
      },
      {
        id: "trad-2",
        title: "Paying for every click",
        description: "You pay $35 or more every time someone clicks your ad. When the ads stop, so do the new patients.",
      },
      {
        id: "trad-3",
        title: "Generic websites",
        description: "Built by agencies that design for restaurants and plumbers too. Slow, confusing templates that frustrate patients before they ever call.",
      },
      {
        id: "trad-4",
        title: "Constant turnover",
        description: "Many practices go through one agency after another, often because no one can show them what the money produced.",
      },
    ],
    seelutionsTitle: "seelutions: Surgical Practice Specialists",
    seelutionsItems: [
      {
        id: "seel-1",
        title: "A brand that sets you apart",
        description: "We build branding and a message that are unique to you: your training, your results, your story. Then we answer patients' questions before they think to ask, so patients, Google, and AI search see you as the expert, not just another option.",
      },
      {
        id: "seel-2",
        title: "Patients who keep finding you",
        description: "We build your authority and relevance in your area, so when local patients search, Google and Google Maps put you at the top. That keeps new patients coming in month after month, without paying for every click.",
      },
      {
        id: "seel-3",
        title: "State-of-the-art websites",
        description: "Fast, secure sites built with patient privacy in mind and built-in accessibility tools. Every page is designed for a smooth patient experience, from the first visit on a phone to the consultation request.",
      },
      {
        id: "seel-4",
        title: "A partner for the long run",
        description: "Dr. Diepenbrock has trusted us for more than 10 years. We answer the phone, show you what's working and what isn't, and stay ahead of every change in search.",
      },
    ],
  },
  footer: {
    tagline: "",
    description: "Helping surgical practices dominate local and AI-driven search landscapes.",
    copyrightText: "© 2026 seelutions. All Rights Reserved. Patient Grower is a specialized publication of seelutions.",
    badge: "Specialized Search Authority for Plastic & Facial Surgeons",
    disclaimer: "We partner exclusively with one board-certified plastic or facial cosmetic surgical practice per metropolitan territory.",
  },
  servicesHero: {
    badge: "SPECIALIZED SEARCH & GROWTH SERVICES",
    title: "Digital Growth & Search Services Engineered for Plastic & Cosmetic Surgeons",
    subtitle: "For over a decade, we have partnered exclusively with board-certified plastic and facial cosmetic surgeons to replace rented ad spend with compounding digital authority and high-margin surgical consults.",
    description: "Explore our four core pillars designed to dominate local map packs, capture AI search citations, convert luxury procedure seekers, and drive profitable patient pipelines.",
    image: "/images/dr-diepenbrock-thumbnail.jpg",
    videoUrl: "/videos/Dr%20Diepenbrock%20Testimonial%20Video.mov",
  },
  childServices: {
    "local-seo-google-maps": {
      slug: "local-seo-google-maps",
      titleTag: "Local SEO & Google Maps for Plastic Surgeons | seelutions",
      metaDescription: "Dominate Google's local 3-pack and capture high-intent patients searching for surgical procedures in your primary metropolitan market.",
      h1: "Local SEO & Google Map Pack Dominance for Plastic Surgeons",
      badge: "LOCAL SEO & GOOGLE MAPS",
      problemTitle: "The Hyper-Local Search Challenge",
      problemText: "Aesthetic patients search with hyper-local intent (e.g., 'facelift surgeon near me' or 'best rhinoplasty in [City]'). Missing the top 3 spots on Google Maps means losing consultations to local competitors regardless of your clinical skill.",
      infrastructureTitle: "Our Local Search Infrastructure",
      infrastructureItems: [
        {
          title: "Google Business Profile (GBP) Optimization",
          desc: "Rigorous category auditing, procedure service menus, and geo-tagged visual assets designed to secure top map rankings."
        },
        {
          title: "Geo-Targeted Procedure Architecture",
          desc: "City-specific landing pages and localized schema markup targeting high-income suburbs within your surgical radius."
        },
        {
          title: "Entity & Citation Synchronization",
          desc: "Clean, unified medical directory listings across Healthgrades, Vitals, RealSelf, and local registries."
        }
      ],
      surgeonValueText: "Filtering for procedure-driven patients—not low-ticket foot traffic, but patients ready to book $10k–$30k surgical consultations.",
      ctaButtonText: "Schedule a Local Search Audit for Your Practice",
      image: "/images/service-local-seo.jpg",
    },
    "ai-search-overviews": {
      slug: "ai-search-overviews",
      titleTag: "AI Search Visibility for Plastic & Facial Cosmetic Surgeons | seelutions",
      metaDescription: "Position your surgical practice as the cited authority in Google AI Overviews, ChatGPT, and generative search engines.",
      h1: "AI Search Visibility for Plastic & Facial Cosmetic Surgeons",
      badge: "AI SEARCH VISIBILITY",
      problemTitle: "The Generative Search Shift",
      problemText: "Generative engines like Google AI Overviews and ChatGPT are replacing standard search results for clinical queries (e.g., recovery timelines, revision risks, candidacy). If your practice isn't cited by AI, you are invisible to the next generation of patients.",
      infrastructureTitle: "Our AI Search Infrastructure",
      infrastructureItems: [
        {
          title: "Medical Entity & Authority Schema",
          desc: "Structuring physician credentials, board certifications, and procedural experience so LLMs recognize you as a verified medical source."
        },
        {
          title: "Clinical Answer Engine Architecture",
          desc: "Content structured to answer patient questions about surgical technique, anesthesia, and healing protocols in formats search engines crawl for AI Overviews."
        },
        {
          title: "Brand Entity Citation",
          desc: "Building high-authority mentions across medical publications and industry registries to anchor your brand in language model databases."
        }
      ],
      surgeonValueText: "Securing the top conversational recommendation before the patient ever visits a directory site.",
      ctaButtonText: "Assess Your Practice’s AI Search Visibility",
      image: "/images/seelutions_AI_Search_Card_Graphic.png",
    },
    "web-design-conversion-optimization": {
      slug: "web-design-conversion-optimization",
      titleTag: "Website Design & Conversion for Plastic Surgeons | seelutions",
      metaDescription: "Luxury, HIPAA-compliant websites designed to showcase surgical artistry and turn procedure research into booked consultations.",
      h1: "Bespoke Website Design & Conversion Optimization for Plastic Surgeons",
      badge: "WEB DESIGN & CRO",
      problemTitle: "The Aesthetic Credibility Gap",
      problemText: "A dated, slow, or template-heavy website devalues high-end surgical work. Patients judging a $20,000 procedure will evaluate your aesthetic eye based on your digital presence.",
      infrastructureTitle: "Our Web & Conversion Infrastructure",
      infrastructureItems: [
        {
          title: "Editorial Before-and-After Galleries",
          desc: "Fast-loading, filterable case galleries that highlight surgical results cleanly across all mobile devices."
        },
        {
          title: "High-Intent Consultation Funnels",
          desc: "Frictionless inquiry flows designed to pre-qualify prospective patients before they reach your front desk."
        },
        {
          title: "Sub-Second Performance & Medical Aesthetics",
          desc: "Luxury typography, clean layouts, and strict mobile responsiveness optimized for Core Web Vitals."
        }
      ],
      surgeonValueText: "Turning passive gallery browsing into scheduled surgical consults.",
      ctaButtonText: "Request a Website Conversion Review",
      image: "/images/service-web-design.jpg",
    },
    "google-ads-paid-search": {
      slug: "google-ads-paid-search",
      titleTag: "Google Ads & Paid Search for Plastic Surgeons | seelutions",
      metaDescription: "Targeted, high-intent Google Ads campaigns engineered to fill your surgical calendar with qualified, high-ticket procedure consults.",
      h1: "Targeted Google Ads & Paid Search Acquisition for Plastic Surgeons",
      badge: "GOOGLE ADS & PAID SEARCH",
      problemTitle: "Eliminating Paid Ad Waste",
      problemText: "Most paid campaigns waste thousands of dollars on broad keywords, price-shoppers, and non-surgical clicks, driving up ad spend without booking actual operating room hours.",
      infrastructureTitle: "Our Paid Acquisition Infrastructure",
      infrastructureItems: [
        {
          title: "Negative Keyword Scrubbing",
          desc: "Eliminating cheap search terms ('cheap', 'discount', 'free consult') to focus exclusively on affluent, qualified patients."
        },
        {
          title: "Procedure-Dedicated Landing Pages",
          desc: "High-converting, single-procedure landing pages built specifically for paid traffic to prevent ad waste."
        },
        {
          title: "Call Tracking & Consultation Attribution",
          desc: "Tracking every phone call and form fill directly to scheduled operating room revenue."
        }
      ],
      surgeonValueText: "Immediate, measurable consultation volume to keep surgical schedules consistently booked weeks in advance.",
      ctaButtonText: "Get a Paid Search Strategy for Your Market",
      image: "/images/service-google-ads.jpg",
    }
  },
  aboutContent: {
    badge: "About Us",
    title: "380% Retainer Growth over 10 Years",
    subtitle: "How Dr. Ryan Diepenbrock (Diepenbrock Facial Cosmetic Surgery — Fort Wayne, IN) Scaled to Regional Market Dominance Across a Decade of Digital Shift.",
    description: "In an industry where practices fire marketing agencies every 6 to 12 months, Dr. Diepenbrock has trusted our search and patient acquisition architecture for a decade. By evolving renewedlook.com from basic local search in 2016 to modern AI Search (AEO) and high-converting procedure hubs today, his monthly reinvestment grew nearly 4x—driven entirely by compounding patient consult revenue.",
    image: "/images/dr-diepenbrock-thumbnail.jpg",
    videoUrl: "/videos/Dr%20Diepenbrock%20Testimonial%20Video.mov",
    videoCaption: "Dr. Ryan Diepenbrock on 10 years with seelutions",
    timelineTitle: "Results for Diepenbrock Facial Cosmetic Surgery",
    timelineSubtitle: "2026 verified results",
    stats: [
      { value: "35 of 62", label: "Google searches in top 3" },
      { value: "+158%", label: "Google Maps views" },
      { value: "+43%", label: "Phone calls from Google" },
      { value: "+48%", label: "Direction requests" },
    ],
    timelineHeading: "A decade of staying ahead",
    timelineRows: [
      { year: "2016", text: "Local search foundation" },
      { year: "2018", text: "Procedure pages and galleries" },
      { year: "2021", text: "Mobile and Google Maps growth" },
      { year: "2024 to today", text: "AI search" },
    ],
    milestones: [
      { yearBudget: "2016", text: "Local search foundation" },
      { yearBudget: "2018", text: "Procedure pages and galleries" },
      { yearBudget: "2021", text: "Mobile and Google Maps growth" },
      { yearBudget: "2024 to today", text: "AI search" },
    ],
  },
  videoShowcase: {
    videoUrl: "/videos/eyeball-showcase.mp4",
    titleVideoUrl: "/videos/title-video.mp4",
    posterUrl: "/images/home-hero-image.webp",
  },
  projectCta: {
    badge: "PRACTICE DIGITAL AUDIT",
    headline: "Is Your Practice Visible in Modern AI & Google Search?",
    description: "Claim a customized, 3-minute video analysis of your practice's digital footprint. We'll walk through your site, identify where high-ticket patient consults are leaking to local competitors, and show you how to fix it.",
    buttonText: "Get Practice Visibility Audit",
    buttonLink: "https://audit.seelutions.com/",
    backgroundImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2100&q=85",
  },
  media: [
    { id: "med-1", name: "Bionic Eyeball Showcase Video", url: "/videos/eyeball-showcase.mp4", type: "video", size: "469 KB" },
    { id: "med-2", name: "Title Mask Looping Video", url: "/videos/title-video.mp4", type: "video", size: "1.1 MB" },
    { id: "med-3", name: "Hero Bionic Eyeball Poster", url: "/images/home-hero-image.webp", type: "image", size: "900 KB" },
    { id: "med-4", name: "seelutions Header Nav Logo", url: "/images/seelutions%20Header%20Nav%20Logo.png", type: "image", size: "145 KB" },
    { id: "med-4b", name: "seelution Footer Logo", url: "/images/seelution%20Footer%20Logo.png", type: "image", size: "34 KB" },
    { id: "med-4c", name: "seelutions Brand Favicon", url: "/images/seelutions%20brand%20icon.webp", type: "image", size: "52 KB" },
    { id: "med-5", name: "Modern Clinic Consultation", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85", type: "image" },
    { id: "med-6", name: "Digital AI Analytics", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=85", type: "image" },
    { id: "med-7", name: "Surgical Case Review", url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85", type: "image" },
  ],
  seoSettings: {
    siteUrl: "https://seelutions.com",
    defaultTitle: "seelutions — Patient Acquisition & Digital Authority Studio",
    defaultDescription: "Specialized patient acquisition for plastic & facial cosmetic surgeons. Stop renting $35 clicks. We engineer long-term search authority.",
    defaultOgImage: "/images/home-hero-image.webp",
    sitemapEnabled: true,
    robotsTxtContent: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://seelutions.com/sitemap.xml",
  },
  pageSeoMap: {
    "home": {
      title: "seelutions — Plastic Surgery Patient Acquisition & Search Authority",
      description: "Be seen in search. Be chosen by high-ticket surgical patients. Specialized organic SEO, Map Pack dominance, and AI search authority for board-certified plastic surgeons.",
      keywords: "plastic surgery seo, cosmetic surgeon patient acquisition, medical search authority, surgical digital marketing",
      slug: "/",
      canonicalUrl: "https://seelutions.com/",
      ogTitle: "seelutions — Plastic Surgery Patient Acquisition Studio",
      ogDescription: "Stop renting $35 clicks. We engineer long-term search authority and Google Map Pack dominance for facial cosmetic surgeons.",
      ogImage: "/images/home-hero-image.webp",
      twitterCard: "summary_large_image",
      schemaType: "MedicalBusiness",
    },
    "about": {
      title: "About seelutions — 10-Year Surgical Growth Strategy Case Study",
      description: "Discover how we helped a single plastic surgery practice scale from $800/mo local SEO to $3,800/mo AI Search Authority over a 10-year partnership.",
      keywords: "plastic surgery case study, medical practice growth, long-term search authority",
      slug: "/#about",
      canonicalUrl: "https://seelutions.com/#about",
      ogTitle: "About seelutions — 10-Year Surgical Search Authority Studio",
      ogDescription: "A 10-year longitudinal case study in scaling plastic surgery practice revenues through organic search authority.",
      ogImage: "/images/home-hero-image.webp",
      twitterCard: "summary_large_image",
      schemaType: "Organization",
    },
    "services": {
      title: "Surgical Patient Acquisition Services — seelutions Studio",
      description: "Explore our 5 core pillars of plastic surgery search dominance: GEO & AI Search Optimization, Map Pack Dominance, High-Ticket Funnel UX, Procedure Content, and Live Analytics.",
      keywords: "plastic surgery services, medical seo services, surgical web design, map pack dominance",
      slug: "/services",
      canonicalUrl: "https://seelutions.com/services",
      ogTitle: "5 Pillars of Surgical Search Dominance — seelutions",
      ogDescription: "From AI search optimization (GEO) to Google Map Pack dominance for board-certified cosmetic surgeons.",
      ogImage: "/images/home-hero-image.webp",
      twitterCard: "summary_large_image",
      schemaType: "MedicalProcedure",
    },
    "projects": {
      title: "Case Studies & Built Practice Works — seelutions",
      description: "Case studies detailing search volume expansions, patient consult increases, and organic authority milestones for facial & plastic surgery practices.",
      keywords: "plastic surgery case studies, cosmetic practice portfolio, organic search results",
      slug: "/projects",
      canonicalUrl: "https://seelutions.com/projects",
      ogTitle: "Surgical Case Studies & Portfolio — seelutions",
      ogDescription: "Real metrics and long-term search growth from board-certified plastic surgery clients.",
      ogImage: "/images/home-hero-image.webp",
      twitterCard: "summary_large_image",
      schemaType: "MedicalWebPage",
    },
    "blog": {
      title: "Patient Grower Journal — Insights on Surgical Search & AI SEO",
      description: "Perspectives and critical strategies on Generative Engine Optimization (GEO), Google Search updates, and patient acquisition for cosmetic surgeons.",
      keywords: "plastic surgery marketing blog, medical seo articles, GEO strategies, surgical patient acquisition",
      slug: "/blog",
      canonicalUrl: "https://seelutions.com/blog",
      ogTitle: "Patient Grower Journal — seelutions Intelligence",
      ogDescription: "Thought leadership on surgical search authority and AI search optimization.",
      ogImage: "/images/home-hero-image.webp",
      twitterCard: "summary_large_image",
      schemaType: "Article",
    },
    "404": {
      title: "Page Not Found — seelutions",
      description: "The requested page could not be located on seelutions Studio.",
      slug: "/404",
      noindex: true,
    }
  },
  redirects: [
    {
      id: "red-1",
      fromPath: "/old-services",
      toPath: "/services",
      type: 301,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "red-2",
      fromPath: "/case-study",
      toPath: "/projects",
      type: 301,
      active: true,
      createdAt: new Date().toISOString(),
    }
  ],
};
