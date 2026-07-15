import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
  role: z.enum(['donor', 'ngo'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

// Donation schemas
export const donationSchema = z.object({
  foodName: z
    .string()
    .min(1, 'Food name is required')
    .min(3, 'Food name must be at least 3 characters')
    .max(100, 'Food name cannot exceed 100 characters'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity seems too high'),
  quantityUnit: z.enum(
    ['pieces', 'dozens', 'servings', 'kg', 'grams', 'vessels', 'packets', 'boxes', 'bunches', 'liters', 'ml', 'bottles', 'cans'],
    { errorMap: () => ({ message: 'Please select a unit' }) }
  ),
  category: z.enum(
    ['Cooked Food', 'Packaged Food', 'Dry Food', 'Fresh Produce', 'Beverages', 'Other'],
    { errorMap: () => ({ message: 'Please select a valid food category' }) }
  ),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(3, 'Location must be at least 3 characters'),
  expiryTime: z
    .string()
    .min(1, 'Expiry time is required')
    .min(3, 'Please enter a valid expiry time'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
});

// Search / filter schema
export const searchSchema = z.object({
  foodName: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  minQuantity: z.string().optional(),
  maxQuantity: z.string().optional(),
  sort: z.string().optional(),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
