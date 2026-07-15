// Card Skeleton
export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-100 dark:border-surface-800">
        <div className="skeleton h-48 w-full rounded-xl mb-4" />
        <div className="skeleton h-4 w-3/4 rounded mb-2" />
        <div className="skeleton h-4 w-1/2 rounded mb-4" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 px-6 py-4 border-b border-surface-100 dark:border-surface-800">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton h-4 rounded flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 px-6 py-4 border-b border-surface-50 dark:border-surface-800/50 last:border-0">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="skeleton h-4 rounded flex-1" style={{ opacity: 1 - j * 0.1 }} />
        ))}
      </div>
    ))}
  </div>
);

// Stat Card Skeleton
export const StatSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-100 dark:border-surface-800">
        <div className="skeleton h-10 w-10 rounded-xl mb-4" />
        <div className="skeleton h-8 w-1/2 rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    ))}
  </div>
);

// Text Skeleton
export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton h-4 rounded"
        style={{ width: `${100 - i * 15}%` }}
      />
    ))}
  </div>
);

const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => (
  <div className={`skeleton rounded ${height} ${width} ${className}`} />
);

export default Skeleton;
