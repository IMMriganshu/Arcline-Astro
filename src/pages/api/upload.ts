import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const prerender = false;

const CHUNK_SIZE = 450000; // ~450KB per chunk to comfortably stay under Firestore's 1,048,576 byte limit

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let dataUrl = '';
    let filename = 'uploaded-image.jpg';
    let mimeType = 'image/jpeg';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      dataUrl = body.file || body.dataUrl || '';
      filename = body.name || filename;
      mimeType = body.type || (dataUrl.match(/data:([^;]+);/)?.[1] || mimeType);
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (file) {
        filename = file.name || filename;
        mimeType = file.type || mimeType;
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        dataUrl = `data:${mimeType};base64,${base64}`;
      }
    }

    if (!dataUrl) {
      return new Response(JSON.stringify({ success: false, error: 'No image data provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique ID
    const cleanName = filename.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/\.[^/.]+$/, '');
    const id = `img-${Date.now()}-${cleanName.slice(0, 20)}`;

    if (dataUrl.length > 700000) {
      // Chunked storage to prevent exceeding Firestore 1MB limit
      const totalChunks = Math.ceil(dataUrl.length / CHUNK_SIZE);
      await setDoc(doc(db, 'media_uploads', id), {
        id,
        filename,
        mimeType,
        isChunked: true,
        totalChunks,
        createdAt: new Date().toISOString(),
      });

      for (let i = 0; i < totalChunks; i++) {
        const chunk = dataUrl.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        await setDoc(doc(db, 'media_uploads', id, 'chunks', String(i)), {
          index: i,
          chunk,
        });
      }
    } else {
      // Direct single-document storage
      const docData = {
        id,
        filename,
        mimeType,
        dataUrl,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'media_uploads', id), docData);
    }

    const publicUrl = `/api/images/${id}`;

    return new Response(
      JSON.stringify({
        success: true,
        id,
        url: publicUrl,
        filename,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
