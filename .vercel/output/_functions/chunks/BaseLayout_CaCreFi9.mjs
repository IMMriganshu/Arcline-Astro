import { C as createAstro, c as renderSlot, d as renderTemplate, f as maybeRenderHead, h as createRenderInstruction, i as renderComponent, m as addAttribute, p as renderHead } from "./server_C_GWBMI-.mjs";
import { t as createComponent } from "./compiler_CDLjna1-.mjs";
/* empty css                 */
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/components/Logo.astro
createAstro("https://astro.build");
var $$Logo = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Logo;
	const { variant = "dark", size = "md", class: className = "", tagline, fetchpriority = "auto" } = Astro.props;
	const textColor = variant === "light" ? "text-white" : "text-[#030303]";
	return renderTemplate`${maybeRenderHead($$result)}<a href="/"${addAttribute(`inline-flex items-center gap-3 group select-none ${className}`, "class")}><!-- New logo --><div${addAttribute({
		sm: "h-10 w-10",
		md: "h-16 w-16",
		lg: "h-20 w-20"
	}[size], "class")}><img src="/images/seelutions%20new%20updatedLogo.png" alt="Seelutions Logo"${addAttribute(fetchpriority, "fetchpriority")} class="w-full h-full object-contain"></div><div class="flex flex-col"><span${addAttribute(`font-bold tracking-tight ${textColor} ${{
		sm: "text-lg",
		md: "text-xl",
		lg: "text-2xl"
	}[size]}`, "class")}>Seelutions</span>${tagline && renderTemplate`<span class="text-[10px] font-medium text-neutral-500 uppercase tracking-widest -mt-0.5">${tagline}</span>`}</div></a>`;
}, "/app/applet/src/components/Logo.astro", void 0);
//#endregion
//#region src/components/Button.astro
createAstro("https://astro.build");
var $$Button = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Button;
	const { href, variant = "black", showIcon = true, iconType = "arrow-up-right", class: className = "", id, type = "button" } = Astro.props;
	const variantClasses = {
		black: "btn-pill-black",
		white: "btn-pill-white",
		outline: "btn-pill-outline"
	};
	const badgeClasses = {
		black: "icon-badge",
		white: "icon-badge-dark",
		outline: "icon-badge"
	};
	return renderTemplate`${renderComponent($$result, "Tag", href ? "a" : "button", {
		"href": href,
		"id": id,
		"type": href ? void 0 : type,
		"class": `${variantClasses[variant]} group cursor-pointer inline-flex items-center select-none ${className}`
	}, { "default": ($$result) => renderTemplate`${renderSlot($$result, $$slots["default"])}${showIcon && renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(badgeClasses[variant], "class")} aria-hidden="true">${iconType === "arrow-up-right" ? renderTemplate`<svg class="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>` : renderTemplate`<svg class="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg>`}</span>`}` })}`;
}, "/app/applet/src/components/Button.astro", void 0);
//#endregion
//#region src/components/Header.astro
var $$Header = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<header id="site-header" class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-4 px-4 sm:px-8"><div class="max-w-7xl mx-auto flex items-center justify-between"><!-- Brand Logo & Tagline --><div class="flex items-center gap-3">${renderComponent($$result, "Logo", $$Logo, {
		"variant": "dark",
		"size": "md",
		"tagline": "be seen. be chosen.",
		"fetchpriority": "high"
	})}</div><!-- Desktop Navigation Pill --><nav class="hidden lg:flex items-center gap-1 bg-[#FCFCFC]/85 backdrop-blur-md px-4 py-2 rounded-full border border-black/8 shadow-xs"><!-- About --><a href="/#about" class="px-3 py-1.5 text-sm font-medium text-[#030303] hover:text-black/70 transition-colors rounded-full">About</a><!-- Services Dropdown --><div class="relative dropdown-container group"><button type="button" class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#030303] hover:text-black/70 transition-colors cursor-pointer rounded-full" aria-expanded="false" aria-haspopup="true"><span>Services</span><svg class="w-3.5 h-3.5 text-black/50 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></button><div class="dropdown-menu absolute top-full left-0 pt-2 w-56 z-50"><div class="bg-white rounded-2xl p-2 shadow-xl border border-black/8 backdrop-blur-lg"><p class="text-[11px] font-semibold text-[#8DC541] uppercase tracking-wider mb-2 px-3 pt-1">Our Expertise</p>${[
		{
			label: "Local SEO & Maps",
			href: "/services/local-seo"
		},
		{
			label: "AI Search & GEO",
			href: "/services/ai-search"
		},
		{
			label: "Medical Brand Identity",
			href: "/services/branding"
		},
		{
			label: "Surgical Web Design",
			href: "/services/web-design"
		},
		{
			label: "Patient Acquisition & PPC",
			href: "/services/ppc"
		},
		{
			label: "Med Spa Pipelines",
			href: "/services/med-spa"
		}
	].map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="block px-3.5 py-2 text-sm text-[#030303] hover:bg-neutral-100 rounded-xl transition-colors font-medium">${item.label}</a>`)}</div></div></div><!-- Case Study --><a href="/case-studies" class="px-3 py-1.5 text-sm font-medium text-[#030303] hover:text-black/70 transition-colors rounded-full">Case Study</a><!-- Patient Grower --><a href="/patient-grower" class="px-3 py-1.5 text-sm font-medium text-[#030303] hover:text-black/70 transition-colors rounded-full">Patient Grower</a></nav><!-- Right: Phone & Request Audit Button --><div class="flex items-center gap-4"><a href="tel:8047075821" class="hidden sm:block text-sm font-bold text-[#030303] hover:text-black/70 transition-colors">(804) 707-5821</a><div class="hidden lg:flex">${renderComponent($$result, "Button", $$Button, {
		"href": "#contact",
		"id": "header-contact-btn",
		"variant": "black",
		"showIcon": true
	}, { "default": ($$result) => renderTemplate`
          Request Practice Audit
        ` })}</div><!-- Mobile Hamburger Button --><button id="mobile-menu-toggle" type="button" class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/10 text-black shadow-xs cursor-pointer" aria-label="Toggle navigation menu" aria-expanded="false"><svg id="hamburger-icon" class="w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path></svg><svg id="close-icon" class="w-5 h-5 hidden transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div></div><!-- Mobile Menu Drawer (Simplified) --><div id="mobile-nav" class="lg:hidden hidden mt-3 mx-2 bg-white rounded-2xl p-5 shadow-2xl border border-black/8 transition-all"><div class="flex flex-col space-y-2"><a href="/#about" class="px-3 py-2 text-base font-semibold text-black hover:bg-neutral-50 rounded-xl mobile-nav-link">About</a><a href="/#services" class="px-3 py-2 text-base font-semibold text-black hover:bg-neutral-50 rounded-xl mobile-nav-link">Services</a><a href="/case-studies" class="px-3 py-2 text-base font-semibold text-black hover:bg-neutral-50 rounded-xl mobile-nav-link">Case Study</a><a href="/patient-grower" class="px-3 py-2 text-base font-semibold text-black hover:bg-neutral-50 rounded-xl mobile-nav-link">Patient Grower</a><div class="pt-3">${renderComponent($$result, "Button", $$Button, {
		"href": "#contact",
		"variant": "black",
		"showIcon": true,
		"class": "w-full justify-center"
	}, { "default": ($$result) => renderTemplate`Request Practice Audit` })}</div></div></div></header>${renderScript($$result, "/app/applet/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/applet/src/components/Header.astro", void 0);
//#endregion
//#region src/data/siteData.ts
var siteConfig = {
	name: "Arcline",
	title: "Arcline — Architecture & Design Agency",
	description: "Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time.",
	email: "yourcompany@gmail.com",
	phone: "(555) 345-6789",
	address: "567 Jac Spruce Crescent, Montreal, QC H1A 2K3",
	estYear: "EST. 2010"
};
var servicesData = [
	{
		number: "01",
		title: "Local SEO & Google Map Pack Dominance",
		description: "We optimize your Google Business Profile, local citations, and schema markup so your practice occupies the top 3 local Map Pack spots for high-value surgical searches in your metro area.",
		image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85",
		imageAlt: "Modern medical aesthetic clinic office and local map search optimization"
	},
	{
		number: "02",
		title: "Generative AI Search (GEO / AEO)",
		description: "Modern surgical patients ask AI assistants (ChatGPT, Perplexity, Google AI Overviews) for doctor recommendations. We structure your digital entity so AI engines cite your practice as the premier surgical authority in your region.",
		image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=85",
		imageAlt: "Digital technology data analytics representing Generative AI search and entity building"
	},
	{
		number: "03",
		title: "Surgical Landing Pages & Gallery CRO",
		description: "Patients looking for a $20,000 deep plane facelift don't fill out generic contact forms. We build procedure hubs and gallery layouts structured to drive long GA4 session durations, high engagement, and direct consultation requests.",
		image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85",
		imageAlt: "Professional medical consultation and surgical procedure gallery showcase"
	},
	{
		number: "04",
		title: "Integrated Med Spa & Pipeline Expansion",
		description: "Many of our surgical practice clients own or operate attached medical spas. We build automated conversion pathways that turn non-invasive med spa clients (injectables, lasers, body contouring) into high-ticket surgical consultations, maximizing patient lifetime value.",
		image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85",
		imageAlt: "Attached medical spa treatment room for skin care and non-invasive procedures"
	},
	{
		number: "05",
		title: "A Note on Social Media",
		description: "We believe organic social media (Instagram Reels, TikTok) is best handled in-house or by a local videographer with direct physical access to your operating room and clinic culture. We focus entirely on taking that content and converting it into search engine authority and patient consultations.",
		image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=85",
		imageAlt: "Clinical environment and professional medical consultation room"
	}
];
var portfolioProjects = [
	{
		number: "2016",
		title: "Foundation ($1,000/mo)",
		category: "Facial Procedures Strategy",
		image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85",
		description: "Launched foundational search infrastructure and local organic strategy targeting core facial procedures (Facelift, Rhinoplasty).",
		year: "2016",
		location: "Metro Area"
	},
	{
		number: "2018",
		title: "Procedure Architecture ($1,500/mo)",
		category: "Gallery & UX Optimization",
		image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85",
		description: "Expanded dedicated procedure hubs and optimized the before-and-after gallery user experience (UX) to increase engagement.",
		year: "2018",
		location: "Metro Area"
	},
	{
		number: "2021",
		title: "Local Dominance ($3,000/mo)",
		category: "Map Pack & Mobile Pathways",
		image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=85",
		description: "Scaled Google Map Pack presence and built mobile-first conversion pathways as consult demand surged.",
		year: "2021",
		location: "Metro Area"
	},
	{
		number: "2024",
		title: "AI & Entity Search ($3,800/mo)",
		category: "GEO / AEO Optimization",
		image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85",
		description: "Integrated modern AI Search optimization (GEO/AEO), securing top recommendation status across AI search engines while maintaining market dominance.",
		year: "2024–Present",
		location: "Metro Area"
	}
];
var testimonialsData = [
	{
		id: "01",
		quote: "Arcline transformed our vision into a living space that exceeds every expectation. Their approach to blending natural light with sustainable materials created a home that feels both luxurious and deeply connected to the environment. An extraordinary team that truly listens.",
		author: "Richard Jackson",
		role: "CEO",
		company: "Luxories",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
		rating: 5
	},
	{
		id: "02",
		quote: "From concept to completion, the Arcline team brought unmatched precision and creativity to our urban development. The result is a community space that residents genuinely love — functional, beautiful, and built to stand the test of time.",
		author: "Emma Thompson",
		role: "CEO",
		company: "Urban Nest",
		avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
		rating: 5
	},
	{
		id: "03",
		quote: "What sets Arcline apart is their ability to listen and then exceed. They understood exactly what we needed — a landmark tower that speaks to innovation without losing human scale. The Skyline Tower has become a true icon of the city.",
		author: "David Lee",
		role: "CEO",
		company: "Arch Vista",
		avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
		rating: 5
	}
];
var blogArticles = [
	{
		slug: "how-chatgpt-perplexity-recommend-surgeons",
		category: "AI Search Optimization",
		date: "Oct 2024",
		readTime: "6 Min Read",
		title: "How ChatGPT, Perplexity, and Google AI Overviews select which plastic surgeon to recommend in your city.",
		excerpt: "Discover how large language models parse medical entity authority, local citations, and procedural schema to rank surgical practices in zero-click generative search results.",
		image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85"
	},
	{
		slug: "structuring-facelift-rhinoplasty-galleries",
		category: "Practice Conversion Economics",
		date: "Oct 2024",
		readTime: "8 Min Read",
		title: "Structuring facelift & rhinoplasty before/after galleries for maximum GA4 engagement and consult bookings.",
		excerpt: "Why high-net-worth patients looking for $20,000+ procedures abandon generic contact forms, and how immersive case studies drive qualified consultation requests.",
		image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85"
	},
	{
		slug: "converting-injectable-patients-surgical-consults",
		category: "Med Spa Pipeline Growth",
		date: "Oct 2024",
		readTime: "5 Min Read",
		title: "Strategies for converting non-surgical injectable patients into high-margin surgical consults.",
		excerpt: "The exact automated referral workflows and cross-sell patient journeys that turn routine Botox and laser clients into lifelong surgical practice advocates.",
		image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85"
	}
];
//#endregion
//#region src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<footer id="contact" class="bg-[#050505] text-white pt-20 pb-8"><div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12"><!-- 4-Column Footer Information Grid --><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-10 md:py-20 border-b border-white/10"><!-- Col 1: Logo, Tagline, Positioning --><div class="flex flex-col gap-6">${renderComponent($$result, "Logo", $$Logo, {
		"variant": "light",
		"size": "lg"
	})}<p class="text-xl font-medium tracking-tight">be seen. be chosen.</p><p class="text-sm text-neutral-400 leading-relaxed">Helping surgical practices dominate local and AI-driven search landscapes.</p></div><!-- Col 2: Quick Links --><div><h3 class="text-sm font-semibold tracking-wider text-white uppercase mb-6">Quick Links</h3><ul class="space-y-3 text-sm text-neutral-400"><li><a href="/#about" class="hover:text-white transition-colors">About</a></li><li><a href="/#services" class="hover:text-white transition-colors">Services</a></li><li><a href="/#case-study" class="hover:text-white transition-colors">Case Study</a></li><li><a href="/#patient-grower" class="hover:text-white transition-colors">Patient Grower</a></li></ul></div><!-- Col 3: Contact Details & Address --><div><h3 class="text-sm font-semibold tracking-wider text-white uppercase mb-6">Contact</h3><address class="not-italic space-y-3 text-sm text-neutral-400"><p><a${addAttribute(`mailto:${siteConfig.email}`, "href")} class="hover:text-white transition-colors">${siteConfig.email}</a></p><p><a${addAttribute(`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`, "href")} class="hover:text-white transition-colors">${siteConfig.phone}</a></p><p class="leading-relaxed">${siteConfig.address}</p></address></div><!-- Col 4: Copyright Info --><div><h3 class="text-sm font-semibold tracking-wider text-white uppercase mb-6">Legal</h3><p class="text-sm text-neutral-400 leading-relaxed mb-4">© 2026 seelutions. All Rights Reserved. Patient Grower is a specialized publication of seelutions.</p><a href="/admin" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-400 hover:text-cyan-300 transition-colors"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg><span>CMS Admin Portal</span></a></div></div></div></footer>`;
}, "/app/applet/src/components/Footer.astro", void 0);
//#endregion
//#region src/components/ScrollToTop.astro
var $$ScrollToTop = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<!-- Floating Back to Top Button (Matching Recording 01:09) --><button id="scroll-to-top" type="button" class="floating-top-btn" aria-label="Scroll back to top"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg></button>${renderScript($$result, "/app/applet/src/components/ScrollToTop.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/applet/src/components/ScrollToTop.astro", void 0);
//#endregion
//#region src/components/SectionLabel.astro
createAstro("https://astro.build");
var $$SectionLabel = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionLabel;
	const { text, theme = "light", class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider select-none ${className}`, "class")}><!-- Accent dash line --><span class="w-4 h-[2px] bg-[#8DC541] rounded-full inline-block" aria-hidden="true"></span><span class="text-[#8DC541]">${text}</span></div>`;
}, "/app/applet/src/components/SectionLabel.astro", void 0);
//#endregion
//#region src/components/ContactModal.astro
var $$ContactModal = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div id="contact-modal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title"><div class="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-black/10 overflow-hidden"><!-- Close Button --><button id="close-contact-modal" type="button" class="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer" aria-label="Close dialog"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button><div class="mb-6">${renderComponent($$result, "SectionLabel", $$SectionLabel, { "text": "START A CONVERSATION" })}<h3 id="contact-modal-title" class="text-2xl sm:text-3xl font-bold text-[#030303] mt-2">Let's Build Something Exceptional</h3><p class="text-sm text-[#737373] mt-1">Share your vision with Arcline Architecture. We typically respond within 24 hours.</p></div><!-- Contact Form --><form id="contact-form" class="space-y-4"><div><label for="contact-name" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Doctor / Practice Name</label><input type="text" id="contact-name" name="name" required placeholder="e.g. Dr. Jane Doe / Renewed Look" class="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black text-sm"></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="contact-website" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Website URL</label><input type="url" id="contact-website" name="website" required placeholder="e.g. renewedlook.com" class="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black text-sm"></div><div><label for="contact-email" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Direct Email Address</label><input type="email" id="contact-email" name="email" required placeholder="e.g. hello@practice.com" class="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black text-sm"></div></div><div><label for="contact-phone" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Direct Phone Number</label><input type="tel" id="contact-phone" name="phone" required placeholder="e.g. (555) 000-0000" class="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black text-sm"></div><div><label for="contact-focus" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Primary Surgical Focus</label><select id="contact-focus" name="focus" class="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black text-sm bg-white"><option value="Facelift">Facelift</option><option value="Rhinoplasty">Rhinoplasty</option><option value="Body Contouring">Body Contouring</option><option value="Breast">Breast</option><option value="Med Spa">Med Spa</option></select></div><div id="contact-success" class="hidden p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">Thank you! Your audit request has been received. Our team will prepare your 3-minute video analysis shortly.</div><div class="pt-2"><button type="submit" class="w-full btn-pill-black justify-center py-3 text-sm cursor-pointer">Request Your Free Practice Audit</button></div></form></div></div>${renderScript($$result, "/app/applet/src/components/ContactModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/applet/src/components/ContactModal.astro", void 0);
//#endregion
//#region src/layouts/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title = "Arcline — Architecture & Design Agency", description = "Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time." } = Astro.props;
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/png" href="/images/seelutions-favicon.png"><meta name="generator"${addAttribute(Astro.generator, "content")}><!-- SEO Meta Tags --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><!-- Google Font: Urbanist --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet"><!-- Schema.org JSON-LD --><script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ArchitecturalFirm",
        "name": "Arcline Architecture",
        "description": "Distinguished architectural agency located in Canada creating meaningful spaces.",
        "foundingDate": "2010",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "567 Jac Spruce Crescent",
          "addressLocality": "Montreal",
          "addressRegion": "QC",
          "postalCode": "H1A 2K3",
          "addressCountry": "CA"
        },
        "telephone": "+1-555-345-6789",
        "email": "yourcompany@gmail.com"
      }
    <\/script>${renderHead($$result)}</head><body class="min-h-screen flex flex-col justify-between selection:bg-black selection:text-white">${renderComponent($$result, "Header", $$Header, {})}<main class="flex-grow">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "Footer", $$Footer, {})}${renderComponent($$result, "ScrollToTop", $$ScrollToTop, {})}${renderComponent($$result, "ContactModal", $$ContactModal, {})}${renderScript($$result, "/app/applet/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/app/applet/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { servicesData as a, renderScript as c, portfolioProjects as i, $$SectionLabel as n, testimonialsData as o, blogArticles as r, $$Button as s, $$BaseLayout as t };
