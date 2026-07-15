import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { MdOutlineFoodBank } from 'react-icons/md';
import { registerSchema } from '../../types/schemas';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const roles = [
  {
    value: 'donor',
    label: 'Donor',
    description: 'I want to donate surplus food',
    emoji: '🍱',
    color: 'border-brand-500 bg-brand-50 dark:bg-brand-900/20',
    selectedText: 'text-brand-700 dark:text-brand-300',
  },
  {
    value: 'ngo',
    label: 'NGO',
    description: 'I represent an NGO to collect food',
    emoji: '🏢',
    color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    selectedText: 'text-purple-700 dark:text-purple-300',
  },
];

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue('role', role, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created! Please sign in. 🎉');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
        className="w-full max-w-lg"
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
            Create your account
          </h2>
          <p className="text-surface-500">
            Join thousands making a difference with food donations.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-surface-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role selection */}
            <div>
              <p className="text-sm font-medium text-surface-700 mb-3">
                I am a... <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleSelect(role.value)}
                    className={`
                      p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                      ${selectedRole === role.value
                        ? `${role.color} border-opacity-100`
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{role.emoji}</div>
                    <div className={`text-sm font-semibold ${selectedRole === role.value ? role.selectedText : 'text-surface-800'}`}>
                      {role.label}
                    </div>
                    <div className="text-xs text-surface-500 mt-0.5">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
              {/* Hidden input for role */}
              <input type="hidden" {...register('role')} />
              {errors.role && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.role.message}
                </p>
              )}
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={HiOutlineUser}
              error={errors.name?.message}
              required
              autoComplete="off"
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={HiOutlineEnvelope}
              error={errors.email?.message}
              required
              autoComplete="new-email"
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 9876543210"
              leftIcon={HiOutlinePhone}
              error={errors.phone?.message}
              required
              autoComplete="off"
              {...register('phone')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              leftIcon={HiOutlineLockClosed}
              error={errors.password?.message}
              required
              helper="At least 6 characters"
              autoComplete="new-password"
              {...register('password')}
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
