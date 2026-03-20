import { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LoginInputs } from '../schema/login.schema';
import { ActionBtn } from '../../../shared/components/ActionBtn';

const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

interface LoginStepProps {
  register: UseFormRegister<LoginInputs>;
  errors: FieldErrors<LoginInputs>;
  isSubmitting: boolean;
  loginApiErr: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onForgot: () => void;
}

export const LoginStep = ({ register, errors, isSubmitting, loginApiErr, onSubmit, onForgot }: LoginStepProps) => {
  const [showPwd, setShowPwd] = useState(false);

  const label: React.CSSProperties  = { fontSize: 12, fontWeight: 500, color: '#555555' };
  const field: React.CSSProperties  = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
  const wrap = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
  const errText: React.CSSProperties = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
  const lnk: React.CSSProperties    = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Mobile no. / Email / Client ID</label>
        <div style={wrap(!!errors.email || !!loginApiErr)}>
          <input type="text" placeholder="Enter Mobile no. / Email" style={field} {...register('email')} />
        </div>
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
      <ActionBtn type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Please wait...' : 'Login'}
      </ActionBtn>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <button type="button" style={lnk} onClick={onForgot}>Forgot user ID or password?</button>
        <button type="button" style={lnk}>Guest login</button>
      </div>
    </form>
  );
};