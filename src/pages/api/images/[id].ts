import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response('Missing image ID', { status: 400 });
  }

  try {
    const docRef = doc(db, 'media_uploads', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return new Response('Image not found', { status: 404 });
    }

    const data = snap.data();
    let dataUrl: string = data.dataUrl || '';

    // If chunked, fetch and reassemble chunks
    if (data.isChunked) {
      try {
        const chunksSnap = await getDocs(collection(db, 'media_uploads', id, 'chunks'));
        const chunkList: { index: number; chunk: string }[] = [];
        chunksSnap.forEach((cDoc) => {
          const cd = cDoc.data();
          chunkList.push({
            index: typeof cd.index === 'number' ? cd.index : parseInt(cDoc.id, 10),
            chunk: cd.chunk || '',
          });
        });
        chunkList.sort((a, b) => a.index - b.index);
        dataUrl = chunkList.map((c) => c.chunk).join('');
      } catch (chunkErr) {
        console.error('Error fetching image chunks:', id, chunkErr);
      }
    }

    if (!dataUrl) {
      return new Response('Empty image data', { status: 404 });
    }

    // Parse data URL format: data:<mimeType>;base64,<base64Data>
    const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
    let mimeType = 'image/jpeg';
    let base64Data = '';

    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    } else {
      base64Data = dataUrl.replace(/^data:[^,]+,/, '');
      mimeType = data.mimeType || 'image/jpeg';
    }

    const imageBuffer = Buffer.from(base64Data, 'base64');

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error('Error serving image:', id, err);
    return new Response('Error retrieving image: ' + err.message, { status: 500 });
  }
};
