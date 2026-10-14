export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  estYear: string;
  ogImage?: string;
  analyticsId?: string;
  vercelDeployHookUrl?: string;
}

export interface HeroContent {
  eyebrowTag: string;
  titleLine1: string;
  titleLine2: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  titleVideoUrl: string;
  bannerVideoUrl: string;
  bannerPosterUrl: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  image: string;
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
  id: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
}

export interface ComparisonItem {
  id: string;
  metric: string;
  rentedClicks: string;
  organicAuthority: string;
}

export interface FooterContent {
  copyrightText: string;
  badge: string;
  disclaimer: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: string;
}

export interface CmsData {
  siteConfig: SiteConfig;
  hero: HeroContent;
  navigation: NavItem[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  articles: Article[];
  comparison: ComparisonItem[];
  footer: FooterContent;
  media: MediaAsset[];
  lastPublishedAt?: string;
  version: number;
}
