import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_C_GWBMI-.mjs";
import { t as createComponent } from "./compiler_CDLjna1-.mjs";
import { n as $$SectionLabel, s as $$Button, t as $$BaseLayout } from "./BaseLayout_CaCreFi9.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
var $$404 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Page Not Found — Arcline",
		"description": "The requested page could not be located."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="pt-40 pb-32 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center"><div class="mb-4 flex justify-center">${renderComponent($$result, "SectionLabel", $$SectionLabel, { "text": "404 ERROR" })}</div><h1 class="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-[#030303] mb-6">404</h1><p class="text-xl sm:text-2xl font-medium text-neutral-800 mb-4">Page Not Found</p><p class="text-neutral-500 max-w-md mx-auto text-sm sm:text-base mb-8">The spatial blueprint you are seeking does not exist or has been relocated to another site sector.</p><div class="flex justify-center">${renderComponent($$result, "Button", $$Button, {
		"href": "/",
		"variant": "black",
		"showIcon": true,
		"iconType": "arrow-right"
	}, { "default": ($$result) => renderTemplate`
        Return to Homepage
      ` })}</div></div>` })}`;
}, "/app/applet/src/pages/404.astro", void 0);
var $$file = "/app/applet/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
