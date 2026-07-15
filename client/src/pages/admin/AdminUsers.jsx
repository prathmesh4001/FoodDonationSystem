import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi2';
import { getAllUsers, deleteUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/helpers';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const ROLE_BADGES = {
  donor: { color: '#15803d', border: 'rgba(22,163,74,0.3)', bg: '#f0fdf4' },
  ngo:   { color: '#7c3aed', border: 'rgba(124,58,237,0.3)', bg: '#f5f3ff' },
  admin: { color: '#b91c1c', border: 'rgba(220,38,38,0.3)', bg: '#fef2f2' },
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
      });
      setUsers(res.users || []);
      setTotalPages(res.totalPages || 1);
      setTotalUsers(res.totalUsers || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteUser(deleteConfirm._id);
      toast.success('User deleted successfully.');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
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
          }}>👥</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e3a8a', marginBottom: '2px' }}>
              Manage Users
            </h1>
            <p style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 500 }}>
              {totalUsers} registered accounts on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search users by name, email, phone, or role..."
          className="flex-1"
        />
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search query." />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-100">
                    {['Name', 'Email', 'Phone', 'Role', 'Date Joined', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {users.map((u, idx) => {
                    const badge = ROLE_BADGES[u.role] || ROLE_BADGES.donor;
                    const isSelf = u._id === currentUser?.id;
                    return (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-surface-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                              {u.name ? u.name[0].toUpperCase() : 'U'}
                            </div>
                            <span className="font-semibold text-surface-900">
                              {u.name} {isSelf && <span className="text-xs font-normal text-surface-400 italic">(You)</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-surface-600 font-mono text-xs">{u.email}</td>
                        <td className="px-4 py-3 text-surface-600">{u.phone}</td>
                        <td className="px-4 py-3">
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '4px 12px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: badge.bg,
                              border: `1px solid ${badge.border}`,
                              color: badge.color,
                              textTransform: 'capitalize',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-surface-400 text-xs">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteConfirm(u)}
                            disabled={isSelf}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                            title={isSelf ? "You cannot delete yourself" : "Delete user"}
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {/* Delete User Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete User Account"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h3 className="font-semibold text-surface-900 text-base">Warning: Cascade Deletion</h3>
          <p className="text-surface-600 dark:text-surface-400 text-xs leading-relaxed">
            Are you sure you want to delete user <strong className="text-surface-900 dark:text-surface-100">{deleteConfirm?.name}</strong> ({deleteConfirm?.email})? 
            <br />
            Deleting this user will **permanently remove all donations** they created. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} loading={deleteLoading} fullWidth>
              Yes, Delete User
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

export default AdminUsers;
