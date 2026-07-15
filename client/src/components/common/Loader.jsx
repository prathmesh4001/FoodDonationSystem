import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { motion } from 'framer-motion';

// Full-screen loader
export const FullScreenLoader = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      className="text-brand-600"
    >
      <AiOutlineLoading3Quarters size={40} />
    </motion.div>
    <p className="mt-4 text-sm text-surface-500">{message}</p>
  </div>
);

// Inline spinner
const Loader = ({ size = 20, className = '' }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    className={`inline-block text-brand-600 ${className}`}
  >
    <AiOutlineLoading3Quarters size={size} />
  </motion.div>
);

export default Loader;
