import { getServerCmsData } from './cms';
import { defaultCmsContent } from '../data/defaultCmsContent';
import type { CmsData } from './types';

export async function getSiteContent(): Promise<CmsData> {
  try {
    return await getServerCmsData();
  } catch {
    return defaultCmsContent;
  }
}
