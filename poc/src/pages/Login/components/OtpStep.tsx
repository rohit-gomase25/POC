import { useState, useEffect } from 'react';
import { OtpBoxInput } from '../../../shared/components/OtpBoxInput';
import { ActionBtn } from '../../../shared/components/ActionBtn';

interface OtpStepProps {
  username: string;
  otp: string;
  otpErr: string;
  verifying: boolean;
  otpAttempts: number;
  onOtpChange: (v: string) => void;
  onVerify: () => void;
  onBack: () => void;
  onResend: () => void;
}

const ResendTimer = ({ onResend }: { onResend: () => void }) => {
  const [secs, setSecs] = useState(30);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const fmt = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, marginBottom: 4 }}>
      {secs > 0
        ? <span style={{ fontSize: 12, color: '#707071' }}>Resend in {fmt(Math.floor(secs / 60))}:{fmt(secs % 60)}</span>
        : <button type="button" onClick={() => { setSecs(30); onResend(); }} style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer' }}>Resend OTP</button>}
    </div>
  );
};

export const OtpStep = ({ username, otp, otpErr, verifying, otpAttempts, onOtpChange, onVerify, onBack, onResend }: OtpStepProps) => {
  const lnk: React.CSSProperties = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#555', margin: '0 0 4px' }}>Enter OTP</p>
      <p style={{ fontSize: 12, color: '#707071', margin: '0 0 24px' }}>OTP Sent on {username}</p>
      <OtpBoxInput value={otp} onChange={onOtpChange} error={otpErr} />
      <ResendTimer onResend={onResend} />
      <ActionBtn onClick={onVerify} disabled={verifying || otpAttempts <= 0}>
        {verifying ? 'Verifying...' : 'Verify'}
      </ActionBtn>
      <div style={{ marginTop: 12 }}>
        <button type="button" style={lnk} onClick={onBack}>← Back to Login</button>
      </div>
    </div>
  );
};