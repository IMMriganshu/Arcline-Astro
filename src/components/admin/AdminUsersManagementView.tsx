import React, { useState } from 'react';
import type { AdminUser } from '../../lib/types';

interface AdminUsersManagementViewProps {
  users: AdminUser[];
  isLoading: boolean;
  currentUserId?: string;
  onRefresh: () => void;
  onCreateUser: (user: Omit<AdminUser, 'id'>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onToggleStatus: (userId: string, currentStatus: 'active' | 'disabled') => Promise<void>;
}

export function AdminUsersManagementView({
  users,
  isLoading,
  currentUserId,
  onRefresh,
  onCreateUser,
  onDeleteUser,
  onToggleStatus,
}: AdminUsersManagementViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');

  // Reveal passcode per user row
  const [revealedPasscodes, setRevealedPasscodes] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'super'>('admin');
  const [newPasscode, setNewPasscode] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'disabled'>('active');
  const [showFormPasscode, setShowFormPasscode] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats calculation
  const totalUsersCount = users.length;
  const superAdminCount = users.filter((u) => u.role === 'super').length;
  const staffAdminCount = users.filter((u) => u.role === 'admin').length;
  const activeCount = users.filter((u) => u.status === 'active').length;

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const generatePasscode = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let code = 'arc-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code += '-2026';
    setNewPasscode(code);
  };

  const handleCopyPasscode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleRevealPasscode = (id: string) => {
    setRevealedPasscodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenModal = () => {
    setNewName('');
    setNewEmail('');
    setNewRole('admin');
    setNewPasscode('');
    setNewStatus('active');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newName.trim()) {
      setFormError('Please enter administrator full name.');
      return;
    }
    if (!newEmail.trim()) {
      setFormError('Please enter administrator email or username.');
      return;
    }
    if (!newPasscode.trim() || newPasscode.trim().length < 4) {
      setFormError('Passcode must be at least 4 characters long.');
      return;
    }

    // Check duplicate email in current list
    const isDuplicate = users.some(
      (u) => u.email.toLowerCase() === newEmail.trim().toLowerCase()
    );
    if (isDuplicate) {
      setFormError('An administrator with this email address already exists.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateUser({
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        passcode: newPasscode.trim(),
        status: newStatus,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create administrator account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold font-urbanist text-white tracking-tight">
              Administrator Accounts & Access Control
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 shadow-sm">
              👑 Super Admin Only
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Super Administrator console to create CMS user accounts, manage permission roles, and inspect the total user list.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Users List from Firestore"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : 'text-neutral-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Create Admin User</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900/70 border border-white/10 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Total User List
          </div>
          <div className="text-3xl font-extrabold text-white font-urbanist flex items-baseline gap-2">
            <span>{totalUsersCount}</span>
            <span className="text-xs text-neutral-400 font-normal">registered</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            CMS accounts in database
          </div>
        </div>

        <div className="bg-neutral-900/70 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider mb-1">
            Super Admins
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-urbanist flex items-baseline gap-2">
            <span>{superAdminCount}</span>
            <span className="text-xs text-amber-300/60 font-normal">top tier</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Full deploy hook & user rights
          </div>
        </div>

        <div className="bg-neutral-900/70 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-[11px] font-semibold text-blue-300/80 uppercase tracking-wider mb-1">
            Staff Admins
          </div>
          <div className="text-3xl font-extrabold text-blue-400 font-urbanist flex items-baseline gap-2">
            <span>{staffAdminCount}</span>
            <span className="text-xs text-blue-300/60 font-normal">content tier</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Content editors & publishers
          </div>
        </div>

        <div className="bg-neutral-900/70 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="text-[11px] font-semibold text-emerald-300/80 uppercase tracking-wider mb-1">
            Active Status
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-urbanist flex items-baseline gap-2">
            <span>{activeCount}</span>
            <span className="text-xs text-emerald-300/60 font-normal">of {totalUsersCount}</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Ready to log in
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by administrator name or email address..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-[11px]">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Roles ({totalUsersCount})
            </button>
            <button
              onClick={() => setRoleFilter('super')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                roleFilter === 'super'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              👑 Super ({superAdminCount})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                roleFilter === 'admin'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🛡️ Admin ({staffAdminCount})
            </button>
          </div>

          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-[11px]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('disabled')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'disabled'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Disabled
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-300">
            <thead className="text-[11px] text-neutral-400 uppercase tracking-wider bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role & Permissions</th>
                <th className="px-4 py-3 font-semibold">Passcode Credential</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-white">No administrators found</p>
                    <p className="text-xs text-neutral-500 mt-1">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isRevealed = revealedPasscodes[user.id] || false;
                  const isRootSuper = user.id === 'master-super-admin';
                  const isCopied = copiedId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-sm ${
                              user.role === 'super'
                                ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-extrabold shadow-amber-500/20'
                                : 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-semibold'
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isRootSuper && (
                                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  Root
                                </span>
                              )}
                              {user.id === 'default-staff-admin' && (
                                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-neutral-400 text-[11px] font-mono">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        {user.role === 'super' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                            <span>👑</span>
                            <span>Super Admin</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                            <span>🛡️</span>
                            <span>Staff Admin</span>
                          </div>
                        )}
                      </td>

                      {/* Passcode (Hidden by default, reveal toggle & copy) */}
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-2 bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                          <span className={isRevealed ? 'text-cyan-300 font-bold' : 'text-neutral-500 tracking-widest'}>
                            {isRevealed ? user.passcode : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPasscode(user.id)}
                            title={isRevealed ? 'Hide passcode' : 'Reveal passcode'}
                            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {isRevealed ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPasscode(user.id, user.passcode)}
                            title="Copy passcode"
                            className="text-neutral-400 hover:text-cyan-400 transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button
                          disabled={isRootSuper}
                          onClick={() => onToggleStatus(user.id, user.status)}
                          title={isRootSuper ? 'Root super admin cannot be disabled' : 'Click to toggle active status'}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25'
                          } ${isRootSuper ? 'opacity-80 cursor-default' : ''}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                            }`}
                          ></span>
                          <span className="capitalize">{user.status}</span>
                        </button>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3.5 text-neutral-400 text-[11px]">
                        <div>
                          {user.createdAt
                            ? typeof user.createdAt.toDate === 'function'
                              ? user.createdAt.toDate().toLocaleDateString()
                              : new Date(user.createdAt).toLocaleDateString()
                            : 'System Default'}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          by {user.createdBy || 'Super Admin'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isRootSuper && (
                            <button
                              onClick={() => onDeleteUser(user.id)}
                              title="Delete Administrator Account"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold font-urbanist text-white">
                    Create New Administrator
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Grant administrative credentials to the Seelutions Headless CMS.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                  {formError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jordan Hayes"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Email / Username */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Email / Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. j.hayes@seelutions.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Account Role & Permissions <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setNewRole('admin')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newRole === 'admin'
                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/50'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🛡️</span>
                      <span className="text-xs font-bold text-white">Staff Admin</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      Can edit pages, blog, services & portfolio. Cannot manage deploy hooks or users.
                    </p>
                  </div>

                  <div
                    onClick={() => setNewRole('super')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newRole === 'super'
                        ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">👑</span>
                      <span className="text-xs font-bold text-amber-300">Super Admin</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      Full authority: can manage Vercel Deploy Hooks and create/delete other admin accounts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Passcode / Access Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Access Passcode <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generatePasscode}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    ⚡ Auto-Generate Passcode
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showFormPasscode ? 'text' : 'password'}
                    required
                    placeholder="Enter unique access passcode"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPasscode(!showFormPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showFormPasscode ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  The user will enter this passcode at the CMS sign-in screen.
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="radio"
                      name="status"
                      checked={newStatus === 'active'}
                      onChange={() => setNewStatus('active')}
                      className="text-cyan-500"
                    />
                    <span>Active (Can sign in)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="radio"
                      name="status"
                      checked={newStatus === 'disabled'}
                      onChange={() => setNewStatus('disabled')}
                      className="text-red-500"
                    />
                    <span>Disabled (Login blocked)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Administrator</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
