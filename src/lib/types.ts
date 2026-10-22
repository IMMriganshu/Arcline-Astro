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
  headerCtaText?: string;
  headerCtaLink?: string;
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
  children?: NavItem[];
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

export interface PageSeoMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  slug?: string;
  noindex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  schemaType?: 'MedicalBusiness' | 'MedicalProcedure' | 'MedicalWebPage' | 'Article' | 'FAQPage' | 'LocalBusiness' | 'WebApplication' | 'Organization' | 'Custom';
  customSchemaJson?: string;
}

export interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  type: 301 | 302;
  active: boolean;
  createdAt?: string;
}

export interface GlobalSeoSettings {
  siteUrl?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  robotsTxtContent?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  sitemapEnabled?: boolean;
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
  seo?: PageSeoMetadata;
}

export interface ComparisonItem {
  id: string;
  metric: string;
  rentedClicks: string;
  organicAuthority: string;
}

export interface ComparisonCardItem {
  id?: string;
  title: string;
  description: string;
}

export interface ComparisonSectionContent {
  badge: string;
  headline: string;
  traditionalTitle: string;
  traditionalItems: ComparisonCardItem[];
  seelutionsTitle: string;
  seelutionsItems: ComparisonCardItem[];
}

export interface FooterContent {
  tagline?: string;
  description?: string;
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

export interface AboutMilestone {
  yearBudget: string;
  text: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  timelineTitle: string;
  timelineSubtitle: string;
  milestones: AboutMilestone[];
}

export interface VideoShowcaseContent {
  videoUrl: string;
  titleVideoUrl: string;
  posterUrl: string;
}

export interface ProjectCtaContent {
  badge: string;
  headline: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export interface PageSectionItem {
  id: string;
  name: string;
  type: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  videoUrl?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  customHtml?: string;
  items?: any[];
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML/Markdown
  sections?: PageSectionItem[];
  seo?: PageSeoMetadata;
}

export interface Submission {
  id: string;
  name: string;
  website: string;
  email: string;
  phone: string;
  focus: string;
  createdAt: any;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super' | 'admin';
  passcode: string;
  status: 'active' | 'disabled';
  createdAt?: any;
  createdBy?: string;
}

export interface CmsData {
  siteConfig: SiteConfig;
  hero: HeroContent;
  navigation: NavItem[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  articles: Article[];
  pages: Page[];
  comparison: ComparisonItem[];
  footer: FooterContent;
  media: MediaAsset[];
  aboutContent?: AboutContent;
  comparisonContent?: ComparisonSectionContent;
  projectCta?: ProjectCtaContent;
  videoShowcase?: VideoShowcaseContent;
  seoSettings?: GlobalSeoSettings;
  pageSeoMap?: Record<string, PageSeoMetadata>;
  redirects?: RedirectRule[];
  lastPublishedAt?: string;
  version: number;
}
