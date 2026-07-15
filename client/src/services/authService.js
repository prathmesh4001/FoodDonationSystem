import api from './api';

/**
 * Register a new user.
 * POST /api/auth/register
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login a user and retrieve JWT token.
 * POST /api/auth/login
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get current user profile.
 * NOTE: Backend does not currently expose this endpoint.
 * This stub is ready for future backend integration.
 * GET /api/auth/me
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch {
    // Endpoint not yet implemented — return null gracefully
    return null;
  }
};

/**
 * Update current user profile.
 * NOTE: Backend does not currently expose this endpoint.
 * This stub is ready for future backend integration.
 * PUT /api/auth/profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch {
    // Endpoint not yet implemented — return null gracefully
    return null;
  }
};

/**
 * Get all users with search.
 * GET /api/auth/users?page=1&limit=10&search=john
 */
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/auth/users', { params });
  return response.data;
};

/**
 * Delete a user by ID.
 * DELETE /api/auth/users/:id
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/auth/users/${id}`);
  return response.data;
};

/**
 * Reset a user's password using email & phone matching.
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (resetData) => {
  const response = await api.post('/auth/forgot-password', resetData);
  return response.data;
};

