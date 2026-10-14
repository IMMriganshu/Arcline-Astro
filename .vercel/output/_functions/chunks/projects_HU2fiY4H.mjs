import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute } from "./server_C_GWBMI-.mjs";
import { t as createComponent } from "./compiler_CDLjna1-.mjs";
import { i as portfolioProjects, n as $$SectionLabel, t as $$BaseLayout } from "./BaseLayout_CaCreFi9.mjs";
import { t as $$ProjectCTA } from "./ProjectCTA_oiW5L5k0.mjs";
//#region src/pages/projects.astro
var projects_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Projects,
	file: () => $$file,
	url: () => $$url
});
var $$Projects = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Projects Portfolio — Arcline Architecture",
		"description": "Explore our built work across residential villas, commercial pavilions, and urban developments."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12"><div class="mb-4">${renderComponent($$result, "SectionLabel", $$SectionLabel, { "text": "ARCHITECTURAL MONOGRAPHS" })}</div><h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#030303] mb-6">Selected Built Works & Commissions</h1><p class="text-lg text-neutral-600 max-w-2xl leading-relaxed mb-16">Explore residential, civic, and commercial architecture projects realized across Canada and internationally.</p><!-- Projects Grid --><div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">${portfolioProjects.map((project) => renderTemplate`<div class="group flex flex-col justify-between"><div><div class="overflow-hidden rounded-3xl aspect-[16/10] bg-neutral-100 border border-black/5 mb-6 shadow-sm"><img${addAttribute(project.image, "src")}${addAttribute(project.title, "alt")} class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy"></div><div class="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2"><span class="text-[#C5A880] font-bold">${project.number}</span><span class="uppercase tracking-wider">${project.location} · ${project.year}</span></div><h2 class="text-2xl sm:text-3xl font-bold text-[#030303] group-hover:text-black mb-2 transition-colors">${project.title}</h2><p class="text-sm text-neutral-600 leading-relaxed">${project.description}</p></div></div>`)}</div></div>${renderComponent($$result, "ProjectCTA", $$ProjectCTA, {})}` })}`;
}, "/app/applet/src/pages/projects.astro", void 0);
var $$file = "/app/applet/src/pages/projects.astro";
var $$url = "/projects";
//#endregion
//#region \0virtual:astro:page:src/pages/projects@_@astro
var page = () => projects_exports;
//#endregion
export { page };
