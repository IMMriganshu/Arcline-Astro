import { defineMiddleware } from 'astro:middleware';
import { getRedirects } from './lib/cms';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url;
  const pathname = url.pathname;

  // Ignore static assets, admin, or api routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_astro') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|mp4|css|js|ico|xml|txt)$/)
  ) {
    return next();
  }

  try {
    const redirects = await getRedirects();
    const activeRule = redirects.find(
      (r) => r.active && (r.fromPath === pathname || r.fromPath === pathname + '/')
    );

    if (activeRule && activeRule.toPath) {
      return context.redirect(activeRule.toPath, activeRule.type || 301);
    }
  } catch (e) {
    console.error('Error in redirects middleware:', e);
  }

  return next();
});
