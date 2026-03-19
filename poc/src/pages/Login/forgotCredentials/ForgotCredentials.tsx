import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotUserId, forgotPassword, forgotPasswordVerifyOtp, setPassword } from '../../../api/auth.api';
import logoSvg from '../../../assets/logo.svg';
import loginSvg from '../../../assets/login.svg';

// ─── Eye Icons ────────────────────────────────────────────────────────────────
const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

// ─── Green Toast ──────────────────────────────────────────────────────────────
const GreenToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#16a34a', color: '#fff', padding: '14px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, minWidth: 280 }}>
    <span>✓</span>
    <span style={{ flex: 1 }}>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
  </div>
);

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn = ({ children, type = 'button', disabled, onClick }: { children: React.ReactNode; type?: 'button' | 'submit'; disabled?: boolean; onClick?: () => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', height: 48, border: 'none', borderRadius: 4, fontSize: 16, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, opacity: disabled ? 0.6 : 1, transition: 'background 0.2s, color 0.2s', background: hovered && !disabled ? '#0F62FE' : '#ECEDEE', color: hovered && !disabled ? '#ffffff' : '#9D9D9D' }}>
      {children}
    </button>
  );
};

// ─── 4-box OTP Input ──────────────────────────────────────────────────────────
const OTP_LEN = 4;
const OtpBoxInput = ({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LEN }, (_, i) => value[i] ?? '');
  const update = (i: number, c: string) => { const n = [...digits]; n[i] = c; onChange(n.join('')); };
  const onCh = (i: number, e: React.ChangeEvent<HTMLInputElement>) => { const c = e.target.value.replace(/\D/g, '').slice(-1); update(i, c); if (c && i < OTP_LEN - 1) refs.current[i + 1]?.focus(); };
  const onKd = (i: number, e: React.KeyboardEvent) => { if (e.key === 'Backspace') { if (digits[i]) update(i, ''); else if (i > 0) refs.current[i - 1]?.focus(); } };
  const onPaste = (e: React.ClipboardEvent) => { const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN); if (p) { onChange(p.padEnd(OTP_LEN, '').slice(0, OTP_LEN)); refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus(); } e.preventDefault(); };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {digits.map((d, i) => (
          <div key={i} style={{ position: 'relative', width: 56, height: 56, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: `1px solid ${error ? '#E24B4A' : d ? '#0F62FE' : '#ECEDEE'}` }}>
            <input ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => onCh(i, e)} onKeyDown={e => onKd(i, e)} onPaste={onPaste} autoComplete="one-time-code"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 20, fontWeight: 600, textAlign: 'center', caretColor: '#0F62FE', zIndex: 1 }} />
            {!d && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ECEDEE' }} />}
          </div>
        ))}
      </div>
      {error && <p style={{ fontSize: 11, color: '#E24B4A', marginTop: 8, lineHeight: 1.4 }}>{error}</p>}
    </div>
  );
};

// ─── Left Panel ───────────────────────────────────────────────────────────────
const LeftPanel = () => (
  <section style={{ flex: 1, background: '#0F62FE', padding: '48px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,0.08) 1.5px,transparent 1.5px)`, backgroundSize: '14px 14px', maskImage: 'radial-gradient(circle at center,black 40%,transparent 90%)', WebkitMaskImage: 'radial-gradient(circle at center,black 40%,transparent 90%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left,rgba(255,255,255,0.15),transparent 40%),linear-gradient(180deg,rgba(0,0,0,0.1) 0%,transparent 100%)', pointerEvents: 'none' }} />
    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: 24 }}>
      <p style={{ fontSize: 28, fontWeight: 400, color: '#fff', lineHeight: 1.4, margin: '0 0 12px' }}>Take Charge of Your<br /><strong>Investments with Us</strong></p>
    </div>
    <img src={loginSvg} alt="illustration" style={{ position: 'relative', zIndex: 1, width: 220, height: 220 }} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 8 }}>
      <span style={{ display: 'block', width: 16, height: 8, background: '#555', borderRadius: 50 }} />
      <span style={{ display: 'block', width: 8, height: 8, background: 'rgba(255,255,255,0.35)', borderRadius: '50%' }} />
      <span style={{ display: 'block', width: 8, height: 8, background: 'rgba(255,255,255,0.35)', borderRadius: '50%' }} />
    </div>
  </section>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ForgotCredentials() {
  const navigate = useNavigate();

  // ── Tab ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'password' | 'userid'>('password');

  // ── Forgot Password state ─────────────────────────────────────────────────
  const [fpStep, setFpStep]               = useState<'form' | 'otp' | 'setpwd'>('form');
  const [fpUsername, setFpUsername]       = useState('');
  const [fpPan, setFpPan]                 = useState('');
  const [fpUsernameErr, setFpUsernameErr] = useState('');
  const [fpPanErr, setFpPanErr]           = useState('');
  const [fpOtp, setFpOtp]                 = useState('');
  const [fpOtpErr, setFpOtpErr]           = useState('');
  const [fpNewPwd, setFpNewPwd]               = useState('');
  const [fpShowNewPwd, setFpShowNewPwd]       = useState(false);
  const [fpNewPwdErr, setFpNewPwdErr]         = useState('');
  const [fpConfirmPwd, setFpConfirmPwd]       = useState('');
  const [fpShowConfirmPwd, setFpShowConfirmPwd] = useState(false);
  const [fpConfirmPwdErr, setFpConfirmPwdErr] = useState('');
  const [fpApiErr, setFpApiErr]               = useState('');
  const [fpLoading, setFpLoading]             = useState(false);

  // ── Forgot User ID state ──────────────────────────────────────────────────
  const [fuPan, setFuPan]           = useState('');
  const [fuEmail, setFuEmail]       = useState('');
  const [fuPanErr, setFuPanErr]     = useState('');
  const [fuEmailErr, setFuEmailErr] = useState('');
  const [fuApiErr, setFuApiErr]     = useState('');
  const [fuLoading, setFuLoading]   = useState(false);

  // ── Shared ────────────────────────────────────────────────────────────────
  const [greenToast, setGreenToast] = useState('');

  // ── Styles ────────────────────────────────────────────────────────────────
  const label: React.CSSProperties   = { fontSize: 12, fontWeight: 500, color: '#555555' };
  const fieldSt: React.CSSProperties = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
  const wrap = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
  const errTxt: React.CSSProperties  = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
  const lnk: React.CSSProperties     = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };
  const hintTxt: React.CSSProperties = { fontSize: 11, color: '#9D9D9D', marginTop: 4 };

  // ── Tab switch ────────────────────────────────────────────────────────────
  const switchTab = (tab: 'password' | 'userid') => {
    setActiveTab(tab);
    setFpStep('form'); setFpUsername(''); setFpPan(''); setFpOtp('');
    setFpOtpErr(''); setFpNewPwd(''); setFpConfirmPwd('');
    setFpApiErr(''); setFpPanErr(''); setFpUsernameErr(''); setFpNewPwdErr(''); setFpConfirmPwdErr('');
    setFuPan(''); setFuEmail(''); setFuApiErr(''); setFuPanErr(''); setFuEmailErr('');
  };

  // ── Forgot Password Step 1: Proceed ───────────────────────────────────────
  const handleFpProceed = async () => {
    let valid = true;
    if (!fpUsername.trim()) { setFpUsernameErr('Client ID is required.'); valid = false; } else setFpUsernameErr('');
    if (!fpPan.trim()) { setFpPanErr('PAN is required.'); valid = false; }
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(fpPan.trim())) { setFpPanErr('Invalid PAN format (e.g., ABCDE1234F)'); valid = false; }
    else setFpPanErr('');
    if (!valid) return;

    setFpApiErr(''); setFpLoading(true);
    try {
      await forgotPassword(fpUsername.trim(), fpPan.trim());
      setFpStep('otp');
    } catch (error: any) {
      setFpApiErr(error.response?.data?.errors?.[0]?.errorMessage || 'Failed to send OTP. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  // ── Forgot Password Step 2: Verify OTP ───────────────────────────────────
  const handleFpVerifyOtp = async () => {
    if (fpOtp.length !== OTP_LEN) { setFpOtpErr('Please enter all 4 digits.'); return; }
    setFpOtpErr(''); setFpLoading(true);
    try {
      const res = await forgotPasswordVerifyOtp(fpUsername.trim(), parseInt(fpOtp, 10));
      if (res.message === 'success') {
        setFpStep('setpwd');
      } else {
        setFpOtpErr('OTP verification failed. Please try again.');
      }
    } catch (error: any) {
      setFpOtpErr(error.response?.data?.errors?.[0]?.errorMessage || 'OTP verification failed. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  // ── Forgot Password Step 3: Set Password ─────────────────────────────────
  const handleSetPassword = async () => {
    let valid = true;
    if (!fpNewPwd) { setFpNewPwdErr('Password is required.'); valid = false; }
    else if (fpNewPwd.length < 8) { setFpNewPwdErr('Password must be at least 8 characters.'); valid = false; }
    else setFpNewPwdErr('');

    if (!fpConfirmPwd) { setFpConfirmPwdErr('Please confirm your password.'); valid = false; }
    else if (fpNewPwd !== fpConfirmPwd) { setFpConfirmPwdErr('Passwords do not match.'); valid = false; }
    else setFpConfirmPwdErr('');

    if (!valid) return;

    setFpApiErr(''); setFpLoading(true);
    try {
      const res = await setPassword(fpUsername.trim(), fpNewPwd);
      if (res.message === 'success') {
        setGreenToast('Password updated successfully! Please login again.');
        setTimeout(() => { setGreenToast(''); navigate('/login'); }, 2500);
      } else {
        setFpApiErr('Failed to set password. Please try again.');
      }
    } catch (error: any) {
      setFpApiErr(error.response?.data?.errors?.[0]?.errorMessage || 'Failed to set password. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  // ── Forgot User ID ────────────────────────────────────────────────────────
  const handleForgotUserId = async () => {
    let valid = true;
    if (!fuPan.trim()) { setFuPanErr('PAN is required.'); valid = false; }
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(fuPan.trim())) { setFuPanErr('Invalid PAN format (e.g., ABCDE1234F)'); valid = false; }
    else setFuPanErr('');
    if (!fuEmail.trim()) { setFuEmailErr('Email is required.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fuEmail.trim())) { setFuEmailErr('Invalid email address.'); valid = false; }
    else setFuEmailErr('');
    if (!valid) return;

    setFuApiErr(''); setFuLoading(true);
    try {
      const res = await forgotUserId(fuPan.trim(), fuEmail.trim());
      if (res.message === 'success') {
        setGreenToast('User ID has been sent to your registered email!');
        setTimeout(() => { setGreenToast(''); navigate('/login'); }, 800);
      }
    } catch (error: any) {
      setFuApiErr(error.response?.data?.errors?.[0]?.errorMessage || 'Verification failed. Please check your credentials.');
    } finally {
      setFuLoading(false);
    }
  };

  return (
    <>
      {greenToast && <GreenToast message={greenToast} onClose={() => setGreenToast('')} />}

      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', maxWidth: 1100, minHeight: 600, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: '#fff' }}>

          <LeftPanel />

          {/* RIGHT PANEL */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 48px' }}>
            <div style={{ width: '100%', maxWidth: 350 }}>

              {/* Logo */}
              <img src={logoSvg} alt="Nest logo" style={{ width: 200, height: 150, display: 'block', marginBottom: 8 }} />

              {/* ── TABS ── */}
              <div style={{ display: 'flex', borderBottom: '1px solid #ECEDEE', marginBottom: 28 }}>
                {(['password', 'userid'] as const).map(tab => (
                  <button key={tab} onClick={() => switchTab(tab)}
                    style={{ background: 'none', border: 'none', padding: '10px 0', marginRight: 24, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: activeTab === tab ? '#0F62FE' : '#9D9D9D', borderBottom: `2px solid ${activeTab === tab ? '#0F62FE' : 'transparent'}`, marginBottom: -1, transition: 'color 0.2s, border-color 0.2s' }}>
                    {tab === 'password' ? 'Forgot Password' : 'Forgot User ID'}
                  </button>
                ))}
              </div>

              {/* ══ FORGOT PASSWORD ══ */}
              {activeTab === 'password' && (
                <>
                  {/* Step 1: Client ID + PAN */}
                  {fpStep === 'form' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={label}>Client ID</label>
                        <div style={wrap(!!fpUsernameErr)}>
                          <input type="text" placeholder="Enter user ID" style={fieldSt}
                            value={fpUsername} onChange={e => { setFpUsername(e.target.value); setFpUsernameErr(''); }} />
                        </div>
                        {fpUsernameErr && <span style={errTxt}>{fpUsernameErr}</span>}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={label}>PAN</label>
                        <div style={wrap(!!fpPanErr)}>
                          <input type="text" placeholder="Enter PAN" style={fieldSt} maxLength={10}
                            value={fpPan} onChange={e => { setFpPan(e.target.value.toUpperCase()); setFpPanErr(''); }} />
                        </div>
                        {fpPanErr && <span style={errTxt}>{fpPanErr}</span>}
                      </div>
                      {fpApiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>{fpApiErr}</p>}
                      <ActionBtn onClick={handleFpProceed} disabled={fpLoading}>
                        {fpLoading ? 'Please wait...' : 'Proceed'}
                      </ActionBtn>
                      <div style={{ marginTop: 12 }}>
                        <button type="button" style={lnk} onClick={() => navigate('/login')}>← Go back</button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: OTP */}
                  {fpStep === 'otp' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#555', margin: '0 0 4px' }}>Enter OTP</p>
                      <p style={{ fontSize: 12, color: '#707071', margin: '0 0 24px' }}>OTP sent to your registered mobile / email</p>
                      <OtpBoxInput value={fpOtp} onChange={v => { setFpOtp(v); setFpOtpErr(''); }} error={fpOtpErr} />
                      <ActionBtn onClick={handleFpVerifyOtp} disabled={fpLoading}>
                        {fpLoading ? 'Verifying...' : 'Verify OTP'}
                      </ActionBtn>
                      <div style={{ marginTop: 12 }}>
                        <button type="button" style={lnk} onClick={() => { setFpStep('form'); setFpOtp(''); setFpOtpErr(''); }}>← Go back</button>
                      </div>
                    </div>
                  )}

                  {fpStep === 'setpwd' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2A2A2B', margin: '0 0 24px' }}>Set your new password</h2>

                      {/* New Password */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={label}>New Password</label>
                        <div style={wrap(!!fpNewPwdErr)}>
                          <input type={fpShowNewPwd ? 'text' : 'password'} placeholder="Enter new password" style={fieldSt}
                            value={fpNewPwd} onChange={e => { setFpNewPwd(e.target.value); setFpNewPwdErr(''); }} />
                          <button type="button" onClick={() => setFpShowNewPwd(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                            {fpShowNewPwd ? <EyeOn /> : <EyeOff />}
                          </button>
                        </div>
                        {fpNewPwdErr
                          ? <span style={errTxt}>{fpNewPwdErr}</span>
                          : <span style={hintTxt}>Minimum 8 characters</span>
                        }
                      </div>

                      {/* Confirm Password */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={label}>Reconfirm Password</label>
                        <div style={wrap(!!fpConfirmPwdErr)}>
                          <input type={fpShowConfirmPwd ? 'text' : 'password'} placeholder="Re-enter new password" style={fieldSt}
                            value={fpConfirmPwd} onChange={e => { setFpConfirmPwd(e.target.value); setFpConfirmPwdErr(''); }} />
                          <button type="button" onClick={() => setFpShowConfirmPwd(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                            {fpShowConfirmPwd ? <EyeOn /> : <EyeOff />}
                          </button>
                        </div>
                        {fpConfirmPwdErr && <span style={errTxt}>{fpConfirmPwdErr}</span>}
                      </div>

                      {fpApiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>{fpApiErr}</p>}

                      <ActionBtn onClick={handleSetPassword} disabled={fpLoading}>
                        {fpLoading ? 'Setting password...' : 'Set Password'}
                      </ActionBtn>
                    </div>
                  )}
                </>
              )}

              {/* ══ FORGOT USER ID ══ */}
              {activeTab === 'userid' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={label}>PAN Number</label>
                    <div style={wrap(!!fuPanErr)}>
                      <input type="text" placeholder="Enter PAN Number" style={fieldSt} maxLength={10}
                        value={fuPan} onChange={e => { setFuPan(e.target.value.toUpperCase()); setFuPanErr(''); }} />
                    </div>
                    {fuPanErr && <span style={errTxt}>{fuPanErr}</span>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={label}>Email ID</label>
                    <div style={wrap(!!fuEmailErr)}>
                      <input type="email" placeholder="Enter Email ID" style={fieldSt}
                        value={fuEmail} onChange={e => { setFuEmail(e.target.value); setFuEmailErr(''); }} />
                    </div>
                    {fuEmailErr && <span style={errTxt}>{fuEmailErr}</span>}
                  </div>
                  {fuApiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>{fuApiErr}</p>}
                  <ActionBtn onClick={handleForgotUserId} disabled={fuLoading}>
                    {fuLoading ? 'Please wait...' : 'Submit'}
                  </ActionBtn>
                  <div style={{ marginTop: 12 }}>
                    <button type="button" style={lnk} onClick={() => navigate('/login')}>← Back to Login</button>
                  </div>
                </div>
              )}

            </div>
          </section>
        </div>
      </main>
    </>
  );
}