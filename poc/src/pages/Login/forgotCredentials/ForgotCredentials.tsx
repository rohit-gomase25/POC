import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { forgotSchema, type ForgotInputs } from '../schema/forgot.schema';
import { forgotUserId } from '../../../api/auth.api';
import logoSvg from '../../../assets/logo.svg';
import loginSvg from '../../../assets/login.svg';

// ─── Green Toaster ────────────────────────────────────────────────────────────
const Toaster = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#16a34a', color: '#fff', padding: '14px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, minWidth: 280 }}>
        <span>✓</span>
        <span style={{ flex: 1 }}>{message}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
    </div>
);

// ─── Hover Action Button ──────────────────────────────────────────────────────
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

// ─── Forgot Credentials Page ──────────────────────────────────────────────────
export default function ForgotCredentials() {
    const navigate = useNavigate();
    const [toast, setToast] = useState('');
    const [apiErr, setApiErr] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ForgotInputs>({ resolver: zodResolver(forgotSchema) });

    const onSubmit = async (data: ForgotInputs) => {
        setApiErr('');
        try {
            const res = await forgotUserId(data.pan, data.email);
            if (res.message === 'success') {
                setToast('User ID has been sent to your registered email!');
                setTimeout(() => { setToast(''); navigate('/login'); }, 800);
            }
        } catch {
            setApiErr('Verification failed. Please check your credentials.');
        }
    };

    const label: React.CSSProperties  = { fontSize: 12, fontWeight: 500, color: '#555555' };
    const field: React.CSSProperties  = { border: 'none', outline: 'none', flex: 1, fontSize: 14, fontWeight: 500, color: '#2A2A2B', background: 'transparent', minWidth: 0 };
    const wrap  = (err?: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, height: 48, border: `1px solid ${err ? '#E24B4A' : '#ECEDEE'}`, borderRadius: 4, background: err ? '#fdf5f5' : '#fff' });
    const errTxt: React.CSSProperties = { fontSize: 11, color: '#E24B4A', marginTop: 2 };
    const lnk: React.CSSProperties   = { background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#0F62FE', cursor: 'pointer', padding: '8px 0' };

    return (
        <>
            {toast && <Toaster message={toast} onClose={() => setToast('')} />}

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
                                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#2A2A2B', margin: 0 }}>Forgot User ID</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={label}>PAN Number</label>
                                    <div style={wrap(!!errors.pan)}>
                                        <input type="text" placeholder="Enter PAN Number" style={field}
                                            {...register('pan', { onChange: (e) => setValue('pan', e.target.value.toUpperCase()) })} />
                                    </div>
                                    {errors.pan && <span style={errTxt}>{errors.pan.message}</span>}
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={label}>Email ID</label>
                                    <div style={wrap(!!errors.email)}>
                                        <input type="email" placeholder="Enter Email ID" style={field} {...register('email')} />
                                    </div>
                                    {errors.email && <span style={errTxt}>{errors.email.message}</span>}
                                </div>
                                {apiErr && <p style={{ ...errTxt, textAlign: 'center', marginBottom: 10, fontWeight: 600 }}>{apiErr}</p>}
                                <ActionBtn type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Please wait...' : 'Submit'}
                                </ActionBtn>
                                <div style={{ marginTop: 12 }}>
                                    <button type="button" style={lnk} onClick={() => navigate('/login')}>← Back to Login</button>
                                </div>
                            </form>

                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}