import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Gavel, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/auth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalAuctions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/users/stats', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        });
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch platform stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Users Stat Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-text-primary">{stats.totalUsers}</h3>
            </div>
          </motion.div>

          {/* Auctions Stat Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Gavel className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Auctions</p>
              <h3 className="text-3xl font-bold text-text-primary">{stats.totalAuctions}</h3>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
