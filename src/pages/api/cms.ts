import type { APIRoute } from 'astro';
import { getServerCmsData, saveServerCmsData, triggerVercelDeploy } from '../../lib/cms';

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await getServerCmsData();
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Check if this is a deploy trigger request
    if (body.action === 'deploy') {
      if (body.data) {
        await saveServerCmsData(body.data);
      }
      const deployResult = await triggerVercelDeploy(body.hookUrl);
      return new Response(JSON.stringify(deployResult), {
        status: deployResult.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const saved = await saveServerCmsData(body);
    if (!saved) {
      return new Response(JSON.stringify({ success: false, error: 'Failed to write CMS content to Firestore' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Content published and saved successfully',
        data: await getServerCmsData(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
