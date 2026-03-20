import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, forgotPasswordVerifyOtp, setPassword } from '../../../../api/auth.api';
import { OtpBoxInput, OTP_LEN } from '../../../../shared/components/OtpBoxInput';
import { ActionBtn } from '../../../../shared/components/ActionBtn';
import { SetPasswordStep } from './SetPasswordStep';

interface ForgotPasswordFlowProps {
  onSuccess: (msg: string) => void;
}

export const ForgotPasswordFlow = ({ onSuccess }: ForgotPasswordFlowProps) => {
  const navigate  = useNavigate();
  const [step, setStep]           = useState<'form' | 'otp' | 'setpwd'>('form');
  const [username, setUsername]   = useState('');
  const [pan, setPan]             = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [panErr, setPanErr]       = useState('');
  const [otp, setOtp]             = useState('');
  const [otpErr, setOtpErr]       = useState('');
  const [apiErr, setApiErr]       = useState('');
  const [loading, setLoading]     = useState(false);

  const label: React.CSSProperties  = { fontSize: 12, fontWeight: 500, color: '#555555' };
  const fieldSt: React.CSSProperties = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
  const wrap = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
  const errTxt: React.CSSProperties = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
  const lnk: React.CSSProperties    = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };

  const handleProceed = async () => {
    let valid = true;
    if (!username.trim()) { setUsernameErr('Client ID is required.'); valid = false; } else setUsernameErr('');
    if (!pan.trim()) { setPanErr('PAN is required.'); valid = false; }
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) { setPanErr('Invalid PAN format (e.g., ABCDE1234F)'); valid = false; }
    else setPanErr('');
    if (!valid) return;
    setApiErr(''); setLoading(true);
    try { await forgotPassword(username.trim(), pan.trim()); setStep('otp'); }
    catch (e: any) { setApiErr(e.response?.data?.errors?.[0]?.errorMessage || 'Failed to send OTP.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LEN) { setOtpErr('Please enter all 4 digits.'); return; }
    setOtpErr(''); setLoading(true);
    try {
      const res = await forgotPasswordVerifyOtp(username.trim(), parseInt(otp, 10));
      if (res.message === 'success') setStep('setpwd');
      else setOtpErr('OTP verification failed. Please try again.');
    }
    catch (e: any) { setOtpErr(e.response?.data?.errors?.[0]?.errorMessage || 'OTP verification failed.'); }
    finally { setLoading(false); }
  };

  const handleSetPassword = async (newPwd: string) => {
    setApiErr(''); setLoading(true);
    try {
      const res = await setPassword(username.trim(), newPwd);
      if (res.message === 'success') onSuccess('Password updated successfully! Please login again.');
      else setApiErr('Failed to set password. Please try again.');
    }
    catch (e: any) { setApiErr(e.response?.data?.errors?.[0]?.errorMessage || 'Failed to set password.'); }
    finally { setLoading(false); }
  };

  if (step === 'form') return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Client ID</label>
        <div style={wrap(!!usernameErr)}>
          <input type="text" placeholder="Enter user ID" style={fieldSt} value={username} onChange={e => { setUsername(e.target.value); setUsernameErr(''); }} />
        </div>
        {usernameErr && <span style={errTxt}>{usernameErr}</span>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>PAN</label>
        <div style={wrap(!!panErr)}>
          <input type="text" placeholder="Enter PAN" style={fieldSt} maxLength={10} value={pan} onChange={e => { setPan(e.target.value.toUpperCase()); setPanErr(''); }} />
        </div>
        {panErr && <span style={errTxt}>{panErr}</span>}
      </div>
      {apiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>{apiErr}</p>}
      <ActionBtn onClick={handleProceed} disabled={loading}>{loading ? 'Please wait...' : 'Proceed'}</ActionBtn>
      <div style={{ marginTop: 12 }}><button style={lnk} onClick={() => navigate('/login')}>← Go back</button></div>
    </div>
  );

  if (step === 'otp') return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#555', margin: '0 0 4px' }}>Enter OTP</p>
      <p style={{ fontSize: 12, color: '#707071', margin: '0 0 24px' }}>OTP sent to your registered mobile / email</p>
      <OtpBoxInput value={otp} onChange={v => { setOtp(v); setOtpErr(''); }} error={otpErr} />
      <ActionBtn onClick={handleVerifyOtp} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</ActionBtn>
      <div style={{ marginTop: 12 }}><button style={lnk} onClick={() => { setStep('form'); setOtp(''); setOtpErr(''); }}>← Go back</button></div>
    </div>
  );

  return <SetPasswordStep onSubmit={handleSetPassword} apiErr={apiErr} loading={loading} />;
};