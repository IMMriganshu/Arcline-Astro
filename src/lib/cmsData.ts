import { getServerCmsData } from './cms';
import { defaultCmsContent } from '../data/defaultCmsContent';
import type { CmsData } from './types';

export function getSiteContent(): CmsData {
  try {
    return getServerCmsData();
  } catch {
    return defaultCmsContent;
  }
}
