import type { CmsData } from '../lib/types';

export const defaultCmsContent: CmsData = {
  version: 1,
  lastPublishedAt: new Date().toISOString(),
  siteConfig: {
    name: "seelutions",
    title: "seelutions — Patient Acquisition & Digital Authority Studio",
    description: "Specialized patient acquisition for plastic & facial cosmetic surgeons. We engineer long-term search authority.",
    email: "hello@seelutions.com",
    phone: "(804) 707-5821",
    address: "5806 Grove Ave, Ste 157, Richmond, VA 23226",
    estYear: "EST. 2010",
    ogImage: "/images/home-hero-image.webp",
    analyticsId: "G-XXXXXXXXXX",
    vercelDeployHookUrl: "https://api.vercel.com/v1/integrations/deploy/prj_urcHfoyBHNVmdjwGAFlqsNC9va6o/6NGuRPGr1s",
    headerCtaText: "Get Your Free Practice Visibility Audit",
    headerCtaLink: "https://audit.seelutions.com/",
  },
  hero: {
    eyebrowTag: "PLASTIC SURGEON MARKETING AGENCY",
    titleLine1: "BE SEEN",
    titleLine2: "BE CHOSEN",
    headline: "Be Seen in Search. Be Chosen by High-Ticket Patients.",
    subheadline: "We engineer long-term search authority, Google Map Pack dominance, and AI search visibility that keeps board-certified surgical calendars booked—predictably and organically.",
    primaryCtaText: "Get Your Free Practice Visibility Audit",
    primaryCtaLink: "#contact",
    secondaryCtaText: "View the 10-Year Practice Case Study",
    secondaryCtaLink: "/case-study",
    titleVideoUrl: "/videos/title-video.mp4",
    bannerVideoUrl: "/videos/eyeball-showcase.mp4",
    bannerPosterUrl: "/images/home-hero-image.webp?v=5",
  },
  navigation: [
    { id: "nav-1", label: "Home", href: "/" },
    { id: "nav-2", label: "About", href: "/about" },
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
    { id: "nav-4", label: "Case Study", href: "/case-study" },
    { id: "nav-5", label: "Patient Grower", href: "/blog" },
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
      badge: "GET FOUND ON GOOGLE MAPS",
      title: "Local SEO & Google Maps",
      description: "When patients search \"facelift surgeon near me,\" Google shows a few practices on the map. We build your authority and relevance in your area so your practice is one of them, with the reviews, photos, and details that turn a search into a call.",
      image: "/images/service-local-seo-v3.jpg",
      imageAlt: "seelutions Local SEO graphic showing Google Maps 3-Pack smartphone recommendation UI for top plastic surgeon",
      href: "/services/local-seo-google-maps/",
      buttonText: "Learn about Local SEO",
    },
    {
      id: "srv-3",
      number: "03",
      badge: "TURN VISITORS INTO CONSULTATIONS",
      title: "Web Design & Conversion Optimization",
      description: "Patients judge your surgical work by your website before they ever meet you. We design websites that show your results at their best, answer patients' questions, and make it easy to book a consultation from any phone.",
      image: "/images/seelutions_Web_Design_Card_Graphic.png",
      imageAlt: "seelutions Web Design graphic showing luxury cosmetic surgery website gallery mobile UI",
      href: "/services/web-design-conversion-optimization/",
      buttonText: "Learn about Web Design",
    },
    {
      id: "srv-4",
      number: "04",
      badge: "PATIENTS READY TO BOOK",
      title: "Google Ads & Paid Search",
      description: "Stop paying for clicks that never turn into consultations. We run surgical-intent paid campaigns that reach patients actively searching for rhinoplasty, facelift, and breast augmentation in your area.",
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
      title: "Built to be found",
      category: "Web Design",
      href: "/services/web-design-conversion-optimization/",
      image: "/assets/aistudio/Case_Study_1_8f4e3ed6.jpg",
      description: "We built his website and a local search plan around his core facial procedures: facelift and rhinoplasty.",
      year: "2016",
      location: "Fort Wayne, IN",
    },
    {
      id: "proj-2",
      number: "2018",
      title: "Proof on every page",
      category: "Web Design",
      href: "/services/web-design-conversion-optimization/",
      image: "/assets/aistudio/Case_Study_2_ecb9b351.jpg",
      description: "We added a dedicated page for each procedure and before-and-after galleries that patients could easily browse.",
      year: "2018",
      location: "Fort Wayne, IN",
    },
    {
      id: "proj-3",
      number: "2021",
      title: "On the map",
      category: "Local SEO & Google Maps",
      href: "/services/local-seo-google-maps/",
      image: "/assets/aistudio/Case_Study_3_23e0540a.jpg",
      description: "We strengthened his Google profile, reviews, and local pages so he showed up when patients searched nearby.",
      year: "2021",
      location: "Fort Wayne, IN",
    },
    {
      id: "proj-4",
      number: "2024",
      title: "Found on ChatGPT",
      category: "AI Search Visibility",
      href: "/services/ai-search-overviews/",
      image: "/assets/aistudio/Case_Study_4_dfaec931.jpg",
      description: "We built expert content and verified credentials for AI tools. Today, new patients tell his team they found him on ChatGPT.",
      year: "2024",
      location: "Fort Wayne, IN",
    },
    {
      id: "proj-5",
      number: "TODAY",
      title: "#1 in Fort Wayne",
      category: "See the 10-year case study",
      href: "/case-study",
      image: "/assets/aistudio/Case_Study_5_76c2a683.jpg",
      description: "His practice ranks #1 on Google in Fort Wayne for searches like 'facial cosmetic surgeon,' 'facial plastic surgeon,' and 'rhinoplasty surgeon.'",
      year: "TODAY",
      location: "Fort Wayne, IN",
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
      slug: "glp-1-patients-asking-for-facelifts",
      category: "AI SEARCH OPTIMIZATION",
      date: "Oct 2024",
      readTime: "6 Min Read",
      title: "GLP-1 Patients Are Asking for Facelifts. Will They Find Your Practice or the Injector Down the Street?",
      excerpt: "How rapid weight-loss trends are driving unprecedented demand for facial rejuvenation procedures, and how board-certified plastic surgeons can capture high-intent patients searching in their territory.",
      content: `<h2>The Rise of GLP-1 Aesthetic Consultations</h2>
<p>As GLP-1 medications like Semaglutide and Tirzepatide reshape patient demographics across North America, cosmetic surgery practices are experiencing a surge in patients seeking facial skin tightening, deep-plane facelifts, and volume restoration.</p>
<h3>Capturing High-Intent Surgical Patients</h3>
<p>Practices that optimize procedure hubs and generative AI search entities around weight-loss facial rejuvenation are securing consultation requests months before traditional marketing competitors react.</p>`,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85",
      published: true,
    },
    {
      id: "art-2",
      slug: "why-competitors-with-worse-reviews-get-recommended-in-chatgpt",
      category: "AI SEARCH STRATEGY",
      date: "Nov 2024",
      readTime: "7 Min Read",
      title: "Why Does a Competitor with Worse Reviews Get Recommended Before You in ChatGPT and Google Maps?",
      excerpt: "Star ratings alone no longer guarantee market dominance. Discover how AI engines parse digital entity authority, procedural depth, and local schema to select recommended surgeons.",
      content: `<h2>The AI Entity Recommendation Engine</h2>
<p>Many surgeons wonder why a competitor with a 4.2-star rating gets cited as the premier specialist by ChatGPT while their 4.9-star practice is overlooked. Large language models don't count stars—they measure entity verification and semantic authority.</p>
<h3>Building Search Authority for LLMs</h3>
<p>Learn the three structural pillars required to dominate zero-click AI search results and map pack recommendations in your geographical area.</p>`,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85",
      published: true,
    },
    {
      id: "art-3",
      slug: "how-plastic-surgery-practices-split-marketing-budget",
      category: "PRACTICE CONVERSION ECONOMICS",
      date: "Dec 2024",
      readTime: "8 Min Read",
      title: "How Should a Plastic Surgery Practice Split Its Marketing Budget Across Its Most Profitable Procedures?",
      excerpt: "A data-driven breakdown of allocating acquisition dollars between high-ticket surgical procedures like facelift, rhinoplasty, and breast augmentation versus short-term PPC campaigns.",
      content: `<h2>Allocating Acquisition Dollars for Max Consult Yield</h2>
<p>Stop over-investing in low-ticket med spa PPC auctions. Discover how top-performing plastic surgery practices balance long-term organic search authority with targeted paid campaigns for high-ticket procedures.</p>`,
      image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85",
      published: true,
    },
    {
      id: "art-4",
      slug: "converting-injectable-patients-surgical-consults",
      category: "MED SPA PIPELINE GROWTH",
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
      slug: "case-study",
      title: "Case Study Page Content",
      content: "<h2>10-Year Practice Growth Case Study</h2><p>Milestones and results from foundation to AI search dominance.</p>",
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
      content: "<h2>Let's Scale Your Surgical Practice</h2><p>Request a customized Practice Visibility Audit and strategy consultation.</p>",
    },
  ],
  comparison: [
    {
      id: "comp-1",
      metric: "Cost per High-Intent Lead",
      rentedClicks: "High cost per lead via Google Ads auction",
      organicAuthority: "Compounding value per organic & AI search consult",
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
        description: "You pay for every time someone clicks your ad. When the ads stop, so do the new patients.",
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
    description: "Helping plastic and cosmetic surgeons get found on Google, Google Maps, and AI search.",
    copyrightText: "© 2026 seelutions. All Rights Reserved. Patient Grower is a specialized publication of seelutions.",
    badge: "Specialized Search Authority for Plastic & Facial Surgeons",
    disclaimer: "We partner exclusively with one board-certified plastic or facial cosmetic surgical practice per metropolitan territory.",
  },
  servicesHero: {
    badge: "SPECIALIZED SEARCH & GROWTH SERVICES",
    title: "Digital Growth & Search Services for Plastic & Cosmetic Surgeons",
    subtitle: "For over a decade, we have partnered exclusively with board-certified plastic and facial cosmetic surgeons to replace rented ad spend with compounding digital authority and high-margin surgical consults.",
    description: "",
    image: "/images/dr-diepenbrock-thumbnail.jpg",
    videoUrl: "/videos/seelutions_Video_Final.mp4",
  },
  childServices: {
    "local-seo-google-maps": {
      slug: "local-seo-google-maps",
      titleTag: "Local SEO & Google Maps for Plastic Surgeons | seelutions",
      metaDescription: "Get your practice found on Google Maps when patients search for a surgeon near them. Local SEO for plastic and facial cosmetic surgeons.",
      h1: "Local SEO & Google Maps for Plastic and Facial Cosmetic Surgeons",
      badge: "GET FOUND ON GOOGLE MAPS",
      problemTitle: "What happens in a \"near me\" search?",
      problemText: "Patients looking for a facelift, rhinoplasty, or eyelid surgery often start with a search like \"facelift surgeon near me.\" Google answers with a map and a short list of local practices, and most patients call one of those first. If your practice isn't on that short list, it doesn't matter how skilled you are. That patient may never find you.",
      infrastructureTitle: "How do we get your practice found on Google Maps?",
      infrastructureItems: [
        {
          title: "A complete, polished Google profile",
          desc: "Your Google Business Profile set up the way Google rewards: the right categories, every procedure listed, accurate hours, and professional photos that show your practice at its best."
        },
        {
          title: "Pages for every procedure and city",
          desc: "Dedicated pages for each procedure and the communities you serve, so Google connects your practice to searches like \"rhinoplasty in [your city].\""
        },
        {
          title: "The same details everywhere",
          desc: "Your practice name, address, and phone number listed accurately across the directories patients and Google trust, such as Healthgrades, Vitals, and RealSelf."
        },
        {
          title: "Reviews that build trust",
          desc: "A simple process for earning more patient reviews and responding to them professionally, because reviews are one of the first things patients and Google look at."
        }
      ],
      surgeonValueText: "When patients search for a surgeon near them, Google shows a few practices on the map. We help make your practice one of them.",
      ctaButtonText: "Get Your Free Practice Visibility Audit",
      image: "/images/seelutions_Local_SEO_Maps_Card_Graphic_v3.png",
      faqTitle: "Google Maps, answered",
      faqItems: [
        {
          q: "How long does it take to show up in the top spots on Google Maps?",
          a: "It depends on your market and your competition. Most practices see steady improvement over several months. Google rewards consistent work, so results build over time and keep working long after ads would have stopped."
        },
        {
          q: "Can you guarantee a top-3 spot on Google Maps?",
          a: "No one honestly can, and be wary of anyone who promises it. Google decides the rankings, and the distance from the person searching always plays a part. We don't use tricks or try to game the system. We build your relevance, reputation, and trust so your practice shows up for more of the searches that matter."
        },
        {
          q: "We have more than one location. Can you help with each?",
          a: "Yes. Each location gets its own Google profile, its own local pages, and its own plan, so every office can show up in its own area."
        },
        {
          q: "Do patient reviews really matter that much?",
          a: "Yes. Reviews are one of the strongest signals for patients and for Google. We help you earn more of them and respond the right way, without ever revealing patient information."
        }
      ],
      proofTitle: "Results for Diepenbrock Facial Cosmetic Surgery",
      proofText: "Today the practice ranks #1 on Google in Fort Wayne for searches like \"facial cosmetic surgeon,\" \"rhinoplasty surgeon,\" and \"facelift surgeon.\"",
      proofStats: [
        { value: "+158%", label: "Google Maps views" },
        { value: "+43%", label: "Phone calls from Google" },
        { value: "+48%", label: "Direction requests" },
      ],
      proofName: "Dr. Ryan M. Diepenbrock, DDS, FAACS · Past President, American Board of Facial Cosmetic Surgery",
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
      problemText: "A dated, slow, or template-heavy website devalues high-end surgical work. Patients judging a high-ticket procedure will evaluate your aesthetic eye based on your digital presence.",
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
    videoUrl: "/videos/seelutions_Video_Final.mp4",
    posterUrl: "/images/seelutions_Video_Final_Thumbnail.png",
  },
  projectCta: {
    badge: "PRACTICE VISIBILITY AUDIT",
    headline: "Is Your Practice Visible in Modern AI & Google Search?",
    description: "Claim a free, customized Practice Visibility Audit of your practice's digital footprint. We'll review your website, Google rankings, Google Maps presence, and AI search visibility, then show you where patients are going to competitors and how to fix it.",
    buttonText: "Get Your Practice Visibility Audit",
    buttonLink: "https://audit.seelutions.com/",
    backgroundImage: "/images/audit-background.jpg",
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
    defaultDescription: "Specialized patient acquisition for plastic & facial cosmetic surgeons. We engineer long-term search authority.",
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
      ogDescription: "We engineer long-term search authority and Google Map Pack dominance for facial cosmetic surgeons.",
      ogImage: "/images/home-hero-image.webp",
      twitterCard: "summary_large_image",
      schemaType: "MedicalBusiness",
    },
    "about": {
      title: "About seelutions — 10-Year Surgical Growth Strategy Case Study",
      description: "Discover how we helped a single plastic surgery practice scale local SEO and AI Search Authority over a 10-year partnership.",
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
    "case-study": {
      title: "Case Study: 10 Years With Dr. Diepenbrock | seelutions",
      description: "How Diepenbrock Facial Cosmetic Surgery in Fort Wayne, Indiana grew to #1 on Google with seelutions: website, Google Maps, and AI search.",
      keywords: "plastic surgery case study, medical practice growth, long-term search authority",
      slug: "/case-study",
      canonicalUrl: "https://seelutions.com/case-study",
      ogTitle: "Case Study: 10 Years With Dr. Diepenbrock — seelutions",
      ogDescription: "How Diepenbrock Facial Cosmetic Surgery in Fort Wayne, Indiana grew to #1 on Google with seelutions.",
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
      fromPath: "/projects",
      toPath: "/case-study",
      type: 301,
      active: true,
      createdAt: new Date().toISOString(),
    }
  ],
};
