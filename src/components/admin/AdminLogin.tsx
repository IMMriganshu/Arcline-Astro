import React, { useState } from 'react';
import { getSupabase } from '../../lib/supabase';
import { useAdmin } from './adminContext';

export const AdminLogin: React.FC = () => {
  const { setUserSession, showToast, isConfigured } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const supabase = getSupabase();

    if (!supabase) {
      // Offline / Pre-configuration development mode
      if (email.includes('@') && password.length >= 4) {
        setUserSession({ email, id: 'local-admin-id' }, 'admin');
        showToast('Logged in as Administrator (Local Workspace Mode)', 'success');
      } else {
        setErrorMsg('Please enter a valid email and password (min 4 characters).');
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        showToast(error.message, 'error');
      } else if (data.user) {
        // Fetch role from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        const role = profile?.role === 'admin' ? 'admin' : 'editor';
        setUserSession({ email: data.user.email || email, id: data.user.id }, role);
        showToast(`Welcome back, ${data.user.email}`, 'success');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setUserSession({ email: 'director@arcline.com', id: 'admin-preview-user' }, 'admin');
    showToast('Signed in as Senior Admin (Development Access)', 'success');
  };

  const handleQuickDemoEditor = () => {
    setUserSession({ email: 'editor@arcline.com', id: 'editor-preview-user' }, 'editor');
    showToast('Signed in as Editorial Staff', 'info');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-urbanist relative overflow-hidden">
      {/* Background architectural glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#8DC541]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <!-- Logo Brand Header -->
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 mb-4 shadow-xl">
            <img
              src="/images/seelutions%20new%20updatedLogo.png"
              alt="Arcline Brand Mark"
              className="w-full h-full object-contain filter brightness-0 invert"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5">
            Arcline Headless CMS
          </h1>
          <p className="text-sm text-neutral-400">
            Publishing Portal & Content Administration
          </p>
        </div>

        <!-- Login Card -->
        <div className="mt-8 bg-[#0F0F12] py-8 px-6 shadow-2xl rounded-3xl border border-white/10 sm:px-10 relative">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold tracking-wider uppercase text-neutral-300 mb-2">
                Administrator Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@arcline.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8DC541] focus:ring-1 focus:ring-[#8DC541] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold tracking-wider uppercase text-neutral-300">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8DC541] focus:ring-1 focus:ring-[#8DC541] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#8DC541] to-[#78a837] text-[#050505] shadow-lg shadow-[#8DC541]/20 hover:opacity-95 focus:outline-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access CMS Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Access / Development Mode Helper */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Workspace Preview Access
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {isConfigured ? 'Supabase Connected' : 'Local Dev Mode'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Use your registered Supabase credentials above, or click below for instant preview access in this workspace:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-200 transition-all text-center"
              >
                Enter as Admin
              </button>
              <button
                type="button"
                onClick={handleQuickDemoEditor}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-200 transition-all text-center"
              >
                Enter as Editor
              </button>
            </div>
          </div>
        </div>

        <!-- Back to site link -->
        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1.5">
            &larr; Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
