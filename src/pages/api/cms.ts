import type { APIRoute } from 'astro';
import { getServerCmsData, saveServerCmsData, triggerVercelDeploy } from '../../lib/cms';

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = getServerCmsData();
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
      const deployResult = await triggerVercelDeploy(body.hookUrl);
      return new Response(JSON.stringify(deployResult), {
        status: deployResult.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let saved = false;
    try {
      saved = saveServerCmsData(body);
    } catch (e) {
      console.warn('Filesystem write not supported in current environment (Vercel serverless):', e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: saved ? 'Content saved to disk' : 'Content accepted (session/client storage active)',
        data: body,
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
