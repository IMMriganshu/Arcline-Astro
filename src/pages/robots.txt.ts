import type { APIRoute } from 'astro';
import { getSeoSettings } from '../lib/cms';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const seoSettings = await getSeoSettings();
  const origin = seoSettings?.siteUrl || new URL(request.url).origin;

  let robotsContent = seoSettings?.robotsTxtContent;

  if (!robotsContent) {
    robotsContent = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml`;
  } else if (!robotsContent.includes('Sitemap:')) {
    robotsContent += `\n\nSitemap: ${origin}/sitemap.xml`;
  }

  return new Response(robotsContent.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
