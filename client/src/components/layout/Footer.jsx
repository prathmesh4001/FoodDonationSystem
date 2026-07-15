import { Link } from 'react-router-dom';
import { MdOutlineFoodBank } from 'react-icons/md';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { ROUTES } from '../../constants';

const Footer = () => {
  const year = new Date().getFullYear();

  const navGroups = [
    {
      heading: 'Platform',
      links: [
        { label: 'For Donors', href: ROUTES.REGISTER },
        { label: 'For NGOs', href: ROUTES.REGISTER },
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'Statistics', href: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/#about' },
        { label: 'Blog', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  const socials = [
    { Icon: FaGithub,   href: '#', label: 'GitHub' },
    { Icon: FaTwitter,  href: '#', label: 'Twitter' },
    { Icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer
      style={{
        background: 'var(--bg-footer)',
        color: '#94a3b8',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Main grid */}
        <div
          style={{
            padding: '56px 0 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              to={ROUTES.HOME}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg,#16a34a,#15803d)',
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(22,163,74,0.28)',
                }}
              >
                <MdOutlineFoodBank size={20} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#ffffff',
                  letterSpacing: '-0.2px',
                }}
              >
                FoodBridge
              </span>
            </Link>

            <p
              style={{
                fontSize: '13px',
                color: '#64748b',
                lineHeight: '1.7',
                marginBottom: '20px',
                maxWidth: '220px',
              }}
            >
              Connecting food donors with NGOs to reduce food waste and nourish communities across India.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(22,163,74,0.2)';
                    e.currentTarget.style.color = '#22c55e';
                    e.currentTarget.style.borderColor = 'rgba(22,163,74,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav link groups */}
          {navGroups.map((group) => (
            <div key={group.heading}>
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: '16px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {group.heading}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: '13px',
                        color: '#64748b',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#22c55e'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '20px 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <p style={{ fontSize: '12px', color: '#475569' }}>
            © {year} FoodBridge. Made with ❤️ to fight hunger.
          </p>
          <p style={{ fontSize: '12px', color: '#475569' }}>
            Reducing food waste, one donation at a time.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
