import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_C_GWBMI-.mjs";
import { t as createComponent } from "./compiler_CDLjna1-.mjs";
import { n as $$SectionLabel, s as $$Button } from "./BaseLayout_CaCreFi9.mjs";
//#region src/components/ProjectCTA.astro
var $$ProjectCTA = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section id="contact-cta" class="py-16 md:py-24 relative overflow-hidden bg-[#050505] text-white"><!-- Atmospheric Dark Architectural Background Image --><div class="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2100&q=85" alt="Modern medical aesthetic practice architecture" class="w-full h-full object-cover object-center opacity-25" loading="lazy"><div class="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/85 to-[#050505]/70"></div></div><div class="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12"><div class="max-w-3xl"><!-- Gold Label --><div class="mb-4" data-animate="fade-up-sm">${renderComponent($$result, "SectionLabel", $$SectionLabel, {
		"text": "PRACTICE DIGITAL AUDIT",
		"theme": "dark"
	})}</div><!-- Headline --><h2 data-animate="fade-up" class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6">Is Your Practice Visible in Modern AI &amp; Google Search?</h2><!-- Sub-Heading --><p data-animate="fade-up-sm" data-animate-delay="1" class="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-2xl font-normal">Claim a customized, 3-minute video analysis of your practice&apos;s digital footprint. We&apos;ll walk through your site, identify where high-ticket patient consults are leaking to local competitors, and show you how to fix it.</p><!-- Trigger Button --><div data-animate="fade-up-sm" data-animate-delay="2">${renderComponent($$result, "Button", $$Button, {
		"href": "#contact",
		"variant": "white",
		"showIcon": true,
		"iconType": "arrow-right"
	}, { "default": ($$result) => renderTemplate`
          Request Your Free 3-Minute Practice Audit
        ` })}</div></div></div></section>`;
}, "/app/applet/src/components/ProjectCTA.astro", void 0);
//#endregion
export { $$ProjectCTA as t };
