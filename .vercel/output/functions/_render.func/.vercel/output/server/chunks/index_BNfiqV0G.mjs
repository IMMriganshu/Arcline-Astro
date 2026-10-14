import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderHead, i as renderComponent, l as renderTemplate } from "./server_BcqehwNh.mjs";
import { t as createComponent } from "./compiler_CsSrJF-e.mjs";
import { t as defaultCmsContent } from "./defaultCmsContent_mzI26U4x.mjs";
import { useEffect, useState } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
//#region src/components/admin/AdminDashboard.tsx
var _jsxFileName = "/app/applet/src/components/admin/AdminDashboard.tsx";
function AdminDashboard() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [passwordInput, setPasswordInput] = useState("");
	const [authError, setAuthError] = useState("");
	const [activeTab, setActiveTab] = useState("overview");
	const [cmsData, setCmsData] = useState(defaultCmsContent);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeploying, setIsDeploying] = useState(false);
	const [notification, setNotification] = useState(null);
	const [hasChanges, setHasChanges] = useState(false);
	const [editingArticle, setEditingArticle] = useState(null);
	const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
	const [editingProject, setEditingProject] = useState(null);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [editingTestimonial, setEditingTestimonial] = useState(null);
	const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
	const [newMediaName, setNewMediaName] = useState("");
	const [newMediaUrl, setNewMediaUrl] = useState("");
	const [newMediaType, setNewMediaType] = useState("image");
	useEffect(() => {
		if (localStorage.getItem("arcline_admin_session") === "authenticated") setIsAuthenticated(true);
		fetch("/api/cms").then((res) => res.json()).then((json) => {
			if (json.data) setCmsData(json.data);
			else {
				const local = localStorage.getItem("arcline_cms_content_v1");
				if (local) setCmsData(JSON.parse(local));
			}
		}).catch(() => {
			const local = localStorage.getItem("arcline_cms_content_v1");
			if (local) setCmsData(JSON.parse(local));
		});
	}, []);
	const showToast = (message, type = "success") => {
		setNotification({
			message,
			type
		});
		setTimeout(() => setNotification(null), 4e3);
	};
	const handleLogin = (e) => {
		e.preventDefault();
		if (passwordInput === "arcline2026" || passwordInput === "admin" || passwordInput === "admin123") {
			setIsAuthenticated(true);
			localStorage.setItem("arcline_admin_session", "authenticated");
			setAuthError("");
			showToast("Welcome to Arcline Headless CMS", "success");
		} else setAuthError("Invalid administrator passcode. Try \"arcline2026\"");
	};
	const handleLogout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("arcline_admin_session");
		showToast("Signed out successfully", "info");
	};
	const handleSaveAll = async () => {
		setIsSaving(true);
		try {
			const updated = {
				...cmsData,
				lastPublishedAt: (/* @__PURE__ */ new Date()).toISOString(),
				version: (cmsData.version || 1) + 1
			};
			localStorage.setItem("arcline_cms_content_v1", JSON.stringify(updated));
			window.dispatchEvent(new CustomEvent("cms:updated", { detail: updated }));
			if ((await fetch("/api/cms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updated)
			})).ok) {
				setCmsData(updated);
				setHasChanges(false);
				showToast("All changes successfully saved and published!", "success");
			} else {
				setCmsData(updated);
				setHasChanges(false);
				showToast("Changes saved to browser cache (API write restricted in preview)", "info");
			}
		} catch (err) {
			showToast("Saved locally: " + (err?.message || "Ready"), "info");
		} finally {
			setIsSaving(false);
		}
	};
	const handleDeployVercel = async () => {
		if (!cmsData.siteConfig.vercelDeployHookUrl) {
			showToast("Please set your Vercel Deploy Hook URL in the SEO & Settings tab first", "error");
			setActiveTab("settings");
			return;
		}
		setIsDeploying(true);
		showToast("Triggering Vercel deployment webhook...", "info");
		try {
			const json = await (await fetch("/api/cms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "deploy",
					hookUrl: cmsData.siteConfig.vercelDeployHookUrl
				})
			})).json();
			if (json.success) showToast("Vercel production build triggered! Live website updating now.", "success");
			else showToast(json.message || "Deployment webhook request failed", "error");
		} catch (err) {
			showToast("Deploy trigger error: " + err.message, "error");
		} finally {
			setIsDeploying(false);
		}
	};
	const handleExportJson = () => {
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cmsData, null, 2));
		const downloadAnchor = document.createElement("a");
		downloadAnchor.setAttribute("href", dataStr);
		downloadAnchor.setAttribute("download", `arcline_cms_backup_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
		showToast("CMS backup exported successfully", "success");
	};
	const handleImportJson = (e) => {
		const fileReader = new FileReader();
		if (e.target.files && e.target.files[0]) {
			fileReader.readAsText(e.target.files[0], "UTF-8");
			fileReader.onload = (event) => {
				try {
					const parsed = JSON.parse(event.target?.result);
					if (parsed.hero && parsed.services) {
						setCmsData(parsed);
						setHasChanges(true);
						showToast("CMS data imported! Click Save to apply.", "success");
					} else showToast("Invalid CMS backup file format", "error");
				} catch {
					showToast("Failed to parse JSON file", "error");
				}
			};
		}
	};
	const handleResetToDefault = () => {
		if (window.confirm("Are you sure you want to reset all CMS content to default template values?")) {
			setCmsData(defaultCmsContent);
			setHasChanges(true);
			showToast("Reset to defaults. Remember to click \"Save & Publish\".", "info");
		}
	};
	if (!isAuthenticated) return /* @__PURE__ */ jsxDEV("div", {
		className: "min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 selection:bg-cyan-500 selection:text-black",
		children: /* @__PURE__ */ jsxDEV("div", {
			className: "w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden",
			children: [
				/* @__PURE__ */ jsxDEV("div", { className: "absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 205,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", { className: "absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 206,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "text-center mb-8 relative z-10",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4",
							children: /* @__PURE__ */ jsxDEV("span", {
								className: "font-extrabold text-cyan-400 text-xl font-urbanist",
								children: "A"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 210,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 209,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("h1", {
							className: "text-2xl font-bold font-urbanist tracking-tight text-white mb-2",
							children: "Arcline Headless CMS"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 212,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "text-xs text-neutral-400 max-w-xs mx-auto",
							children: "Authorized practice administration dashboard for patient acquisition content and live deployment."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 215,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 208,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("form", {
					onSubmit: handleLogin,
					className: "space-y-4 relative z-10",
					children: [
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
							children: "Administrator Passcode"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 222,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("input", {
							type: "password",
							value: passwordInput,
							onChange: (e) => setPasswordInput(e.target.value),
							placeholder: "Enter passcode (e.g. arcline2026)",
							className: "w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all",
							autoFocus: true
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 225,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 221,
							columnNumber: 13
						}, this),
						authError && /* @__PURE__ */ jsxDEV("div", {
							className: "p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs",
							children: authError
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 236,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV("button", {
							type: "submit",
							className: "w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 cursor-pointer",
							children: "Sign In to CMS Dashboard"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 241,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 220,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-neutral-500",
					children: ["Default credentials for demonstration: ", /* @__PURE__ */ jsxDEV("span", {
						className: "text-neutral-400 font-mono",
						children: "arcline2026"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 250,
						columnNumber: 52
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 249,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 203,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 202,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "min-h-screen bg-[#030712] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black",
		children: [
			notification && /* @__PURE__ */ jsxDEV("div", {
				className: `fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 backdrop-blur-xl border transition-all animate-bounce-once ${notification.type === "success" ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200" : notification.type === "error" ? "bg-red-950/90 border-red-500/40 text-red-200" : "bg-cyan-950/90 border-cyan-500/40 text-cyan-200"}`,
				children: [/* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 rounded-full bg-current animate-ping" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 270,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("span", { children: notification.message }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 271,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 261,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ jsxDEV("header", {
				className: "sticky top-0 z-40 bg-[#050b1a]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsxDEV("a", {
						href: "/",
						target: "_blank",
						rel: "noreferrer",
						className: "flex items-center gap-2.5 group",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md",
							children: "A"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 279,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("span", {
							className: "font-bold text-white text-base tracking-tight font-urbanist group-hover:text-cyan-400 transition-colors",
							children: "Arcline CMS"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 283,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("span", {
							className: "hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300",
							children: "Headless Studio"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 286,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 282,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 278,
						columnNumber: 11
					}, this), hasChanges && /* @__PURE__ */ jsxDEV("span", {
						className: "text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse",
						children: "Unsaved Changes"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 293,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 277,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsxDEV("a", {
							href: "/",
							target: "_blank",
							rel: "noreferrer",
							className: "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-colors",
							children: [/* @__PURE__ */ jsxDEV("span", { children: "Preview Site" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 306,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("svg", {
								className: "w-3.5 h-3.5 text-neutral-400",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsxDEV("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 2,
									d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 308,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 307,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 300,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("button", {
							onClick: handleDeployVercel,
							disabled: isDeploying,
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50",
							children: [/* @__PURE__ */ jsxDEV("svg", {
								className: `w-3.5 h-3.5 ${isDeploying ? "animate-spin" : ""}`,
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsxDEV("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 2,
									d: "M5 13l4 4L19 7"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 319,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 318,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("span", { children: isDeploying ? "Deploying..." : "Deploy to Vercel" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 321,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 313,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("button", {
							onClick: handleSaveAll,
							disabled: isSaving,
							className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50",
							children: [/* @__PURE__ */ jsxDEV("svg", {
								className: `w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`,
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsxDEV("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 2,
									d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 331,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 330,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("span", { children: isSaving ? "Saving..." : "Save & Publish" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 333,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 325,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("button", {
							onClick: handleLogout,
							title: "Sign out",
							className: "p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer",
							children: /* @__PURE__ */ jsxDEV("svg", {
								className: "w-4 h-4",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsxDEV("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 2,
									d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 342,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 341,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 336,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 299,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 276,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "flex-1 flex overflow-hidden",
				children: [/* @__PURE__ */ jsxDEV("aside", {
					className: "w-64 bg-[#050b1a]/50 border-r border-white/10 flex flex-col justify-between p-4 overflow-y-auto",
					children: [/* @__PURE__ */ jsxDEV("nav", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-2",
							children: "Content Sections"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 353,
							columnNumber: 13
						}, this), [
							{
								id: "overview",
								label: "Overview & Status",
								icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							},
							{
								id: "hero",
								label: "Hero & Branding",
								icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							},
							{
								id: "services",
								label: "Services (01–05)",
								icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							},
							{
								id: "projects",
								label: "Case Studies (10-Yr)",
								icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							},
							{
								id: "blog",
								label: "Blog & Articles",
								icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
							},
							{
								id: "testimonials",
								label: "Surgeon Testimonials",
								icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							},
							{
								id: "comparison",
								label: "Search vs PPC Matrix",
								icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							},
							{
								id: "navigation",
								label: "Navigation & Footer",
								icon: "M4 6h16M4 12h16M4 18h16"
							},
							{
								id: "media",
								label: "Media Assets",
								icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
							},
							{
								id: "settings",
								label: "SEO & Deploy Settings",
								icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							}
						].map((tab) => /* @__PURE__ */ jsxDEV("button", {
							onClick: () => setActiveTab(tab.id),
							className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30" : "text-neutral-400 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ jsxDEV("svg", {
								className: "w-4 h-4 shrink-0",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsxDEV("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 1.75,
									d: tab.icon
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 379,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 378,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("span", { children: tab.label }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 381,
								columnNumber: 17
							}, this)]
						}, tab.id, true, {
							fileName: _jsxFileName,
							lineNumber: 369,
							columnNumber: 15
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 352,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "pt-4 mt-4 border-t border-white/5 space-y-2",
						children: [
							/* @__PURE__ */ jsxDEV("button", {
								onClick: handleExportJson,
								className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsxDEV("svg", {
									className: "w-3.5 h-3.5 text-neutral-400",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									children: /* @__PURE__ */ jsxDEV("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 2,
										d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 393,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 392,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("span", { children: "Export JSON Backup" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 395,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 388,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ jsxDEV("svg", {
										className: "w-3.5 h-3.5 text-neutral-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										children: /* @__PURE__ */ jsxDEV("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 2,
											d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 400,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 399,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ jsxDEV("span", { children: "Import JSON" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 402,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ jsxDEV("input", {
										type: "file",
										accept: ".json",
										onChange: handleImportJson,
										className: "hidden"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 403,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 398,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("button", {
								onClick: handleResetToDefault,
								className: "w-full text-center text-[10px] text-neutral-500 hover:text-red-400 transition-colors pt-2 cursor-pointer",
								children: "Reset to default values"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 406,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 387,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 351,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("main", {
					className: "flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl",
					children: [
						activeTab === "overview" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
									className: "text-2xl font-bold font-urbanist text-white",
									children: "System Overview & Deployment"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 421,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-neutral-400",
									children: "Headless CMS operational status and publication triggers."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 422,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
									children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md",
											children: [
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-neutral-400 text-xs uppercase tracking-wider mb-1",
													children: "Live Status"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 428,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-xl font-bold text-emerald-400 flex items-center gap-2",
													children: [/* @__PURE__ */ jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 430,
														columnNumber: 21
													}, this), "Operational"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 429,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-[11px] text-neutral-500 mt-2",
													children: "Vercel SSR / Static Ready"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 433,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 427,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md",
											children: [
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-neutral-400 text-xs uppercase tracking-wider mb-1",
													children: "Published Articles"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 437,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-2xl font-bold text-white font-urbanist",
													children: [
														cmsData.articles.filter((a) => a.published).length,
														" / ",
														cmsData.articles.length
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 438,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-[11px] text-neutral-500 mt-2",
													children: "Editorial Blog Hub"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 441,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 436,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md",
											children: [
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-neutral-400 text-xs uppercase tracking-wider mb-1",
													children: "Active Services"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 445,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-2xl font-bold text-white font-urbanist",
													children: cmsData.services.length
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 446,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-[11px] text-neutral-500 mt-2",
													children: "Practice Specialties"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 447,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 444,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md",
											children: [
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-neutral-400 text-xs uppercase tracking-wider mb-1",
													children: "Last Publication"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 451,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-xs font-mono font-semibold text-cyan-300 mt-1",
													children: cmsData.lastPublishedAt ? new Date(cmsData.lastPublishedAt).toLocaleTimeString() : "Pending"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 452,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ jsxDEV("div", {
													className: "text-[10px] text-neutral-500 mt-2",
													children: cmsData.lastPublishedAt ? new Date(cmsData.lastPublishedAt).toLocaleDateString() : "Initial"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 455,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 450,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 426,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "bg-neutral-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden",
									children: /* @__PURE__ */ jsxDEV("div", {
										className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsxDEV("span", {
												className: "font-bold text-white text-base font-urbanist",
												children: "Vercel Webhook Deployment"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 466,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("span", {
												className: "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400",
												children: "Zero-Downtime Rebuild"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 467,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 465,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("p", {
											className: "text-xs text-neutral-400 mt-1 max-w-xl",
											children: "When you trigger deployment, Vercel initiates an immediate rebuild of the live production site with your updated CMS data, generating statically optimized pages with high Google PageSpeed scores."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 471,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 464,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("button", {
											onClick: handleDeployVercel,
											disabled: isDeploying,
											className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50",
											children: [/* @__PURE__ */ jsxDEV("svg", {
												className: `w-4 h-4 ${isDeploying ? "animate-spin" : ""}`,
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												children: /* @__PURE__ */ jsxDEV("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													strokeWidth: 2,
													d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 482,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 481,
												columnNumber: 21
											}, this), /* @__PURE__ */ jsxDEV("span", { children: isDeploying ? "Deploying to Vercel..." : "Publish to Live Vercel Site" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 484,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 476,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 463,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 462,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-4",
									children: [
										/* @__PURE__ */ jsxDEV("div", {
											onClick: () => setActiveTab("hero"),
											className: "p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group",
											children: [/* @__PURE__ */ jsxDEV("h3", {
												className: "text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors",
												children: "Hero Section & Title Video"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 495,
												columnNumber: 19
											}, this), /* @__PURE__ */ jsxDEV("p", {
												className: "text-xs text-neutral-500 mt-1",
												children: "Edit headline, subheadline, CTAs, and looping video sources."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 498,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 491,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											onClick: () => setActiveTab("blog"),
											className: "p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group",
											children: [/* @__PURE__ */ jsxDEV("h3", {
												className: "text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors",
												children: "Patient Grower Blog Articles"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 505,
												columnNumber: 19
											}, this), /* @__PURE__ */ jsxDEV("p", {
												className: "text-xs text-neutral-500 mt-1",
												children: "Write, edit, and publish search authority editorial articles."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 508,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 501,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											onClick: () => setActiveTab("services"),
											className: "p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group",
											children: [/* @__PURE__ */ jsxDEV("h3", {
												className: "text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors",
												children: "Practice Service Cards (01–05)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 515,
												columnNumber: 19
											}, this), /* @__PURE__ */ jsxDEV("p", {
												className: "text-xs text-neutral-500 mt-1",
												children: "Update SEO, GEO search, and procedure conversion copy."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 518,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 511,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 490,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 419,
							columnNumber: 13
						}, this),
						activeTab === "hero" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
								className: "text-2xl font-bold font-urbanist text-white",
								children: "Hero Section & Visual Identity"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 528,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-neutral-400",
								children: "Control the above-the-fold patient acquisition messaging and video streams."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 529,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 527,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4",
								children: [
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
										className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
										children: "Eyebrow Tag (Upper Cyan Badge)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 534,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("input", {
										type: "text",
										value: cmsData.hero.eyebrowTag,
										onChange: (e) => {
											setCmsData({
												...cmsData,
												hero: {
													...cmsData.hero,
													eyebrowTag: e.target.value
												}
											});
											setHasChanges(true);
										},
										className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 537,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 533,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Masked Title Line 1"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 550,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.hero.titleLine1,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													hero: {
														...cmsData.hero,
														titleLine1: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold font-urbanist focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 553,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 549,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Masked Title Line 2"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 565,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.hero.titleLine2,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													hero: {
														...cmsData.hero,
														titleLine2: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold font-urbanist focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 568,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 564,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 548,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
										className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
										children: "Hero Card Headline"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 581,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("textarea", {
										rows: 2,
										value: cmsData.hero.headline,
										onChange: (e) => {
											setCmsData({
												...cmsData,
												hero: {
													...cmsData.hero,
													headline: e.target.value
												}
											});
											setHasChanges(true);
										},
										className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-cyan-400"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 584,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 580,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
										className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
										children: "Subheadline Paragraph"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 596,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("textarea", {
										rows: 3,
										value: cmsData.hero.subheadline,
										onChange: (e) => {
											setCmsData({
												...cmsData,
												hero: {
													...cmsData.hero,
													subheadline: e.target.value
												}
											});
											setHasChanges(true);
										},
										className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 599,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 595,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Primary CTA Button Label"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 612,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.hero.primaryCtaText,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													hero: {
														...cmsData.hero,
														primaryCtaText: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 615,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 611,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Primary CTA Target Link"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 627,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.hero.primaryCtaLink,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													hero: {
														...cmsData.hero,
														primaryCtaLink: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 630,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 626,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 610,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Secondary CTA Button Label"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 644,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.hero.secondaryCtaText,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													hero: {
														...cmsData.hero,
														secondaryCtaText: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 647,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 643,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Secondary CTA Target Link"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 659,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.hero.secondaryCtaLink,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													hero: {
														...cmsData.hero,
														secondaryCtaLink: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 662,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 658,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 642,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "pt-4 border-t border-white/10 space-y-4",
										children: [/* @__PURE__ */ jsxDEV("h3", {
											className: "text-sm font-bold text-cyan-300",
											children: "Hero Video Sources"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 676,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
												children: "Title Mask Video Source"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 679,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												value: cmsData.hero.titleVideoUrl,
												onChange: (e) => {
													setCmsData({
														...cmsData,
														hero: {
															...cmsData.hero,
															titleVideoUrl: e.target.value
														}
													});
													setHasChanges(true);
												},
												className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 682,
												columnNumber: 23
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 678,
												columnNumber: 21
											}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
												children: "Hero Card Bionic Eye Video"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 694,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												value: cmsData.hero.bannerVideoUrl,
												onChange: (e) => {
													setCmsData({
														...cmsData,
														hero: {
															...cmsData.hero,
															bannerVideoUrl: e.target.value
														}
													});
													setHasChanges(true);
												},
												className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 697,
												columnNumber: 23
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 693,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 677,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 675,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 526,
							columnNumber: 13
						}, this),
						activeTab === "services" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
									className: "text-2xl font-bold font-urbanist text-white",
									children: "Practice Services (01–05)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 718,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-neutral-400",
									children: "Manage specialized SEO and patient acquisition offerings."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 719,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 717,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("button", {
									onClick: () => {
										setEditingService({
											id: `srv-${Date.now()}`,
											number: `0${cmsData.services.length + 1}`,
											title: "New Surgical Marketing Offering",
											description: "Comprehensive patient acquisition protocol designed for board-certified plastic surgeons.",
											image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85",
											imageAlt: "Medical surgical consultation clinic aesthetic"
										});
										setIsServiceModalOpen(true);
									},
									className: "px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer",
									children: "+ Add Service"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 722,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 716,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "space-y-3",
								children: cmsData.services.map((srv, idx) => /* @__PURE__ */ jsxDEV("div", {
									className: "p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV("div", {
										className: "flex items-start gap-4 flex-1",
										children: [/* @__PURE__ */ jsxDEV("div", {
											className: "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-urbanist shrink-0",
											children: srv.number
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 747,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ jsxDEV("h3", {
												className: "font-bold text-white text-sm",
												children: srv.title
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 751,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("p", {
												className: "text-xs text-neutral-400 mt-1 line-clamp-2",
												children: srv.description
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 752,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 750,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 746,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV("div", {
										className: "flex items-center gap-2 self-end md:self-center shrink-0",
										children: [/* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												setEditingService({ ...srv });
												setIsServiceModalOpen(true);
											},
											className: "px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer",
											children: "Edit"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 757,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												if (window.confirm(`Delete service "${srv.title}"?`)) {
													setCmsData({
														...cmsData,
														services: cmsData.services.filter((s) => s.id !== srv.id)
													});
													setHasChanges(true);
												}
											},
											className: "px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer",
											children: "Delete"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 766,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 756,
										columnNumber: 21
									}, this)]
								}, srv.id || idx, true, {
									fileName: _jsxFileName,
									lineNumber: 742,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 740,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 715,
							columnNumber: 13
						}, this),
						activeTab === "projects" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
									className: "text-2xl font-bold font-urbanist text-white",
									children: "10-Year Practice Case Studies"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 792,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-neutral-400",
									children: "Milestone timeline tracking budget vs organic consult yield."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 793,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 791,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("button", {
									onClick: () => {
										setEditingProject({
											id: `proj-${Date.now()}`,
											number: `${(/* @__PURE__ */ new Date()).getFullYear()}`,
											title: "Market Expansion ($4,500/mo)",
											category: "Multi-Location Map Pack",
											image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85",
											description: "Expanded search infrastructure into adjacent affluent suburbs.",
											year: `${(/* @__PURE__ */ new Date()).getFullYear()}`,
											location: "Metro Territory"
										});
										setIsProjectModalOpen(true);
									},
									className: "px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer",
									children: "+ Add Case Study"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 796,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 790,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "space-y-3",
								children: cmsData.projects.map((proj, idx) => /* @__PURE__ */ jsxDEV("div", {
									className: "p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV("div", {
										className: "flex items-start gap-4 flex-1",
										children: [/* @__PURE__ */ jsxDEV("div", {
											className: "w-16 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-urbanist shrink-0 text-xs",
											children: proj.number
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 823,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ jsxDEV("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsxDEV("h3", {
													className: "font-bold text-white text-sm",
													children: proj.title
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 828,
													columnNumber: 27
												}, this), /* @__PURE__ */ jsxDEV("span", {
													className: "text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40",
													children: proj.category
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 829,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 827,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("p", {
												className: "text-xs text-neutral-400 mt-1 line-clamp-2",
												children: proj.description
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 833,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 826,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 822,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV("div", {
										className: "flex items-center gap-2 self-end md:self-center shrink-0",
										children: [/* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												setEditingProject({ ...proj });
												setIsProjectModalOpen(true);
											},
											className: "px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer",
											children: "Edit"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 838,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												if (window.confirm(`Delete case study "${proj.title}"?`)) {
													setCmsData({
														...cmsData,
														projects: cmsData.projects.filter((p) => p.id !== proj.id)
													});
													setHasChanges(true);
												}
											},
											className: "px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer",
											children: "Delete"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 847,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 837,
										columnNumber: 21
									}, this)]
								}, proj.id || idx, true, {
									fileName: _jsxFileName,
									lineNumber: 818,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 816,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 789,
							columnNumber: 13
						}, this),
						activeTab === "blog" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
									className: "text-2xl font-bold font-urbanist text-white",
									children: "Patient Grower Editorial Hub"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 873,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-neutral-400",
									children: "Educational search authority and AI optimization articles."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 874,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 872,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("button", {
									onClick: () => {
										setEditingArticle({
											id: `art-${Date.now()}`,
											slug: "new-article-slug",
											category: "Surgical Authority",
											date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
												month: "short",
												year: "numeric"
											}),
											readTime: "5 Min Read",
											title: "New Editorial Article Title",
											excerpt: "Brief summary outlining key procedural insights for prospective surgical patients.",
											content: "<p>Write your detailed article body content here.</p>",
											image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85",
											published: true
										});
										setIsArticleModalOpen(true);
									},
									className: "px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer",
									children: "+ Create Article"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 877,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 871,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: cmsData.articles.map((art) => /* @__PURE__ */ jsxDEV("div", {
									className: "p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col justify-between",
									children: [/* @__PURE__ */ jsxDEV("div", { children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-center justify-between text-xs text-neutral-500 mb-2",
											children: [/* @__PURE__ */ jsxDEV("span", {
												className: "text-cyan-400 font-semibold",
												children: art.category
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 907,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("span", { children: art.readTime }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 908,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 906,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ jsxDEV("h3", {
											className: "font-bold text-white text-sm mb-2",
											children: art.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 910,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ jsxDEV("p", {
											className: "text-xs text-neutral-400 line-clamp-2 leading-relaxed",
											children: art.excerpt
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 911,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 905,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV("div", {
										className: "mt-5 pt-3 border-t border-white/5 flex items-center justify-between",
										children: [/* @__PURE__ */ jsxDEV("span", {
											className: `text-[10px] px-2 py-0.5 rounded-full font-semibold ${art.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-400"}`,
											children: art.published ? "Published" : "Draft"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 915,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsxDEV("button", {
												onClick: () => {
													setEditingArticle({ ...art });
													setIsArticleModalOpen(true);
												},
												className: "px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer",
												children: "Edit"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 920,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("button", {
												onClick: () => {
													if (window.confirm(`Delete article "${art.title}"?`)) {
														setCmsData({
															...cmsData,
															articles: cmsData.articles.filter((a) => a.id !== art.id)
														});
														setHasChanges(true);
													}
												},
												className: "px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors cursor-pointer",
												children: "Delete"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 929,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 919,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 914,
										columnNumber: 21
									}, this)]
								}, art.id, true, {
									fileName: _jsxFileName,
									lineNumber: 901,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 899,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 870,
							columnNumber: 13
						}, this),
						activeTab === "testimonials" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
									className: "text-2xl font-bold font-urbanist text-white",
									children: "Surgeon Client Testimonials"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 956,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-neutral-400",
									children: "Quotes and reviews from board-certified surgical practice clients."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 957,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 955,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("button", {
									onClick: () => {
										setEditingTestimonial({
											id: `test-${Date.now()}`,
											quote: "Their patient acquisition architecture generated consistent high-ticket surgical consultations.",
											author: "Dr. Jane Smith, MD",
											role: "Board-Certified Plastic Surgeon",
											company: "Smith Plastic Surgery",
											avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
											rating: 5
										});
										setIsTestimonialModalOpen(true);
									},
									className: "px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer",
									children: "+ Add Testimonial"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 960,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 954,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "space-y-3",
								children: cmsData.testimonials.map((test) => /* @__PURE__ */ jsxDEV("div", {
									className: "p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ jsxDEV("img", {
											src: test.avatar,
											alt: test.author,
											className: "w-12 h-12 rounded-full object-cover border border-white/15 shrink-0"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 986,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsxDEV("h3", {
												className: "font-bold text-white text-sm",
												children: test.author
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 993,
												columnNumber: 27
											}, this), /* @__PURE__ */ jsxDEV("span", {
												className: "text-xs text-neutral-400",
												children: [
													"· ",
													test.role,
													", ",
													test.company
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 994,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 992,
											columnNumber: 25
										}, this), /* @__PURE__ */ jsxDEV("p", {
											className: "text-xs text-neutral-300 mt-2 italic",
											children: [
												"\"",
												test.quote,
												"\""
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 996,
											columnNumber: 25
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 991,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 985,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV("div", {
										className: "flex items-center gap-2 self-end md:self-center shrink-0",
										children: [/* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												setEditingTestimonial({ ...test });
												setIsTestimonialModalOpen(true);
											},
											className: "px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer",
											children: "Edit"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1001,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												if (window.confirm(`Delete testimonial from ${test.author}?`)) {
													setCmsData({
														...cmsData,
														testimonials: cmsData.testimonials.filter((t) => t.id !== test.id)
													});
													setHasChanges(true);
												}
											},
											className: "px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer",
											children: "Delete"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1010,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1e3,
										columnNumber: 21
									}, this)]
								}, test.id, true, {
									fileName: _jsxFileName,
									lineNumber: 981,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 979,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 953,
							columnNumber: 13
						}, this),
						activeTab === "navigation" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
								className: "text-2xl font-bold font-urbanist text-white",
								children: "Navigation & Footer Settings"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1035,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-neutral-400",
								children: "Configure global menu links, phone, email, and legal disclaimers."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1036,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1034,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4",
								children: [
									/* @__PURE__ */ jsxDEV("h3", {
										className: "text-sm font-bold text-cyan-300",
										children: "Practice Contact Information"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1040,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Practice Phone Number"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1043,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: cmsData.siteConfig.phone,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													siteConfig: {
														...cmsData.siteConfig,
														phone: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1046,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1042,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Contact Email Address"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1058,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("input", {
											type: "email",
											value: cmsData.siteConfig.email,
											onChange: (e) => {
												setCmsData({
													...cmsData,
													siteConfig: {
														...cmsData.siteConfig,
														email: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1061,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1057,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1041,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
										className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
										children: "Office Address"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1074,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("input", {
										type: "text",
										value: cmsData.siteConfig.address,
										onChange: (e) => {
											setCmsData({
												...cmsData,
												siteConfig: {
													...cmsData.siteConfig,
													address: e.target.value
												}
											});
											setHasChanges(true);
										},
										className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1077,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1073,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "pt-4 border-t border-white/10",
										children: [/* @__PURE__ */ jsxDEV("h3", {
											className: "text-sm font-bold text-cyan-300 mb-3",
											children: "Footer Legal & Territory Exclusivity"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1089,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "space-y-4",
											children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
												children: "Exclusivity Disclaimer"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1092,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("textarea", {
												rows: 2,
												value: cmsData.footer.disclaimer,
												onChange: (e) => {
													setCmsData({
														...cmsData,
														footer: {
															...cmsData.footer,
															disclaimer: e.target.value
														}
													});
													setHasChanges(true);
												},
												className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1095,
												columnNumber: 23
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1091,
												columnNumber: 21
											}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
												children: "Copyright Notice"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1107,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												value: cmsData.footer.copyrightText,
												onChange: (e) => {
													setCmsData({
														...cmsData,
														footer: {
															...cmsData.footer,
															copyrightText: e.target.value
														}
													});
													setHasChanges(true);
												},
												className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1110,
												columnNumber: 23
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1106,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1090,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1088,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1039,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1033,
							columnNumber: 13
						}, this),
						activeTab === "comparison" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
								className: "text-2xl font-bold font-urbanist text-white",
								children: "Search vs PPC Economics Matrix"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1130,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-neutral-400",
								children: "Customize the comparison chart between rented ads and compounding search authority."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1131,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1129,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "space-y-4",
								children: cmsData.comparison.map((item, idx) => /* @__PURE__ */ jsxDEV("div", {
									className: "p-5 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-3",
									children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "text-xs font-bold text-cyan-400 uppercase tracking-wider",
											children: ["Metric #", idx + 1]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1137,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV("input", {
											type: "text",
											value: item.metric,
											onChange: (e) => {
												const updated = [...cmsData.comparison];
												updated[idx].metric = e.target.value;
												setCmsData({
													...cmsData,
													comparison: updated
												});
												setHasChanges(true);
											},
											className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-semibold text-xs focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1141,
											columnNumber: 23
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1140,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-[11px] text-red-400 font-medium mb-1",
												children: "Rented Clicks (Google Ads)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1155,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												value: item.rentedClicks,
												onChange: (e) => {
													const updated = [...cmsData.comparison];
													updated[idx].rentedClicks = e.target.value;
													setCmsData({
														...cmsData,
														comparison: updated
													});
													setHasChanges(true);
												},
												className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-red-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1156,
												columnNumber: 25
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1154,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-[11px] text-cyan-400 font-medium mb-1",
												children: "Organic Authority (Seelutions)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1169,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												value: item.organicAuthority,
												onChange: (e) => {
													const updated = [...cmsData.comparison];
													updated[idx].organicAuthority = e.target.value;
													setCmsData({
														...cmsData,
														comparison: updated
													});
													setHasChanges(true);
												},
												className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1170,
												columnNumber: 25
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1168,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1153,
											columnNumber: 21
										}, this)
									]
								}, item.id || idx, true, {
									fileName: _jsxFileName,
									lineNumber: 1136,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1134,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1128,
							columnNumber: 13
						}, this),
						activeTab === "media" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
									className: "text-2xl font-bold font-urbanist text-white",
									children: "Media Assets Library"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1193,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-neutral-400",
									children: "Browse and manage videos, posters, logos, and clinical imagery."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1194,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1192,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "p-5 bg-neutral-900/80 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-end",
									children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "flex-1 w-full",
											children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 mb-1",
												children: "Asset Name"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1200,
												columnNumber: 19
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												placeholder: "e.g. Surgical Suite Video",
												value: newMediaName,
												onChange: (e) => setNewMediaName(e.target.value),
												className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1201,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1199,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "flex-2 w-full",
											children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 mb-1",
												children: "Asset URL"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1210,
												columnNumber: 19
											}, this), /* @__PURE__ */ jsxDEV("input", {
												type: "text",
												placeholder: "https://... or /videos/...",
												value: newMediaUrl,
												onChange: (e) => setNewMediaUrl(e.target.value),
												className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1211,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1209,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "w-full md:w-32",
											children: [/* @__PURE__ */ jsxDEV("label", {
												className: "block text-xs font-semibold text-neutral-300 mb-1",
												children: "Type"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1220,
												columnNumber: 19
											}, this), /* @__PURE__ */ jsxDEV("select", {
												value: newMediaType,
												onChange: (e) => setNewMediaType(e.target.value),
												className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400",
												children: [/* @__PURE__ */ jsxDEV("option", {
													value: "image",
													children: "Image"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1226,
													columnNumber: 21
												}, this), /* @__PURE__ */ jsxDEV("option", {
													value: "video",
													children: "Video"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1227,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1221,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1219,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("button", {
											onClick: () => {
												if (newMediaName && newMediaUrl) {
													setCmsData({
														...cmsData,
														media: [...cmsData.media, {
															id: `med-${Date.now()}`,
															name: newMediaName,
															url: newMediaUrl,
															type: newMediaType
														}]
													});
													setNewMediaName("");
													setNewMediaUrl("");
													setHasChanges(true);
													showToast("Media asset added", "success");
												}
											},
											className: "px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shrink-0 cursor-pointer",
											children: "+ Add Asset"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1230,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1198,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
									children: cmsData.media.map((asset) => /* @__PURE__ */ jsxDEV("div", {
										className: "p-4 bg-neutral-900/60 border border-white/10 rounded-2xl flex flex-col justify-between",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [
											/* @__PURE__ */ jsxDEV("div", {
												className: "aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-white/5 mb-3 flex items-center justify-center relative",
												children: [asset.type === "video" ? /* @__PURE__ */ jsxDEV("div", {
													className: "text-center p-3",
													children: [/* @__PURE__ */ jsxDEV("svg", {
														className: "w-8 h-8 text-cyan-400 mx-auto mb-1",
														fill: "none",
														viewBox: "0 0 24 24",
														stroke: "currentColor",
														children: [/* @__PURE__ */ jsxDEV("path", {
															strokeLinecap: "round",
															strokeLinejoin: "round",
															strokeWidth: 1.5,
															d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1261,
															columnNumber: 31
														}, this), /* @__PURE__ */ jsxDEV("path", {
															strokeLinecap: "round",
															strokeLinejoin: "round",
															strokeWidth: 1.5,
															d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1262,
															columnNumber: 31
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1260,
														columnNumber: 29
													}, this), /* @__PURE__ */ jsxDEV("span", {
														className: "text-[10px] text-neutral-400 font-mono",
														children: "MP4 Video"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1264,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1259,
													columnNumber: 27
												}, this) : /* @__PURE__ */ jsxDEV("img", {
													src: asset.url,
													alt: asset.name,
													className: "w-full h-full object-cover"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1267,
													columnNumber: 27
												}, this), /* @__PURE__ */ jsxDEV("span", {
													className: "absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[9px] uppercase font-bold text-neutral-300",
													children: asset.type
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1269,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1257,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ jsxDEV("h4", {
												className: "font-bold text-xs text-white truncate",
												children: asset.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1273,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ jsxDEV("p", {
												className: "text-[11px] font-mono text-neutral-500 truncate mt-0.5",
												children: asset.url
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1274,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1256,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "mt-3 pt-3 border-t border-white/5 flex items-center justify-between",
											children: [/* @__PURE__ */ jsxDEV("button", {
												onClick: () => {
													navigator.clipboard.writeText(asset.url);
													showToast("URL copied to clipboard!", "info");
												},
												className: "text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer",
												children: "Copy URL"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1278,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV("button", {
												onClick: () => {
													setCmsData({
														...cmsData,
														media: cmsData.media.filter((m) => m.id !== asset.id)
													});
													setHasChanges(true);
												},
												className: "text-[11px] text-red-400 hover:text-red-300 cursor-pointer",
												children: "Remove"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1287,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1277,
											columnNumber: 21
										}, this)]
									}, asset.id, true, {
										fileName: _jsxFileName,
										lineNumber: 1255,
										columnNumber: 19
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1253,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1191,
							columnNumber: 13
						}, this),
						activeTab === "settings" && /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
								className: "text-2xl font-bold font-urbanist text-white",
								children: "SEO & Vercel Deployment Configuration"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1307,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-neutral-400",
								children: "Configure search meta tags, analytics, and automated live rebuild hooks."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1308,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1306,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4",
								children: [
									/* @__PURE__ */ jsxDEV("h3", {
										className: "text-sm font-bold text-cyan-300",
										children: "Vercel Deploy Webhook Integration"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1312,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "text-xs text-neutral-400",
										children: "To trigger real, automated production rebuilds whenever you hit \"Deploy to Vercel\", paste your Vercel Deploy Hook URL below:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1313,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [
										/* @__PURE__ */ jsxDEV("label", {
											className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
											children: "Vercel Deploy Hook URL"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1318,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("input", {
											type: "url",
											placeholder: "https://api.vercel.com/v1/integrations/deploy/prj_.../...",
											value: cmsData.siteConfig.vercelDeployHookUrl || "",
											onChange: (e) => {
												setCmsData({
													...cmsData,
													siteConfig: {
														...cmsData.siteConfig,
														vercelDeployHookUrl: e.target.value
													}
												});
												setHasChanges(true);
											},
											className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1321,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("span", {
											className: "text-[11px] text-neutral-500 mt-1 block",
											children: "Found in Vercel Project Dashboard → Settings → Git → Deploy Hooks."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1334,
											columnNumber: 19
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1317,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "pt-4 border-t border-white/10",
										children: [/* @__PURE__ */ jsxDEV("h3", {
											className: "text-sm font-bold text-cyan-300 mb-3",
											children: "Global SEO Metadata"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1340,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "space-y-4",
											children: [
												/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
													className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
													children: "Global Page Title"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1343,
													columnNumber: 23
												}, this), /* @__PURE__ */ jsxDEV("input", {
													type: "text",
													value: cmsData.siteConfig.title,
													onChange: (e) => {
														setCmsData({
															...cmsData,
															siteConfig: {
																...cmsData.siteConfig,
																title: e.target.value
															}
														});
														setHasChanges(true);
													},
													className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1346,
													columnNumber: 23
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1342,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
													className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
													children: "Meta Description"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1361,
													columnNumber: 23
												}, this), /* @__PURE__ */ jsxDEV("textarea", {
													rows: 3,
													value: cmsData.siteConfig.description,
													onChange: (e) => {
														setCmsData({
															...cmsData,
															siteConfig: {
																...cmsData.siteConfig,
																description: e.target.value
															}
														});
														setHasChanges(true);
													},
													className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1364,
													columnNumber: 23
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1360,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
													className: "block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2",
													children: "OpenGraph Share Image URL"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1379,
													columnNumber: 23
												}, this), /* @__PURE__ */ jsxDEV("input", {
													type: "text",
													value: cmsData.siteConfig.ogImage || "",
													onChange: (e) => {
														setCmsData({
															...cmsData,
															siteConfig: {
																...cmsData.siteConfig,
																ogImage: e.target.value
															}
														});
														setHasChanges(true);
													},
													className: "w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1382,
													columnNumber: 23
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1378,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1341,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1339,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1311,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1305,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 416,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 349,
				columnNumber: 7
			}, this),
			isArticleModalOpen && editingArticle && /* @__PURE__ */ jsxDEV("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center justify-between pb-3 border-b border-white/10",
							children: [/* @__PURE__ */ jsxDEV("h3", {
								className: "text-lg font-bold text-white font-urbanist",
								children: editingArticle.id ? "Edit Article" : "Create Article"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1408,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsArticleModalOpen(false),
								className: "text-neutral-400 hover:text-white cursor-pointer",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1411,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1407,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Article Title"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1420,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("input", {
							type: "text",
							value: editingArticle.title,
							onChange: (e) => setEditingArticle({
								...editingArticle,
								title: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-sm"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1421,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1419,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Slug (URL path)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1431,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingArticle.slug,
								onChange: (e) => setEditingArticle({
									...editingArticle,
									slug: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1432,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1430,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Category"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1440,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingArticle.category,
								onChange: (e) => setEditingArticle({
									...editingArticle,
									category: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1441,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1439,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1429,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Read Time"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1452,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingArticle.readTime,
								onChange: (e) => setEditingArticle({
									...editingArticle,
									readTime: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1453,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1451,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Featured Image URL"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1461,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingArticle.image,
								onChange: (e) => setEditingArticle({
									...editingArticle,
									image: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1462,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1460,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1450,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Short Excerpt"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1472,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("textarea", {
							rows: 2,
							value: editingArticle.excerpt,
							onChange: (e) => setEditingArticle({
								...editingArticle,
								excerpt: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1473,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1471,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Article Content (HTML / Markdown)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1482,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("textarea", {
							rows: 6,
							value: editingArticle.content,
							onChange: (e) => setEditingArticle({
								...editingArticle,
								content: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-mono text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1483,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1481,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-2 pt-2",
							children: [/* @__PURE__ */ jsxDEV("input", {
								type: "checkbox",
								id: "article-published",
								checked: editingArticle.published,
								onChange: (e) => setEditingArticle({
									...editingArticle,
									published: e.target.checked
								}),
								className: "rounded"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1492,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("label", {
								htmlFor: "article-published",
								className: "text-xs text-neutral-300",
								children: "Publish immediately to website"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1499,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1491,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "pt-4 border-t border-white/10 flex justify-end gap-3",
							children: [/* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsArticleModalOpen(false),
								className: "px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1505,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => {
									const updated = cmsData.articles.some((a) => a.id === editingArticle.id) ? cmsData.articles.map((a) => a.id === editingArticle.id ? editingArticle : a) : [editingArticle, ...cmsData.articles];
									setCmsData({
										...cmsData,
										articles: updated
									});
									setHasChanges(true);
									setIsArticleModalOpen(false);
									showToast("Article saved to CMS", "success");
								},
								className: "px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer",
								children: "Save Article"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1511,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1504,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1406,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1405,
				columnNumber: 9
			}, this),
			isServiceModalOpen && editingService && /* @__PURE__ */ jsxDEV("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center justify-between pb-3 border-b border-white/10",
							children: [/* @__PURE__ */ jsxDEV("h3", {
								className: "text-lg font-bold text-white font-urbanist",
								children: "Service Details"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1536,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsServiceModalOpen(false),
								className: "text-neutral-400 hover:text-white cursor-pointer",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1537,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1535,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid grid-cols-4 gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Number"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1542,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingService.number,
								onChange: (e) => setEditingService({
									...editingService,
									number: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1543,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1541,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "col-span-3",
								children: [/* @__PURE__ */ jsxDEV("label", {
									className: "block text-xs font-semibold text-neutral-300 mb-1",
									children: "Service Title"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1551,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("input", {
									type: "text",
									value: editingService.title,
									onChange: (e) => setEditingService({
										...editingService,
										title: e.target.value
									}),
									className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1552,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1550,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1540,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Description"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1562,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("textarea", {
							rows: 3,
							value: editingService.description,
							onChange: (e) => setEditingService({
								...editingService,
								description: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1563,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1561,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Image URL"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1572,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("input", {
							type: "text",
							value: editingService.image,
							onChange: (e) => setEditingService({
								...editingService,
								image: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1573,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1571,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "pt-4 border-t border-white/10 flex justify-end gap-3",
							children: [/* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsServiceModalOpen(false),
								className: "px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1582,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => {
									const updated = cmsData.services.some((s) => s.id === editingService.id) ? cmsData.services.map((s) => s.id === editingService.id ? editingService : s) : [...cmsData.services, editingService];
									setCmsData({
										...cmsData,
										services: updated
									});
									setHasChanges(true);
									setIsServiceModalOpen(false);
								},
								className: "px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer",
								children: "Save Service"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1585,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1581,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1534,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1533,
				columnNumber: 9
			}, this),
			isProjectModalOpen && editingProject && /* @__PURE__ */ jsxDEV("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center justify-between pb-3 border-b border-white/10",
							children: [/* @__PURE__ */ jsxDEV("h3", {
								className: "text-lg font-bold text-white font-urbanist",
								children: "Case Study Milestone"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1609,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsProjectModalOpen(false),
								className: "text-neutral-400 hover:text-white cursor-pointer",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1610,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1608,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid grid-cols-4 gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Year"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1615,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingProject.number,
								onChange: (e) => setEditingProject({
									...editingProject,
									number: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1616,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1614,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "col-span-3",
								children: [/* @__PURE__ */ jsxDEV("label", {
									className: "block text-xs font-semibold text-neutral-300 mb-1",
									children: "Title & Budget"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1624,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("input", {
									type: "text",
									value: editingProject.title,
									onChange: (e) => setEditingProject({
										...editingProject,
										title: e.target.value
									}),
									className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1625,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1623,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1613,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Category Strategy"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1635,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("input", {
							type: "text",
							value: editingProject.category,
							onChange: (e) => setEditingProject({
								...editingProject,
								category: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1636,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1634,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Outcome Narrative"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1645,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("textarea", {
							rows: 3,
							value: editingProject.description,
							onChange: (e) => setEditingProject({
								...editingProject,
								description: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1646,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1644,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "pt-4 border-t border-white/10 flex justify-end gap-3",
							children: [/* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsProjectModalOpen(false),
								className: "px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1655,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => {
									const updated = cmsData.projects.some((p) => p.id === editingProject.id) ? cmsData.projects.map((p) => p.id === editingProject.id ? editingProject : p) : [...cmsData.projects, editingProject];
									setCmsData({
										...cmsData,
										projects: updated
									});
									setHasChanges(true);
									setIsProjectModalOpen(false);
								},
								className: "px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer",
								children: "Save Milestone"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1658,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1654,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1607,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1606,
				columnNumber: 9
			}, this),
			isTestimonialModalOpen && editingTestimonial && /* @__PURE__ */ jsxDEV("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center justify-between pb-3 border-b border-white/10",
							children: [/* @__PURE__ */ jsxDEV("h3", {
								className: "text-lg font-bold text-white font-urbanist",
								children: "Surgeon Testimonial"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1682,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsTestimonialModalOpen(false),
								className: "text-neutral-400 hover:text-white cursor-pointer",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1683,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1681,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Surgeon Name & Credentials"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1687,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("input", {
							type: "text",
							value: editingTestimonial.author,
							onChange: (e) => setEditingTestimonial({
								...editingTestimonial,
								author: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1688,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1686,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Role / Specialty"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1698,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingTestimonial.role,
								onChange: (e) => setEditingTestimonial({
									...editingTestimonial,
									role: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1699,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1697,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1",
								children: "Clinic / Practice"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1707,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("input", {
								type: "text",
								value: editingTestimonial.company,
								onChange: (e) => setEditingTestimonial({
									...editingTestimonial,
									company: e.target.value
								}),
								className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1708,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1706,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1696,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Quote"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1718,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("textarea", {
							rows: 3,
							value: editingTestimonial.quote,
							onChange: (e) => setEditingTestimonial({
								...editingTestimonial,
								quote: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1719,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1717,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("label", {
							className: "block text-xs font-semibold text-neutral-300 mb-1",
							children: "Avatar Image URL"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1728,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("input", {
							type: "text",
							value: editingTestimonial.avatar,
							onChange: (e) => setEditingTestimonial({
								...editingTestimonial,
								avatar: e.target.value
							}),
							className: "w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1729,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1727,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "pt-4 border-t border-white/10 flex justify-end gap-3",
							children: [/* @__PURE__ */ jsxDEV("button", {
								onClick: () => setIsTestimonialModalOpen(false),
								className: "px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1738,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("button", {
								onClick: () => {
									const updated = cmsData.testimonials.some((t) => t.id === editingTestimonial.id) ? cmsData.testimonials.map((t) => t.id === editingTestimonial.id ? editingTestimonial : t) : [...cmsData.testimonials, editingTestimonial];
									setCmsData({
										...cmsData,
										testimonials: updated
									});
									setHasChanges(true);
									setIsTestimonialModalOpen(false);
								},
								className: "px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer",
								children: "Save Testimonial"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1741,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1737,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1680,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1679,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 258,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/pages/admin/index.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Arcline — Headless CMS Studio</title><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/png" href="/images/seelutions-favicon.png"><!-- Google Font: Urbanist --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">${renderHead($$result)}</head><body class="bg-[#030712] text-white min-h-screen">${renderComponent($$result, "AdminDashboard", AdminDashboard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/app/applet/src/components/admin/AdminDashboard.tsx",
		"client:component-export": "default"
	})}</body></html>`;
}, "/app/applet/src/pages/admin/index.astro", void 0);
var $$file = "/app/applet/src/pages/admin/index.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/index@_@astro
var page = () => admin_exports;
//#endregion
export { page };
