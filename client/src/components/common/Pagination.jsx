import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-surface-200 dark:border-surface-700
                   text-surface-600 dark:text-surface-400
                   hover:bg-surface-100 dark:hover:bg-surface-800
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150 cursor-pointer"
      >
        <HiChevronLeft size={18} />
      </motion.button>

      {/* Page numbers */}
      {pages.map((page, idx) => (
        page === '...'
          ? (
            <span key={`dot-${idx}`} className="px-2 text-surface-400">...</span>
          ) : (
            <motion.button
              key={page}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`
                w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer
                ${currentPage === page
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }
              `}
            >
              {page}
            </motion.button>
          )
      ))}

      {/* Next */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-surface-200 dark:border-surface-700
                   text-surface-600 dark:text-surface-400
                   hover:bg-surface-100 dark:hover:bg-surface-800
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150 cursor-pointer"
      >
        <HiChevronRight size={18} />
      </motion.button>
    </div>
  );
};

export default Pagination;
