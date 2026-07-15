import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineGift,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlinePlusCircle,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import { getDonorDashboard, getAllDonations } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { StatSkeleton, TableSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import { StatusBadge } from '../../components/common/Table';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';
import { ROUTES } from '../../constants';

const DonorDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, donationsRes] = await Promise.all([
        getDonorDashboard(),
        getAllDonations({ page: 1, limit: 5, sort: 'newest' }),
      ]);
      setStats(dashRes.dashboard);
      setRecentDonations(donationsRes.donations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
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
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
          border: '1px solid #fed7aa',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(234,88,12,0.3)',
              fontSize: '22px',
              flexShrink: 0,
            }}>🎁</div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#7c2d12', marginBottom: '2px' }}>
                Welcome back, {profile?.name?.split(' ')[0] || 'Donor'} 👋
              </h1>
              <p style={{ fontSize: '13px', color: '#c2410c', fontWeight: 500 }}>
                Here's an overview of your food donation activity.
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.DONOR_ADD_DONATION}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '12px',
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(234,88,12,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(234,88,12,0.45)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(234,88,12,0.35)'; }}
          >
            <HiOutlinePlusCircle size={18} />
            Add Donation
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <StatSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Donations"
            value={stats?.totalDonations}
            icon={HiOutlineGift}
            variant="donor"
          />
          <StatCard
            title="Available"
            value={stats?.availableDonations}
            icon={HiOutlineClipboardDocumentList}
            variant="donor"
          />
          <StatCard
            title="Claimed"
            value={stats?.claimedDonations}
            icon={HiOutlineCheckCircle}
            variant="donor"
          />
          <StatCard
            title="Delivered"
            value={stats?.deliveredDonations}
            icon={HiOutlineTruck}
            variant="donor"
          />
        </div>
      )}


      {/* Recent Donations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Recent Donations
          </h2>
          <Link
            to={ROUTES.DONOR_MY_DONATIONS}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : recentDonations.length === 0 ? (
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-12 text-center">
            <div className="text-4xl mb-3">🍱</div>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              No donations yet.{' '}
              <Link to={ROUTES.DONOR_ADD_DONATION} className="text-brand-600 font-medium">Add your first donation!</Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white border-b border-surface-100">
                    {['Food', 'Qty', 'Location', 'Expiry', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {recentDonations.map((d) => (
                    <tr key={d._id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {d.image && (
                            <img
                              src={getImageUrl(d.image)}
                              alt={d.foodName}
                              className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span className="font-medium text-surface-900">
                            {truncate(d.foodName, 25)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-surface-700">{d.quantity}{d.quantityUnit ? ` ${d.quantityUnit}` : ''}</td>
                      <td className="px-4 py-3 text-surface-700">{truncate(d.location, 20)}</td>
                      <td className="px-4 py-3 text-surface-700">{d.expiryTime}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-4 py-3 text-surface-500">{formatDate(d.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
