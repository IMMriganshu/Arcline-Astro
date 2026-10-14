import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as saveServerCmsData, r as triggerVercelDeploy, t as getServerCmsData } from "./cms_CJQMlJP2.mjs";
//#region src/pages/api/cms.ts
var cms_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async () => {
	const data = getServerCmsData();
	return new Response(JSON.stringify({
		success: true,
		data
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
var POST = async ({ request }) => {
	try {
		const body = await request.json();
		if (body.action === "deploy") {
			const deployResult = await triggerVercelDeploy(body.hookUrl);
			return new Response(JSON.stringify(deployResult), {
				status: deployResult.success ? 200 : 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		if (!saveServerCmsData(body)) return new Response(JSON.stringify({
			success: false,
			error: "Failed to write CMS content to disk"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			success: true,
			message: "Content published and saved successfully",
			data: getServerCmsData()
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({
			success: false,
			error: err?.message || "Invalid request body"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/cms@_@ts
var page = () => cms_exports;
//#endregion
export { page };
