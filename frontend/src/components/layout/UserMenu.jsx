'use client'

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, KeyRound, LogOut, UserRound, ChevronRight, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ROLE_META } from '@/config/roles';
import useClickOutside from '@/hooks/useClickOutside';
import ChangePasswordModal from '@/features/auth/ChangePasswordModal';
import ForgotPasswordModal from '@/features/auth/ForgotPasswordModal';
import UserAvatar from '@/components/common/UserAvatar';

export default function UserMenu({ dropUp = false }) {
  const { user, role, logout, isPreviewMode, switchPreviewRole } = useAuth();
  const hideDemoIdentity = user.id === 'admin-demo';
  const toast = useToast();
  const router = useRouter();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  useClickOutside(ref, () => setOpen(false), open);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      setConfirmLogout(false);
      toast.success('Signed out', 'Your admin session has ended.');
      router.replace('/login');
      router.refresh();
    } catch {
      toast.error('Sign out failed', 'Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const requestLogout = () => {
    setOpen(false);
    setConfirmLogout(true);
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label={`Open profile menu for ${user.name}`} className="group flex cursor-pointer items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <UserAvatar name={user.name} src={user.avatarUrl} size="sm" className="ring-2 ring-white shadow-sm" />
          <span className="min-w-0 max-w-[6.5rem] text-left leading-tight sm:max-w-[9rem] md:max-w-none">
            <span className="block truncate text-sm font-medium text-slate-900">{user.name}</span>
            <span className="block truncate text-xs text-slate-500">{ROLE_META[role].short}</span>
          </span>
          <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform group-hover:text-slate-600', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className={cn('scroll-thin absolute right-0 z-50 max-h-[calc(100dvh-5rem)] w-72 max-w-[calc(100vw-2rem)] animate-fade-in overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white shadow-pop sm:w-80', dropUp ? 'bottom-full mb-2' : 'top-full mt-2')}>
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-4">
            <UserAvatar name={user.name} src={user.avatarUrl} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              {!hideDemoIdentity && user.email && (
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              )}
            </div>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mx-3 mb-2 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700" aria-hidden="true">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-slate-800">Current User</span>
              <span className="block truncate text-xs text-slate-700">{user.name}</span>
              {!hideDemoIdentity && user.email && (
                <span className="block truncate text-xs text-slate-500">{user.email}</span>
              )}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          </Link>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
          >
            <UserRound className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>My Profile</span>
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); setPasswordDialog('reset'); }}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
          >
            <KeyRound className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Reset Password</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); setPasswordDialog('forgot'); }}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
          >
            <Mail className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Forgot Password</span>
          </button>
          {isPreviewMode && (
            <div className="max-h-72 overflow-y-auto border-t border-slate-100 p-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Switch preview role</p>
              {Object.entries(ROLE_META).map(([roleKey, meta]) => (
                <button
                  type="button"
                  key={roleKey}
                  onClick={() => { switchPreviewRole(roleKey); setOpen(false); }}
                  role="menuitem"
                  className={cn('flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50', role === roleKey ? 'font-semibold text-brand-700' : 'text-slate-700')}
                >
                  <span>{meta.label}</span>
                  {role === roleKey && <Check className="h-4 w-4" aria-label="Current role" />}
                </button>
              ))}
            </div>
          )}
          <button type="button" onClick={requestLogout} role="menuitem" className="flex w-full cursor-pointer items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmLogout}
        title="Log out of your workspace?"
        message="Your secure session will end on this device. You can sign in again at any time."
        confirmLabel="Logout"
        cancelLabel="Stay signed in"
        tone="danger"
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => { if (!loggingOut) setConfirmLogout(false); }}
      />
      {passwordDialog === 'reset' && (
        <ChangePasswordModal
          open
          onClose={() => setPasswordDialog(null)}
        />
      )}
      {passwordDialog === 'forgot' && (
        <ForgotPasswordModal
          open
          onClose={() => setPasswordDialog(null)}
          initialEmail={user.email || ''}
          title="Forgot Password"
          successButtonLabel="Close"
        />
      )}
    </div>
  );
}


