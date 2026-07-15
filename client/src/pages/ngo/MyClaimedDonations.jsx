import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineCalendar,
} from 'react-icons/hi2';
import { getClaimedDonations, markAsDelivered } from '../../services/donationService';
import { getImageUrl, truncate, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Table';
import { CardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import Tracker from '../../components/common/Tracker';


const MyClaimedDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveringId, setDeliveringId] = useState(null);
  const [activeTrackerId, setActiveTrackerId] = useState(null);


  const fetchClaimed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClaimedDonations();
      const mine = (res.donations || []).filter((d) => {
        const ngoId = d.claimedBy?._id || d.claimedBy;
        return ngoId?.toString() === user?.id;
      });
      setDonations(mine);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load claimed donations');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchClaimed(); }, [fetchClaimed]);

  const handleDeliver = async (id) => {
    setDeliveringId(id);
    try {
      await markAsDelivered(id);
      toast.success('Marked as delivered! 🚚');
      fetchClaimed();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark as delivered');
    } finally {
      setDeliveringId(null);
    }
  };

  return (
    <div className="space-y-6">
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
          }}>🚚</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', marginBottom: '2px' }}>
              My Claimed Donations
            </h1>
            <p style={{ fontSize: '13px', color: '#15803d', fontWeight: 500 }}>
              {donations.length} donation{donations.length !== 1 ? 's' : ''} you've claimed
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchClaimed} />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No claimed donations"
          description="You haven't claimed any donations yet. Browse available donations to get started."
          icon={HiOutlineCheckCircle}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {donations.map((d, idx) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image section with gradient overlay for text readability */}
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#f1f5f9' }}>
                {d.image ? (
                  <img
                    src={getImageUrl(d.image)}
                    alt={d.foodName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🍱</div>
                )}

                {/* Dark gradient scrim at bottom — ensures food name is always readable */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '75px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%)',
                }} />

                {/* Food name overlay on image */}
                <div style={{
                  position: 'absolute', bottom: '10px', left: '12px', right: '56px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  lineHeight: 1.2,
                }}>
                  {d.foodName}
                </div>

                {/* Frosted-glass status badge — always visible over any food image */}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <StatusBadge status={d.status} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Description */}
                {d.description && (
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }} className="line-clamp-2">
                    {d.description}
                  </p>
                )}

                {/* Meta info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                    <HiOutlineMapPin size={13} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>{truncate(d.location, 32)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                    <HiOutlineClock size={13} style={{ color: '#d97706', flexShrink: 0 }} />
                    <span>Expires: {d.expiryTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                    <HiOutlineCalendar size={13} style={{ flexShrink: 0 }} />
                    <span>Claimed: {formatDate(d.updatedAt)}</span>
                  </div>
                </div>

                {/* Track Status toggle button */}
                <button
                  type="button"
                  onClick={() => setActiveTrackerId(activeTrackerId === d._id ? null : d._id)}
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                >
                  {activeTrackerId === d._id ? "Hide Tracking" : "Track Status"}
                </button>

                {/* Collapsible Tracker timeline */}
                {activeTrackerId === d._id && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '4px' }}>
                    <Tracker 
                      status={d.status} 
                      donatedAt={d.createdAt} 
                      updatedAt={d.updatedAt} 
                      claimedBy={d.claimedBy} 
                    />
                  </div>
                )}

                {/* Divider */}
                <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '10px' }} />

                {/* Action area */}
                {d.status === 'Claimed' && (
                  <Button
                    fullWidth
                    size="sm"
                    onClick={() => handleDeliver(d._id)}
                    loading={deliveringId === d._id}
                  >
                    <HiOutlineTruck size={15} />
                    Mark as Delivered
                  </Button>
                )}

                {d.status === 'Delivered' && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', color: '#16a34a', fontWeight: 600,
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: '8px', padding: '8px 12px',
                  }}>
                    <HiOutlineCheckCircle size={16} />
                    Delivered Successfully
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaimedDonations;
