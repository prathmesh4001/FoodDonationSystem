import { useState } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
}) => {
  return (
    <div className={`relative ${className}`}>
      <HiMagnifyingGlass
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-9 py-2.5 rounded-xl text-sm
          bg-white
          border border-surface-200
          text-surface-900
          placeholder:text-surface-400
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          transition-all duration-200
        "
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 
                     hover:text-surface-600 dark:hover:text-surface-200 transition-colors cursor-pointer"
        >
          <HiXMark size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
