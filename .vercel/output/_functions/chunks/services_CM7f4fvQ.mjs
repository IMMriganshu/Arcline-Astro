import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_C_GWBMI-.mjs";
import { t as createComponent } from "./compiler_CDLjna1-.mjs";
import { n as $$SectionLabel, t as $$BaseLayout } from "./BaseLayout_CaCreFi9.mjs";
import { t as $$ProjectCTA } from "./ProjectCTA_oiW5L5k0.mjs";
import { t as $$ServicesSection } from "./ServicesSection_CD71UfyY.mjs";
//#region src/pages/services.astro
var services_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Services,
	file: () => $$file,
	url: () => $$url
});
var $$Services = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Services — Arcline Architecture & Design",
		"description": "Explore our specialized architectural, interior design, landscape, and renovation services."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="pt-32 pb-8 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12"><div class="mb-4">${renderComponent($$result, "SectionLabel", $$SectionLabel, { "text": "OUR CAPABILITIES" })}</div><h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#030303] mb-6 max-w-4xl">Comprehensive Architectural & Environmental Design Services</h1><p class="text-lg text-neutral-600 max-w-2xl leading-relaxed mb-12">From initial site feasibility and zoning permits to bespoke millwork design and construction oversight, we provide end-to-end expertise.</p></div>${renderComponent($$result, "ServicesSection", $$ServicesSection, {})}${renderComponent($$result, "ProjectCTA", $$ProjectCTA, {})}` })}`;
}, "/app/applet/src/pages/services.astro", void 0);
var $$file = "/app/applet/src/pages/services.astro";
var $$url = "/services";
//#endregion
//#region \0virtual:astro:page:src/pages/services@_@astro
var page = () => services_exports;
//#endregion
export { page };
