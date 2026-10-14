import type { CmsData } from './types';
import { defaultCmsContent } from '../data/defaultCmsContent';
import fs from 'node:fs';
import path from 'node:path';

const CMS_STORAGE_KEY = 'arcline_cms_content_v1';
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const CMS_FILE_PATH = isServerless
  ? path.resolve('/tmp', 'cmsContent.json')
  : path.resolve(process.cwd(), 'src/data/cmsContent.json');

export const defaultArticles = defaultCmsContent.articles;

/**
 * Server-side helper to read persistent CMS data from disk or fallback to default
 */
export function getServerCmsData(): CmsData {
  try {
    if (fs.existsSync(CMS_FILE_PATH)) {
      const fileData = fs.readFileSync(CMS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      return { ...defaultCmsContent, ...parsed };
    }
    const localPath = path.resolve(process.cwd(), 'src/data/cmsContent.json');
    if (fs.existsSync(localPath)) {
      const fileData = fs.readFileSync(localPath, 'utf-8');
      const parsed = JSON.parse(fileData);
      return { ...defaultCmsContent, ...parsed };
    }
  } catch (err) {
    console.error('Error reading CMS file from disk:', err);
  }
  return defaultCmsContent;
}

/**
 * Universal helper to get CMS data in either server or client context
 */
export function getCmsData(): CmsData {
  if (typeof window === 'undefined') {
    return getServerCmsData();
  }
  return getClientCmsData();
}

/**
 * Get all blog articles
 */
export function getArticles() {
  const data = getCmsData();
  return data.articles && data.articles.length > 0 ? data.articles : defaultArticles;
}

/**
 * Find an article by its slug
 */
export function getArticleBySlug(slug: string) {
  const articles = getArticles();
  return articles.find((a) => a.slug === slug);
}

/**
 * Get all services
 */
export function getServices() {
  const data = getCmsData();
  return data.services || defaultCmsContent.services;
}

/**
 * Get all case study projects
 */
export function getProjects() {
  const data = getCmsData();
  return data.projects || defaultCmsContent.projects;
}

/**
 * Get all surgeon testimonials
 */
export function getTestimonials() {
  const data = getCmsData();
  return data.testimonials || defaultCmsContent.testimonials;
}

/**
 * Get site configuration
 */
export function getSiteConfig() {
  const data = getCmsData();
  return data.siteConfig || defaultCmsContent.siteConfig;
}

/**
 * Server-side helper to persist CMS data to disk
 */
export function saveServerCmsData(data: CmsData): boolean {
  try {
    const targetPath = isServerless ? path.resolve('/tmp', 'cmsContent.json') : CMS_FILE_PATH;
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const updated = {
      ...data,
      lastPublishedAt: new Date().toISOString(),
      version: (data.version || 1) + 1,
    };
    fs.writeFileSync(targetPath, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving CMS file to disk:', err);
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
      return JSON.parse(local);
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
