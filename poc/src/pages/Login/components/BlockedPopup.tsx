import { useState, useRef } from 'react';
import { unblockUser, authenticateOtp } from '../../../api/auth.api';

interface BlockedPopupProps {
  username: string;
  onUnblocked: () => void;
  onClose: () => void;
}

const OTP_LEN = 4;

export default function BlockedPopup({ username, onUnblocked, onClose }: BlockedPopupProps) {
  // Step 1: PAN entry → call unblock-user
  // Step 2: OTP entry → call authenticate-otp
  const [step, setStep]       = useState<'pan' | 'otp'>('pan');
  const [pan, setPan]         = useState('');
  const [otp, setOtp]         = useState('');
  const [err, setErr]         = useState('');
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: OTP_LEN }, (_, i) => otp[i] ?? '');

  // ─── OTP box handlers ────────────────────────────────────────────────────────
  const update = (i: number, c: string) => {
    const n = [...digits]; n[i] = c; setOtp(n.join(''));
  };
  const onCh = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.replace(/\D/g, '').slice(-1);
    update(i, c);
    if (c && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };
  const onKd = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (digits[i]) update(i, '');
      else if (i > 0) refs.current[i - 1]?.focus();
    }
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN);
    if (p) { setOtp(p.padEnd(OTP_LEN, '').slice(0, OTP_LEN)); refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus(); }
    e.preventDefault();
  };

  // ─── Step 1: Submit PAN → hit unblock-user API ───────────────────────────────
  const handleUnblockRequest = async () => {
    if (!pan || pan.trim().length < 5) { setErr('Please enter a valid PAN number.'); return; }
    setErr(''); setLoading(true);
    try {
      await unblockUser(username, pan.trim().toUpperCase());
      // OTP sent — move to OTP step
      setStep('otp');
    } catch (error: any) {
      setErr(error.response?.data?.errors?.[0]?.errorMessage || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Submit OTP → hit authenticate-otp API ──────────────────────────
  const handleVerifyOtp = async () => {
    const otpStr = digits.join('');
    if (otpStr.length !== OTP_LEN) { setErr('Please enter all 4 digits.'); return; }
    setErr(''); setLoading(true);
    try {
      const res = await authenticateOtp(username, parseInt(otpStr, 10));
      if (res.message === 'success') {
        onUnblocked();
      } else {
        setErr('OTP verification failed. Please try again.');
      }
    } catch (error: any) {
      setErr(error.response?.data?.errors?.[0]?.errorMessage || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const boxBase: React.CSSProperties = {
    position: 'relative', width: 56, height: 56, borderRadius: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>

        {/* Lock icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Account Blocked</h2>
        <p style={{ fontSize: 13, color: '#707071', margin: '0 0 24px', lineHeight: 1.6 }}>
          Your account has been blocked due to multiple incorrect password attempts.<br />
          {step === 'pan'
            ? 'Enter your PAN number to receive an OTP.'
            : 'Enter the OTP sent to your registered mobile / email to unblock.'}
        </p>

        {/* ── STEP 1: PAN input ── */}
        {step === 'pan' && (
          <>
            <input
              type="text"
              placeholder="Enter PAN Number"
              value={pan}
              maxLength={10}
              onChange={e => { setPan(e.target.value.toUpperCase()); setErr(''); }}
              style={{ width: '100%', height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, fontSize: 15, fontWeight: 500, textAlign: 'center', letterSpacing: 2, outline: 'none', boxSizing: 'border-box', marginBottom: 4, color: '#2A2A2B' }}
            />
            {err && <p style={{ fontSize: 11, color: '#E24B4A', marginBottom: 8 }}>{err}</p>}
            <button
              onClick={handleUnblockRequest}
              disabled={loading}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ width: '100%', height: 48, border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, transition: 'background 0.2s, color 0.2s', background: hovered && !loading ? '#0F62FE' : '#ECEDEE', color: hovered && !loading ? '#fff' : '#9D9D9D', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {/* ── STEP 2: OTP input ── */}
        {step === 'otp' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              {digits.map((d, i) => (
                <div key={i} style={{ ...boxBase, border: `1px solid ${err ? '#E24B4A' : d ? '#0F62FE' : '#ECEDEE'}`, flex: 1 }}>
                  <input
                    ref={el => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => onCh(i, e)}
                    onKeyDown={e => onKd(i, e)}
                    onPaste={onPaste}
                    autoComplete="one-time-code"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 20, fontWeight: 600, textAlign: 'center', caretColor: '#0F62FE', zIndex: 1 }}
                  />
                  {!d && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ECEDEE' }} />}
                </div>
              ))}
            </div>
            {err && <p style={{ fontSize: 11, color: '#E24B4A', marginBottom: 8 }}>{err}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ width: '100%', height: 48, border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, transition: 'background 0.2s, color 0.2s', background: hovered && !loading ? '#0F62FE' : '#ECEDEE', color: hovered && !loading ? '#fff' : '#9D9D9D', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Verifying...' : 'Unblock Account'}
            </button>
            {/* Back to PAN step */}
            <button
              onClick={() => { setStep('pan'); setOtp(''); setErr(''); }}
              style={{ marginTop: 10, background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer' }}>
              ← Change PAN
            </button>
          </>
        )}

        {/* Cancel */}
        <button onClick={onClose} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#707071', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}