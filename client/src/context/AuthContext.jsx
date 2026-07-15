import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile } from '../services/authService';
import { parseJWT, isTokenExpired } from '../utils/helpers';
import { ROLES, ROUTES } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, role }
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null); // { name, email, phone }
  const [loading, setLoading] = useState(true);

  /**
   * Fetch profile data.
   * Ready for GET /profile or GET /auth/me backend APIs.
   * Falls back to extracting profile info from user's donations if backend API doesn't exist yet.
   */
  const fetchProfile = useCallback(async (currentUserId, currentRole) => {
    try {
      // 1. Try to fetch from real backend profile API (future-proof)
      const data = await getProfile();
      if (data && data.success && data.user) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            name: data.user.name || '',
            email: data.user.email || prev?.email || '',
            phone: data.user.phone || '',
            role: data.user.role || currentRole || '',
          };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
        return;
      }

      // 2. Fallback: For donors, get user details from populated donation items
      if (currentRole === ROLES.DONOR) {
        const { getAllDonations } = await import('../services/donationService');
        const res = await getAllDonations({ limit: 1 });
        if (res && res.donations && res.donations.length > 0) {
          const matched = res.donations.find((d) => d.donor && d.donor._id === currentUserId);
          if (matched && matched.donor) {
            setProfile((prev) => {
              const updated = {
                ...prev,
                name: matched.donor.name || prev?.name || '',
                phone: matched.donor.phone || prev?.phone || '',
              };
              localStorage.setItem('user', JSON.stringify(updated));
              return updated;
            });
          }
        }
      }
    } catch (err) {
      console.warn('Profile fetch fallback warning:', err);
    }
  }, []);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setProfile(parsedUser);
            // Fetch the rest of the profile fields in the background
            await fetchProfile(parsedUser.id, parsedUser.role);
          } catch {
            localStorage.removeItem('user');
          }
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    initializeAuth();
  }, [fetchProfile]);

  /**
   * Login action — saves token and user data.
   */
  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    const { token: newToken } = data;

    const decoded = parseJWT(newToken);
    if (!decoded) {
      throw new Error('Invalid authentication token');
    }
    const userPayload = {
      id: decoded.id,
      role: decoded.role,
      email: credentials.email,
      name: '',
      phone: '',
    };

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userPayload));

    setToken(newToken);
    setUser(userPayload);
    setProfile(userPayload);

    // Fetch full profile dynamically
    await fetchProfile(decoded.id, decoded.role);

    return decoded.role;
  }, [fetchProfile]);

  /**
   * Register action.
   */
  const register = useCallback(async (userData) => {
    const data = await registerUser(userData);
    return data;
  }, []);

  /**
   * Logout — clears all auth state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  /**
   * Update profile state (transient local update fallback + backend PUT sync ready)
   */
  const updateProfileState = useCallback((updates) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    profile,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfileState,
    getRoleRedirect: (role) => {
      switch (role) {
        case ROLES.DONOR:
          return ROUTES.DONOR_DASHBOARD;
        case ROLES.NGO:
          return ROUTES.NGO_DASHBOARD;
        case ROLES.ADMIN:
          return ROUTES.ADMIN_DASHBOARD;
        default:
          return ROUTES.HOME;
      }
    },
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
