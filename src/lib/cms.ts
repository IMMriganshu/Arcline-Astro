import type { CmsData } from './types';
import { defaultCmsContent } from '../data/defaultCmsContent';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CMS_STORAGE_KEY = 'arcline_cms_content_v1';
const CMS_DOC_ID = 'main';
const CMS_COLLECTION = 'cms_content';

export const defaultArticles = defaultCmsContent.articles;

/**
 * Helper to deep merge default and saved CMS data
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in output)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(output[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Server-side helper to read persistent CMS data from Firestore
 */
export async function getServerCmsData(): Promise<CmsData> {
  try {
    const docRef = doc(db, CMS_COLLECTION, CMS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const remoteData = docSnap.data() as CmsData;
      if (remoteData?.siteConfig) {
        if (remoteData.siteConfig.name === 'Arcline') {
          remoteData.siteConfig.name = 'Seelutions';
        }
        if (remoteData.siteConfig.title && remoteData.siteConfig.title.includes('Arcline')) {
          remoteData.siteConfig.title = remoteData.siteConfig.title.replace(/Arcline/g, 'Seelutions');
        }
        if (remoteData.siteConfig.description && remoteData.siteConfig.description.includes('Distinguished architectural agency')) {
          remoteData.siteConfig.description = defaultCmsContent.siteConfig.description;
        }
      }
      return deepMerge(defaultCmsContent, remoteData);
    }
  } catch (err) {
    console.error('Error reading CMS data from Firestore:', err);
  }
  return defaultCmsContent;
}

/**
 * Universal helper to get CMS data in either server or client context
 */
export async function getCmsData(): Promise<CmsData> {
  if (typeof window === 'undefined') {
    return await getServerCmsData();
  }
  return getClientCmsData();
}

/**
 * Get all blog articles
 */
export async function getArticles() {
  const data = await getCmsData();
  return data.articles && data.articles.length > 0 ? data.articles : defaultArticles;
}

/**
 * Find an article by its slug
 */
export async function getArticleBySlug(slug: string) {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

/**
 * Get all website pages
 */
export async function getPages() {
  const data = await getCmsData();
  return data.pages && data.pages.length > 0 ? data.pages : defaultCmsContent.pages;
}

/**
 * Find a page by its slug
 */
export async function getPageBySlug(slug: string) {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug);
}

/**
 * Get all header navigation items
 */
export async function getNavigation() {
  const data = await getCmsData();
  return (data.navigation && data.navigation.length > 0) ? data.navigation : defaultCmsContent.navigation;
}

/**
 * Get footer configuration & content
 */
export async function getFooterContent() {
  const data = await getCmsData();
  return data.footer || defaultCmsContent.footer;
}

/**
 * Get all services
 */
export async function getServices() {
  const data = await getCmsData();
  return data.services || defaultCmsContent.services;
}

/**
 * Get all case study projects
 */
export async function getProjects() {
  const data = await getCmsData();
  return data.projects || defaultCmsContent.projects;
}

/**
 * Get all surgeon testimonials
 */
export async function getTestimonials() {
  const data = await getCmsData();
  return data.testimonials || defaultCmsContent.testimonials;
}

/**
 * Get site configuration
 */
export async function getSiteConfig() {
  const data = await getCmsData();
  return data.siteConfig || defaultCmsContent.siteConfig;
}

/**
 * Get About section content
 */
export async function getAboutContent() {
  const data = await getCmsData();
  return data.aboutContent || defaultCmsContent.aboutContent!;
}

/**
 * Get Comparison section content (Why Traditional Models Fail Plastic Surgeons)
 */
export async function getComparisonContent() {
  const data = await getCmsData();
  return data.comparisonContent || defaultCmsContent.comparisonContent!;
}

/**
 * Get Project CTA content
 */
export async function getProjectCtaContent() {
  const data = await getCmsData();
  return data.projectCta || defaultCmsContent.projectCta!;
}

/**
 * Get Video Showcase content
 */
export async function getVideoShowcaseContent() {
  const data = await getCmsData();
  return data.videoShowcase || defaultCmsContent.videoShowcase!;
}

/**
 * Server-side helper to persist CMS data to Firestore
 */
export async function saveServerCmsData(data: CmsData): Promise<boolean> {
  try {
    const updated = {
      ...data,
      lastPublishedAt: new Date().toISOString(),
      version: (data.version || 1) + 1,
    };
    
    await setDoc(doc(db, CMS_COLLECTION, CMS_DOC_ID), updated);
    return true;
  } catch (err) {
    console.error('Error saving CMS data to Firestore:', err);
    return false;
  }
}


/**
 * Client-side helper to get CMS data from localStorage or fallback
 */
export function getClientCmsData(): CmsData {
  if (typeof window === 'undefined') {
    return defaultCmsContent;
  }
  try {
    const local = localStorage.getItem(CMS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.siteConfig) {
        if (parsed.siteConfig.name === 'Arcline') parsed.siteConfig.name = 'Seelutions';
        if (parsed.siteConfig.title && parsed.siteConfig.title.includes('Arcline')) {
          parsed.siteConfig.title = parsed.siteConfig.title.replace(/Arcline/g, 'Seelutions');
        }
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse localStorage CMS data:', e);
  }
  return defaultCmsContent;
}

/**
 * Client-side helper to save CMS data locally and send to API
 */
export async function saveClientCmsData(data: CmsData): Promise<{ success: boolean; data?: CmsData; error?: string }> {
  try {
    const updated: CmsData = {
      ...data,
      lastPublishedAt: new Date().toISOString(),
      version: (data.version || 1) + 1,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cms:updated', { detail: updated }));
    }

    // Also persist to server endpoint if available
    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (response.ok) {
        const json = await response.json();
        return { success: true, data: json.data || updated };
      }
    } catch {
      // Offline or static preview fallback
    }

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save CMS data' };
  }
}

/**
 * Triggers the Vercel Deploy Hook if configured
 */
export async function triggerVercelDeploy(hookUrl?: string): Promise<{ success: boolean; message: string }> {
  const url = hookUrl || getClientCmsData().siteConfig.vercelDeployHookUrl;
  if (!url) {
    return {
      success: false,
      message: 'No Vercel Deploy Hook URL configured. Please configure it in SEO & Settings tab.',
    };
  }

  try {
    const res = await fetch(url, { method: 'POST' });
    if (res.ok) {
      return {
        success: true,
        message: 'Deployment triggered successfully! Vercel is now rebuilding the live website with your changes.',
      };
    }
    return {
      success: false,
      message: `Vercel Deploy Hook returned status ${res.status}. Please check your webhook URL.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Vercel Deploy Hook: ${err?.message || 'Network error'}`,
    };
  }
}
