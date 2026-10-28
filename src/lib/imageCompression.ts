/**
 * Utility to compress and resize image files/data URLs on the client side before storing in CMS or Firestore.
 * Reduces raw 5-15MB image files down to ultra-compact, high-quality WebP/JPEG data URLs (~30KB-80KB).
 */

export async function compressImageFile(
  file: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    // If it's already a short web path or URL, return as-is
    if (typeof file === 'string') {
      if (!file.startsWith('data:image')) {
        resolve(file);
        return;
      }
      // If it's a data URL under 150KB, it's already small enough
      if (file.length < 200000) {
        resolve(file);
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
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
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (typeof file === 'string') resolve(file);
        else {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsDataURL(file);
        }
        return;
      }

      // Smooth resizing quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Attempt webp compression first, fallback to jpeg
      let compressedDataUrl = canvas.toDataURL('image/webp', quality);
      if (!compressedDataUrl || !compressedDataUrl.startsWith('data:image/webp')) {
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      if (typeof file === 'string') {
        resolve(file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.readAsDataURL(file);
      }
    };

    if (typeof file === 'string') {
      img.src = file;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    }
  });
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

  try {
    let dataUrl = '';
    let name = filename;
    let type = 'image/jpeg';

    if (typeof dataUrlOrFile === 'string') {
      dataUrl = dataUrlOrFile;
      const typeMatch = dataUrl.match(/data:([^;]+);/);
      if (typeMatch) type = typeMatch[1];
    } else {
      name = dataUrlOrFile.name || filename;
      type = dataUrlOrFile.type || type;
      dataUrl = await compressImageFile(dataUrlOrFile, 1400, 1400, 0.85);
    }

    // Call server upload endpoint
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: dataUrl, name, type }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.url) {
        return json.url;
      }
    }
  } catch (err) {
    console.warn('uploadDataUrlToServer failed:', err);
  }

  // Fallback to data URL if upload failed
  return typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '';
}

/**
 * Scan HTML prose content for any inline base64 image strings, upload them to /api/upload,
 * and replace the huge data URLs with clean /api/images/[id] endpoints.
 * This keeps the article HTML and Firestore documents tiny (<10KB) and avoids quota exhaustion.
 */
export async function processHtmlAndUploadImages(htmlContent: string): Promise<string> {
  if (!htmlContent || !htmlContent.includes('data:image')) {
    return htmlContent;
  }

  // Regex to find img src with data:image
  const imgDataUrlRegex = /<img\s+([^>]*?)src=["'](data:image\/[^"']+)["']([^>]*?)>/gi;
  const matches = [...htmlContent.matchAll(imgDataUrlRegex)];

  if (matches.length === 0) return htmlContent;

  let updatedHtml = htmlContent;

  for (const match of matches) {
    const rawDataUrl = match[2];
    if (rawDataUrl && rawDataUrl.startsWith('data:image')) {
      try {
        const compressed = await compressImageFile(rawDataUrl, 1400, 1400, 0.85);
        const serverUrl = await uploadDataUrlToServer(compressed, `article-inline-${Date.now()}.webp`);
        if (serverUrl && !serverUrl.startsWith('data:')) {
          updatedHtml = updatedHtml.split(rawDataUrl).join(serverUrl);
        }
      } catch (err) {
        console.warn('Failed to upload inline prose image to server:', err);
      }
    }
  }

  return updatedHtml;
}

/**
 * Scan HTML prose content for oversized inline base64 image strings and convert to server URLs or compress them.
 */
export async function compressProseImages(htmlContent: string): Promise<string> {
  return processHtmlAndUploadImages(htmlContent);
}
