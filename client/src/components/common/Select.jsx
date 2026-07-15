import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  helper,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  required = false,
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
      <select
        ref={ref}
        className={`
          w-full rounded-xl border px-4 py-2.5 text-sm
          bg-white
          text-surface-900
          transition-all duration-200 cursor-pointer
          ${error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-surface-200 focus:border-brand-500 focus:ring-brand-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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

Select.displayName = 'Select';

export default Select;
