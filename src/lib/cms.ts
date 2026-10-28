import type { CmsData } from './types';
import { defaultCmsContent } from '../data/defaultCmsContent';
import { db } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

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
 * Recursively normalize any occurrence of "Seelutions" to lowercase "seelutions"
 */
export function replaceSeelutionsDeep<T>(obj: T): T {
  if (typeof obj === 'string') {
    return (obj as string).replace(/Seelutions/g, 'seelutions') as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceSeelutionsDeep(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj as object)) {
      res[key] = replaceSeelutionsDeep((obj as any)[key]);
    }
    return res;
  }
  return obj;
}

/**
 * Server-side helper to read persistent CMS data from Firestore
 */
export async function getServerCmsData(): Promise<CmsData> {
  let remoteData: Partial<CmsData> | null = null;
  try {
    const docRef = doc(db, CMS_COLLECTION, CMS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      remoteData = docSnap.data() as CmsData;
      if (remoteData?.siteConfig) {
        if (remoteData.siteConfig.name === 'Arcline' || remoteData.siteConfig.name === 'Seelutions') {
          remoteData.siteConfig.name = 'seelutions';
        }
        if (remoteData.siteConfig.title) {
          remoteData.siteConfig.title = remoteData.siteConfig.title.replace(/Arcline/g, 'seelutions').replace(/Seelutions/g, 'seelutions');
        }
        if (remoteData.siteConfig.description && remoteData.siteConfig.description.includes('Distinguished architectural agency')) {
          remoteData.siteConfig.description = defaultCmsContent.siteConfig.description;
        }
      }
      if (remoteData?.comparisonContent?.seelutionsTitle) {
        remoteData.comparisonContent.seelutionsTitle = remoteData.comparisonContent.seelutionsTitle.replace(/Seelutions/g, 'seelutions');
      }
    }
  } catch (err) {
    console.error('Error reading CMS data from Firestore:', err);
  }

  // Also query individual articles from cms_articles collection for bulletproof persistence
  try {
    const articlesCol = collection(db, 'cms_articles');
    const articlesSnap = await getDocs(articlesCol);
    if (!articlesSnap.empty) {
      const individualArticles: any[] = [];
      articlesSnap.forEach((d) => {
        const art = d.data();
        if (art && (art.slug || art.title)) {
          individualArticles.push({ ...art, id: art.id || d.id });
        }
      });

      if (individualArticles.length > 0) {
        if (!remoteData) remoteData = {};
        const existingArticles = Array.isArray(remoteData.articles) ? remoteData.articles : [];
        const articleMap = new Map<string, any>();
        existingArticles.forEach((a) => {
          if (a.id) articleMap.set(a.id, a);
          else if (a.slug) articleMap.set(a.slug, a);
        });
        individualArticles.forEach((a) => {
          if (a.id) articleMap.set(a.id, a);
          else if (a.slug) articleMap.set(a.slug, a);
        });
        remoteData.articles = Array.from(articleMap.values());
      }
    }
  } catch (colErr) {
    console.warn('Error reading cms_articles collection:', colErr);
  }

  if (remoteData) {
    return replaceSeelutionsDeep(deepMerge(defaultCmsContent, remoteData));
  }
  return replaceSeelutionsDeep(defaultCmsContent);
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
 * Get global SEO settings
 */
export async function getSeoSettings() {
  const data = await getCmsData();
  return data.seoSettings || defaultCmsContent.seoSettings;
}

/**
 * Get page SEO metadata by key (e.g., 'home', 'about', 'services', 'projects', 'blog')
 */
export async function getPageSeo(key: string) {
  const data = await getCmsData();
  if (data.pageSeoMap && data.pageSeoMap[key]) {
    return data.pageSeoMap[key];
  }
  return defaultCmsContent.pageSeoMap?.[key];
}

/**
 * Get active redirect rules
 */
export async function getRedirects() {
  const data = await getCmsData();
  return data.redirects || defaultCmsContent.redirects || [];
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
  let mainSuccess = false;
  try {
    const cleaned = replaceSeelutionsDeep(data);
    const updated = {
      ...cleaned,
      lastPublishedAt: new Date().toISOString(),
      version: (cleaned.version || 1) + 1,
    };
    
    await setDoc(doc(db, CMS_COLLECTION, CMS_DOC_ID), updated);
    mainSuccess = true;
  } catch (err) {
    console.error('Error saving CMS data to main Firestore document:', err);
  }

  // Always persist all individual articles to cms_articles collection for resilient isolation
  if (Array.isArray(data.articles)) {
    for (const art of data.articles) {
      if (art && (art.id || art.slug)) {
        const docId = art.id || art.slug;
        try {
          await setDoc(doc(db, 'cms_articles', docId), art);
        } catch (artErr) {
          console.warn('Error saving individual article document:', docId, artErr);
        }
      }
    }
  }

  return mainSuccess || (Array.isArray(data.articles) && data.articles.length > 0);
}

/**
 * Server-side helper to delete an individual article from Firestore
 */
export async function deleteServerArticle(articleId: string, slug?: string): Promise<boolean> {
  let success = false;
  try {
    if (articleId) {
      await deleteDoc(doc(db, 'cms_articles', articleId));
      success = true;
    }
    if (slug && slug !== articleId) {
      await deleteDoc(doc(db, 'cms_articles', slug));
      success = true;
    }
  } catch (err) {
    console.warn('Error deleting article from cms_articles:', articleId, slug, err);
  }
  return success;
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
      return replaceSeelutionsDeep(deepMerge(defaultCmsContent, parsed));
    }
  } catch (e) {
    console.warn('Failed to parse localStorage CMS data:', e);
  }
  return replaceSeelutionsDeep(defaultCmsContent);
}

/**
 * Client-side helper to save CMS data locally and send to API
 */
export async function saveClientCmsData(data: CmsData): Promise<{ success: boolean; data?: CmsData; error?: string }> {
  try {
    const cleaned = replaceSeelutionsDeep(data);
    const updated: CmsData = {
      ...cleaned,
      lastPublishedAt: new Date().toISOString(),
      version: (cleaned.version || 1) + 1,
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
