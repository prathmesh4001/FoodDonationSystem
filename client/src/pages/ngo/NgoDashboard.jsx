import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { getNgoDashboard, getAvailableDonations } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { StatSkeleton, CardSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import { StatusBadge } from '../../components/common/Table';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';

const NgoDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, availRes] = await Promise.all([
        getNgoDashboard(),
        getAvailableDonations(),
      ]);
      setStats(dashRes.dashboard);
      setAvailable((availRes.donations || []).slice(0, 6));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (

    <div className="space-y-8">
      {/* Page Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
            fontSize: '22px',
            flexShrink: 0,
          }}>🏢</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', marginBottom: '2px' }}>
              Welcome, {profile?.name?.split(' ')[0] || 'NGO'} 👋
            </h1>
            <p style={{ fontSize: '13px', color: '#15803d', fontWeight: 500 }}>
              Manage your food claims and pickups.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? <StatSkeleton count={2} /> : (
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <StatCard
            title="Claimed"
            value={stats?.claimedDonations}
            icon={HiOutlineCheckCircle}
            variant="ngo"
          />
          <StatCard
            title="Delivered"
            value={stats?.deliveredDonations}
            icon={HiOutlineTruck}
            variant="ngo"
          />
        </div>
      )}


      {/* Available donations preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Available Donations
          </h2>
          <Link
            to={ROUTES.NGO_AVAILABLE}
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Browse all <HiOutlineArrowRight size={15} />
          </Link>
        </div>

        {loading ? <CardSkeleton count={3} /> : available.length === 0 ? (
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-12 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-surface-500 text-sm">All donations have been claimed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {available.map((d, idx) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-36 bg-surface-100 relative">
                  {d.image ? (
                    <img src={getImageUrl(d.image)} alt={d.foodName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍱</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={d.status} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-surface-900 text-sm mb-1">
                    {d.foodName}
                  </h3>
                  <p className="text-xs text-surface-400 mb-2">Qty: {d.quantity}{d.quantityUnit ? ` ${d.quantityUnit}` : ''} • {truncate(d.location, 22)}</p>
                  <Link
                    to={ROUTES.NGO_AVAILABLE}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    View & Claim →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoDashboard;
