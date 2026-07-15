import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { getAllDonations, deleteDonation, updateDonation } from '../../services/donationService';
import { donationSchema } from '../../types/schemas';
import { useDebounce } from '../../hooks/useDebounce';
import { SORT_OPTIONS, DEFAULT_PAGE_LIMIT, CATEGORY_OPTIONS, CATEGORY_FORM_OPTIONS, UNIT_OPTIONS_BY_CATEGORY } from '../../constants';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Table';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Available', value: 'Available' },
  { label: 'Claimed', value: 'Claimed' },
  { label: 'Delivered', value: 'Delivered' },
];

const AllDonations = () => {
  const [donations, setDonations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonations, setTotalDonations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals state
  const [editingDonation, setEditingDonation] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
        category: categoryFilter,
      });
      setDonations(res.donations || []);
      setTotalPages(res.totalPages || 1);
      setTotalDonations(res.totalDonations || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, sort, statusFilter, categoryFilter]);

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

  return (
    <div className="space-y-6">
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
          }}>📊</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e3a8a', marginBottom: '2px' }}>
              All Donations
            </h1>
            <p style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 500 }}>
              {totalDonations} total donations across all users
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
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-36"
        />
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDonations} />
      ) : donations.length === 0 ? (
        <EmptyState title="No donations found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-100">
                    {['Food', 'Category', 'Donor', 'Qty', 'Location', 'Expiry', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {donations.map((d, idx) => (
                    <motion.tr
                      key={d._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {d.image && (
                            <img
                              src={getImageUrl(d.image)}
                              alt={d.foodName}
                              className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                            />
                          )}
                          <span className="font-medium text-surface-900">
                            {truncate(d.foodName, 22)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {d.category ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 whitespace-nowrap">
                            {d.category}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-surface-700">
                        {d.donor?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-surface-700">{d.quantity}{d.quantityUnit ? ` ${d.quantityUnit}` : ''}</td>
                      <td className="px-4 py-3 text-surface-700">{truncate(d.location, 20)}</td>
                      <td className="px-4 py-3 text-surface-700">{d.expiryTime}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-4 py-3 text-surface-400 text-xs">{formatDate(d.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(d)}
                            className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                            title="Edit donation"
                          >
                            <HiOutlinePencilSquare size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(d)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                            title="Delete donation"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDonation}
        onClose={() => setEditingDonation(null)}
        title="Edit Donation (Admin Control)"
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
        title="Delete Donation (Admin Control)"
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

export default AllDonations;

