import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Gavel, ShieldCheck, AlertCircle, CheckCircle, XCircle, ArrowUpCircle, ChevronDown } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/auth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalAuctions: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('users');

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, requestsData] = await Promise.all([
          apiRequest('/api/users/stats', { headers }),
          apiRequest('/api/users', { headers }),
          apiRequest('/api/upgrade-requests', { headers }),
        ]);
        setStats(statsData);
        setAllUsers(usersData);
        setRequests(requestsData);
      } catch (err) {
        setError(err.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiRequest(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      setAllUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpgradeAction = async (requestId, status) => {
    try {
      await apiRequest(`/api/upgrade-requests/${requestId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
      // If approved, update the user list too
      if (status === 'approved') {
        const req = requests.find((r) => r._id === requestId);
        if (req) {
          setAllUsers((prev) =>
            prev.map((u) => (u._id === req.user._id ? { ...u, role: 'seller' } : u))
          );
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-secondary text-sm font-semibold uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-text-secondary text-sm">Welcome back, {user?.name}. Here's what's happening on BidNest.</p>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-text-primary">{stats.totalUsers}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Gavel className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Auctions</p>
            <h3 className="text-3xl font-bold text-text-primary">{stats.totalAuctions}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Pending Requests</p>
            <h3 className="text-3xl font-bold text-text-primary">{pendingCount}</h3>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-white rounded-xl border border-border w-fit">
          <button
            onClick={() => setTab('users')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              tab === 'users' ? 'bg-accent text-white shadow-soft' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Users ({allUsers.length})
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              tab === 'requests' ? 'bg-accent text-white shadow-soft' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Upgrade Requests
            {pendingCount > 0 && (
              <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                tab === 'requests' ? 'bg-white text-accent' : 'bg-amber-100 text-amber-700'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg-primary">
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">User</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Email</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Role</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Joined</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u._id} className="border-b border-border/50 hover:bg-bg-primary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-text-primary">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{u.email}</td>
                      <td className="px-6 py-4">{roleBadge(u.role)}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {u.role !== 'admin' ? (
                          <div className="relative">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="appearance-none w-full pl-3 pr-8 py-2 rounded-lg border border-border bg-bg-primary text-xs font-semibold text-text-primary cursor-pointer focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                            >
                              <option value="bidder">Bidder</option>
                              <option value="seller">Seller</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
                          </div>
                        ) : (
                          <span className="text-xs text-text-secondary italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Upgrade Requests Tab */}
        {tab === 'requests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-soft">
                <ArrowUpCircle className="w-10 h-10 text-text-secondary mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium text-text-primary">No upgrade requests yet</p>
                <p className="text-xs text-text-secondary mt-1">Requests from bidders will appear here</p>
              </div>
            ) : (
              requests.map((r) => (
                <div key={r._id} className="bg-white rounded-2xl border border-border p-6 shadow-soft">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {r.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{r.user?.name}</p>
                          <p className="text-xs text-text-secondary">{r.user?.email}</p>
                        </div>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                          r.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : r.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="ml-12 mt-2 p-3 rounded-lg bg-bg-primary border border-border">
                        <p className="text-sm text-text-secondary italic">"{r.message}"</p>
                      </div>
                      <p className="ml-12 text-[10px] text-text-secondary mt-2">
                        Submitted {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {r.status === 'pending' && (
                      <div className="flex gap-2 sm:flex-col ml-12 sm:ml-0">
                        <button
                          onClick={() => handleUpgradeAction(r._id, 'approved')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleUpgradeAction(r._id, 'rejected')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
