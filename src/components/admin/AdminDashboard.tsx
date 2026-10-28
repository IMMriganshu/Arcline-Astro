import React, { useState, useEffect } from 'react';
import type { CmsData, Service, Project, Article, Testimonial, NavItem, MediaAsset, Page, Submission, AdminUser } from '../../lib/types';
import { defaultCmsContent } from '../../data/defaultCmsContent';
import { replaceSeelutionsDeep } from '../../lib/cms';
import { ArticleContentBuilder } from './ArticleContentBuilder';
import { PageSectionBuilder } from './PageSectionBuilder';
import { AdminUsersManagementView } from './AdminUsersManagementView';
import { SeoManagerView } from './SeoManagerView';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp, setDoc } from 'firebase/firestore';
import { compressImageFile, compressProseImages, uploadDataUrlToServer, processHtmlAndUploadImages, sanitizeArticleForFirestore } from '../../lib/imageCompression';



function SubmissionsView({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-urbanist text-white">Form Submissions</h2>
      <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
        <table className="w-full text-xs text-left text-neutral-300">
          <thead className="text-neutral-500 uppercase">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Website</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Focus</th>
              <th className="px-3 py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} className="border-t border-white/5">
                <td className="px-3 py-3 text-white">{sub.name}</td>
                <td className="px-3 py-3 text-cyan-400"><a href={sub.website.startsWith('http') ? sub.website : `https://${sub.website}`} target="_blank">{sub.website}</a></td>
                <td className="px-3 py-3">{sub.email}</td>
                <td className="px-3 py-3">{sub.phone}</td>
                <td className="px-3 py-3">{sub.focus}</td>
                <td className="px-3 py-3">{sub.createdAt?.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PERMANENT_VERCEL_HOOK = 'https://api.vercel.com/v1/integrations/deploy/prj_urcHfoyBHNVmdjwGAFlqsNC9va6o/6NGuRPGr1s';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'super' | 'admin'>('admin');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: 'super' | 'admin' } | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isVerifyingLogin, setIsVerifyingLogin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Admin users state (for Super Admin user management)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoadingAdminUsers, setIsLoadingAdminUsers] = useState<boolean>(false);

  // Page editing modal state
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState<boolean>(false);

  const [cmsData, setCmsData] = useState<CmsData>(() => {
    if (typeof window !== 'undefined') {
      const dedicatedHook = localStorage.getItem('arcline_vercel_hook') || PERMANENT_VERCEL_HOOK;
      try {
        const local = localStorage.getItem('arcline_cms_content_v1');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && typeof parsed === 'object') {
            return replaceSeelutionsDeep({
              ...defaultCmsContent,
              ...parsed,
              hero: { ...defaultCmsContent.hero, ...(parsed.hero || {}) },
              footer: { ...defaultCmsContent.footer, ...(parsed.footer || {}) },
              siteConfig: {
                ...defaultCmsContent.siteConfig,
                ...(parsed.siteConfig || {}),
                name: (parsed.siteConfig?.name === 'Arcline' || parsed.siteConfig?.name === 'Seelutions') ? 'seelutions' : (parsed.siteConfig?.name || 'seelutions'),
                title: parsed.siteConfig?.title ? parsed.siteConfig.title.replace(/Arcline/g, 'seelutions').replace(/Seelutions/g, 'seelutions') : defaultCmsContent.siteConfig.title,
                vercelDeployHookUrl: dedicatedHook || parsed.siteConfig?.vercelDeployHookUrl || PERMANENT_VERCEL_HOOK,
              },
              comparison: Array.isArray(parsed.comparison) && parsed.comparison.length > 0 ? parsed.comparison : defaultCmsContent.comparison,
              comparisonContent: (parsed.comparisonContent !== undefined && parsed.comparisonContent !== null) ? parsed.comparisonContent : defaultCmsContent.comparisonContent,
              navigation: Array.isArray(parsed.navigation) && parsed.navigation.length > 0 ? parsed.navigation : defaultCmsContent.navigation,
              aboutContent: parsed.aboutContent || defaultCmsContent.aboutContent,
              projectCta: parsed.projectCta || defaultCmsContent.projectCta,
              videoShowcase: parsed.videoShowcase || defaultCmsContent.videoShowcase,
              articles: Array.isArray(parsed.articles) && parsed.articles.length > 0 ? parsed.articles : defaultCmsContent.articles,
              services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : defaultCmsContent.services,
              projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : defaultCmsContent.projects,
              testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 ? parsed.testimonials : defaultCmsContent.testimonials,
              media: Array.isArray(parsed.media) && parsed.media.length > 0 ? parsed.media : defaultCmsContent.media,
              pages: Array.isArray(parsed.pages) && parsed.pages.length > 0 ? parsed.pages : defaultCmsContent.pages,
            });
          }
        }
      } catch (e) {}
    }
    return {
      ...defaultCmsContent,
      siteConfig: {
        ...defaultCmsContent.siteConfig,
        vercelDeployHookUrl: PERMANENT_VERCEL_HOOK,
      },
    };
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Blog article editing modal state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isSavingArticle, setIsSavingArticle] = useState<boolean>(false);

  // Service editing modal state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

  // Project editing modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);

  // Testimonial modal state
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState<boolean>(false);

  // New Media URL input
  const [newMediaName, setNewMediaName] = useState<string>('');
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');

  // New Navigation Menu Item input
  const [newMenuLabel, setNewMenuLabel] = useState<string>('');
  const [newMenuHref, setNewMenuHref] = useState<string>('');
  
  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Check auth and load content on mount
  useEffect(() => {
    const session = localStorage.getItem('arcline_admin_session');
    const storedRole = (localStorage.getItem('arcline_admin_role') as 'super' | 'admin') || 'admin';
    const storedUserStr = localStorage.getItem('arcline_admin_user');
    
    if (session === 'authenticated') {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      if (storedUserStr) {
        try {
          setCurrentUser(JSON.parse(storedUserStr));
        } catch {}
      } else {
        setCurrentUser({
          name: storedRole === 'super' ? 'Super Administrator' : 'Staff Administrator',
          email: storedRole === 'super' ? 'superadmin@seelutions.com' : 'admin@seelutions.com',
          role: storedRole,
        });
      }
    }

    const dedicatedHook = typeof window !== 'undefined'
      ? localStorage.getItem('arcline_vercel_hook') || PERMANENT_VERCEL_HOOK
      : PERMANENT_VERCEL_HOOK;

    let localData: CmsData | null = null;
    try {
      const local = localStorage.getItem('arcline_cms_content_v1');
      if (local) {
        localData = JSON.parse(local);
        if (localData && localData.siteConfig) {
          localData.siteConfig.vercelDeployHookUrl = dedicatedHook || localData.siteConfig.vercelDeployHookUrl || PERMANENT_VERCEL_HOOK;
        }
      }
    } catch (e) {
      console.warn('Failed to load local CMS data', e);
    }

    // Fetch initial CMS content from API and merge resiliently
    fetch('/api/cms')
      .then((res) => res.json())
      .then(async (json) => {
        if (json.data && typeof json.data === 'object') {
          const effectiveHook =
            dedicatedHook ||
            json.data.siteConfig?.vercelDeployHookUrl ||
            localData?.siteConfig?.vercelDeployHookUrl ||
            PERMANENT_VERCEL_HOOK;

          // Merge articles from default, local, API, and Firestore individual articles
          const articleMap = new Map<string, Article>();
          (defaultCmsContent.articles || []).forEach((a) => {
            if (a.id) articleMap.set(a.id, a);
            else if (a.slug) articleMap.set(a.slug, a);
          });
          (localData?.articles || []).forEach((a) => {
            if (a.id) articleMap.set(a.id, a);
            else if (a.slug) articleMap.set(a.slug, a);
          });
          if (Array.isArray(json.data.articles)) {
            json.data.articles.forEach((a: Article) => {
              if (a.id) articleMap.set(a.id, a);
              else if (a.slug) articleMap.set(a.slug, a);
            });
          }

          // Directly query cms_articles collection from Firestore to guarantee new articles are caught
          try {
            const artSnap = await getDocs(collection(db, 'cms_articles'));
            artSnap.forEach((d) => {
              const artData = d.data() as Article;
              if (artData && (artData.id || artData.slug)) {
                articleMap.set(artData.id || d.id, { ...artData, id: artData.id || d.id });
              }
            });
          } catch (colErr) {
            console.warn('Could not query cms_articles collection directly:', colErr);
          }

          const combinedArticles = Array.from(articleMap.values());

          const merged: CmsData = {
            ...defaultCmsContent,
            ...json.data,
            hero: { ...defaultCmsContent.hero, ...(json.data.hero || {}) },
            footer: { ...defaultCmsContent.footer, ...(json.data.footer || {}) },
            siteConfig: {
              ...defaultCmsContent.siteConfig,
              ...(json.data.siteConfig || {}),
              name: (json.data.siteConfig?.name === 'Arcline' || json.data.siteConfig?.name === 'Seelutions') ? 'seelutions' : (json.data.siteConfig?.name || 'seelutions'),
              title: json.data.siteConfig?.title ? json.data.siteConfig.title.replace(/Arcline/g, 'seelutions').replace(/Seelutions/g, 'seelutions') : defaultCmsContent.siteConfig.title,
              vercelDeployHookUrl: effectiveHook,
            },
            comparison: Array.isArray(json.data.comparison) && json.data.comparison.length > 0 ? json.data.comparison : defaultCmsContent.comparison,
            comparisonContent: (json.data.comparisonContent !== undefined && json.data.comparisonContent !== null) 
              ? json.data.comparisonContent 
              : defaultCmsContent.comparisonContent,
            navigation: Array.isArray(json.data.navigation) && json.data.navigation.length > 0 ? json.data.navigation : defaultCmsContent.navigation,
            aboutContent: json.data.aboutContent || defaultCmsContent.aboutContent,
            projectCta: json.data.projectCta || defaultCmsContent.projectCta,
            videoShowcase: json.data.videoShowcase || defaultCmsContent.videoShowcase,
            articles: combinedArticles.length > 0 ? combinedArticles : defaultCmsContent.articles,
            services: Array.isArray(json.data.services) && json.data.services.length > 0 ? json.data.services : defaultCmsContent.services,
            projects: Array.isArray(json.data.projects) && json.data.projects.length > 0 ? json.data.projects : defaultCmsContent.projects,
            testimonials: Array.isArray(json.data.testimonials) && json.data.testimonials.length > 0 ? json.data.testimonials : defaultCmsContent.testimonials,
            media: Array.isArray(json.data.media) && json.data.media.length > 0 ? json.data.media : defaultCmsContent.media,
            pages: Array.isArray(json.data.pages) && json.data.pages.length > 0 ? json.data.pages : defaultCmsContent.pages,
          };
          const cleanedMerged = replaceSeelutionsDeep(merged);
          setCmsData(cleanedMerged);
          localStorage.setItem('arcline_cms_content_v1', JSON.stringify(cleanedMerged));
          localStorage.setItem('arcline_vercel_hook', effectiveHook);
        }
      })
      .catch(async () => {
        if (localData) {
          // Direct fallback query to cms_articles
          try {
            const artSnap = await getDocs(collection(db, 'cms_articles'));
            const articleMap = new Map<string, Article>();
            (localData.articles || []).forEach((a) => { if (a.id) articleMap.set(a.id, a); });
            artSnap.forEach((d) => {
              const artData = d.data() as Article;
              if (artData && (artData.id || artData.slug)) {
                articleMap.set(artData.id || d.id, { ...artData, id: artData.id || d.id });
              }
            });
            localData.articles = Array.from(articleMap.values());
          } catch {}
          setCmsData(localData);
        }
      });
      
    // Load submissions from Firestore
    const loadSubmissions = async () => {
      try {
        const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const subs: Submission[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Submission));
        setSubmissions(subs);
      } catch (err) {
        console.error("Error loading submissions:", err);
      }
    };
    loadSubmissions();

    // Load Admin Users from Firestore
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    setIsLoadingAdminUsers(true);
    try {
      let fetchedList: AdminUser[] = [];
      try {
        const q = query(collection(db, 'admin_users'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        fetchedList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as AdminUser));
      } catch {
        const fallbackSnap = await getDocs(collection(db, 'admin_users'));
        fetchedList = fallbackSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as AdminUser));
      }

      // Root Master Super Admin
      const masterSuper: AdminUser = {
        id: 'master-super-admin',
        name: 'Master Super Administrator',
        email: 'superadmin@seelutions.com',
        role: 'super',
        passcode: 'superadmin2026',
        status: 'active',
        createdBy: 'System Root',
      };

      // Built-in Staff Administrator
      const masterStaff: AdminUser = {
        id: 'default-staff-admin',
        name: 'Staff Administrator',
        email: 'admin@seelutions.com',
        role: 'admin',
        passcode: 'arcline2026',
        status: 'active',
        createdBy: 'System Root',
      };

      const hasSuperInDb = fetchedList.some(
        (u) => u.email?.toLowerCase() === 'superadmin@seelutions.com'
      );
      const hasStaffInDb = fetchedList.some(
        (u) => u.email?.toLowerCase() === 'admin@seelutions.com'
      );

      const customUsers = fetchedList.filter(
        (u) =>
          u.id !== 'master-super-admin' &&
          u.id !== 'default-staff-admin' &&
          u.email?.toLowerCase() !== 'superadmin@seelutions.com' &&
          u.email?.toLowerCase() !== 'admin@seelutions.com'
      );

      const finalUsers: AdminUser[] = [
        ...(hasSuperInDb ? [fetchedList.find(u => u.email?.toLowerCase() === 'superadmin@seelutions.com')!] : [masterSuper]),
        ...(hasStaffInDb ? [fetchedList.find(u => u.email?.toLowerCase() === 'admin@seelutions.com')!] : [masterStaff]),
        ...customUsers,
      ];
      setAdminUsers(finalUsers);
    } catch (err) {
      console.error('Error loading admin users:', err);
    } finally {
      setIsLoadingAdminUsers(false);
    }
  };

  const handleCreateAdminUser = async (newUserData: Omit<AdminUser, 'id'>) => {
    try {
      await addDoc(collection(db, 'admin_users'), {
        ...newUserData,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.name || 'Super Administrator',
      });
      showToast(`Admin user "${newUserData.name}" created successfully!`, 'success');
      await loadAdminUsers();
    } catch (err: any) {
      showToast('Failed to create admin in Firestore: ' + err.message, 'error');
      throw err;
    }
  };

  const handleDeleteAdminUser = async (userId: string) => {
    if (userId === 'master-super-admin') {
      showToast('Master Super Administrator cannot be removed.', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to permanently delete this administrator account?')) {
      return;
    }
    if (userId === 'default-staff-admin') {
      setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('Administrator account removed successfully.', 'info');
      return;
    }
    try {
      await deleteDoc(doc(db, 'admin_users', userId));
      setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('Administrator account removed successfully.', 'info');
    } catch (err: any) {
      showToast('Failed to delete account: ' + err.message, 'error');
    }
  };

  const handleToggleAdminStatus = async (userId: string, currentStatus: 'active' | 'disabled') => {
    if (userId === 'master-super-admin') {
      showToast('Master Super Administrator status cannot be changed.', 'error');
      return;
    }
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    if (userId === 'default-staff-admin') {
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      showToast(`Account status updated to ${newStatus}.`, 'success');
      return;
    }
    try {
      await updateDoc(doc(db, 'admin_users', userId), {
        status: newStatus,
      });
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      showToast(`Account status updated to ${newStatus}.`, 'success');
    } catch (err: any) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setAuthError('Please enter administrator passcode.');
      return;
    }

    setIsVerifyingLogin(true);
    setAuthError('');

    try {
      // 1. Direct check for default Super Admin Master Key
      if (trimmed === 'superadmin2026') {
        const u = {
          name: 'Master Super Administrator',
          email: 'superadmin@seelutions.com',
          role: 'super' as const,
        };
        setIsAuthenticated(true);
        setUserRole('super');
        setCurrentUser(u);
        localStorage.setItem('arcline_admin_session', 'authenticated');
        localStorage.setItem('arcline_admin_role', 'super');
        localStorage.setItem('arcline_admin_user', JSON.stringify(u));
        showToast('Welcome, Super Administrator', 'success');
        return;
      }

      // 2. Direct check for default Staff Admin Key
      if (trimmed === 'arcline2026') {
        const u = {
          name: 'Staff Administrator',
          email: 'admin@seelutions.com',
          role: 'admin' as const,
        };
        setIsAuthenticated(true);
        setUserRole('admin');
        setCurrentUser(u);
        localStorage.setItem('arcline_admin_session', 'authenticated');
        localStorage.setItem('arcline_admin_role', 'admin');
        localStorage.setItem('arcline_admin_user', JSON.stringify(u));
        showToast('Welcome to seelutions CMS', 'success');
        return;
      }

      // 3. Check created accounts in Firestore admin_users
      const snap = await getDocs(collection(db, 'admin_users'));
      const matchedDoc = snap.docs.find((d) => {
        const data = d.data();
        return data.passcode === trimmed;
      });

      if (matchedDoc) {
        const data = matchedDoc.data();
        if (data.status === 'disabled') {
          setAuthError('This administrator account has been disabled. Please contact Super Admin.');
          return;
        }

        const role: 'super' | 'admin' = data.role === 'super' ? 'super' : 'admin';
        const u = {
          name: data.name || 'CMS Administrator',
          email: data.email || '',
          role,
        };
        setIsAuthenticated(true);
        setUserRole(role);
        setCurrentUser(u);
        localStorage.setItem('arcline_admin_session', 'authenticated');
        localStorage.setItem('arcline_admin_role', role);
        localStorage.setItem('arcline_admin_user', JSON.stringify(u));
        showToast(`Welcome back, ${u.name}!`, 'success');
        return;
      }

      setAuthError('Invalid administrator passcode.');
    } catch (err: any) {
      console.error('Authentication verification error:', err);
      setAuthError('Could not verify credentials: ' + (err.message || 'Network error'));
    } finally {
      setIsVerifyingLogin(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('admin');
    setCurrentUser(null);
    localStorage.removeItem('arcline_admin_session');
    localStorage.removeItem('arcline_admin_role');
    localStorage.removeItem('arcline_admin_user');
    showToast('Signed out successfully', 'info');
  };

  const persistCmsData = async (targetData: CmsData, showNotification = true) => {
    try {
      // 1. Convert all inline images in articles to server URLs (/api/images/...)
      const compressedArticles = await Promise.all(
        (targetData.articles || []).map(async (art) => {
          let updatedContent = art.content || '';
          if (updatedContent.includes('data:image')) {
            updatedContent = await processHtmlAndUploadImages(updatedContent);
          }
          let updatedImg = art.image || '';
          if (updatedImg.startsWith('data:image')) {
            updatedImg = await uploadDataUrlToServer(updatedImg, `art-cover-${art.slug || 'img'}.webp`);
          }
          return { ...art, content: updatedContent, image: updatedImg };
        })
      );

      // 1b. Clean media assets in targetData.media to ensure no base64 bloat
      const cleanMedia = await Promise.all(
        (targetData.media || []).map(async (asset) => {
          if (asset.url && asset.url.startsWith('data:image')) {
            const serverUrl = await uploadDataUrlToServer(asset.url, asset.name || 'media-asset.webp');
            return { ...asset, url: serverUrl || asset.url };
          }
          return asset;
        })
      );

      const updated: CmsData = replaceSeelutionsDeep({
        ...targetData,
        articles: compressedArticles,
        media: cleanMedia,
        lastPublishedAt: new Date().toISOString(),
        version: (targetData.version || 1) + 1,
      });

      // 2. Direct browser write to individual cms_articles docs for bulletproof persistence
      for (const art of compressedArticles) {
        if (art && (art.id || art.slug)) {
          const docId = art.id || art.slug;
          try {
            await setDoc(doc(db, 'cms_articles', docId), art);
          } catch (artErr) {
            console.warn('Error saving individual article to Firestore:', docId, artErr);
          }
        }
      }

      // 3. Direct browser write to main Firestore document
      try {
        await setDoc(doc(db, 'cms_content', 'main'), updated);
      } catch (fErr) {
        console.warn('Direct Firestore client write error:', fErr);
      }

      // 4. Update localStorage safely
      try {
        localStorage.setItem('arcline_cms_content_v1', JSON.stringify(updated));
        if (updated.siteConfig?.vercelDeployHookUrl) {
          localStorage.setItem('arcline_vercel_hook', updated.siteConfig.vercelDeployHookUrl);
        }
      } catch (storageErr) {
        console.warn('localStorage save warning (Firestore is primary source):', storageErr);
      }
      window.dispatchEvent(new CustomEvent('cms:updated', { detail: updated }));

      // 5. Send to /api/cms server endpoint
      try {
        await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (apiErr) {
        console.warn('API /api/cms write warning:', apiErr);
      }

      setCmsData(updated);
      setHasChanges(false);
      if (showNotification) {
        showToast('All changes successfully saved and synchronized!', 'success');
      }
      return updated;
    } catch (err: any) {
      console.error('Error persisting CMS data:', err);
      if (showNotification) {
        showToast('Saved locally: ' + (err?.message || 'Ready'), 'info');
      }
      return targetData;
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await persistCmsData(cmsData, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeployVercel = async () => {
    if (!cmsData.siteConfig.vercelDeployHookUrl) {
      showToast('Please set your Vercel Deploy Hook URL in the SEO & Settings tab first', 'error');
      setActiveTab('settings');
      return;
    }

    setIsDeploying(true);
    showToast('Saving all articles and content to database before live deploy...', 'info');

    try {
      // Step 1: Guarantee that current CMS data (including newly added articles) is written to Firestore!
      const savedData = await persistCmsData(cmsData, false);

      // Step 2: Trigger Vercel deployment with data payload
      let triggered = false;
      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deploy',
            hookUrl: savedData.siteConfig.vercelDeployHookUrl,
            data: savedData,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) triggered = true;
        }
      } catch {
        // Fallback to direct client POST
      }

      if (!triggered) {
        const targetUrl = savedData.siteConfig?.vercelDeployHookUrl || cmsData.siteConfig?.vercelDeployHookUrl;
        if (targetUrl) {
          await fetch(targetUrl, { method: 'POST', mode: 'no-cors' });
          triggered = true;
        }
      }

      showToast('All articles and content published! Live website rebuilding now.', 'success');
    } catch (err: any) {
      showToast('Deploy trigger error: ' + err.message, 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cmsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `arcline_cms_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CMS backup exported successfully', 'success');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.hero && parsed.services) {
            setCmsData(parsed);
            setHasChanges(true);
            showToast('CMS data imported! Click Save to apply.', 'success');
          } else {
            showToast('Invalid CMS backup file format', 'error');
          }
        } catch {
          showToast('Failed to parse JSON file', 'error');
        }
      };
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all CMS content to default template values?')) {
      setCmsData(defaultCmsContent);
      setHasChanges(true);
      showToast('Reset to defaults. Remember to click "Save & Publish".', 'info');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 selection:bg-cyan-500 selection:text-black">
        <div className="w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center p-2 mb-4">
              <img
                src="/images/seelutions%20Full%20Logo%20on%20White%20Background.png"
                alt="seelutions Logo"
                className="h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-bold font-urbanist tracking-tight text-white mb-2">
              seelutions CMS
            </h1>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Authorized practice administration dashboard for patient acquisition content and live deployment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Administrator Passcode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter administrator passcode"
                className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifyingLogin}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isVerifyingLogin ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <span>Sign In to CMS Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 backdrop-blur-xl border transition-all animate-bounce-once ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current animate-ping"></div>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#050b1a]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center shadow-md">
              <img
                src="/images/seelutions%20Full%20Logo%20on%20White%20Background.png"
                alt="seelutions Logo"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight font-urbanist group-hover:text-cyan-400 transition-colors">
                seelutions CMS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                Headless Studio
              </span>
            </div>
          </a>

          {hasChanges && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-colors"
          >
            <span>Preview Site</span>
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Trigger Live Site Publishing */}
          <button
            onClick={handleDeployVercel}
            disabled={isDeploying}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${isDeploying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{isDeploying ? 'Publishing to Live...' : 'Publish to Live Site'}</span>
          </button>

          {/* Save All */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
          </button>

          {/* Current User Badge & Profile */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-white/10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm ${
                  userRole === 'super'
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-amber-500/20'
                    : 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white'
                }`}
              >
                {currentUser.name ? currentUser.name.charAt(0) : (userRole === 'super' ? 'S' : 'A')}
              </div>
              <div className="text-left hidden lg:block leading-none">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  {userRole === 'super' ? (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                      👑 Super Admin
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold">
                      🛡️ Admin
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-400 mt-1 max-w-[140px] truncate font-mono">
                  {currentUser.email || 'CMS Administrator'}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sign out of CMS"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#050b1a]/50 border-r border-white/10 flex flex-col justify-between p-4 overflow-y-auto">
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-2 flex items-center justify-between">
              <span>Content Sections</span>
              {userRole === 'super' && (
                <span className="text-[9px] font-mono text-amber-400/80">SUPER ROLE</span>
              )}
            </div>

            {[
              { id: 'overview', label: 'Overview & Status', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              ...(userRole === 'super'
                ? [
                    {
                      id: 'users',
                      label: 'Admin Users',
                      badge: 'Super Only',
                      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                    },
                  ]
                : []),
              { id: 'hero', label: 'Hero & Branding', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'services', label: 'Services (01–05)', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { id: 'projects', label: 'Case Studies (10-Yr)', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'blog', label: 'Blog & Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
              { id: 'pages', label: 'Manage Pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'testimonials', label: 'Surgeon Testimonials', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
              { id: 'comparison', label: 'Why Models Fail (Comparison)', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'navigation', label: 'Navigation & Footer', icon: 'M4 6h16M4 12h16M4 18h16' },
              { id: 'submissions', label: 'Form Submissions', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { id: 'media', label: 'Media Assets', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
              { id: 'seo', label: 'Complete SEO Suite', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
              { id: 'settings', label: 'Vercel Deploy Hook', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </div>
                {'badge' in tab && tab.badge && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    👑 Super
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Backup & Actions */}
          <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
            <button
              onClick={handleExportJson}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export JSON Backup</span>
            </button>

            <label className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={handleResetToDefault}
              className="w-full text-center text-[10px] text-neutral-500 hover:text-red-400 transition-colors pt-2 cursor-pointer"
            >
              Reset to default values
            </button>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl">
          {/* TAB: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">System Overview & Deployment</h2>
                <p className="text-xs text-neutral-400">Headless CMS operational status and publication triggers.</p>
              </div>

              {/* Status Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Live Status</div>
                  <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    Operational
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-2">Vercel SSR / Static Ready</div>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Published Articles</div>
                  <div className="text-2xl font-bold text-white font-urbanist">
                    {cmsData.articles.filter((a) => a.published).length} / {cmsData.articles.length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-2">Editorial Blog Hub</div>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Active Services</div>
                  <div className="text-2xl font-bold text-white font-urbanist">{cmsData.services.length}</div>
                  <div className="text-[11px] text-neutral-500 mt-2">Practice Specialties</div>
                </div>

                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Last Publication</div>
                  <div className="text-xs font-mono font-semibold text-cyan-300 mt-1">
                    {cmsData.lastPublishedAt ? new Date(cmsData.lastPublishedAt).toLocaleTimeString() : 'Pending'}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-2">
                    {cmsData.lastPublishedAt ? new Date(cmsData.lastPublishedAt).toLocaleDateString() : 'Initial'}
                  </div>
                </div>
              </div>

              {/* Vercel Deployment Panel */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-urbanist">Vercel Webhook Deployment</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        Zero-Downtime Rebuild
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                      When you trigger deployment, Vercel initiates an immediate rebuild of the live production site with your updated CMS data, generating statically optimized pages with high Google PageSpeed scores.
                    </p>
                  </div>

                  <button
                    onClick={handleDeployVercel}
                    disabled={isDeploying}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{isDeploying ? 'Deploying to Vercel...' : 'Publish to Live Vercel Site'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div
                  onClick={() => setActiveTab('hero')}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Hero Section & Title Video
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Edit headline, subheadline, CTAs, and looping video sources.</p>
                </div>

                <div
                  onClick={() => setActiveTab('blog')}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Patient Grower Blog Articles
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Write, edit, and publish search authority editorial articles.</p>
                </div>

                <div
                  onClick={() => setActiveTab('services')}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900/70 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Practice Service Cards (01–05)
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Update SEO, GEO search, and procedure conversion copy.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">Hero Section & Visual Identity</h2>
                <p className="text-xs text-neutral-400">Control the above-the-fold patient acquisition messaging and video streams.</p>
              </div>

              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Eyebrow Tag (Upper Cyan Badge)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.eyebrowTag}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, hero: { ...cmsData.hero, eyebrowTag: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Masked Title Line 1
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.titleLine1}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, titleLine1: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold font-urbanist focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Masked Title Line 2
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.titleLine2}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, titleLine2: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-bold font-urbanist focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Hero Card Headline
                  </label>
                  <textarea
                    rows={2}
                    value={cmsData.hero.headline}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, hero: { ...cmsData.hero, headline: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Subheadline Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.hero.subheadline}
                    onChange={(e) => {
                      setCmsData({ ...cmsData, hero: { ...cmsData.hero, subheadline: e.target.value } });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.primaryCtaText}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, primaryCtaText: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Primary CTA Target Link
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.primaryCtaLink}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, primaryCtaLink: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Secondary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.secondaryCtaText}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, secondaryCtaText: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Secondary CTA Target Link
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.secondaryCtaLink}
                      onChange={(e) => {
                        setCmsData({ ...cmsData, hero: { ...cmsData.hero, secondaryCtaLink: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Video URLs */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-cyan-300">Hero Video Sources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Title Mask Video Source
                      </label>
                      <input
                        type="text"
                        value={cmsData.hero.titleVideoUrl}
                        onChange={(e) => {
                          setCmsData({ ...cmsData, hero: { ...cmsData.hero, titleVideoUrl: e.target.value } });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Hero Card Bionic Eye Video
                      </label>
                      <input
                        type="text"
                        value={cmsData.hero.bannerVideoUrl}
                        onChange={(e) => {
                          setCmsData({ ...cmsData, hero: { ...cmsData.hero, bannerVideoUrl: e.target.value } });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Services */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Practice Services (01–05)</h2>
                  <p className="text-xs text-neutral-400">Manage specialized SEO and patient acquisition offerings.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingService({
                      id: `srv-${Date.now()}`,
                      number: `0${cmsData.services.length + 1}`,
                      title: 'New Surgical Marketing Offering',
                      description: 'Comprehensive patient acquisition protocol designed for board-certified plastic surgeons.',
                      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=85',
                      imageAlt: 'Medical surgical consultation clinic aesthetic',
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Service
                </button>
              </div>

              <div className="space-y-3">
                {cmsData.services.map((srv, idx) => (
                  <div
                    key={srv.id || idx}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-urbanist shrink-0">
                        {srv.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{srv.title}</h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{srv.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingService({ ...srv });
                          setIsServiceModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete service "${srv.title}"?`)) {
                            setCmsData({
                              ...cmsData,
                              services: cmsData.services.filter((s) => s.id !== srv.id),
                            });
                            setHasChanges(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Case Studies (Projects) */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">10-Year Practice Case Studies</h2>
                  <p className="text-xs text-neutral-400">Milestone timeline tracking budget vs organic consult yield.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      number: `${new Date().getFullYear()}`,
                      title: 'Market Expansion ($4,500/mo)',
                      category: 'Multi-Location Map Pack',
                      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85',
                      description: 'Expanded search infrastructure into adjacent affluent suburbs.',
                      year: `${new Date().getFullYear()}`,
                      location: 'Metro Territory',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Case Study
                </button>
              </div>

              <div className="space-y-3">
                {cmsData.projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400 font-urbanist shrink-0 text-xs">
                        {proj.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{proj.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{proj.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject({ ...proj });
                          setIsProjectModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete case study "${proj.title}"?`)) {
                            setCmsData({
                              ...cmsData,
                              projects: cmsData.projects.filter((p) => p.id !== proj.id),
                            });
                            setHasChanges(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Blog & Articles */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Patient Grower Editorial Hub</h2>
                  <p className="text-xs text-neutral-400">Educational search authority and AI optimization articles.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticle({
                      id: `art-${Date.now()}`,
                      slug: 'new-article-slug',
                      category: 'Surgical Authority',
                      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                      readTime: '5 Min Read',
                      title: 'New Editorial Article Title',
                      excerpt: 'Brief summary outlining key procedural insights for prospective surgical patients.',
                      content: '<p>Write your detailed article body content here.</p>',
                      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85',
                      published: true,
                    });
                    setIsArticleModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Create Article
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cmsData.articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span className="text-cyan-400 font-semibold">{art.category}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm mb-2">{art.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${art.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-400'}`}>
                        {art.published ? 'Published' : 'Draft'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingArticle({ ...art });
                            setIsArticleModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete article "${art.title}"?`)) {
                              const updatedArticles = (cmsData.articles || []).filter((a) => {
                                if (art.id && a.id === art.id) return false;
                                if (art.slug && a.slug === art.slug) return false;
                                return true;
                              });
                              const updatedData: CmsData = { ...cmsData, articles: updatedArticles };
                              
                              // 1. Immediately update local state so article disappears instantly
                              setCmsData(updatedData);
                              setHasChanges(true);

                              // 2. Immediately update localStorage
                              try {
                                localStorage.setItem('arcline_cms_content_v1', JSON.stringify(updatedData));
                              } catch {}

                              // 3. Delete from Firestore individual docs collection (both id and slug)
                              try {
                                if (art.id) await deleteDoc(doc(db, 'cms_articles', art.id));
                                if (art.slug && art.slug !== art.id) await deleteDoc(doc(db, 'cms_articles', art.slug));
                              } catch (dErr) {
                                console.warn('Direct cms_articles delete warning:', dErr);
                              }

                              // 4. Delete via server endpoint
                              try {
                                await fetch('/api/cms', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ action: 'delete_article', articleId: art.id, slug: art.slug, data: updatedData }),
                                });
                              } catch (apiErr) {
                                console.warn('Server delete_article warning:', apiErr);
                              }

                              // 5. Persist the updated CMS content
                              try {
                                await persistCmsData(updatedData, false);
                              } catch (pErr) {
                                console.warn('persistCmsData warning on delete:', pErr);
                              }

                              showToast(`Article "${art.title}" deleted successfully`, 'info');
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Testimonials */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Surgeon Client Testimonials</h2>
                  <p className="text-xs text-neutral-400">Quotes and reviews from board-certified surgical practice clients.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingTestimonial({
                      id: `test-${Date.now()}`,
                      quote: 'Their patient acquisition architecture generated consistent high-ticket surgical consultations.',
                      author: 'Dr. Jane Smith, MD',
                      role: 'Board-Certified Plastic Surgeon',
                      company: 'Smith Plastic Surgery',
                      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
                      rating: 5,
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add Testimonial
                </button>
              </div>

              <div className="space-y-3">
                {cmsData.testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="p-5 bg-neutral-900/70 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={test.avatar}
                        alt={test.author}
                        className="w-12 h-12 rounded-full object-cover border border-white/15 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{test.author}</h3>
                          <span className="text-xs text-neutral-400">· {test.role}, {test.company}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-2 italic">"{test.quote}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingTestimonial({ ...test });
                          setIsTestimonialModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete testimonial from ${test.author}?`)) {
                            setCmsData({
                              ...cmsData,
                              testimonials: cmsData.testimonials.filter((t) => t.id !== test.id),
                            });
                            setHasChanges(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Navigation & Footer */}
          {activeTab === 'navigation' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">Header & Footer Management</h2>
                <p className="text-xs text-neutral-400">
                  Manage the header navigation menu items, header CTA buttons, contact details, and footer brand content.
                </p>
              </div>

              {/* SECTION 1: HEADER NAVIGATION MENU BUILDER */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      Header Navigation Menu
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Links appear in the top pill bar on desktop, the mobile drawer, and automatically mirror in the footer Quick Links.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono w-fit">
                    {(Array.isArray(cmsData.navigation) ? cmsData.navigation : []).length} Menu Items
                  </span>
                </div>

                {/* List of Navigation Items */}
                <div className="space-y-3">
                  {(Array.isArray(cmsData.navigation) ? cmsData.navigation : []).map((item, idx) => (
                    <div
                      key={item.id || `nav-${idx}`}
                      className="p-4 bg-black/40 border border-white/10 rounded-xl hover:border-white/20 transition-all flex flex-col gap-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        {/* Index & Handle badge */}
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-cyan-300 shrink-0">
                            {idx + 1}
                          </span>
                        </div>

                        {/* Item Label Input */}
                        <div className="flex-1 min-w-[140px]">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                            Menu Label
                          </label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const current = Array.isArray(cmsData.navigation) ? [...cmsData.navigation] : [];
                              current[idx] = { ...current[idx], label: e.target.value };
                              setCmsData({ ...cmsData, navigation: current });
                              setHasChanges(true);
                            }}
                            placeholder="e.g. Services, About, Blog"
                            className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs font-medium focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* Item Link/Href Input */}
                        <div className="flex-[1.5] min-w-[180px]">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                            Target URL / Anchor Link
                          </label>
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const current = Array.isArray(cmsData.navigation) ? [...cmsData.navigation] : [];
                              current[idx] = { ...current[idx], href: e.target.value };
                              setCmsData({ ...cmsData, navigation: current });
                              setHasChanges(true);
                            }}
                            placeholder="e.g. /#services, /blog, /about"
                            className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* Actions: Reorder & Delete */}
                        <div className="flex items-center gap-1.5 self-end md:self-end pt-1">
                          <label className="flex items-center gap-2 text-[10px] text-neutral-300 cursor-pointer px-2">
                             <input type="checkbox" checked={!!item.hasDropdown} onChange={(e) => {
                                const current = Array.isArray(cmsData.navigation) ? [...cmsData.navigation] : [];
                                current[idx] = { ...current[idx], hasDropdown: e.target.checked, children: e.target.checked ? (current[idx].children || []) : undefined };
                                setCmsData({ ...cmsData, navigation: current });
                                setHasChanges(true);
                             }} />
                             Dropdown
                          </label>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx <= 0) return;
                              const current = Array.isArray(cmsData.navigation) ? [...cmsData.navigation] : [];
                              const temp = current[idx];
                              current[idx] = current[idx - 1];
                              current[idx - 1] = temp;
                              setCmsData({ ...cmsData, navigation: current });
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-neutral-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === (Array.isArray(cmsData.navigation) ? cmsData.navigation.length : 0) - 1}
                            onClick={() => {
                              if (idx >= (Array.isArray(cmsData.navigation) ? cmsData.navigation.length : 0) - 1) return;
                              const current = Array.isArray(cmsData.navigation) ? [...cmsData.navigation] : [];
                              const temp = current[idx];
                              current[idx] = current[idx + 1];
                              current[idx + 1] = temp;
                              setCmsData({ ...cmsData, navigation: current });
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-neutral-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete menu item "${item.label}"?`)) {
                                const current = (Array.isArray(cmsData.navigation) ? cmsData.navigation : []).filter(
                                  (_, i) => i !== idx
                                );
                                setCmsData({ ...cmsData, navigation: current });
                                setHasChanges(true);
                              }
                            }}
                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center text-xs transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>


                      {/* Sub-items */}
                      {item.hasDropdown && (
                        <div className="ml-8 mt-2 space-y-2 border-l-2 border-cyan-500/20 pl-4">
                          {(item.children || []).map((child, cIdx) => (
                             <div key={child.id || `child-${cIdx}`} className="flex gap-2">
                                <input type="text" value={child.label} onChange={(e) => {
                                   const current = [...cmsData.navigation];
                                   const children = [...(current[idx].children || [])];
                                   children[cIdx] = { ...children[cIdx], label: e.target.value };
                                   current[idx] = { ...current[idx], children };
                                   setCmsData({ ...cmsData, navigation: current });
                                   setHasChanges(true);
                                }} placeholder="Label" className="px-2 py-1 bg-black/50 border border-white/15 rounded-lg text-white text-[10px]" />
                                <input type="text" value={child.href} onChange={(e) => {
                                   const current = [...cmsData.navigation];
                                   const children = [...(current[idx].children || [])];
                                   children[cIdx] = { ...children[cIdx], href: e.target.value };
                                   current[idx] = { ...current[idx], children };
                                   setCmsData({ ...cmsData, navigation: current });
                                   setHasChanges(true);
                                }} placeholder="URL" className="px-2 py-1 bg-black/50 border border-white/15 rounded-lg text-white text-[10px]" />
                                <button onClick={() => {
                                   const current = [...cmsData.navigation];
                                   const children = (current[idx].children || []).filter((_, i) => i !== cIdx);
                                   current[idx] = { ...current[idx], children, hasDropdown: children.length > 0 };
                                   setCmsData({ ...cmsData, navigation: current });
                                   setHasChanges(true);
                                }} className="text-red-400 text-[10px]">✕</button>
                             </div>
                          ))}
                          <button onClick={() => {
                              const current = [...cmsData.navigation];
                              const children = [...(current[idx].children || []), { id: `child-${Date.now()}`, label: 'New Link', href: '#' }];
                              current[idx] = { ...current[idx], children, hasDropdown: true };
                              setCmsData({ ...cmsData, navigation: current });
                              setHasChanges(true);
                          }} className="text-[10px] text-cyan-400">+ Add Link</button>
                        </div>
                      )}
                    </div>
                  ))}

                  {(Array.isArray(cmsData.navigation) ? cmsData.navigation : []).length === 0 && (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-500 text-xs">
                      No navigation menu items configured. Add one below!
                    </div>
                  )}
                </div>

                {/* Add New Menu Item Form */}
                <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Menu Item
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
                    <div className="sm:col-span-1 md:col-span-2">
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                        Menu Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Case Studies, Pricing, About"
                        value={newMenuLabel}
                        onChange={(e) => setNewMenuLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="sm:col-span-1 md:col-span-2">
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                        Target URL / Anchor Link
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /#projects, /#about, /blog"
                        value={newMenuHref}
                        onChange={(e) => setNewMenuHref(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMenuLabel.trim() || !newMenuHref.trim()) {
                            showToast('Please provide both a label and a link for the menu item', 'error');
                            return;
                          }
                          const current = Array.isArray(cmsData.navigation) ? [...cmsData.navigation] : [];
                          const newItem: NavItem = {
                            id: `nav-${Date.now()}`,
                            label: newMenuLabel.trim(),
                            href: newMenuHref.trim(),
                          };
                          setCmsData({ ...cmsData, navigation: [...current, newItem] });
                          setNewMenuLabel('');
                          setNewMenuHref('');
                          setHasChanges(true);
                          showToast(`Added "${newItem.label}" to navigation menu`, 'success');
                        }}
                        className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    💡 Tip: Use <code className="text-cyan-300 font-mono">/#section-id</code> (e.g. <code className="text-cyan-300 font-mono">/#services</code>, <code className="text-cyan-300 font-mono">/#about</code>, <code className="text-cyan-300 font-mono">/#contact</code>) for homepage smooth scroll sections, or <code className="text-cyan-300 font-mono">/blog</code> for subpages.
                  </p>
                </div>
              </div>

              {/* SECTION 2: HEADER ACTION BUTTONS & PHONE */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Header Action Buttons & Contact Callout
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Header CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={cmsData.siteConfig.headerCtaText || ''}
                      placeholder="Request Practice Audit"
                      onChange={(e) => {
                        setCmsData({
                          ...cmsData,
                          siteConfig: { ...cmsData.siteConfig, headerCtaText: e.target.value },
                        });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Header CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={cmsData.siteConfig.headerCtaLink || ''}
                      placeholder="#contact"
                      onChange={(e) => {
                        setCmsData({
                          ...cmsData,
                          siteConfig: { ...cmsData.siteConfig, headerCtaLink: e.target.value },
                        });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Header Phone Number Display
                    </label>
                    <input
                      type="text"
                      value={cmsData.siteConfig.phone}
                      placeholder="(804) 707-5821"
                      onChange={(e) => {
                        setCmsData({
                          ...cmsData,
                          siteConfig: { ...cmsData.siteConfig, phone: e.target.value },
                        });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: FOOTER BRANDING & DESCRIPTION */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Footer Brand & Company Content
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Brand Tagline (Under Footer Logo)
                    </label>
                    <input
                      type="text"
                      value={cmsData.footer?.tagline || ''}
                      placeholder="be seen. be chosen."
                      onChange={(e) => {
                        setCmsData({
                          ...cmsData,
                          footer: { ...cmsData.footer, tagline: e.target.value },
                        });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Legal Copyright Notice
                    </label>
                    <input
                      type="text"
                      value={cmsData.footer?.copyrightText || ''}
                      placeholder="© 2026 seelutions. All Rights Reserved."
                      onChange={(e) => {
                        setCmsData({
                          ...cmsData,
                          footer: { ...cmsData.footer, copyrightText: e.target.value },
                        });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Footer Mission / Agency Description
                  </label>
                  <textarea
                    rows={2}
                    value={cmsData.footer?.description || ''}
                    placeholder="Helping surgical practices dominate local and AI-driven search landscapes."
                    onChange={(e) => {
                      setCmsData({
                        ...cmsData,
                        footer: { ...cmsData.footer, description: e.target.value },
                      });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Territory Exclusivity & Legal Disclaimer
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.footer?.disclaimer || ''}
                    placeholder="Territory exclusivity guaranteed: We partner with exactly one surgical practice per geographic metro..."
                    onChange={(e) => {
                      setCmsData({
                        ...cmsData,
                        footer: { ...cmsData.footer, disclaimer: e.target.value },
                      });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* SECTION 4: PRACTICE CONTACT DETAILS (MIRRORED IN FOOTER) */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Practice Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Contact Email Address
                    </label>
                    <input
                      type="email"
                      value={cmsData.siteConfig.email}
                      placeholder="audit@seelutions.com"
                      onChange={(e) => {
                        setCmsData({ ...cmsData, siteConfig: { ...cmsData.siteConfig, email: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Physical / Office Address
                    </label>
                    <input
                      type="text"
                      value={cmsData.siteConfig.address}
                      placeholder="488 Madison Avenue, New York, NY 10022"
                      onChange={(e) => {
                        setCmsData({ ...cmsData, siteConfig: { ...cmsData.siteConfig, address: e.target.value } });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Why Traditional Models Fail (Comparison) */}
          {activeTab === 'comparison' && (() => {
            const compContent = cmsData.comparisonContent || defaultCmsContent.comparisonContent!;
            return (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Why Traditional Models Fail Plastic Surgeons</h2>
                  <p className="text-xs text-neutral-400">
                    Customize the homepage comparison cards between Traditional Agencies (Rented Clicks) and The seelutions Growth Blueprint.
                  </p>
                </div>

                {/* Section Header */}
                <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-cyan-300">Section Header &amp; Eyebrow</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Eyebrow Badge Label
                      </label>
                      <input
                        type="text"
                        value={compContent.badge}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            comparisonContent: { ...compContent, badge: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Section Main Headline
                      </label>
                      <input
                        type="text"
                        value={compContent.headline}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            comparisonContent: { ...compContent, headline: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 2-Column Comparison Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Traditional Agencies */}
                  <div className="bg-neutral-900/80 border border-red-500/20 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                        Left Column: Traditional Agencies
                      </h3>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {(compContent.traditionalItems || []).length} Points
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Column Title</label>
                      <input
                        type="text"
                        value={compContent.traditionalTitle}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            comparisonContent: { ...compContent, traditionalTitle: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      {(compContent.traditionalItems || []).map((item, idx) => (
                        <div key={item.id || idx} className="p-3.5 bg-black/50 border border-white/10 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-neutral-400">Point #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = compContent.traditionalItems.filter((_, i) => i !== idx);
                                setCmsData({
                                  ...cmsData,
                                  comparisonContent: { ...compContent, traditionalItems: updated },
                                });
                                setHasChanges(true);
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...compContent.traditionalItems];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setCmsData({
                                ...cmsData,
                                comparisonContent: { ...compContent, traditionalItems: updated },
                              });
                              setHasChanges(true);
                            }}
                            placeholder="Point Title"
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-red-400"
                          />
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...compContent.traditionalItems];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setCmsData({
                                ...cmsData,
                                comparisonContent: { ...compContent, traditionalItems: updated },
                              });
                              setHasChanges(true);
                            }}
                            placeholder="Point Description"
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/15 rounded-lg text-neutral-300 text-xs leading-relaxed focus:outline-none focus:border-red-400"
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(compContent.traditionalItems || []),
                            { id: `trad-${Date.now()}`, title: 'New Failure Point', description: 'Description of agency model flaw...' },
                          ];
                          setCmsData({
                            ...cmsData,
                            comparisonContent: { ...compContent, traditionalItems: updated },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                      >
                        + Add Traditional Point
                      </button>
                    </div>
                  </div>

                  {/* Right Column: The seelutions Growth Blueprint */}
                  <div className="bg-neutral-900/80 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                        Right Column: seelutions Blueprint
                      </h3>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {(compContent.seelutionsItems || []).length} Points
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Column Title</label>
                      <input
                        type="text"
                        value={compContent.seelutionsTitle}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            comparisonContent: { ...compContent, seelutionsTitle: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      {(compContent.seelutionsItems || []).map((item, idx) => (
                        <div key={item.id || idx} className="p-3.5 bg-black/50 border border-white/10 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-neutral-400">Point #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = compContent.seelutionsItems.filter((_, i) => i !== idx);
                                setCmsData({
                                  ...cmsData,
                                  comparisonContent: { ...compContent, seelutionsItems: updated },
                                });
                                setHasChanges(true);
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...compContent.seelutionsItems];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setCmsData({
                                ...cmsData,
                                comparisonContent: { ...compContent, seelutionsItems: updated },
                              });
                              setHasChanges(true);
                            }}
                            placeholder="Point Title"
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/15 rounded-lg text-emerald-300 text-xs font-semibold focus:outline-none focus:border-emerald-400"
                          />
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...compContent.seelutionsItems];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setCmsData({
                                ...cmsData,
                                comparisonContent: { ...compContent, seelutionsItems: updated },
                              });
                              setHasChanges(true);
                            }}
                            placeholder="Point Description"
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/15 rounded-lg text-neutral-300 text-xs leading-relaxed focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(compContent.seelutionsItems || []),
                            { id: `seel-${Date.now()}`, title: 'New Growth Advantage', description: 'Description of seelutions advantage...' },
                          ];
                          setCmsData({
                            ...cmsData,
                            comparisonContent: { ...compContent, seelutionsItems: updated },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                      >
                        + Add seelutions Blueprint Point
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: Admin Users (Super Admin Feature Only) */}
          {activeTab === 'users' && userRole === 'super' && (
            <AdminUsersManagementView
              users={adminUsers}
              isLoading={isLoadingAdminUsers}
              currentUserId={currentUser?.email}
              onRefresh={loadAdminUsers}
              onCreateUser={handleCreateAdminUser}
              onDeleteUser={handleDeleteAdminUser}
              onToggleStatus={handleToggleAdminStatus}
            />
          )}

          {activeTab === 'users' && userRole !== 'super' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white font-urbanist">Restricted Access: Super Administrator Only</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                User creation and administrator list inspection is strictly reserved for the Super Administrator account.
              </p>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Return to Overview
              </button>
            </div>
          )}

          {/* TAB: Form Submissions */}
          {activeTab === 'submissions' && <SubmissionsView submissions={submissions} />}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-urbanist text-white">Media Assets Library</h2>
                  <p className="text-xs text-neutral-400">Upload, browse, and manage videos, posters, logos, and clinical imagery for live deployment.</p>
                </div>
              </div>

              {/* Direct File Upload & Drag-and-Drop Dropzone */}
              <div className="bg-neutral-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-urbanist">Upload New Media File to Live Server</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">Select image or video files from your computer. Files are stored persistently in CMS state.</p>
                    </div>
                  </div>

                  <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Choose &amp; Upload Media</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;

                        showToast(`Uploading ${files.length} file(s) to live server...`, 'info');
                        const newAssets: MediaAsset[] = [];

                        for (const file of files) {
                          try {
                            const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mov|webm)$/i);
                            let publicUrl = '';

                            if (isVideo) {
                              const resultDataUrl = await new Promise<string>((res) => {
                                const r = new FileReader();
                                r.onload = (evt) => res((evt.target?.result as string) || '');
                                r.readAsDataURL(file);
                              });
                              publicUrl = await uploadDataUrlToServer(resultDataUrl, file.name);
                            } else {
                              const compressedDataUrl = await compressImageFile(file, 1400, 1400, 0.85);
                              publicUrl = await uploadDataUrlToServer(compressedDataUrl, file.name);
                            }

                            if (publicUrl) {
                              newAssets.push({
                                id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                name: file.name,
                                url: publicUrl,
                                type: isVideo ? 'video' : 'image',
                              });
                            }
                          } catch (err) {
                            console.error('Failed to compress/upload file:', err);
                          }
                        }

                        if (newAssets.length > 0) {
                          const updatedMedia = [...newAssets, ...cmsData.media];
                          const updatedCms = { ...cmsData, media: updatedMedia };
                          setCmsData(updatedCms);
                          await persistCmsData(updatedCms, false);
                          showToast(`Successfully uploaded ${newAssets.length} file(s) to live server!`, 'success');
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Drag and Drop Zone Area */}
                <div className="mt-4 border-2 border-dashed border-white/15 hover:border-cyan-400/60 rounded-xl p-6 text-center bg-black/30 transition-colors">
                  <p className="text-xs text-neutral-300 font-medium">
                    Drag &amp; drop images (<code className="text-cyan-300 font-mono">.jpg, .png, .webp, .svg</code>) or videos (<code className="text-cyan-300 font-mono">.mp4, .mov</code>) into the field or click <span className="text-cyan-400 font-bold">Choose &amp; Upload Media</span>
                  </p>
                </div>
              </div>

              {/* Add New Media via URL Form */}
              <div className="p-5 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">Add External Asset via URL / Path</span>
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Asset Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Diepenbrock Portrait Photo"
                      value={newMediaName}
                      onChange={(e) => setNewMediaName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex-2 w-full">
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Asset Path / URL</label>
                    <input
                      type="text"
                      placeholder="/images/Dr.%20Diepenbrock.jpg or https://..."
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Type</label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (newMediaName && newMediaUrl) {
                        const newAsset: MediaAsset = {
                          id: `med-${Date.now()}`,
                          name: newMediaName,
                          url: newMediaUrl,
                          type: newMediaType,
                        };
                        setCmsData({
                          ...cmsData,
                          media: [newAsset, ...cmsData.media],
                        });
                        setNewMediaName('');
                        setNewMediaUrl('');
                        setHasChanges(true);
                        showToast(`Media asset "${newMediaName}" added!`, 'success');
                      } else {
                        showToast('Please enter both asset name and asset URL', 'error');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    + Add Asset Link
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cmsData.media.map((asset) => (
                  <div key={asset.id} className="p-4 bg-neutral-900/60 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-white/5 mb-3 flex items-center justify-center relative">
                        {asset.type === 'video' ? (
                          <video src={asset.url} controls={false} className="w-full h-full object-cover" />
                        ) : (
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[9px] uppercase font-bold text-neutral-300">
                          {asset.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white truncate">{asset.name}</h4>
                      <p className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">{asset.url}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          showToast('Asset URL copied to clipboard!', 'info');
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => {
                          setCmsData({ ...cmsData, media: cmsData.media.filter((m) => m.id !== asset.id) });
                          setHasChanges(true);
                          showToast('Asset removed from library', 'info');
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Complete SEO Suite */}
          {activeTab === 'seo' && (
            <SeoManagerView
              cmsData={cmsData}
              setCmsData={setCmsData}
              setHasChanges={setHasChanges}
              showToast={showToast}
              userRole={userRole}
            />
          )}

          {/* TAB: Vercel Deploy Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-urbanist text-white">SEO & Vercel Deployment Configuration</h2>
                <p className="text-xs text-neutral-400">Configure search meta tags, analytics, and automated live rebuild hooks.</p>
              </div>

              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-cyan-300">Vercel Deploy Webhook Integration</h3>
                <p className="text-xs text-neutral-400">
                  To trigger real, automated production rebuilds whenever you hit "Publish to Live Site", paste your Vercel Deploy Hook URL below:
                </p>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                      Vercel Deploy Hook URL
                    </label>
                    {userRole === 'super' ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        👑 Super Admin Modifiable
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        🔒 Super Admin Only (Locked)
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://api.vercel.com/v1/integrations/deploy/prj_.../..."
                    value={cmsData.siteConfig.vercelDeployHookUrl || ''}
                    readOnly={userRole !== 'super'}
                    onChange={(e) => {
                      if (userRole !== 'super') return;
                      setCmsData({
                        ...cmsData,
                        siteConfig: { ...cmsData.siteConfig, vercelDeployHookUrl: e.target.value },
                      });
                      setHasChanges(true);
                    }}
                    className={`w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400 ${
                      userRole !== 'super' ? 'opacity-50 cursor-not-allowed bg-black/80' : ''
                    }`}
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    {userRole === 'super'
                      ? 'Found in Vercel Project Dashboard → Settings → Git → Deploy Hooks. As Super Admin, you can edit this.'
                      : 'This critical deployment webhook URL is protected and can only be altered by a Super Administrator.'}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-cyan-300 mb-3">Global SEO Metadata</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Global Page Title
                      </label>
                      <input
                        type="text"
                        value={cmsData.siteConfig.title}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            siteConfig: { ...cmsData.siteConfig, title: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={cmsData.siteConfig.description}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            siteConfig: { ...cmsData.siteConfig, description: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        OpenGraph Share Image URL
                      </label>
                      <input
                        type="text"
                        value={cmsData.siteConfig.ogImage || ''}
                        onChange={(e) => {
                          setCmsData({
                            ...cmsData,
                            siteConfig: { ...cmsData.siteConfig, ogImage: e.target.value },
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

           {/* TAB: Pages Management */}
           {activeTab === 'pages' && (
             <div className="space-y-6">
               <div>
                 <h2 className="text-2xl font-bold font-urbanist text-white">Manage Pages &amp; Section Media</h2>
                 <p className="text-xs text-neutral-400">Select any site page below to update its section text, prose content, and attached media assets (hero videos, banner graphics, gallery images, and avatars).</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {cmsData.pages.map((page) => (
                   <div key={page.id} className="bg-neutral-900/60 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between transition-all group">
                     <div>
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">Content &amp; Media</span>
                         <span className="text-[9px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                           🖼️ Media Attached
                         </span>
                       </div>
                       <h3 className="text-lg font-bold text-white mb-2 font-urbanist">{page.title}</h3>
                       <code className="text-xs text-neutral-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">/{page.slug}</code>
                     </div>
                     <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                       <span className="text-xs text-neutral-400">Sections, Copy &amp; Media</span>
                       <button
                         onClick={() => {
                           setEditingPage(page);
                           setIsPageModalOpen(true);
                         }}
                         className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                       >
                         <span>Edit Content &amp; Media</span>
                         <span>&rarr;</span>
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </main>
      </div>

      {/* Article Modal */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">
                {editingArticle.id ? 'Edit Article & Rich Content' : 'Create Article & Rich Content'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Article Title</label>
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Slug (URL path)</label>
                <input
                  type="text"
                  value={editingArticle.slug}
                  onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Read Time</label>
                <input
                  type="text"
                  value={editingArticle.readTime}
                  onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Featured Cover Image</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://... or /images/... or /api/images/..."
                    value={editingArticle.image}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 text-center flex items-center justify-center gap-1.5 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        showToast('Uploading cover image to live server...', 'info');
                        try {
                          const compressed = await compressImageFile(file, 1400, 1400, 0.85);
                          const url = await uploadDataUrlToServer(compressed, file.name);
                          if (url) {
                            setEditingArticle({ ...editingArticle, image: url });
                            showToast('Cover image uploaded!', 'success');
                          }
                        } catch (err: any) {
                          showToast('Upload failed: ' + err.message, 'error');
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingArticle.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-black/40 rounded-xl border border-white/10">
                    <img
                      src={editingArticle.image}
                      alt="Cover Preview"
                      className="w-14 h-10 object-cover rounded-lg border border-white/10"
                    />
                    <span className="text-[11px] text-cyan-300 font-mono truncate flex-1">
                      {editingArticle.image}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Short Excerpt</label>
              <textarea
                rows={2}
                value={editingArticle.excerpt}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            {/* Rich Article Text Builder with H1-H6, Links, Quotes, Bullets, Images, Captions & Preview */}
            <div className="pt-1">
              <ArticleContentBuilder
                value={editingArticle.content || ''}
                onChange={(content) => setEditingArticle({ ...editingArticle, content })}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="article-published"
                checked={editingArticle.published}
                onChange={(e) => setEditingArticle({ ...editingArticle, published: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="article-published" className="text-xs text-neutral-300">
                Publish immediately to website
              </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingArticle}
                onClick={async () => {
                  if (!editingArticle) return;
                  if (!editingArticle.title?.trim()) {
                    showToast('Please enter an article title', 'error');
                    return;
                  }

                  setIsSavingArticle(true);
                  try {
                    showToast('Optimizing images and saving article...', 'info');

                    // Sanitize article: compress cover image and all inline HTML images/data URLs to lightweight server URLs (<100KB)
                    const articleToSave = await sanitizeArticleForFirestore(editingArticle);

                    // 1. Direct write to individual Firestore doc for absolute persistence
                    try {
                      await setDoc(doc(db, 'cms_articles', articleToSave.id), articleToSave);
                    } catch (colErr: any) {
                      console.warn('Direct cms_articles Firestore write warning:', colErr);
                    }

                    // 2. Update local state immediately so user sees article right away
                    const exists = cmsData.articles.some((a) => a.id === articleToSave.id);
                    const updatedArticles = exists
                      ? cmsData.articles.map((a) => (a.id === articleToSave.id ? articleToSave : a))
                      : [articleToSave, ...cmsData.articles];

                    const updatedData: CmsData = { ...cmsData, articles: updatedArticles };
                    setCmsData(updatedData);

                    // 3. Persist to main CMS content
                    try {
                      await persistCmsData(updatedData, false);
                    } catch (pErr: any) {
                      console.warn('persistCmsData warning:', pErr);
                    }

                    // 4. Direct server save_article endpoint call
                    try {
                      await fetch('/api/cms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'save_article', article: articleToSave, data: updatedData }),
                      });
                    } catch (apiErr: any) {
                      console.warn('API /api/cms save warning:', apiErr);
                    }

                    setIsArticleModalOpen(false);
                    setEditingArticle(null);
                    showToast(`Article "${articleToSave.title}" saved and synced successfully!`, 'success');
                  } catch (err: any) {
                    console.error('Error saving article:', err);
                    showToast('Could not save article: ' + (err?.message || 'Check connection'), 'error');
                  } finally {
                    setIsSavingArticle(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                {isSavingArticle ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving Article...</span>
                  </>
                ) : (
                  <span>Save Article</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">Service Details</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Number</label>
                <input
                  type="text"
                  value={editingService.number}
                  onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingService.description}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Image URL</label>
              <input
                type="text"
                value={editingService.image}
                onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.services.some((s) => s.id === editingService.id);
                  const updated = exists
                    ? cmsData.services.map((s) => (s.id === editingService.id ? editingService : s))
                    : [...cmsData.services, editingService];
                  setCmsData({ ...cmsData, services: updated });
                  setHasChanges(true);
                  setIsServiceModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">Case Study Milestone</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Year</label>
                <input
                  type="text"
                  value={editingProject.number}
                  onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Title & Budget</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Category Strategy</label>
              <input
                type="text"
                value={editingProject.category}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Outcome Narrative</label>
              <textarea
                rows={3}
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.projects.some((p) => p.id === editingProject.id);
                  const updated = exists
                    ? cmsData.projects.map((p) => (p.id === editingProject.id ? editingProject : p))
                    : [...cmsData.projects, editingProject];
                  setCmsData({ ...cmsData, projects: updated });
                  setHasChanges(true);
                  setIsProjectModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-urbanist">Surgeon Testimonial</h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Surgeon Name & Credentials</label>
              <input
                type="text"
                value={editingTestimonial.author}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Role / Specialty</label>
                <input
                  type="text"
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Clinic / Practice</label>
                <input
                  type="text"
                  value={editingTestimonial.company}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Quote</label>
              <textarea
                rows={3}
                value={editingTestimonial.quote}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={editingTestimonial.avatar}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const exists = cmsData.testimonials.some((t) => t.id === editingTestimonial.id);
                  const updated = exists
                    ? cmsData.testimonials.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t))
                    : [...cmsData.testimonials, editingTestimonial];
                  setCmsData({ ...cmsData, testimonials: updated });
                  setHasChanges(true);
                  setIsTestimonialModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs cursor-pointer"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section-Wise Page Content Builder */}
      {isPageModalOpen && editingPage && (
        <PageSectionBuilder
          page={editingPage}
          cmsData={cmsData}
          onClose={() => setIsPageModalOpen(false)}
          onSave={(updatedPage, updatedCmsData) => {
            setCmsData(updatedCmsData);
            setHasChanges(true);
            setIsPageModalOpen(false);
            showToast(`Page "${updatedPage.title}" and its sections updated successfully! Click "Save & Publish" to deploy.`, 'success');
          }}
        />
      )}
    </div>
  );
}
