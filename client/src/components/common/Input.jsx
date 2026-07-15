import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helper,
  className = '',
  containerClassName = '',
  required = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}, ref) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className={containerClassName}>
      {label && (
        <label
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-body)',
          }}
        >
          {label}
          {required && <span style={{ color: '#dc2626', marginLeft: '3px' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {LeftIcon && (
          <div
            style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center',
            }}
          >
            <LeftIcon size={16} />
          </div>
        )}

        <input
          ref={ref}
          style={{
            width: '100%',
            borderRadius: '9px',
            border: `1.5px solid ${error ? '#ef4444' : 'var(--border-default)'}`,
            padding: `10px ${RightIcon ? '40px' : '14px'} 10px ${LeftIcon ? '40px' : '14px'}`,
            fontSize: '14px',
            background: 'var(--bg-input)',
            color: 'var(--text-body)',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? '#ef4444' : 'var(--color-primary)';
            e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.12)' : '0 0 0 3px rgba(22,163,74,0.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#ef4444' : 'var(--border-default)';
            e.target.style.boxShadow = 'none';
          }}
          className={className}
          {...props}
        />

        {RightIcon && (
          <div
            style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center',
            }}
          >
            <RightIcon size={16} />
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⚠</span> {error}
        </p>
      )}
      {helper && !error && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
