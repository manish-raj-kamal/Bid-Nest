import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, CheckCircle, AlertCircle, ArrowUpCircle, Clock, XCircle, Mail } from 'lucide-react';
import { useAuth } from '../context/auth';
import { apiRequest } from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Upgrade request state
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [existingRequest, setExistingRequest] = useState(null);
  const [upgradeMsg, setUpgradeMsg] = useState('');
  const [upgradeErr, setUpgradeErr] = useState('');
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'bidder') {
      apiRequest('/api/upgrade-requests/me', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((data) => setExistingRequest(data))
        .catch(() => {});
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErr('');
    setProfileMsg('');
    setProfileLoading(true);
    try {
      const data = await apiRequest('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name }),
      });
      updateUser(data);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileErr(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwErr('');
    setPwMsg('');

    if (newPassword !== confirmPassword) {
      setPwErr('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwErr('New password must be at least 6 characters');
      return;
    }

    setPwLoading(true);
    try {
      const data = await apiRequest('/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMsg(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwErr(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  const handleUpgradeRequest = async (e) => {
    e.preventDefault();
    setUpgradeErr('');
    setUpgradeMsg('');

    if (!upgradeMessage.trim()) {
      setUpgradeErr('Please write a message');
      return;
    }

    setUpgradeLoading(true);
    try {
      const data = await apiRequest('/api/upgrade-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: upgradeMessage.trim() }),
      });
      setExistingRequest(data);
      setUpgradeMsg('Request submitted successfully!');
      setUpgradeMessage('');
    } catch (err) {
      setUpgradeErr(err.message);
    } finally {
      setUpgradeLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Pending' },
      approved: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'Approved' },
      rejected: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Rejected' },
    };
    const s = map[status] || map.pending;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${s.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {s.label}
      </span>
    );
  };

  const roleBadge = (role) => {
    const map = {
      bidder: 'bg-blue-50 text-blue-700 border-blue-200',
      seller: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      admin: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${map[role] || map.bidder}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">My Profile</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-text-secondary text-sm">Manage your account details</p>
            {roleBadge(user?.role)}
          </div>
        </motion.div>

        <div className="space-y-8">

          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Profile Information</h2>
            </div>

            {profileMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" /> {profileMsg}
              </div>
            )}
            {profileErr && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {profileErr}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-bg-secondary text-sm text-text-secondary cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark shadow-soft transition-all disabled:opacity-60 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>

          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Change Password</h2>
            </div>

            {pwMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" /> {pwMsg}
              </div>
            )}
            {pwErr && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {pwErr}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark shadow-soft transition-all disabled:opacity-60 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                {pwLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </motion.div>

          {/* Upgrade Request Card (bidder only) */}
          {user?.role === 'bidder' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ArrowUpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">Request Seller Account</h2>
              </div>

              {existingRequest && existingRequest.status === 'pending' ? (
                <div className="p-5 rounded-xl bg-bg-primary border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-text-primary">Your Request</p>
                    {statusBadge(existingRequest.status)}
                  </div>
                  <p className="text-sm text-text-secondary italic">"{existingRequest.message}"</p>
                  <p className="text-xs text-text-secondary mt-3">Submitted {new Date(existingRequest.createdAt).toLocaleDateString()}</p>
                </div>
              ) : existingRequest && existingRequest.status === 'rejected' ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-red-50/50 border border-red-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-text-primary">Previous Request</p>
                      {statusBadge(existingRequest.status)}
                    </div>
                    <p className="text-sm text-text-secondary italic">"{existingRequest.message}"</p>
                    {existingRequest.adminNote && (
                      <p className="text-xs text-red-600 mt-2">Admin: {existingRequest.adminNote}</p>
                    )}
                  </div>

                  {/* Allow re-submit after rejection */}
                  {upgradeMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" /> {upgradeMsg}
                    </div>
                  )}
                  {upgradeErr && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {upgradeErr}
                    </div>
                  )}
                  <form onSubmit={handleUpgradeRequest} className="space-y-4">
                    <textarea
                      value={upgradeMessage}
                      onChange={(e) => setUpgradeMessage(e.target.value)}
                      placeholder="Tell us why you'd like to become a seller..."
                      maxLength={500}
                      rows={3}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                    />
                    <button
                      type="submit"
                      disabled={upgradeLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark shadow-soft transition-all disabled:opacity-60 cursor-pointer"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      {upgradeLoading ? 'Submitting...' : 'Submit New Request'}
                    </button>
                  </form>
                </div>
              ) : existingRequest && existingRequest.status === 'approved' ? (
                <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-text-primary">Your Request</p>
                    {statusBadge(existingRequest.status)}
                  </div>
                  <p className="text-sm text-emerald-700">Your account has been upgraded! Please log out and log back in to access seller features.</p>
                </div>
              ) : (
                <>
                  {upgradeMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" /> {upgradeMsg}
                    </div>
                  )}
                  {upgradeErr && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {upgradeErr}
                    </div>
                  )}
                  <p className="text-sm text-text-secondary mb-4">
                    Want to sell items on BidNest? Send a request to our admin team explaining why you'd like to become a seller.
                  </p>
                  <form onSubmit={handleUpgradeRequest} className="space-y-4">
                    <textarea
                      value={upgradeMessage}
                      onChange={(e) => setUpgradeMessage(e.target.value)}
                      placeholder="Tell us why you'd like to become a seller..."
                      maxLength={500}
                      rows={3}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">{upgradeMessage.length}/500 characters</span>
                      <button
                        type="submit"
                        disabled={upgradeLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark shadow-soft transition-all disabled:opacity-60 cursor-pointer"
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                        {upgradeLoading ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
