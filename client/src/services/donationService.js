import api from './api';

/**
 * Add a new donation.
 * POST /api/donation/add
 * Requires multipart/form-data for image upload.
 */
export const addDonation = async (formData) => {
  const response = await api.post('/donation/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Get all donations with pagination, sorting, searching, and filtering.
 * GET /api/donation?page=1&limit=6&sort=newest&search=rice&status=Available&location=Mumbai
 */
export const getAllDonations = async (params = {}) => {
  const response = await api.get('/donation', { params });
  return response.data;
};

/**
 * Get a single donation by ID.
 * GET /api/donation/:id
 */
export const getDonationById = async (id) => {
  const response = await api.get(`/donation/${id}`);
  return response.data;
};

/**
 * Update an existing donation.
 * PUT /api/donation/update/:id
 * Requires multipart/form-data.
 */
export const updateDonation = async (id, formData) => {
  const response = await api.put(`/donation/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Delete a donation.
 * DELETE /api/donation/delete/:id
 */
export const deleteDonation = async (id) => {
  const response = await api.delete(`/donation/delete/${id}`);
  return response.data;
};

/**
 * Claim a donation (NGO only).
 * PUT /api/donation/claim/:id
 */
export const claimDonation = async (id) => {
  const response = await api.put(`/donation/claim/${id}`);
  return response.data;
};

/**
 * Mark a claimed donation as delivered (NGO only).
 * PUT /api/donation/deliver/:id
 */
export const markAsDelivered = async (id) => {
  const response = await api.put(`/donation/deliver/${id}`);
  return response.data;
};

/**
 * Get all available donations.
 * GET /api/donation/available
 */
export const getAvailableDonations = async () => {
  const response = await api.get('/donation/available');
  return response.data;
};

/**
 * Get all claimed donations.
 * GET /api/donation/claimed
 */
export const getClaimedDonations = async () => {
  const response = await api.get('/donation/claimed');
  return response.data;
};

/**
 * Get all delivered donations.
 * GET /api/donation/delivered
 */
export const getDeliveredDonations = async () => {
  const response = await api.get('/donation/delivered');
  return response.data;
};

/**
 * Advanced search donations.
 * GET /api/donation/search?foodName=&location=&status=&minQuantity=&maxQuantity=&sort=&startDate=&endDate=
 */
export const searchDonations = async (params = {}) => {
  const response = await api.get('/donation/search', { params });
  return response.data;
};

/**
 * Get admin dashboard donation stats.
 * GET /api/donation/dashboard/stats
 */
export const getDashboardStats = async () => {
  const response = await api.get('/donation/dashboard/stats');
  return response.data;
};

/**
 * Get donor dashboard data.
 * GET /api/dashboard/donor
 */
export const getDonorDashboard = async () => {
  const response = await api.get('/dashboard/donor');
  return response.data;
};

/**
 * Get NGO dashboard data.
 * GET /api/dashboard/ngo
 */
export const getNgoDashboard = async () => {
  const response = await api.get('/dashboard/ngo');
  return response.data;
};

/**
 * Get admin dashboard data.
 * GET /api/dashboard/admin
 */
export const getAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};
