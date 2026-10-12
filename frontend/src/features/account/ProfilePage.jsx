'use client'

import { useRef, useState } from 'react';
import { KeyRound, LockKeyhole, Mail, Pencil, UserRound } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import ChangePasswordModal from '@/features/auth/ChangePasswordModal';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '@/components/common/UserAvatar';
import { uploadAdminAvatar } from '@/services/authApi';

function ProfileDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500" aria-hidden="true">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isPreviewMode, updateProfileAvatar } = useAuth();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState(null);
  const avatarInputRef = useRef(null);

  const handleAvatarChange = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarFeedback({ type: 'error', message: 'Choose a PNG, JPG, or WebP image.' });
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarFeedback({ type: 'error', message: 'Choose an image smaller than 2 MB.' });
      input.value = '';
      return;
    }

    setAvatarUploading(true);
    setAvatarFeedback(null);
    try {
      const result = await uploadAdminAvatar(file);
      updateProfileAvatar(result.avatarUrl);
      setAvatarFeedback({ type: 'success', message: 'Profile image updated.' });
    } catch (error) {
      setAvatarFeedback({ type: 'error', message: error.message || 'Unable to update the profile image.' });
    } finally {
      setAvatarUploading(false);
      input.value = '';
    }
  };

  return (
    <>
      <PageHeader title="My Profile" subtitle="Your current user and account details." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="card overflow-hidden" aria-label="Profile summary">
          <div className="h-24 bg-gradient-to-r from-slate-900 via-blue-950 to-brand-700" />
          <div className="px-5 pb-5">
            <div className="relative -mt-10 h-20 w-20 overflow-visible">
              <UserAvatar name={user?.name} src={user?.avatarUrl} size="lg" className="border-4 border-white shadow-sm" />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                aria-label="Change profile image"
                title="Change profile image"
                className="absolute -bottom-1 -right-1 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#2636a8] text-white shadow-lg transition-colors hover:bg-[#232f86] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4560ec] disabled:cursor-wait disabled:opacity-70"
              >
                <Pencil className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="sr-only"
                aria-label="Upload a profile image"
              />
            </div>
            {avatarUploading && <p role="status" className="mt-2 text-xs text-slate-500">Uploading image…</p>}
            {avatarFeedback && (
              <p role={avatarFeedback.type === 'error' ? 'alert' : 'status'} className={`mt-2 text-xs ${avatarFeedback.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>
                {avatarFeedback.message}
              </p>
            )}
            <h2 className="mt-3 break-words text-lg font-semibold text-slate-900">{user?.name}</h2>
            <p className="mt-1 break-words text-sm text-slate-500">{user?.email}</p>
          </div>
        </section>

        <div className="space-y-5">
          <section className="card p-5 sm:p-6" aria-labelledby="profile-details-heading">
            <div className="mb-5">
              <h2 id="profile-details-heading" className="text-base font-semibold text-slate-900">Profile details</h2>
              <p className="mt-1 text-sm text-slate-500">Information for the signed-in account.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileDetail icon={UserRound} label="Current user" value={user?.name} />
              <ProfileDetail icon={Mail} label="Email or username" value={user?.email} />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" />
              {isPreviewMode ? 'Development preview session' : 'Secure session active'}
            </div>
          </section>

          <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6" aria-labelledby="password-security-heading">
            <div>
              <h2 id="password-security-heading" className="text-base font-semibold text-slate-900">Password &amp; security</h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">Request a secure, one-time email link to reset the password for this account.</p>
            </div>
            <Button type="button" variant="secondary" icon={KeyRound} onClick={() => setResetPasswordOpen(true)} className="shrink-0">
              Reset password
            </Button>
          </section>
        </div>
      </div>

      {resetPasswordOpen && (
        <ChangePasswordModal
          open
          onClose={() => setResetPasswordOpen(false)}
        />
      )}
    </>
  );
}
