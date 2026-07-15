import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineBars3 } from 'react-icons/hi2';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, user } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: 'var(--bg-alt2)',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Top bar */}
        <header
          style={{
            height: '62px',
            backgroundColor: 'var(--bg-navbar)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Mobile menu button */}
          <button
            className="flex lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              width: '36px', height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-card)',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <HiOutlineBars3 size={20} />
          </button>

          <div className="hidden lg:block" />

          {/* Right side — Profile only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            <Link
              to={ROUTES.PROFILE}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                padding: '5px 10px 5px 5px',
                borderRadius: '10px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            >
              <div
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                }}
              >
                {getInitials(profile?.name || 'U')}
              </div>
              <div className="hidden sm:block" style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.2 }}>
                  {profile?.name || 'User'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user?.role}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
