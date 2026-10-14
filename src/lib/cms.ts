import type { CmsData } from './types';
import { defaultCmsContent } from '../data/defaultCmsContent';
import fs from 'node:fs';
import path from 'node:path';

const CMS_STORAGE_KEY = 'arcline_cms_content_v1';
const CMS_FILE_PATH = path.resolve(process.cwd(), 'src/data/cmsContent.json');

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
  } catch (err) {
    console.error('Error reading CMS file from disk:', err);
  }
  return defaultCmsContent;
}

/**
 * Server-side helper to persist CMS data to disk
 */
export function saveServerCmsData(data: CmsData): boolean {
  try {
    const dir = path.dirname(CMS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const updated = {
      ...data,
      lastPublishedAt: new Date().toISOString(),
      version: (data.version || 1) + 1,
    };
    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
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
