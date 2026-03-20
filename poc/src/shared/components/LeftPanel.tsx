import loginSvg from '../../assets/login.svg';

export const LeftPanel = () => (
  <section style={{ flex: 1, background: '#0F62FE', padding: '48px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,0.08) 1.5px,transparent 1.5px)`, backgroundSize: '14px 14px', maskImage: 'radial-gradient(circle at center,black 40%,transparent 90%)', WebkitMaskImage: 'radial-gradient(circle at center,black 40%,transparent 90%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left,rgba(255,255,255,0.15),transparent 40%),linear-gradient(180deg,rgba(0,0,0,0.1) 0%,transparent 100%)', pointerEvents: 'none' }} />
    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: 24 }}>
      <p style={{ fontSize: 28, fontWeight: 400, color: '#fff', lineHeight: 1.4, margin: '0 0 12px' }}>
        Take Charge of Your<br /><strong>Investments with Us</strong>
      </p>
    </div>
    <img src={loginSvg} alt="illustration" style={{ position: 'relative', zIndex: 1, width: 220, height: 220 }} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 8 }}>
      <span style={{ display: 'block', width: 16, height: 8, background: '#555', borderRadius: 50 }} />
      <span style={{ display: 'block', width: 8, height: 8, background: 'rgba(255,255,255,0.35)', borderRadius: '50%' }} />
      <span style={{ display: 'block', width: 8, height: 8, background: 'rgba(255,255,255,0.35)', borderRadius: '50%' }} />
    </div>
  </section>
);