import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotUserId } from '../../../../api/auth.api';
import { ActionBtn } from '../../../../shared/components/ActionBtn';

interface ForgotUserIdFormProps {
  onSuccess: (msg: string) => void;
}

export const ForgotUserIdForm = ({ onSuccess }: ForgotUserIdFormProps) => {
  const navigate = useNavigate();
  const [pan, setPan]         = useState('');
  const [email, setEmail]     = useState('');
  const [panErr, setPanErr]   = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [apiErr, setApiErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const label: React.CSSProperties   = { fontSize: 12, fontWeight: 500, color: '#555555' };
  const fieldSt: React.CSSProperties = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
  const wrap = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
  const errTxt: React.CSSProperties  = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
  const lnk: React.CSSProperties     = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };

  const handleSubmit = async () => {
    let valid = true;
    if (!pan.trim()) { setPanErr('PAN is required.'); valid = false; }
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) { setPanErr('Invalid PAN format (e.g., ABCDE1234F)'); valid = false; }
    else setPanErr('');
    if (!email.trim()) { setEmailErr('Email is required.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr('Invalid email address.'); valid = false; }
    else setEmailErr('');
    if (!valid) return;

    setApiErr(''); setLoading(true);
    try {
      const res = await forgotUserId(pan.trim(), email.trim());
      if (res.message === 'success') onSuccess('User ID has been sent to your registered email!');
    }
    catch (e: any) { setApiErr(e.response?.data?.errors?.[0]?.errorMessage || 'Verification failed. Please check your credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>PAN Number</label>
        <div style={wrap(!!panErr)}>
          <input type="text" placeholder="Enter PAN Number" style={fieldSt} maxLength={10}
            value={pan} onChange={e => { setPan(e.target.value.toUpperCase()); setPanErr(''); }} />
        </div>
        {panErr && <span style={errTxt}>{panErr}</span>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Email ID</label>
        <div style={wrap(!!emailErr)}>
          <input type="email" placeholder="Enter Email ID" style={fieldSt}
            value={email} onChange={e => { setEmail(e.target.value); setEmailErr(''); }} />
        </div>
        {emailErr && <span style={errTxt}>{emailErr}</span>}
      </div>
      {apiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>{apiErr}</p>}
      <ActionBtn onClick={handleSubmit} disabled={loading}>
        {loading ? 'Please wait...' : 'Submit'}
      </ActionBtn>
      <div style={{ marginTop: 12 }}>
        <button style={lnk} onClick={() => navigate('/login')}>← Back to Login</button>
      </div>
    </div>
  );
};