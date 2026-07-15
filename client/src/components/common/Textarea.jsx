import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  helper,
  className = '',
  containerClassName = '',
  required = false,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-xl border px-4 py-2.5 text-sm resize-none
          bg-white
          text-surface-900
          placeholder:text-surface-400
          transition-all duration-200
          ${error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-brand-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-xs text-surface-400">{helper}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
