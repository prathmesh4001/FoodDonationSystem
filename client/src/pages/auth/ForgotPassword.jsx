import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineArrowLeft,
} from 'react-icons/hi2';
import { MdOutlineFoodBank } from 'react-icons/md';
import { forgotPasswordSchema } from '../../types/schemas';
import { forgotPassword } from '../../services/authService';
import { ROUTES } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const resetPayload = {
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      await forgotPassword(resetPayload);
      toast.success('Password reset successfully! Please sign in. 🎉');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification or reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 font-bold text-xl mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <MdOutlineFoodBank size={22} className="text-white" />
            </div>
            <span className="gradient-text font-display text-2xl">FoodBridge</span>
          </Link>
          <h2 className="text-3xl font-bold text-surface-900 mb-2">
            Reset Password
          </h2>
          <p className="text-surface-500 text-sm">
            Verify your email and registered phone number to set a new password.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-surface-100 p-8">
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

            <Input
              label="Registered Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              leftIcon={HiOutlinePhone}
              error={errors.phone?.message}
              required
              autoComplete="off"
              {...register('phone')}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Create a new password"
              leftIcon={HiOutlineLockClosed}
              error={errors.password?.message}
              required
              helper="At least 6 characters"
              autoComplete="new-password"
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              leftIcon={HiOutlineLockClosed}
              error={errors.confirmPassword?.message}
              required
              autoComplete="new-password"
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Reset Password
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-6">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
          >
            <HiOutlineArrowLeft size={16} /> Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
