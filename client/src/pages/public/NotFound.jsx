import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHome } from 'react-icons/hi2';
import { ROUTES } from '../../constants';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-md"
    >
      <div className="text-8xl mb-6">🍽️</div>
      <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">
        Page Not Found
      </h2>
      <p className="text-surface-500 dark:text-surface-400 mb-8">
        Looks like this page went missing. Let's get you back to safety.
      </p>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
      >
        <HiOutlineHome size={18} />
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
