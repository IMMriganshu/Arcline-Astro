import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_C_GWBMI-.mjs";
import { t as createComponent } from "./compiler_CDLjna1-.mjs";
import { n as $$SectionLabel, t as $$BaseLayout } from "./BaseLayout_CaCreFi9.mjs";
import { t as $$ProjectCTA } from "./ProjectCTA_oiW5L5k0.mjs";
import { t as $$BlogSection } from "./BlogSection_DaI4vIy4.mjs";
//#region src/pages/blog.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Blog,
	file: () => $$file,
	url: () => $$url
});
var $$Blog = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Journal & Perspectives — Arcline Architecture",
		"description": "Critical essays, research, and reflections on architecture, biophilic design, and urban density."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="pt-32 pb-4 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12"><div class="mb-4">${renderComponent($$result, "SectionLabel", $$SectionLabel, { "text": "ARCHITECTURAL ESSAYS" })}</div><h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#030303] mb-6">Studio Perspectives & Architecture Insights</h1><p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">Thought leadership on spatial innovation, passive house standards, and material circularity.</p></div>${renderComponent($$result, "BlogSection", $$BlogSection, {})}${renderComponent($$result, "ProjectCTA", $$ProjectCTA, {})}` })}`;
}, "/app/applet/src/pages/blog.astro", void 0);
var $$file = "/app/applet/src/pages/blog.astro";
var $$url = "/blog";
//#endregion
//#region \0virtual:astro:page:src/pages/blog@_@astro
var page = () => blog_exports;
//#endregion
export { page };
