import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { MdOutlineFoodBank } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';

const publicLinks = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'About', href: '#about' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, user, getRoleRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleDashboard = () => {
    if (user) navigate(getRoleRedirect(user.role));
  };

  // On public hero page (not scrolled) — use white text on transparent bg
  const heroMode = isPublicPage && !isScrolled;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: heroMode ? 'transparent' : 'var(--bg-navbar)',
        borderBottom: heroMode ? 'none' : '1px solid var(--border-default)',
        boxShadow: heroMode ? 'none' : 'var(--shadow-nav)',
        backdropFilter: heroMode ? 'none' : 'blur(14px)',
        WebkitBackdropFilter: heroMode ? 'none' : 'blur(14px)',
        transition: 'all 0.35s ease',
      }}
    >
      <nav
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* ── Logo ── */}
        <Link
          to={ROUTES.HOME}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(22,163,74,0.32)',
            }}
          >
            <MdOutlineFoodBank size={22} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '20px',
              color: heroMode ? '#ffffff' : 'var(--text-heading)',
              letterSpacing: '-0.3px',
            }}
          >
            FoodBridge
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
          {isPublicPage && publicLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: '7px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: heroMode ? 'rgba(255,255,255,0.88)' : 'var(--text-muted)',
                textDecoration: 'none',
                borderRadius: '7px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = heroMode ? '#ffffff' : 'var(--text-heading)';
                e.currentTarget.style.background = heroMode ? 'rgba(255,255,255,0.12)' : 'var(--bg-alt2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = heroMode ? 'rgba(255,255,255,0.88)' : 'var(--text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Right Actions ── */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              <button
                onClick={handleDashboard}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: heroMode ? 'rgba(255,255,255,0.88)' : 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '7px 14px',
                  borderRadius: '7px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = heroMode ? '#fff' : 'var(--text-heading)';
                  e.currentTarget.style.background = heroMode ? 'rgba(255,255,255,0.12)' : 'var(--bg-alt2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = heroMode ? 'rgba(255,255,255,0.88)' : 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Dashboard
              </button>
              <Link
                to={ROUTES.PROFILE}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '9px',
                  border: heroMode ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border-default)',
                  background: heroMode ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: heroMode ? '#fff' : 'var(--text-muted)',
                  textDecoration: 'none',
                }}
              >
                <HiOutlineUser size={17} />
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', fontWeight: 500,
                  color: '#ef4444',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '7px 12px', borderRadius: '7px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <HiOutlineArrowRightOnRectangle size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: heroMode ? 'rgba(255,255,255,0.9)' : 'var(--text-heading)',
                  textDecoration: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: heroMode ? '1px solid rgba(255,255,255,0.35)' : '1px solid var(--border-default)',
                  background: heroMode ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = heroMode ? 'rgba(255,255,255,0.18)' : 'var(--bg-alt2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = heroMode ? 'rgba(255,255,255,0.08)' : 'transparent';
                }}
              >
                Log In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '8px 22px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.32)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.42)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.32)';
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Menu Button ── */}
        <button
          className="md:hidden flex items-center justify-center"
          style={{
            width: '38px', height: '38px',
            borderRadius: '9px',
            border: heroMode ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border-default)',
            background: heroMode ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
            cursor: 'pointer',
            color: heroMode ? '#fff' : 'var(--text-muted)',
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              backgroundColor: 'var(--bg-navbar)',
              borderTop: '1px solid var(--border-default)',
              overflow: 'hidden',
            }}
            className="md:hidden"
          >
            <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {isPublicPage && publicLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '10px 12px',
                    fontSize: '14px', fontWeight: 500,
                    color: 'var(--text-body)',
                    textDecoration: 'none', borderRadius: '7px',
                  }}
                >
                  {link.label}
                </a>
              ))}

              <div style={{ borderTop: '1px solid var(--border-default)', marginTop: '8px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {isAuthenticated ? (
                  <>
                    <button onClick={() => { handleDashboard(); setMobileOpen(false); }}
                      style={{ textAlign:'left', fontSize:'14px', fontWeight:500, color:'var(--color-primary)', background:'none', border:'none', cursor:'pointer', padding:'10px 12px', borderRadius:'7px' }}>
                      Dashboard
                    </button>
                    <Link to={ROUTES.PROFILE} onClick={() => setMobileOpen(false)}
                      style={{ fontSize:'14px', color:'var(--text-body)', textDecoration:'none', padding:'10px 12px', borderRadius:'7px' }}>
                      Profile
                    </Link>
                    <button onClick={handleLogout}
                      style={{ textAlign:'left', fontSize:'14px', color:'#ef4444', background:'none', border:'none', cursor:'pointer', padding:'10px 12px', borderRadius:'7px' }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}
                      style={{ fontSize:'14px', fontWeight:500, color:'var(--text-heading)', textDecoration:'none', padding:'10px 12px', borderRadius:'7px' }}>
                      Log In
                    </Link>
                    <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}
                      style={{ fontSize:'14px', fontWeight:600, color:'#fff', textDecoration:'none', padding:'11px 16px', borderRadius:'8px',
                               background:'linear-gradient(135deg,#16a34a,#15803d)', textAlign:'center' }}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
