import { motion } from 'framer-motion';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Button from '../common/Button';

const ErrorState = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
  >
    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
      <HiOutlineExclamationTriangle size={32} className="text-red-500" />
    </div>
    <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-1">
      {title}
    </h3>
    {message && (
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">
        {message}
      </p>
    )}
    {onRetry && (
      <Button onClick={onRetry} variant="outline" size="md">
        Try Again
      </Button>
    )}
  </motion.div>
);

export default ErrorState;
