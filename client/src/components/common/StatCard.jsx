import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendLabel,
  description,
  className = '',
  variant, // 'ngo' | 'donor' | 'admin'
}) => {
  const isPositive = trend > 0;

  // Theme variable fallbacks
  let cardBg = 'var(--bg-card)';
  let cardBorder = '1px solid var(--border-card)';
  let valueColor = 'var(--text-heading)';
  let titleColor = 'var(--text-body)';
  let cardShadow = 'var(--shadow-card)';
  let resolvedIconBg = iconBg || 'rgba(22,163,74,0.12)';
  let resolvedIconColor = iconColor || '#16a34a';

  if (variant === 'ngo') {
    cardBg = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
    cardBorder = '1px solid #86efac';
    valueColor = '#14532d';
    titleColor = '#166534';
    cardShadow = '0 4px 20px 0 rgba(22, 163, 74, 0.08)';
    resolvedIconBg = 'linear-gradient(135deg, #16a34a, #15803d)';
    resolvedIconColor = '#ffffff';
  } else if (variant === 'donor') {
    cardBg = 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)';
    cardBorder = '1px solid #fdba74';
    valueColor = '#7c2d12';
    titleColor = '#9a3412';
    cardShadow = '0 4px 20px 0 rgba(234, 88, 12, 0.08)';
    resolvedIconBg = 'linear-gradient(135deg, #ea580c, #c2410c)';
    resolvedIconColor = '#ffffff';
  } else if (variant === 'admin') {
    cardBg = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    cardBorder = '1px solid #93c5fd';
    valueColor = '#1e3a8a';
    titleColor = '#1e40af';
    cardShadow = '0 4px 20px 0 rgba(37, 99, 235, 0.08)';
    resolvedIconBg = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
    resolvedIconColor = '#ffffff';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow:
          variant === 'ngo'
            ? '0 12px 30px -4px rgba(22, 163, 74, 0.12)'
            : variant === 'donor'
            ? '0 12px 30px -4px rgba(234, 88, 12, 0.12)'
            : variant === 'admin'
            ? '0 12px 30px -4px rgba(37, 99, 235, 0.12)'
            : 'var(--shadow-card-hover)',
      }}
      transition={{ duration: 0.25 }}
      style={{
        background: cardBg,
        border: cardBorder,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: cardShadow,
        cursor: 'pointer',
      }}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div
          style={{
            padding: '10px',
            borderRadius: '10px',
            background: resolvedIconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: variant ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          {Icon && <Icon size={22} style={{ color: resolvedIconColor }} />}
        </div>

        {trend !== undefined && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: '999px',
              background: isPositive ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
              color: isPositive ? '#16a34a' : '#dc2626',
            }}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p style={{ fontSize: '30px', fontWeight: 800, color: valueColor, marginBottom: '4px', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
        {value ?? 0}
      </p>
      <p style={{ fontSize: '14px', fontWeight: 600, color: titleColor, letterSpacing: '-0.1px' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{description}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
