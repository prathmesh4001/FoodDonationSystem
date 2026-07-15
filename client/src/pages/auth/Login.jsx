import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { MdOutlineFoodBank } from 'react-icons/md';
import { loginSchema } from '../../types/schemas';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, ROLES } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const stats = [
  { icon: HiOutlineHeart,      value: '50K+',  label: 'Meals Shared'  },
  { icon: HiOutlineUserGroup,  value: '200+',  label: 'NGO Partners'  },
  { icon: HiOutlineGlobeAlt,   value: '30+',   label: 'Cities'        },
];

const floatingItems = ['🍚', '🥗', '🍞', '🥦', '🍎', '🥕', '🍲', '🌽', '🍋', '🫐'];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, getRoleRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const role = await login(data);
      toast.success('Welcome back! 👋');

      // Prevent redirecting to unauthorized routes from past sessions
      let redirectPath = getRoleRedirect(role);
      if (from) {
        const isProfile = from === ROUTES.PROFILE;
        const isDonorRoute = from.startsWith('/donor') && role === ROLES.DONOR;
        const isNgoRoute = from.startsWith('/ngo') && role === ROLES.NGO;
        const isAdminRoute = from.startsWith('/admin') && role === ROLES.ADMIN;
        if (isProfile || isDonorRoute || isNgoRoute || isAdminRoute) {
          redirectPath = from;
        }
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ backgroundColor: '#0a192f' }}
      >
        {/* Background image - option A children eating */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/login-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'right 45%',
            backgroundRepeat: 'no-repeat',
            filter: 'contrast(1.08) brightness(0.68)', // Make it sharp yet dark enough for text readability
          }}
        />

        {/* Dark overlay gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10,25,47,0.94) 0%, rgba(10,25,47,0.85) 50%, rgba(22,163,74,0.22) 100%)',
            zIndex: 2,
          }}
        />

        {/* Floating food emojis */}
        {floatingItems.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl select-none pointer-events-none"
            style={{
              left: `${(i * 13 + 7) % 90}%`,
              top: `${(i * 17 + 5) % 85}%`,
              opacity: 0.12,
              zIndex: 3,
            }}
            animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit hover:opacity-90 transition-opacity">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-brand-600" style={{ boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)' }}>
              <MdOutlineFoodBank size={26} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight font-display">FoodBridge</span>
          </Link>

          {/* Center message */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Pill tag */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(22,163,74,0.18)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80', backdropFilter: 'blur(8px)' }}>
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse inline-block" />
                Food Donation Platform
              </div>

              <h1 className="text-5xl font-bold leading-tight mb-5 font-display" style={{ color: '#ffffff' }}>
                Every Meal<br />
                <span style={{ color: '#22c55e' }}>Changes</span> a Life.
              </h1>

              <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Connect surplus food with those who need it most.<br />
                Together, we can end hunger — one donation at a time.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Icon size={20} className="mx-auto mb-2 text-brand-400" />
                  <p className="text-2xl font-bold text-white font-display">{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Quote */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
            <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.78)' }}>
              "The simplest act of giving food can restore dignity, hope, and trust in humanity."
            </p>
            <p className="text-xs mt-2 font-semibold text-brand-400">— FoodBridge Community</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — FORM ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white relative">

        {/* Top-right background accent */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full opacity-5 pointer-events-none" style={{ background: '#16a34a' }} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 w-fit">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#16a34a' }}>
              <MdOutlineFoodBank size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: '#16a34a', fontFamily: 'Poppins, sans-serif' }}>FoodBridge</span>
          </Link>

          <div className="mb-8">
            <Link to={ROUTES.HOME} className="inline-block hover:opacity-90 transition-opacity" title="Back to Home">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#f0fdf4' }}>
                <MdOutlineFoodBank size={26} style={{ color: '#16a34a' }} />
              </div>
            </Link>
            <h2 className="text-3xl font-bold mb-1.5" style={{ color: '#0f172a', fontFamily: 'Poppins, sans-serif' }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Sign in to continue your food donation journey.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={HiOutlineEnvelope}
              error={errors.email?.message}
              required
              autoComplete="off"
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={HiOutlineLockClosed}
                error={errors.password?.message}
                required
                autoComplete="new-password"
                {...register('password')}
              />
              <div className="text-right mt-1.5">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-medium hover:underline cursor-pointer"
                  style={{ color: '#16a34a', textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-1"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          {/* Register link */}
          <p className="text-center text-sm" style={{ color: '#64748b' }}>
            New to FoodBridge?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-semibold"
              style={{ color: '#16a34a' }}
            >
              Create a free account →
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;
