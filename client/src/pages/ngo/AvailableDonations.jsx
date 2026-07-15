import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { searchDonations, claimDonation } from '../../services/donationService';
import { useDebounce } from '../../hooks/useDebounce';
import { getImageUrl, truncate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Table';
import { CardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import SearchBar from '../../components/common/SearchBar';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { SORT_OPTIONS, CATEGORY_OPTIONS } from '../../constants';

const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [claimingId, setClaimingId] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedLocation = useDebounce(location, 400);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchDonations({
        foodName: debouncedSearch,
        location: debouncedLocation,
        status: 'Available',
        sort,
        category: categoryFilter,
      });
      setDonations(res.donations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedLocation, sort, categoryFilter]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const handleClaim = async (id) => {
    setClaimingId(id);
    try {
      await claimDonation(id);
      toast.success('Donation claimed successfully! 🎉');
      setSelectedDonation(null);
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim donation');
    } finally {
      setClaimingId(null);
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
          }}>🥗</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', marginBottom: '2px' }}>
              Available Donations
            </h1>
            <p style={{ fontSize: '13px', color: '#15803d', fontWeight: 500 }}>
              {donations.length} donation{donations.length !== 1 ? 's' : ''} available for claiming
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by food name..."
          className="flex-1"
        />
        <Input
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          leftIcon={HiOutlineMapPin}
          className="sm:w-48"
        />
        <Select
          options={CATEGORY_OPTIONS}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="sm:w-44"
          placeholder="All Categories"
        />
        <Select
          options={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sm:w-40"
          placeholder="Sort by"
        />
      </div>

      {/* Content */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDonations} />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No donations available"
          description={search || location ? 'Try adjusting your search filters.' : 'No food donations are available right now.'}
          icon={HiOutlineMagnifyingGlass}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {donations.map((d, idx) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image */}
              <div className="h-44 bg-surface-100 relative overflow-hidden">
                {d.image ? (
                  <img src={getImageUrl(d.image)} alt={d.foodName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍱</div>
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={d.status} />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-surface-900 mb-0.5">
                    {d.foodName}
                  </h3>
                  {d.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {d.category}
                    </span>
                  )}
                  <p className="text-xs text-surface-500 line-clamp-2 mt-1">
                    {d.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <HiOutlineMapPin size={13} />
                    <span>{truncate(d.location, 32)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <HiOutlineClock size={13} />
                    <span>Expires: {d.expiryTime}</span>
                  </div>
                  {d.donor && (
                    <div className="flex items-center gap-1.5 text-xs text-surface-500">
                      <HiOutlineUser size={13} />
                      <span>{d.donor.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-surface-600">
                    Qty: <strong className="text-surface-900">{d.quantity}{d.quantityUnit ? ` ${d.quantityUnit}` : ''}</strong>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedDonation(d)}
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Claim Confirmation Modal */}
      <Modal
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        title="Claim Donation"
        size="sm"
      >
        {selectedDonation && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              {selectedDonation.image && (
                <img
                  src={getImageUrl(selectedDonation.image)}
                  alt={selectedDonation.foodName}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-surface-900 dark:text-surface-100">{selectedDonation.foodName}</p>
                <p className="text-xs text-surface-500 mt-0.5">Qty: {selectedDonation.quantity}{selectedDonation.quantityUnit ? ` ${selectedDonation.quantityUnit}` : ''} • {selectedDonation.location}</p>
              </div>
            </div>

            {selectedDonation.donor && (
              <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Donor Contact</p>
                <div className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
                  <HiOutlineUser size={14} /> {selectedDonation.donor.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
                  <HiOutlinePhone size={14} /> {selectedDonation.donor.phone}
                </div>
              </div>
            )}

            <p className="text-sm text-surface-600 dark:text-surface-400">
              By claiming this donation, you commit to picking it up and distributing it to those in need.
            </p>

            <div className="flex gap-3">
              <Button
                fullWidth
                loading={claimingId === selectedDonation._id}
                onClick={() => handleClaim(selectedDonation._id)}
              >
                Confirm Claim
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setSelectedDonation(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailableDonations;
