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
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
}

export const siteConfig = {
  name: "Arcline",
  title: "Arcline — Architecture & Design Agency",
  description: "Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time.",
  email: "yourcompany@gmail.com",
  phone: "(555) 345-6789",
  address: "567 Jac Spruce Crescent, Montreal, QC H1A 2K3",
  estYear: "EST. 2010",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", hasDropdown: true },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Pages", href: "#", hasDropdown: true },
  { label: "Blog", href: "/#blog" },
];

export const homeDropdownItems = [
  { label: "Home One", href: "/" },
  { label: "Home Two", href: "/#hero-secondary" },
];

export const pagesDropdownData = {
  pages: [
    { label: "Projects", href: "/projects" },
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
    title: "Local SEO & Google Map Pack Dominance",
    description: "We optimize your Google Business Profile, local citations, and schema markup so your practice occupies the top 3 local Map Pack spots for high-value surgical searches in your metro area.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Modern medical aesthetic clinic office and local map search optimization",
  },
  {
    number: "02",
    title: "Generative AI Search (GEO / AEO)",
    description: "Modern surgical patients ask AI assistants (ChatGPT, Perplexity, Google AI Overviews) for doctor recommendations. We structure your digital entity so AI engines cite your practice as the premier surgical authority in your region.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Digital technology data analytics representing Generative AI search and entity building",
  },
  {
    number: "03",
    title: "Surgical Landing Pages & Gallery CRO",
    description: "Patients looking for a $20,000 deep plane facelift don't fill out generic contact forms. We build procedure hubs and gallery layouts structured to drive long GA4 session durations, high engagement, and direct consultation requests.",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Professional medical consultation and surgical procedure gallery showcase",
  },
  {
    number: "04",
    title: "Integrated Med Spa & Pipeline Expansion",
    description: "Many of our surgical practice clients own or operate attached medical spas. We build automated conversion pathways that turn non-invasive med spa clients (injectables, lasers, body contouring) into high-ticket surgical consultations, maximizing patient lifetime value.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Attached medical spa treatment room for skin care and non-invasive procedures",
  },
  {
    number: "05",
    title: "A Note on Social Media",
    description: "We believe organic social media (Instagram Reels, TikTok) is best handled in-house or by a local videographer with direct physical access to your operating room and clinic culture. We focus entirely on taking that content and converting it into search engine authority and patient consultations.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Clinical environment and professional medical consultation room",
  },
];

export const portfolioProjects: Project[] = [
  {
    number: "2016",
    title: "Foundation ($1,000/mo)",
    category: "Facial Procedures Strategy",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
    description: "Launched foundational search infrastructure and local organic strategy targeting core facial procedures (Facelift, Rhinoplasty).",
    year: "2016",
    location: "Metro Area",
  },
  {
    number: "2018",
    title: "Procedure Architecture ($1,500/mo)",
    category: "Gallery & UX Optimization",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=85",
    description: "Expanded dedicated procedure hubs and optimized the before-and-after gallery user experience (UX) to increase engagement.",
    year: "2018",
    location: "Metro Area",
  },
  {
    number: "2021",
    title: "Local Dominance ($3,000/mo)",
    category: "Map Pack & Mobile Pathways",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=85",
    description: "Scaled Google Map Pack presence and built mobile-first conversion pathways as consult demand surged.",
    year: "2021",
    location: "Metro Area",
  },
  {
    number: "2024",
    title: "AI & Entity Search ($3,800/mo)",
    category: "GEO / AEO Optimization",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
    description: "Integrated modern AI Search optimization (GEO/AEO), securing top recommendation status across AI search engines while maintaining market dominance.",
    year: "2024–Present",
    location: "Metro Area",
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: "01",
    quote: "Arcline transformed our vision into a living space that exceeds every expectation. Their approach to blending natural light with sustainable materials created a home that feels both luxurious and deeply connected to the environment. An extraordinary team that truly listens.",
    author: "Richard Jackson",
    role: "CEO",
    company: "Luxories",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    rating: 5,
  },
  {
    id: "02",
    quote: "From concept to completion, the Arcline team brought unmatched precision and creativity to our urban development. The result is a community space that residents genuinely love — functional, beautiful, and built to stand the test of time.",
    author: "Emma Thompson",
    role: "CEO",
    company: "Urban Nest",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    rating: 5,
  },
  {
    id: "03",
    quote: "What sets Arcline apart is their ability to listen and then exceed. They understood exactly what we needed — a landmark tower that speaks to innovation without losing human scale. The Skyline Tower has become a true icon of the city.",
    author: "David Lee",
    role: "CEO",
    company: "Arch Vista",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    rating: 5,
  },
];

export const blogArticles: Article[] = [
  {
    slug: "how-chatgpt-perplexity-recommend-surgeons",
    category: "AI Search Optimization",
    date: "Oct 2024",
    readTime: "6 Min Read",
    title: "How ChatGPT, Perplexity, and Google AI Overviews select which plastic surgeon to recommend in your city.",
    excerpt: "Discover how large language models parse medical entity authority, local citations, and procedural schema to rank surgical practices in zero-click generative search results.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "structuring-facelift-rhinoplasty-galleries",
    category: "Practice Conversion Economics",
    date: "Oct 2024",
    readTime: "8 Min Read",
    title: "Structuring facelift & rhinoplasty before/after galleries for maximum GA4 engagement and consult bookings.",
    excerpt: "Why high-net-worth patients looking for $20,000+ procedures abandon generic contact forms, and how immersive case studies drive qualified consultation requests.",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "converting-injectable-patients-surgical-consults",
    category: "Med Spa Pipeline Growth",
    date: "Oct 2024",
    readTime: "5 Min Read",
    title: "Strategies for converting non-surgical injectable patients into high-margin surgical consults.",
    excerpt: "The exact automated referral workflows and cross-sell patient journeys that turn routine Botox and laser clients into lifelong surgical practice advocates.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85",
  },
];
