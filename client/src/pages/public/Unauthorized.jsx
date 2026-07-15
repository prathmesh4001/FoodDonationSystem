import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShieldExclamation, HiOutlineArrowLeft } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, getRoleRedirect } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <HiOutlineShieldExclamation size={40} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
          Access Denied
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8">
          You don't have permission to view this page. Please navigate to your dashboard.
        </p>
        <button
          onClick={() => navigate(user ? getRoleRedirect(user.role) : '/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface-900 dark:bg-white text-white dark:text-surface-900 font-semibold rounded-xl transition-colors hover:opacity-90 shadow-sm"
        >
          <HiOutlineArrowLeft size={18} />
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
