import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineGift,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiChevronDown,
} from 'react-icons/hi2';
import { MdOutlineFoodBank } from 'react-icons/md';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

/* ── Animation helpers ── */
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay },
});

/* ── Data ── */
const features = [
  { icon: HiOutlineGift,              title: 'Easy Donations',   description: 'List your surplus food in under 2 minutes. Add photos, location, expiry details, and use guided category-based quantity units.', iconBg: '#dcfce7', iconColor: '#16a34a', shadow: 'rgba(22, 163, 74, 0.22)' },
  { icon: HiOutlineBuildingOffice2,   title: 'NGO Network',      description: 'Connect with verified NGOs in your city who can collect and distribute food quickly.',  iconBg: '#dbeafe', iconColor: '#1d4ed8', shadow: 'rgba(29, 78, 216, 0.22)' },
  { icon: HiOutlineHeart,             title: 'Real Impact',      description: 'View donation statistics and see the direct impact of your contributions on your dashboard.', iconBg: '#fee2e2', iconColor: '#dc2626', shadow: 'rgba(220, 38, 38, 0.22)' },
  { icon: HiOutlineMapPin,            title: 'Location Based',   description: 'Find active listings and partner NGOs nearby. Hyperlocal coordination facilitates rapid food collection.',             iconBg: '#fef3c7', iconColor: '#d97706', shadow: 'rgba(217, 119, 6, 0.22)' },
  { icon: HiOutlineClock,             title: 'Time Sensitive',   description: 'Expiry time tracking ensures surplus food is claimed and distributed before it goes to waste.',              iconBg: '#e0f2fe', iconColor: '#0284c7', shadow: 'rgba(2, 132, 199, 0.22)' },
  { icon: HiOutlineCheckCircle,       title: 'Visual Tracking',  description: 'Follow the live timeline stepper tracking each donation from claiming to pickup and final distribution.',                            iconBg: '#d1fae5', iconColor: '#059669', shadow: 'rgba(5, 150, 105, 0.22)' },
];

const steps = [
  { step: '01', title: 'Register',        description: 'Sign up as a Donor or NGO in under a minute.',                          bg: '#16a34a', shadow: 'rgba(22,163,74,0.22)'  },
  { step: '02', title: 'Post or Browse',  description: 'Donors list food. NGOs browse and claim available donations.',           bg: '#1a3a6b', shadow: 'rgba(26,58,107,0.22)' },
  { step: '03', title: 'Pickup & Deliver',description: 'NGO collects the food, marks it as delivered, and progress is tracked in real-time.',                      bg: '#f58220', shadow: 'rgba(245,130,32,0.22)' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Restaurant Owner, Donor',
    text: "FoodBridge has helped us donate our daily surplus food to local NGOs. It's incredibly easy and rewarding.",
    avatar: 'PS',
    bg: '#16a34a',
    bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
    borderColor: '#16a34a',
    activeShadow: '0 16px 36px rgba(22, 163, 74, 0.22)',
  },
  {
    name: 'Arjun Mehta',
    role: 'NGO Director, Delhi',
    text: 'We receive 50+ donation requests every week through FoodBridge. This platform has transformed our operations.',
    avatar: 'AM',
    bg: '#1a3a6b',
    bgGradient: 'linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)',
    borderColor: '#1a3a6b',
    activeShadow: '0 16px 36px rgba(26, 58, 107, 0.22)',
  },
  {
    name: 'Sunita Devi',
    role: 'Catering Business, Mumbai',
    text: 'Instead of throwing away leftover food after events, we now donate it. Feels amazing to make a difference.',
    avatar: 'SD',
    bg: '#f58220',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
    borderColor: '#f58220',
    activeShadow: '0 16px 36px rgba(245, 130, 32, 0.22)',
  },
];

const faqs = [
  { q: 'Who can use FoodBridge?', a: 'Anyone with surplus food (restaurants, caterers, households) can register as a Donor. NGOs and food banks register as NGOs to claim and distribute food.' },
  { q: 'Is FoodBridge free to use?', a: 'Yes, FoodBridge is completely free for both Donors and NGOs. Our mission is to reduce food waste, not to profit from it.' },
  { q: 'What types of food can be donated?', a: 'Any edible food safe for consumption — cooked meals, packaged foods, fresh produce, and more. Ensure the food is within its expiry time.' },
  { q: 'How is the food pickup coordinated?', a: 'After an NGO claims your donation, they coordinate the pickup directly. Once the NGO collects and distributes the food, they mark it as Delivered on their portal, which updates the visual tracker.' },
  { q: 'How do I track my donations?', a: 'You can track your donations in real-time. Simply go to "My Donations" on your dashboard and click "Track Status" to view the live visual timeline of your food from pickup to final delivery.' },
];

/* ── Reusable section label ── */
const SectionLabel = ({ text }) => (
  <span style={{ display:'inline-block', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.8px', color:'#16a34a', background:'#dcfce7', padding:'4px 14px', borderRadius:'999px', marginBottom:'14px' }}>
    {text}
  </span>
);

const Home = () => {
  const { isAuthenticated, getRoleRedirect, user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════
          HERO — Generosity layout, text left, child right
          ══════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '88px',
          paddingBottom: '60px',
          paddingLeft: '24px',
          paddingRight: '24px',
          overflow: 'hidden',
          backgroundColor: '#0a192f',
        }}
      >
        {/* Background image - option A children eating */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/hero-bg-new.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'right 45%',
            backgroundRepeat: 'no-repeat',
            filter: 'contrast(1.05) brightness(0.95)', // Boost contrast and remove fogginess
          }}
        />

        {/* Dark gradient overlay leaving the right side slightly brighter */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(10,25,47,0.96) 0%, rgba(10,25,47,0.82) 45%, rgba(10,25,47,0.12) 75%, rgba(10,25,47,0.25) 100%)', // Lighter overlay on the right
            zIndex: 2,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 40px',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            {/* Live badge */}
            <motion.div
              initial={{ opacity:0, scale:0.88 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 20px',
                background: 'rgba(22,163,74,0.15)',
                border: '1px solid rgba(22,163,74,0.35)',
                color: '#4ade80',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '26px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ width:'7px', height:'7px', background:'#4ade80', borderRadius:'50%' }} className="animate-pulse" />
              Fighting Food Waste Across India
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity:0, y:36 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.65, delay:0.1 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 6vw, 64px)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '20px',
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
              }}
            >
              Every Meal <span style={{ color: '#22c55e' }}>Deserves</span><br />
              a Second <span style={{ color: '#f58220' }}>Chance</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.2 }}
              style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '36px',
                lineHeight: 1.7,
              }}
            >
              FoodBridge connects food donors with local NGOs to reduce waste and
              feed communities. Join thousands already making a difference.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.3 }}
              style={{ display:'flex', flexWrap:'wrap', gap:'14px' }}
            >
              {isAuthenticated ? (
                <Link
                  to={getRoleRedirect(user?.role)}
                  style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 36px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'16px', borderRadius:'10px', textDecoration:'none', boxShadow:'0 6px 24px rgba(22,163,74,0.40)' }}
                >
                  Go to Dashboard <HiOutlineArrowRight size={19} />
                </Link>
              ) : (
                <>
                  <Link
                    to={ROUTES.REGISTER}
                    style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 36px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'16px', borderRadius:'10px', textDecoration:'none', boxShadow:'0 6px 24px rgba(22,163,74,0.40)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#22c55e,#16a34a)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,#16a34a,#15803d)'; e.currentTarget.style.transform='translateY(0)'; }}
                  >
                    Start Donating <HiOutlineArrowRight size={19} />
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 32px', background:'rgba(255,255,255,0.10)', border:'1.5px solid rgba(255,255,255,0.30)', color:'#fff', fontWeight:600, fontSize:'16px', borderRadius:'10px', textDecoration:'none', backdropFilter:'blur(8px)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.10)'; }}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.5 }}
              style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', maxWidth:'440px', marginTop:'56px', paddingTop:'28px', borderTop:'1px solid rgba(255,255,255,0.12)' }}
            >
              {[
                { value:'50K+',  label:'Meals Shared' },
                { value:'200+',  label:'NGO Partners' },
                { value:'30+',   label:'Cities' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ textAlign:'center', padding:'0 12px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
                  <p className="gradient-text" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3.5vw,30px)', fontWeight:800, lineHeight:1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)', marginTop:'6px', letterSpacing:'0.5px' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y:[0,8,0] }}
          transition={{ repeat:Infinity, duration:2.2 }}
          style={{ position:'absolute', bottom:'28px', left:'50%', transform:'translateX(-50%)', color:'rgba(255,255,255,0.28)', zIndex: 5 }}
        >
          <HiChevronDown size={28} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          TRUST BAR
          ══════════════════════════════════════ */}
      <section style={{ background:'#1a3a6b', padding:'22px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:'40px' }}>
          {[
            { label:'Zero Service Fee' },
            { label:'Verified NGO Partners' },
            { label:'Real-time Tracking' },
            { label:'Secure & Free' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', color:'rgba(255,255,255,0.85)', fontSize:'13px', fontWeight:500 }}>
              <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4ade80', flexShrink:0 }} />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding:'96px 24px', backgroundColor:'var(--bg-page)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign:'center', marginBottom:'60px' }}>
            <SectionLabel text="Simple Process" />
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4.5vw,42px)', fontWeight:700, color:'var(--text-heading)', margin:'0 0 10px' }}>
              How FoodBridge Works
            </h2>
            <div style={{ width:'56px', height:'3px', background:'#16a34a', borderRadius:'2px', margin:'14px auto 0' }} />
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'24px' }}>
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                {...stagger(idx * 0.12)}
                style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'44px 28px 36px', borderRadius:'18px', background:'var(--bg-card)', border:'1px solid var(--border-card)', boxShadow:'var(--shadow-card)' }}
                whileHover={{ y:-5, boxShadow:`0 18px 40px ${step.shadow}` }}
                transition={{ duration:0.2 }}
              >
                <div style={{ width:'68px', height:'68px', borderRadius:'18px', background:step.bg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${step.shadow}`, marginBottom:'22px' }}>
                  <span style={{ color:'#fff', fontWeight:800, fontSize:'24px', fontFamily:'var(--font-display)' }}>{step.step}</span>
                </div>
                <h3 style={{ fontSize:'18px', fontWeight:700, color:'var(--text-heading)', marginBottom:'10px' }}>{step.title}</h3>
                <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.7 }}>{step.description}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden sm:flex" style={{ position:'absolute', right:'-13px', top:'50%', transform:'translateY(-50%)', zIndex:10, width:'26px', height:'26px', background:'var(--bg-page)', borderRadius:'50%', border:'1px solid var(--border-card)', alignItems:'center', justifyContent:'center', color:'var(--text-subtle)' }}>
                    <HiOutlineArrowRight size={13} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
          ══════════════════════════════════════ */}
      <section id="about" style={{ padding:'96px 24px', backgroundColor:'var(--bg-alt)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign:'center', marginBottom:'60px' }}>
            <SectionLabel text="Features" />
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4.5vw,42px)', fontWeight:700, color:'var(--text-heading)', margin:'0 0 0' }}>
              Everything you need to fight food waste
            </h2>
            <div style={{ width:'56px', height:'3px', background:'#16a34a', borderRadius:'2px', margin:'14px auto 0' }} />
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                {...stagger(idx * 0.07)}
                style={{ padding:'30px', borderRadius:'16px', background:'var(--bg-card)', border:'1px solid var(--border-card)', boxShadow:'var(--shadow-card)', cursor:'default', transition: 'all 0.2s ease' }}
                whileHover={{ y:-4, boxShadow:`0 18px 40px ${f.shadow}` }}
                transition={{ duration:0.2 }}
              >
                <div style={{ width:'50px', height:'50px', background:f.iconBg, borderRadius:'13px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'18px' }}>
                  <f.icon size={26} color={f.iconColor} />
                </div>
                <h3 style={{ fontSize:'17px', fontWeight:700, color:'var(--text-heading)', marginBottom:'8px' }}>{f.title}</h3>
                <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.7 }}>{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding:'96px 24px', backgroundColor:'var(--bg-page)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign:'center', marginBottom:'60px' }}>
            <SectionLabel text="Testimonials" />
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4.5vw,42px)', fontWeight:700, color:'var(--text-heading)' }}>
              Loved by donors and NGOs
            </h2>
            <div style={{ width:'56px', height:'3px', background:'#16a34a', borderRadius:'2px', margin:'14px auto 0' }} />
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'22px' }}>
            {testimonials.map((t, idx) => {
              const isActive = activeTestimonial === idx;
              return (
                <motion.div
                  key={t.name}
                  {...stagger(idx * 0.1)}
                  onClick={() => setActiveTestimonial(isActive ? null : idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '30px',
                    borderRadius: '16px',
                    background: isActive ? t.bgGradient : 'var(--bg-card)',
                    border: isActive ? `1.5px solid ${t.borderColor}` : '1px solid var(--border-card)',
                    boxShadow: isActive ? t.activeShadow : 'var(--shadow-card)',
                    cursor: 'pointer',
                    transform: isActive ? 'scale(1.02)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  whileHover={{
                    y: isActive ? 0 : -4,
                    boxShadow: t.activeShadow,
                  }}
                >
                  <div style={{ fontSize:'44px', lineHeight:1, color:t.bg, opacity:0.18, fontFamily:'Georgia,serif', marginBottom:'6px' }}>"</div>
                  <p style={{ fontSize:'14px', color:'var(--text-body)', lineHeight:1.75, flex:1, marginBottom:'24px' }}>{t.text}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'14px', fontWeight:700, flexShrink:0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize:'14px', fontWeight:600, color:'var(--text-heading)' }}>{t.name}</p>
                      <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding:'96px 24px', backgroundColor:'var(--bg-alt)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth:'740px', margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign:'center', marginBottom:'60px' }}>
            <SectionLabel text="FAQ" />
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4.5vw,42px)', fontWeight:700, color:'var(--text-heading)' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ width:'56px', height:'3px', background:'#16a34a', borderRadius:'2px', margin:'14px auto 0' }} />
          </motion.div>

          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {faqs.map((faq, idx) => (
              <motion.details
                key={idx}
                {...stagger(idx * 0.06)}
                style={{ borderRadius:'13px', background:'var(--bg-card)', border:'1px solid var(--border-card)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}
              >
                <summary style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', fontWeight:600, fontSize:'15px', color:'var(--text-heading)', listStyle:'none', cursor:'pointer' }}>
                  <span style={{ paddingRight:'16px' }}>{faq.q}</span>
                  <HiChevronDown size={20} style={{ color:'var(--text-muted)', flexShrink:0 }} />
                </summary>
                <div style={{ padding:'0 22px 20px' }}>
                  <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.75 }}>{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding:'96px 24px', backgroundColor:'var(--bg-page)', position: 'relative', zIndex: 10 }}>
        <motion.div
          {...fadeUp}
          style={{ maxWidth:'960px', margin:'0 auto', borderRadius:'24px', overflow:'hidden', position:'relative', boxShadow:'0 24px 64px rgba(26,58,107,0.20)' }}
        >
          {/* Background image for CTA too */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/hero-bg-new.png)', backgroundSize:'cover', backgroundPosition:'center 45%' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(26,58,107,0.92) 0%, rgba(15,32,68,0.95) 100%)' }} />

          <div style={{ position:'relative', zIndex:5, padding:'64px 40px', textAlign:'center' }}>
            <div style={{ width:'64px', height:'64px', background:'rgba(22,163,74,0.2)', border:'1px solid rgba(22,163,74,0.35)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 26px' }}>
              <MdOutlineFoodBank size={32} color="#4ade80" />
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,40px)', fontWeight:700, color:'#fff', marginBottom:'14px' }}>
              Ready to make a difference?
            </h2>
            <p style={{ fontSize:'17px', color:'rgba(255,255,255,0.65)', marginBottom:'36px', maxWidth:'480px', margin:'0 auto 36px', lineHeight:1.75 }}>
              Join FoodBridge today and help us ensure no good food goes to waste.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'14px', justifyContent:'center' }}>
              <Link
                to={ROUTES.REGISTER}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'13px 36px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'15px', borderRadius:'10px', textDecoration:'none', boxShadow:'0 6px 22px rgba(22,163,74,0.40)' }}
                onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#22c55e,#16a34a)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,#16a34a,#15803d)'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                Get Started Free <HiOutlineArrowRight size={18} />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'13px 32px', background:'rgba(255,255,255,0.10)', border:'1.5px solid rgba(255,255,255,0.28)', color:'#fff', fontWeight:600, fontSize:'15px', borderRadius:'10px', textDecoration:'none', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.10)'; }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
