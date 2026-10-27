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
 * Scan HTML prose content for oversized inline base64 image strings and compress them.
 */
export async function compressProseImages(htmlContent: string): Promise<string> {
  if (!htmlContent || !htmlContent.includes('data:image')) {
    return htmlContent;
  }

  // Regex to find img src with data:image
  const imgDataUrlRegex = /<img\s+([^>]*?)src=["'](data:image\/[^"']+)["']([^>]*?)>/gi;
  let matches = [...htmlContent.matchAll(imgDataUrlRegex)];

  if (matches.length === 0) return htmlContent;

  let updatedHtml = htmlContent;

  for (const match of matches) {
    const fullImgTag = match[0];
    const rawDataUrl = match[2];

    // Only compress if the data URL is oversized (>150KB string length)
    if (rawDataUrl && rawDataUrl.length > 200000) {
      try {
        const compressed = await compressImageFile(rawDataUrl, 1200, 1200, 0.8);
        if (compressed && compressed.length < rawDataUrl.length) {
          updatedHtml = updatedHtml.replace(rawDataUrl, compressed);
        }
      } catch (err) {
        console.warn('Failed to compress inline prose image:', err);
      }
    }
  }

  return updatedHtml;
}
