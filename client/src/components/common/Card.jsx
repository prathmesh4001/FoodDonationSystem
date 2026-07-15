import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
  style = {},
  ...props
}) => {
  const paddings = {
    none: '0px',
    sm: '16px',
    md: '24px',
    lg: '32px',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={glass ? 'glass' : ''}
      style={{
        borderRadius: '14px',
        background: glass ? undefined : 'var(--bg-card)',
        border: glass ? undefined : '1px solid var(--border-card)',
        boxShadow: 'var(--shadow-card)',
        padding: paddings[padding],
        cursor: hover ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
