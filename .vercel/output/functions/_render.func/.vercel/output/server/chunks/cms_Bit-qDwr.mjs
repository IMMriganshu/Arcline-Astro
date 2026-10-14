import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as defaultCmsContent } from "./defaultCmsContent_mzI26U4x.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/lib/cms.ts
var CMS_STORAGE_KEY = "arcline_cms_content_v1";
var CMS_FILE_PATH = path.resolve(process.cwd(), "src/data/cmsContent.json");
defaultCmsContent.articles;
/**
* Server-side helper to read persistent CMS data from disk or fallback to default
*/
function getServerCmsData() {
	try {
		if (fs.existsSync(CMS_FILE_PATH)) {
			const fileData = fs.readFileSync(CMS_FILE_PATH, "utf-8");
			const parsed = JSON.parse(fileData);
			return {
				...defaultCmsContent,
				...parsed
			};
		}
	} catch (err) {
		console.error("Error reading CMS file from disk:", err);
	}
	return defaultCmsContent;
}
/**
* Server-side helper to persist CMS data to disk
*/
function saveServerCmsData(data) {
	try {
		const dir = path.dirname(CMS_FILE_PATH);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		const updated = {
			...data,
			lastPublishedAt: (/* @__PURE__ */ new Date()).toISOString(),
			version: (data.version || 1) + 1
		};
		fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
		return true;
	} catch (err) {
		console.error("Error saving CMS file to disk:", err);
		return false;
	}
}
/**
* Client-side helper to get CMS data from localStorage or fallback
*/
function getClientCmsData() {
	if (typeof window === "undefined") return defaultCmsContent;
	try {
		const local = localStorage.getItem(CMS_STORAGE_KEY);
		if (local) return JSON.parse(local);
	} catch (e) {
		console.warn("Failed to parse localStorage CMS data:", e);
	}
	return defaultCmsContent;
}
/**
* Triggers the Vercel Deploy Hook if configured
*/
async function triggerVercelDeploy(hookUrl) {
	const url = hookUrl || getClientCmsData().siteConfig.vercelDeployHookUrl;
	if (!url) return {
		success: false,
		message: "No Vercel Deploy Hook URL configured. Please configure it in SEO & Settings tab."
	};
	try {
		const res = await fetch(url, { method: "POST" });
		if (res.ok) return {
			success: true,
			message: "Deployment triggered successfully! Vercel is now rebuilding the live website with your changes."
		};
		return {
			success: false,
			message: `Vercel Deploy Hook returned status ${res.status}. Please check your webhook URL.`
		};
	} catch (err) {
		return {
			success: false,
			message: `Failed to connect to Vercel Deploy Hook: ${err?.message || "Network error"}`
		};
	}
}
//#endregion
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
