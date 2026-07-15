// API base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// User roles
export const ROLES = {
  DONOR: 'donor',
  NGO: 'ngo',
  ADMIN: 'admin',
};

// Donation statuses
export const DONATION_STATUS = {
  AVAILABLE: 'Available',
  CLAIMED: 'Claimed',
  DELIVERED: 'Delivered',
};

// Food categories
export const FOOD_CATEGORIES = [
  'Cooked Food',
  'Packaged Food',
  'Dry Food',
  'Fresh Produce',
  'Beverages',
  'Other',
];

export const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: '' },
  { label: '🍛 Cooked Food', value: 'Cooked Food' },
  { label: '📦 Packaged Food', value: 'Packaged Food' },
  { label: '🌾 Dry Food', value: 'Dry Food' },
  { label: '🥦 Fresh Produce', value: 'Fresh Produce' },
  { label: '🥤 Beverages', value: 'Beverages' },
  { label: '📋 Other', value: 'Other' },
];

export const CATEGORY_FORM_OPTIONS = [
  { label: '🍛 Cooked Food', value: 'Cooked Food' },
  { label: '📦 Packaged Food', value: 'Packaged Food' },
  { label: '🌾 Dry Food', value: 'Dry Food' },
  { label: '🥦 Fresh Produce', value: 'Fresh Produce' },
  { label: '🥤 Beverages', value: 'Beverages' },
  { label: '📋 Other', value: 'Other' },
];

// Unit options per food category
export const UNIT_OPTIONS_BY_CATEGORY = {
  'Cooked Food': [
    { label: 'servings  (how many people can eat)', value: 'servings' },
    { label: 'pieces  (roti, paratha, puri...)', value: 'pieces' },
    { label: 'dozens  (e.g. 1 dozen = 12 pcs)', value: 'dozens' },
    { label: 'kg  (by weight)', value: 'kg' },
    { label: 'vessels/pots  (big utensil)', value: 'vessels' },
  ],
  'Packaged Food': [
    { label: 'packets  (sealed packets)', value: 'packets' },
    { label: 'kg  (by weight)', value: 'kg' },
    { label: 'boxes  (cartons/boxes)', value: 'boxes' },
    { label: 'pieces  (individual items)', value: 'pieces' },
  ],
  'Dry Food': [
    { label: 'kg  (by weight)', value: 'kg' },
    { label: 'grams  (small quantity)', value: 'grams' },
    { label: 'packets  (sealed bags)', value: 'packets' },
  ],
  'Fresh Produce': [
    { label: 'kg  (by weight)', value: 'kg' },
    { label: 'grams  (small quantity)', value: 'grams' },
    { label: 'bunches  (spinach, coriander...)', value: 'bunches' },
    { label: 'pieces  (individual fruit/veg)', value: 'pieces' },
  ],
  'Beverages': [
    { label: 'liters  (liquid volume)', value: 'liters' },
    { label: 'bottles  (sealed bottles)', value: 'bottles' },
    { label: 'cans  (canned drinks)', value: 'cans' },
    { label: 'ml  (small volume)', value: 'ml' },
  ],
  'Other': [
    { label: 'servings  (portions)', value: 'servings' },
    { label: 'kg  (by weight)', value: 'kg' },
    { label: 'pieces  (individual items)', value: 'pieces' },
    { label: 'packets', value: 'packets' },
  ],
};


// Sort options
export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Quantity: High to Low', value: 'high' },
  { label: 'Quantity: Low to High', value: 'low' },
];

// Pagination
export const DEFAULT_PAGE_LIMIT = 6;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
  DONOR_DASHBOARD: '/donor/dashboard',
  DONOR_MY_DONATIONS: '/donor/my-donations',
  DONOR_ADD_DONATION: '/donor/add-donation',
  NGO_DASHBOARD: '/ngo/dashboard',
  NGO_AVAILABLE: '/ngo/available',
  NGO_CLAIMED: '/ngo/claimed',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ALL_DONATIONS: '/admin/donations',
  ADMIN_USERS: '/admin/users',
};

// Status badge colors
export const STATUS_COLORS = {
  Available: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Claimed: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  Delivered: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
};
