export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface Service {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface Project {
  number: string;
  title: string;
  category: string;
  href?: string;
  image: string;
  aspect?: string;
  description: string;
  year: string;
  location: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface Article {
  id?: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  published?: boolean;
}

export const siteConfig = {
  name: "seelutions",
  title: "seelutions — Patient Acquisition & Digital Authority Studio",
  description: "Specialized patient acquisition for plastic & facial cosmetic surgeons. We engineer long-term search authority.",
  email: "hello@seelutions.com",
  phone: "(804) 707-5821",
  address: "5806 Grove Ave, Ste 157, Richmond, VA 23226",
  estYear: "EST. 2010",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Pages", href: "#", hasDropdown: true },
  { label: "Case Study", href: "/case-study" },
  { label: "Patient Grower", href: "/#blog" },
];

export const homeDropdownItems = [
  { label: "Home One", href: "/" },
  { label: "Home Two", href: "/#hero-secondary" },
];

export const pagesDropdownData = {
  pages: [
    { label: "Case Study", href: "/case-study" },
    { label: "Team", href: "/about#team" },
    { label: "Project Details", href: "/projects#details" },
    { label: "Service Details", href: "/services#details" },
    { label: "Blog Details", href: "/blog#details" },
  ],
  utilityPages: [
    { label: "Style Guide", href: "/style-guide" },
    { label: "License", href: "/style-guide#license" },
    { label: "Changelog", href: "/style-guide#changelog" },
    { label: "Password Protected", href: "/style-guide#password" },
    { label: "Not Found", href: "/404" },
  ],
};

export const servicesData: Service[] = [
  {
    number: "01",
    title: "AI Search Visibility",
    description: "More patients now ask ChatGPT, Google's AI answers, and Perplexity, \"Who's the best facelift surgeon near me?\" We build the expert content, reviews, and consistent practice information these tools rely on, so your name is the one patients hear.",
    image: "/images/seelutions_AI_Search_Card_Graphic.png",
    imageAlt: "seelutions AI Search Visibility graphic showing ChatGPT recommendation for top facelift surgeon",
  },
  {
    number: "02",
    title: "Local SEO & Google Maps",
    description: "We optimize your Google Business Profile, local citations, and schema markup so your practice occupies the top 3 local Map Pack spots for high-value surgical searches in your metro area.",
    image: "/images/service-local-seo-v3.jpg",
    imageAlt: "seelutions Local SEO graphic showing Google Maps 3-Pack smartphone recommendation UI for top plastic surgeon",
  },
  {
    number: "03",
    title: "Web Design & Conversion Optimization",
    description: "Patients judge your surgical work by your website before they ever meet you. We design websites that show your results at their best, answer patients' questions, and make it easy to book a consultation from any phone.",
    image: "/images/seelutions_Web_Design_Card_Graphic.png",
    imageAlt: "seelutions Web Design graphic showing luxury cosmetic surgery website gallery mobile UI",
  },
  {
    number: "04",
    title: "Google Ads & Paid Search",
    description: "Stop paying for clicks that never turn into consultations. We run surgical-intent paid campaigns that reach patients actively searching for rhinoplasty, facelift, and breast augmentation in your area.",
    image: "/images/service-google-ads.jpg",
    imageAlt: "seelutions Google Ads graphic showing sponsored search ad result mobile UI for top plastic surgeon",
  },
];

export const portfolioProjects: Project[] = [
  {
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
    number: "TODAY",
    title: "#1 in Fort Wayne",
    category: "See the full 10-year case study",
    href: "/case-study",
    image: "/assets/aistudio/Case_Study_5_76c2a683.jpg",
    description: "His practice ranks #1 on Google in Fort Wayne for searches like 'facial cosmetic surgeon,' 'facial plastic surgeon,' and 'rhinoplasty surgeon.'",
    year: "TODAY",
    location: "Fort Wayne, IN",
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: "01",
    quote: "I have no idea what you are doing, but just keep doing it. We are consistently hearing new patients say they found us on ChatGPT when they searched for Plastic Surgeon Near Me.",
    author: "Dr. Ryan Diepenbrock, DDS, FAACS",
    role: "Founder & Chief Facial Cosmetic Surgeon",
    company: "Diepenbrock Facial Cosmetic Surgery",
    avatar: "/assets/aistudio/Dr._Diepenbrock_162f955f.jpg",
    rating: 5,
  },
];

export const blogArticles: Article[] = [
  {
    id: "art-1",
    slug: "glp-1-patients-asking-for-facelifts",
    category: "AI SEARCH OPTIMIZATION",
    date: "Oct 2024",
    readTime: "6 Min Read",
    title: "GLP-1 Patients Are Asking for Facelifts. Will They Find Your Practice or the Injector Down the Street?",
    excerpt: "How rapid weight-loss trends are driving unprecedented demand for facial rejuvenation procedures, and how board-certified plastic surgeons can capture high-intent patients searching in their territory.",
    content: "How rapid weight-loss trends are driving unprecedented demand for facial rejuvenation procedures...",
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
    content: "Star ratings alone no longer guarantee market dominance...",
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
    content: "A data-driven breakdown of allocating acquisition dollars...",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85",
    published: true,
  },
];
