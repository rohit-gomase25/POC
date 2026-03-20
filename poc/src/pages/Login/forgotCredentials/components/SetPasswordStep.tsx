import { useState } from 'react';
import { ActionBtn } from '../../../../shared/components/ActionBtn';

const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

interface SetPasswordStepProps {
  onSubmit: (newPwd: string) => void;
  apiErr: string;
  loading: boolean;
}

export const SetPasswordStep = ({ onSubmit, apiErr, loading }: SetPasswordStepProps) => {
  const [newPwd, setNewPwd]             = useState('');
  const [showNew, setShowNew]           = useState(false);
  const [newPwdErr, setNewPwdErr]       = useState('');
  const [confirmPwd, setConfirmPwd]     = useState('');
  const [showConfirm, setShowConfirm]   = useState(false);
  const [confirmErr, setConfirmErr]     = useState('');

  const label: React.CSSProperties   = { fontSize: 12, fontWeight: 500, color: '#555555' };
  const fieldSt: React.CSSProperties = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
  const wrap = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
  const errTxt: React.CSSProperties  = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
  const hintTxt: React.CSSProperties = { fontSize: 11, color: '#9D9D9D', marginTop: 4 };

  const handleSubmit = () => {
    let valid = true;
    if (!newPwd) { setNewPwdErr('Password is required.'); valid = false; }
    else if (newPwd.length < 8) { setNewPwdErr('Password must be at least 8 characters.'); valid = false; }
    else setNewPwdErr('');
    if (!confirmPwd) { setConfirmErr('Please confirm your password.'); valid = false; }
    else if (newPwd !== confirmPwd) { setConfirmErr('Passwords do not match.'); valid = false; }
    else setConfirmErr('');
    if (!valid) return;
    onSubmit(newPwd);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2A2A2B', margin: '0 0 24px' }}>Set your new password</h2>

      <div style={{ marginBottom: 16 }}>
        <label style={label}>New Password</label>
        <div style={wrap(!!newPwdErr)}>
          <input type={showNew ? 'text' : 'password'} placeholder="Enter new password" style={fieldSt}
            value={newPwd} onChange={e => { setNewPwd(e.target.value); setNewPwdErr(''); }} />
          <button type="button" onClick={() => setShowNew(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {showNew ? <EyeOn /> : <EyeOff />}
          </button>
        </div>
        {newPwdErr ? <span style={errTxt}>{newPwdErr}</span> : <span style={hintTxt}>Minimum 8 characters</span>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={label}>Reconfirm Password</label>
        <div style={wrap(!!confirmErr)}>
          <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter new password" style={fieldSt}
            value={confirmPwd} onChange={e => { setConfirmPwd(e.target.value); setConfirmErr(''); }} />
          <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {showConfirm ? <EyeOn /> : <EyeOff />}
          </button>
        </div>
        {confirmErr && <span style={errTxt}>{confirmErr}</span>}
      </div>

      {apiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>{apiErr}</p>}
      <ActionBtn onClick={handleSubmit} disabled={loading}>
        {loading ? 'Setting password...' : 'Set Password'}
      </ActionBtn>
    </div>
  );
};