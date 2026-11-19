import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  Upload,
} from 'lucide-react';

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Photo upload states
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSubmitting, setPhotoSubmitting] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle Photo File Selection
  const handlePhotoSelect = (e) => {
    setPhotoError('');
    setPhotoSuccess('');
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError('Image size must be smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save selected photo
  const handleSavePhoto = async () => {
    if (!photoPreview) return;
    setPhotoSubmitting(true);
    setPhotoError('');
    setPhotoSuccess('');

    const result = await updateProfile({ avatar: photoPreview });
    setPhotoSubmitting(false);

    if (result.success) {
      setPhotoSuccess('Profile photo updated successfully!');
      setPhotoPreview(null);
    } else {
      setPhotoError(result.message || 'Failed to update profile photo.');
    }
  };

  // Remove existing photo
  const handleRemovePhoto = async () => {
    setPhotoSubmitting(true);
    setPhotoError('');
    setPhotoSuccess('');

    const result = await updateProfile({ avatar: '' });
    setPhotoSubmitting(false);

    if (result.success) {
      setPhotoSuccess('Profile photo removed.');
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setPhotoError(result.message || 'Failed to remove profile photo.');
    }
  };

  // Cancel photo preview
  const handleCancelPhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Name and Email updates
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!name.trim() || !email.trim()) {
      setProfileError('Name and email cannot be empty.');
      return;
    }

    setProfileSubmitting(true);
    const result = await updateProfile({ name, email });
    setProfileSubmitting(false);

    if (result.success) {
      setProfileSuccess('Profile information updated successfully!');
    } else {
      setProfileError(result.message || 'Failed to update profile.');
    }
  };

  // Handle Password changes
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSubmitting(true);
    const result = await updateProfile({
      currentPassword,
      newPassword,
    });
    setPasswordSubmitting(false);

    if (result.success) {
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setPasswordError(result.message || 'Failed to change password.');
    }
  };

  const currentDisplayAvatar = photoPreview || user?.avatar;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          Account & Profile Settings
        </h1>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {/* User Info Overview Banner with Avatar Upload */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar with Camera Trigger */}
        <div className="relative group">
          {currentDisplayAvatar ? (
            <img
              src={currentDisplayAvatar}
              alt={user?.name || 'User'}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl shadow-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0 border-4 border-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          {/* Quick upload camera overlay button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload new photo"
            className="absolute bottom-0 right-0 p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-transform hover:scale-110 cursor-pointer border-2 border-white"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Text and Actions */}
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
            <span>
              Member since: <strong className="text-slate-700">{formatDate(user?.createdAt)}</strong>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Verified User
            </span>
          </div>

          {/* Photo Actions Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Choose Photo</span>
            </button>

            {user?.avatar && !photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={photoSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}

            {photoPreview && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  disabled={photoSubmitting}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition"
                >
                  {photoSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Save Photo</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPhoto}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Photo feedback alerts */}
          {photoSuccess && (
            <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{photoSuccess}</span>
            </p>
          )}
          {photoError && (
            <p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{photoError}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Personal Details</h3>

          {profileSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileSubmitting}
              className="w-full mt-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {profileSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Update Details</span>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Security & Password</h3>

          {passwordSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSubmitting}
              className="w-full mt-4 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {passwordSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Changing Password...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
