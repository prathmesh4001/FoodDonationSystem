import { motion } from 'framer-motion';
import { HiOutlineInboxStack } from 'react-icons/hi2';
import Button from '../common/Button';

const EmptyState = ({
  icon: Icon = HiOutlineInboxStack,
  title = 'Nothing here yet',
  description = 'No data available at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
  >
    <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
      <Icon size={32} className="text-surface-400 dark:text-surface-500" />
    </div>
    <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-1">
      {title}
    </h3>
    <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs mb-6">
      {description}
    </p>
    {actionLabel && onAction && (
      <Button onClick={onAction} variant="primary" size="md">
        {actionLabel}
      </Button>
    )}
  </motion.div>
);

export default EmptyState;
