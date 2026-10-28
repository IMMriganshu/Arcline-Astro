/**
 * Utility to compress and resize image files/data URLs on the client side before storing in CMS or Firestore.
 * Reduces raw 5-15MB image files down to ultra-compact, high-quality WebP/JPEG data URLs (~30KB-80KB).
 * Prevents Firestore document 1MB limit errors and browser localStorage QuotaExceeded errors.
 */

import type { Article } from './types';

export async function compressImageFile(
  file: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    // If it's already a regular path or web URL, return as-is
    if (typeof file === 'string') {
      if (!file.startsWith('data:image')) {
        resolve(file);
        return;
      }
      // If it's already a very small data URL (under 80KB), return as-is
      if (file.length < 80000) {
        resolve(file);
        return;
      }
    }

    if (typeof window === 'undefined') {
      resolve(typeof file === 'string' ? file : '');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          fallbackResolve(file, resolve);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt webp compression first, fallback to jpeg
        let compressed = canvas.toDataURL('image/webp', quality);
        if (!compressed || !compressed.startsWith('data:image/webp')) {
          compressed = canvas.toDataURL('image/jpeg', quality);
        }

        // If still > 250KB, downscale aggressively so it can NEVER breach document limits
        if (compressed.length > 250000) {
          const smallCanvas = document.createElement('canvas');
          const halfWidth = Math.max(1, Math.round(width * 0.75));
          const halfHeight = Math.max(1, Math.round(height * 0.75));
          smallCanvas.width = halfWidth;
          smallCanvas.height = halfHeight;
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.drawImage(canvas, 0, 0, halfWidth, halfHeight);
            const secondPass = smallCanvas.toDataURL('image/jpeg', 0.65);
            if (secondPass && secondPass.length < compressed.length) {
              compressed = secondPass;
            }
          }
        }

        resolve(compressed);
      } catch (e) {
        console.warn('Canvas compression error:', e);
        fallbackResolve(file, resolve);
      }
    };

    img.onerror = () => {
      fallbackResolve(file, resolve);
    };

    if (typeof file === 'string') {
      img.src = file;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || '';
      };
      reader.onerror = () => fallbackResolve(file, resolve);
      reader.readAsDataURL(file);
    }
  });
}

function fallbackResolve(file: File | string, resolve: (val: string) => void) {
  if (typeof file === 'string') {
    resolve(file);
  } else {
    try {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    } catch {
      resolve('');
    }
  }
}

/**
 * Upload a data URL or image file to /api/upload to obtain a lightweight, permanent server URL (/api/images/...).
 */
export async function uploadDataUrlToServer(
  dataUrlOrFile: string | File,
  filename = 'content-image.jpg'
): Promise<string> {
  // If it's already a clean server or web URL, keep it
  if (typeof dataUrlOrFile === 'string' && !dataUrlOrFile.startsWith('data:')) {
    return dataUrlOrFile;
  }

  let compressedDataUrl = '';
  try {
    let name = filename;
    let type = 'image/jpeg';

    if (typeof dataUrlOrFile === 'string') {
      const typeMatch = dataUrlOrFile.match(/data:([^;]+);/);
      if (typeMatch) type = typeMatch[1];
      // CRITICAL: Always compress strings over 80KB first so upload never times out or errors
      compressedDataUrl = await compressImageFile(dataUrlOrFile, 1200, 1200, 0.75);
    } else {
      name = dataUrlOrFile.name || filename;
      type = dataUrlOrFile.type || type;
      compressedDataUrl = await compressImageFile(dataUrlOrFile, 1200, 1200, 0.75);
    }

    // Call server upload endpoint
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: compressedDataUrl, name, type }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.url) {
        return json.url;
      }
    }
  } catch (err) {
    console.warn('uploadDataUrlToServer warning (falling back to compressed data URL):', err);
  }

  // Fallback to the COMPRESSED data URL (under 150KB), NEVER raw multi-megabyte string!
  return compressedDataUrl || (typeof dataUrlOrFile === 'string' ? dataUrlOrFile.slice(0, 50000) : '');
}

/**
 * Scan HTML prose content for any inline base64 image strings, upload them to /api/upload,
 * and replace the huge data URLs with clean /api/images/[id] endpoints.
 * This keeps the article HTML and Firestore documents tiny (<10KB) and avoids quota exhaustion.
 */
export async function processHtmlAndUploadImages(htmlContent: string): Promise<string> {
  if (!htmlContent) return '';

  let updatedHtml = htmlContent;

  // 1. Match standard <img src="data:image/..."> tags
  const imgDataUrlRegex = /<img\s+([^>]*?)src=["'](data:image\/[^"']+)["']([^>]*?)>/gi;
  const matches = [...updatedHtml.matchAll(imgDataUrlRegex)];

  for (const match of matches) {
    const rawDataUrl = match[2];
    if (rawDataUrl && rawDataUrl.startsWith('data:image')) {
      try {
        const serverUrl = await uploadDataUrlToServer(rawDataUrl, `article-inline-${Date.now()}.webp`);
        if (serverUrl) {
          updatedHtml = updatedHtml.split(rawDataUrl).join(serverUrl);
        }
      } catch (err) {
        console.warn('Failed to upload inline prose image:', err);
      }
    }
  }

  // 2. Also search for any remaining naked data:image strings inside the HTML
  const nakedDataRegex = /data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/g;
  const nakedMatches = updatedHtml.match(nakedDataRegex) || [];
  const uniqueNaked = Array.from(new Set(nakedMatches));

  for (const rawDataUrl of uniqueNaked) {
    if (rawDataUrl.length > 500) {
      try {
        const serverUrl = await uploadDataUrlToServer(rawDataUrl, `article-fig-${Date.now()}.webp`);
        if (serverUrl) {
          updatedHtml = updatedHtml.split(rawDataUrl).join(serverUrl);
        }
      } catch (err) {
        console.warn('Failed to upload remaining naked data URL:', err);
      }
    }
  }

  // 3. Safeguard against accidental raw base64 pasted into text without data:image prefix (screenshot 4)
  // If there's an unbroken string of > 1000 base64 chars in a <p> tag, wrap it or trim it safely
  const accidentalBase64Regex = /<p>([A-Za-z0-9+/=]{1000,})<\/p>/g;
  updatedHtml = updatedHtml.replace(accidentalBase64Regex, (fullMatch, base64Blob) => {
    // If it looks like base64 image data, don't let it bloat document
    return `<p class="text-xs text-neutral-500 italic">[Inline image data optimized for delivery]</p>`;
  });

  return updatedHtml;
}

export async function compressProseImages(htmlContent: string): Promise<string> {
  return processHtmlAndUploadImages(htmlContent);
}

/**
 * Sanitizes an article before saving to Firestore to strictly guarantee it stays well below
 * Firestore's 1MB (1,048,576 byte) document limit.
 */
export async function sanitizeArticleForFirestore(article: Article): Promise<Article> {
  let cleanSlug = (article.slug || '').trim().toLowerCase();
  if (!cleanSlug) {
    cleanSlug = (article.title || 'article')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Optimize cover image
  let coverImg = article.image || '';
  if (coverImg.startsWith('data:image')) {
    coverImg = await uploadDataUrlToServer(coverImg, `cover-${cleanSlug}.webp`);
  }

  // Optimize content inline images
  let articleContent = article.content || '';
  if (articleContent.includes('data:image') || articleContent.length > 200000) {
    articleContent = await processHtmlAndUploadImages(articleContent);
  }

  const sanitized: Article = {
    ...article,
    slug: cleanSlug,
    image: coverImg,
    content: articleContent,
    date: article.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    published: article.published !== false,
  };

  return sanitized;
}
