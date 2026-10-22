import type { APIRoute } from 'astro';
import { getCmsData, getSeoSettings } from '../lib/cms';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const cmsData = await getCmsData();
  const seoSettings = await getSeoSettings();
  const origin = seoSettings?.siteUrl || new URL(request.url).origin;

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/#about', changefreq: 'weekly', priority: '0.8' },
    { url: '/services', changefreq: 'weekly', priority: '0.9' },
    { url: '/projects', changefreq: 'weekly', priority: '0.8' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/style-guide', changefreq: 'monthly', priority: '0.3' },
  ];

  const articles = cmsData.articles || [];
  const publishedArticles = articles.filter((a) => a.published);

  const customPages = cmsData.pages || [];

  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${origin}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${publishedArticles
    .map(
      (art) => `
  <url>
    <loc>${origin}/blog/${art.slug}</loc>
    <lastmod>${art.date ? new Date(art.date).toISOString().split('T')[0] : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${customPages
    .map(
      (page) => `
  <url>
    <loc>${origin}/pages/${page.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(xml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
