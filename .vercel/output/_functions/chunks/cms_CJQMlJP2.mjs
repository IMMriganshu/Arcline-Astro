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
export { saveServerCmsData as n, triggerVercelDeploy as r, getServerCmsData as t };
