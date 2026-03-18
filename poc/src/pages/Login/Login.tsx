import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schema/login.schema';
import type { LoginInputs } from './schema/login.schema';
import { preAuthHandshake, login, validateOtp } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';
import logoSvg from '../../assets/logo.svg';
import loginSvg from '../../assets/login.svg';
import { useNavigate } from 'react-router-dom';

// ─── Eye Icons ────────────────────────────────────────────────────────────────
const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

// ─── Red Toast ────────────────────────────────────────────────────────────────
const RedToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#dc2626', color: '#fff', padding: '14px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, minWidth: 280 }}>
    <span>✕</span>
    <span style={{ flex: 1 }}>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
  </div>
);

// ─── OTP Input ────────────────────────────────────────────────────────────────
const OTP_LEN = 4;
const OtpBoxInput = ({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LEN }, (_, i) => value[i] ?? '');
  const update = (i: number, c: string) => { const n = [...digits]; n[i] = c; onChange(n.join('')); };
  const onCh = (i: number, e: React.ChangeEvent<HTMLInputElement>) => { const c = e.target.value.replace(/\D/g, '').slice(-1); update(i, c); if (c && i < OTP_LEN - 1) refs.current[i + 1]?.focus(); };
  const onKd = (i: number, e: React.KeyboardEvent) => { if (e.key === 'Backspace') { if (digits[i]) update(i, ''); else if (i > 0) refs.current[i - 1]?.focus(); } };
  const onPaste = (e: React.ClipboardEvent) => { const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN); if (p) { onChange(p.padEnd(OTP_LEN, '').slice(0, OTP_LEN)); refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus(); } e.preventDefault(); };
  const boxBase: React.CSSProperties = { position: 'relative', width: 56, height: 56, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {digits.map((d, i) => (
          <div key={i} style={{ ...boxBase, border: `1px solid ${error ? '#E24B4A' : d ? '#0F62FE' : '#ECEDEE'}` }}>
            <input ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => onCh(i, e)} onKeyDown={e => onKd(i, e)} onPaste={onPaste} autoComplete="one-time-code"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 20, fontWeight: 600, textAlign: 'center', caretColor: '#0F62FE', zIndex: 1 }} />
            {!d && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ECEDEE' }} />}
          </div>
        ))}
      </div>
      {error && <p style={{ fontSize: 11, color: '#E24B4A', marginTop: 8, lineHeight: '1.4' }}>{error}</p>}
    </div>
  );
};

// ─── Resend Timer ─────────────────────────────────────────────────────────────
const ResendTimer = ({ onResend }: { onResend: () => void }) => {
  const [secs, setSecs] = useState(30);
  useEffect(() => { if (secs <= 0) return; const t = setTimeout(() => setSecs(s => s - 1), 1000); return () => clearTimeout(t); }, [secs]);
  const fmt = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, marginBottom: 4 }}>
      {secs > 0
        ? <span style={{ fontSize: 12, color: '#707071' }}>Resend in {fmt(Math.floor(secs / 60))}:{fmt(secs % 60)}</span>
        : <button type="button" onClick={() => { setSecs(30); onResend(); }} style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer' }}>Resend OTP</button>}
    </div>
  );
};

// ─── Hover Button ─────────────────────────────────────────────────────────────
const ActionBtn = ({ children, onClick, type = 'button', disabled }: { children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', height: 48, border: 'none', borderRadius: 4, fontSize: 16, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, opacity: disabled ? 0.6 : 1, transition: 'background 0.2s, color 0.2s', background: hovered && !disabled ? '#0F62FE' : '#ECEDEE', color: hovered && !disabled ? '#ffffff' : '#9D9D9D' }}>
      {children}
    </button>
  );
};

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [step, setStep]               = useState<'login' | 'otp'>('login');
  const [showPwd, setShowPwd]         = useState(false);
  const [username, setUsername]       = useState('');
  const [otp, setOtp]                 = useState('');
  const [otpErr, setOtpErr]           = useState('');
  const [loginApiErr, setLoginApiErr] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(3);
  const [verifying, setVerifying]     = useState(false);
  const [redToast, setRedToast]       = useState('');

  const setHandshake = useAuthStore(s => s.setHandshake);
  const setAuth      = useAuthStore(s => s.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });

  const resetToLogin = () => { setStep('login'); setOtp(''); setOtpErr(''); setOtpAttempts(3); setLoginApiErr(''); };

  const onLogin = async (data: LoginInputs) => {
    setLoginApiErr('');
    try {
      const hs = await preAuthHandshake(); setHandshake(hs.bffPublicKey);
      const res = await login(data.email, data.password);
      if (res.message === 'success') {
        setUsername(data.email); setStep('otp'); setOtp(''); setOtpErr(''); setOtpAttempts(3);
      } else {
        setLoginApiErr('Invalid Username or Password');
      }
    } catch { setLoginApiErr('Invalid Username or Password'); }
  };

  const onVerify = async () => {
    if (!/^\d+$/.test(otp)) { setOtpErr('OTP must contain only numbers.'); return; }
    if (otp.length < OTP_LEN) { setOtpErr('Please enter all 4 digits.'); return; }
    if (otpAttempts <= 0) return;
    setOtpErr(''); setVerifying(true);
    try {
      const res = await validateOtp(username, otp); setAuth(res, res.jwtTokens);
    } catch {
      const remaining = otpAttempts - 1;
      setOtpAttempts(remaining);
      if (remaining > 0) {
        // Show inline red error with remaining attempts
        setOtpErr(`Wrong OTP, ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`);
      } else {
        // 0 attempts — red toast then navigate back to login
        setOtp('');
        setOtpErr('');
        setRedToast('Login again');
        setTimeout(() => { setRedToast(''); resetToLogin(); }, 500);
      }
    } finally { setVerifying(false); }
  };

  const label: React.CSSProperties   = { fontSize: 12, fontWeight: 500, color: '#555555' };
  const field: React.CSSProperties   = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
  const wrap  = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
  const errText: React.CSSProperties = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
  const lnk: React.CSSProperties     = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };

  return (
    <>
      {redToast && <RedToast message={redToast} onClose={() => setRedToast('')} />}

      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', maxWidth: 1100, minHeight: 600, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: '#fff' }}>

          {/* LEFT */}
          <section style={{ flex: 1, background: '#0F62FE', padding: '48px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,0.08) 1.5px,transparent 1.5px)`, backgroundSize: '14px 14px', maskImage: 'radial-gradient(circle at center,black 40%,transparent 90%)', WebkitMaskImage: 'radial-gradient(circle at center,black 40%,transparent 90%)', pointerEvents: 'none' }} />
            {/* Top-left glow */}
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

          {/* RIGHT */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 48px' }}>
            <div style={{ width: '100%', maxWidth: 350 }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                <img src={logoSvg} alt="Nest logo" style={{ width: '200px', height: '150px', display: 'block' }} />
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#2A2A2B', margin: 0 }}>Welcome to Nest app</h2>
              </div>

              {step === 'login' && (
                <form onSubmit={handleSubmit(onLogin)} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={label}>Mobile no. / Email / Client ID</label>
                    <div style={wrap(!!errors.email || !!loginApiErr)}><input type="text" placeholder="Enter Mobile no. / Email" style={field} {...register('email')} /></div>
                    {errors.email && <span style={errText}>{errors.email.message}</span>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={label}>Password / MPIN</label>
                    <div style={wrap(!!errors.password || !!loginApiErr)}>
                      <input type={showPwd ? 'text' : 'password'} placeholder="Enter password / MPIN" style={field} {...register('password')} />
                      <button type="button" onClick={() => setShowPwd(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        {showPwd ? <EyeOn /> : <EyeOff />}
                      </button>
                    </div>
                    {errors.password && <span style={errText}>{errors.password.message}</span>}
                  </div>
                  {loginApiErr && <p style={{ ...errText, textAlign: 'center', marginBottom: 10, fontWeight: 600 }}>{loginApiErr}</p>}
                  <ActionBtn type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : 'Login'}</ActionBtn>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button type="button" style={lnk} onClick={() => navigate('/forgot-credentials')}>Forgot user ID or password?</button>
                    <button type="button" style={lnk}>Guest login</button>
                  </div>
                </form>
              )}

              {step === 'otp' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#555', margin: '0 0 4px' }}>Enter OTP</p>
                  <p style={{ fontSize: 12, color: '#707071', margin: '0 0 24px' }}>OTP Sent on {username}</p>
                  <OtpBoxInput value={otp} onChange={setOtp} error={otpErr} />
                  <ResendTimer onResend={() => { setOtp(''); setOtpErr(''); setOtpAttempts(3); }} />
                  <ActionBtn onClick={onVerify} disabled={verifying || otpAttempts <= 0}>{verifying ? 'Verifying...' : 'Verify'}</ActionBtn>
                  <div style={{ marginTop: 12 }}>
                    <button type="button" style={lnk} onClick={resetToLogin}>← Back to Login</button>
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