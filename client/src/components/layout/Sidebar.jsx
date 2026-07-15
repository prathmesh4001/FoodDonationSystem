import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineGift,
  HiOutlinePlusCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { MdOutlineFoodBank } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, ROLES } from '../../constants';

const navItems = {
  [ROLES.DONOR]: [
    { label: 'Dashboard', icon: HiOutlineHome, href: ROUTES.DONOR_DASHBOARD },
    { label: 'My Donations', icon: HiOutlineGift, href: ROUTES.DONOR_MY_DONATIONS },
    { label: 'Add Donation', icon: HiOutlinePlusCircle, href: ROUTES.DONOR_ADD_DONATION },
  ],
  [ROLES.NGO]: [
    { label: 'Dashboard', icon: HiOutlineHome, href: ROUTES.NGO_DASHBOARD },
    { label: 'Available', icon: HiOutlineClipboardDocumentList, href: ROUTES.NGO_AVAILABLE },
    { label: 'My Claims', icon: HiOutlineCheckCircle, href: ROUTES.NGO_CLAIMED },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', icon: HiOutlineHome, href: ROUTES.ADMIN_DASHBOARD },
    { label: 'All Donations', icon: HiOutlineGift, href: ROUTES.ADMIN_ALL_DONATIONS },
    { label: 'Manage Users', icon: HiOutlineUsers, href: ROUTES.ADMIN_USERS },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;
  const items = navItems[role] || [];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 18px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '10px'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              background: 'linear-gradient(135deg,#16a34a,#15803d)',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(22,163,74,0.28)',
            }}
          >
            <MdOutlineFoodBank size={19} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--text-heading)',
              letterSpacing: '-0.2px',
            }}
          >
            FoodBridge
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            className="sidebar-nav-item"
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '0 14px 20px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
        <NavLink
          to={ROUTES.PROFILE}
          onClick={onClose}
          className="sidebar-nav-item"
        >
          <HiOutlineUser size={18} />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-nav-item"
          style={{ color: '#dc2626' }}
        >
          <HiOutlineArrowRightOnRectangle size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          flexDirection: 'column',
          width: '240px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-default)',
          flexShrink: 0,
        }}
        className="hidden lg:flex"
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(0,0,0,0.45)',
            }}
            className="lg:hidden"
            onClick={onClose}
          />
          <aside
            style={{
              position: 'fixed',
              inset: '0 auto 0 0',
              zIndex: 50,
              width: '260px',
              background: 'var(--bg-sidebar)',
              borderRight: '1px solid var(--border-default)',
            }}
            className="lg:hidden"
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
