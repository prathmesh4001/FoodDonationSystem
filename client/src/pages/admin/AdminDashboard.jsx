import { useEffect, useState } from 'react';
import {
  HiOutlineUsers,
  HiOutlineGift,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { getAdminDashboard } from '../../services/donationService';
import StatCard from '../../components/common/StatCard';
import { StatSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import { motion } from 'framer-motion';

const PIE_COLORS = ['#22c55e', '#f59e0b', '#3b82f6'];
const BAR_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminDashboard();
      setStats(res.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (error) return <ErrorState message={error} onRetry={fetchStats} />;

  // Prepare chart data
  const donationStatusData = stats ? [
    { name: 'Available', value: stats.availableDonations, color: '#22c55e' },
    { name: 'Claimed', value: stats.claimedDonations, color: '#f59e0b' },
    { name: 'Delivered', value: stats.deliveredDonations, color: '#3b82f6' },
  ] : [];

  const userBreakdownData = stats ? [
    { name: 'Donors', value: stats.totalDonors },
    { name: 'NGOs', value: stats.totalNGOs },
    { name: 'Admins', value: stats.totalAdmins },
  ] : [];

  const overviewBarData = stats ? [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Donors', value: stats.totalDonors },
    { label: 'NGOs', value: stats.totalNGOs },
    { label: 'Total Donations', value: stats.totalDonations },
    { label: 'Available', value: stats.availableDonations },
    { label: 'Claimed', value: stats.claimedDonations },
    { label: 'Delivered', value: stats.deliveredDonations },
  ] : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 rounded-xl px-3 py-2 shadow-lg text-sm">
          <p className="font-medium text-surface-900 dark:text-surface-100">{label || payload[0].name}</p>
          <p className="text-brand-600">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
          border: '1px solid #93c5fd',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            fontSize: '22px',
            flexShrink: 0,
          }}>👑</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e3a8a', marginBottom: '2px' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 500 }}>
              Full platform overview and analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? <StatSkeleton count={8} /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats?.totalUsers} icon={HiOutlineUsers} variant="admin" />
          <StatCard title="Donors" value={stats?.totalDonors} icon={HiOutlineUserGroup} variant="admin" />
          <StatCard title="NGOs" value={stats?.totalNGOs} icon={HiOutlineBuildingOffice2} variant="admin" />
          <StatCard title="Admins" value={stats?.totalAdmins} icon={HiOutlineShieldCheck} variant="admin" />
          <StatCard title="Total Donations" value={stats?.totalDonations} icon={HiOutlineGift} variant="admin" />
          <StatCard title="Available" value={stats?.availableDonations} icon={HiOutlineClipboardDocumentList} variant="admin" />
          <StatCard title="Claimed" value={stats?.claimedDonations} icon={HiOutlineCheckCircle} variant="admin" />
          <StatCard title="Delivered" value={stats?.deliveredDonations} icon={HiOutlineTruck} variant="admin" />
        </div>
      )}

      {/* Charts */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Status Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-surface-100 p-6"
          >
            <h3 className="text-base font-semibold text-surface-900 mb-6">
              Donation Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={donationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name} (${value})` : ''}
                >
                  {donationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-surface-600 dark:text-surface-400">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* User Breakdown Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-surface-100 p-6"
          >
            <h3 className="text-base font-semibold text-surface-900 mb-6">
              User Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userBreakdownData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {userBreakdownData.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Full overview bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-surface-100 p-6"
          >
            <h3 className="text-base font-semibold text-surface-900 mb-6">
              Platform Overview
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overviewBarData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
