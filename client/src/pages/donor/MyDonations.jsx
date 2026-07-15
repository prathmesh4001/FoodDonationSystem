import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePlusCircle,
  HiOutlineMapPin,
  HiOutlineClock,
} from 'react-icons/hi2';
import { getAllDonations, deleteDonation, updateDonation } from '../../services/donationService';
import { donationSchema } from '../../types/schemas';
import { useDebounce } from '../../hooks/useDebounce';
import { SORT_OPTIONS, DEFAULT_PAGE_LIMIT, CATEGORY_FORM_OPTIONS, UNIT_OPTIONS_BY_CATEGORY } from '../../constants';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Table';
import { TableSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import EmptyState from '../../components/feedback/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Tracker from '../../components/common/Tracker';


const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDonations, setTotalDonations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingDonation, setEditingDonation] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTrackerId, setActiveTrackerId] = useState(null);


  const debouncedSearch = useDebounce(search, 400);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(donationSchema),
  });

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllDonations({
        page: currentPage,
        limit: DEFAULT_PAGE_LIMIT,
        sort,
        search: debouncedSearch,
        status: statusFilter,
      });
      setDonations(res.donations || []);
      setTotalPages(res.totalPages || 1);
      setTotalDonations(res.totalDonations || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, debouncedSearch, statusFilter]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, sort, statusFilter]);

  const openEdit = (donation) => {
    setEditingDonation(donation);
    setPreviewImage(null);
    setEditCategory(donation.category || 'Other');
    reset({
      foodName: donation.foodName,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit || 'servings',
      category: donation.category || 'Other',
      location: donation.location,
      expiryTime: donation.expiryTime,
      description: donation.description,
    });
  };

  const handleEdit = async (data) => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (previewImage?.file) formData.append('image', previewImage.file);
      await updateDonation(editingDonation._id, formData);
      toast.success('Donation updated successfully!');
      setEditingDonation(null);
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDonation(deleteConfirm._id);
      toast.success('Donation deleted.');
      setDeleteConfirm(null);
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage({ file, url: URL.createObjectURL(file) });
  };

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Available', value: 'Available' },
    { label: 'Claimed', value: 'Claimed' },
    { label: 'Delivered', value: 'Delivered' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
          border: '1px solid #fed7aa',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(234,88,12,0.3)',
            fontSize: '22px',
            flexShrink: 0,
          }}>🍱</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#7c2d12', marginBottom: '2px' }}>
              My Donations
            </h1>
            <p style={{ fontSize: '13px', color: '#c2410c', fontWeight: 500 }}>
              {totalDonations} donation{totalDonations !== 1 ? 's' : ''} total
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
        <Select
          options={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sm:w-48"
          placeholder="Sort by"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-40"
          placeholder="All Status"
        />
      </div>

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDonations} />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No donations found"
          description={search ? "No results match your search." : "You haven't added any donations yet."}
        />
      ) : (
        <>
          {/* Donation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {donations.map((d, idx) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Image */}
                <div className="h-44 bg-surface-100 relative overflow-hidden">
                  {d.image ? (
                    <img
                      src={getImageUrl(d.image)}
                      alt={d.foodName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍱</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={d.status} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold text-surface-900 mb-1">
                    {d.foodName}
                  </h3>
                  {d.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 mb-2">
                      {d.category}
                    </span>
                  )}
                  <p className="text-xs text-surface-500 mb-3 line-clamp-2">
                    {d.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-surface-500">
                      <HiOutlineMapPin size={13} /> {truncate(d.location, 30)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-surface-500">
                      <HiOutlineClock size={13} /> Expires: {d.expiryTime}
                    </div>
                  </div>

                  {/* Track Status button */}
                  <button
                    type="button"
                    onClick={() => setActiveTrackerId(activeTrackerId === d._id ? null : d._id)}
                    className="w-full text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 py-2.5 rounded-xl transition-all duration-200 mb-4 flex items-center justify-center gap-1.5 cursor-pointer dark:bg-surface-800 dark:text-brand-400 dark:hover:bg-surface-700"
                  >
                    {activeTrackerId === d._id ? "Hide Tracking" : "Track Status"}
                  </button>

                  {/* Collapsible Tracker */}
                  {activeTrackerId === d._id && (
                    <div className="border-t border-surface-100 dark:border-surface-800 pt-3 pb-2 mb-4">
                      <Tracker 
                        status={d.status} 
                        donatedAt={d.createdAt} 
                        updatedAt={d.updatedAt} 
                        claimedBy={d.claimedBy} 
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-surface-400">{formatDate(d.createdAt)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(d)}
                        disabled={d.status !== 'Available'}
                        title={d.status !== 'Available' ? 'Cannot edit after claiming' : 'Edit donation'}
                        className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <HiOutlinePencilSquare size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(d)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDonation}
        onClose={() => setEditingDonation(null)}
        title="Edit Donation"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Food Name"
              error={errors.foodName?.message}
              required
              {...register('foodName')}
            />

            {/* Quantity + Unit combo */}
            <div>
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300 block mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>

              {/* Number input */}
              <input
                type="number"
                min="1"
                placeholder="Enter quantity  e.g. 5, 20, 100"
                style={{
                  width: '100%',
                  border: '1.5px solid',
                  borderColor: errors.quantity ? '#ef4444' : '#e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  background: 'transparent',
                  outline: 'none',
                  color: 'inherit',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                className="dark:border-surface-700"
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mb-1">⚠ {errors.quantity.message}</p>
              )}

              {/* Unit dropdown */}
              <select
                style={{
                  width: '100%',
                  border: '1.5px solid',
                  borderColor: errors.quantityUnit ? '#ef4444' : '#e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                className="dark:border-surface-700"
                {...register('quantityUnit')}
              >
                {(UNIT_OPTIONS_BY_CATEGORY[editCategory] || UNIT_OPTIONS_BY_CATEGORY['Other']).map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              {errors.quantityUnit && !errors.quantity && (
                <p className="text-xs text-red-500 mt-1">⚠ {errors.quantityUnit.message}</p>
              )}
            </div>


            <Select
              label="Food Category"
              options={CATEGORY_FORM_OPTIONS}
              error={errors.category?.message}
              required
              {...register('category', {
                onChange: (e) => setEditCategory(e.target.value),
              })}
            />
            <Input
              label="Location"
              error={errors.location?.message}
              required
              {...register('location')}
            />
            <Input
              label="Expiry Time"
              placeholder="e.g. 2 hours, Tomorrow 6pm"
              error={errors.expiryTime?.message}
              required
              {...register('expiryTime')}
            />
          </div>
          <Textarea
            label="Description"
            rows={3}
            error={errors.description?.message}
            required
            {...register('description')}
          />

          {/* Image update */}
          <div>
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300 block mb-2">
              Update Image (optional)
            </label>
            {previewImage ? (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-2">
                <img src={previewImage.url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-lg px-2 py-1 text-xs cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : editingDonation?.image && (
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2">
                <img src={getImageUrl(editingDonation.image)} alt="current" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              onChange={handleImageChange}
              className="text-sm text-surface-600 dark:text-surface-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={editLoading} fullWidth>
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditingDonation(null)} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Donation"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">🗑️</div>
          <p className="text-surface-600 dark:text-surface-400 text-sm">
            Are you sure you want to delete <strong className="text-surface-900 dark:text-surface-100">{deleteConfirm?.foodName}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} loading={deleteLoading} fullWidth>
              Yes, Delete
            </Button>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyDonations;
