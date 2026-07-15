import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, ROLES } from '../constants';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import HomeLayout from '../layouts/HomeLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { FullScreenLoader } from '../components/common/Loader';

// Router configurations
// Lazy-loaded public pages
const Home = lazy(() => import('../pages/public/Home'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// Lazy-loaded shared pages
const Profile = lazy(() => import('../pages/Profile'));

// Lazy-loaded Donor pages
const DonorDashboard = lazy(() => import('../pages/donor/DonorDashboard'));
const MyDonations = lazy(() => import('../pages/donor/MyDonations'));
const AddDonation = lazy(() => import('../pages/donor/AddDonation'));

// Lazy-loaded NGO pages
const NgoDashboard = lazy(() => import('../pages/ngo/NgoDashboard'));
const AvailableDonations = lazy(() => import('../pages/ngo/AvailableDonations'));
const MyClaimedDonations = lazy(() => import('../pages/ngo/MyClaimedDonations'));

// Lazy-loaded Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AllDonations = lazy(() => import('../pages/admin/AllDonations'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<HomeLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        </Route>

        {/* Auth routes (Standalone, without main Navbar/Footer) */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* Protected dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Profile — all authenticated roles */}
          <Route path={ROUTES.PROFILE} element={<Profile />} />

          {/* Donor routes */}
          <Route
            path={ROUTES.DONOR_DASHBOARD}
            element={
              <RoleRoute allowedRoles={[ROLES.DONOR]}>
                <DonorDashboard />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTES.DONOR_MY_DONATIONS}
            element={
              <RoleRoute allowedRoles={[ROLES.DONOR]}>
                <MyDonations />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTES.DONOR_ADD_DONATION}
            element={
              <RoleRoute allowedRoles={[ROLES.DONOR]}>
                <AddDonation />
              </RoleRoute>
            }
          />

          {/* NGO routes */}
          <Route
            path={ROUTES.NGO_DASHBOARD}
            element={
              <RoleRoute allowedRoles={[ROLES.NGO]}>
                <NgoDashboard />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTES.NGO_AVAILABLE}
            element={
              <RoleRoute allowedRoles={[ROLES.NGO]}>
                <AvailableDonations />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTES.NGO_CLAIMED}
            element={
              <RoleRoute allowedRoles={[ROLES.NGO]}>
                <MyClaimedDonations />
              </RoleRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ALL_DONATIONS}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AllDonations />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminUsers />
              </RoleRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
