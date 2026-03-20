import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schema/login.schema';
import type { LoginInputs } from './schema/login.schema';
import { useNavigate } from 'react-router-dom';
import { LeftPanel } from '../../shared/components/LeftPanel';
import { RedToast, GreenToast } from '../../shared/components/Toast';
import { LoginStep } from './components/LoginStep';
import { OtpStep } from './components/OtpStep';
import BlockedPopup from './components/BlockedPopup';
import { useLoginFlow } from './hooks/useLoginFlow';
import logoSvg from '../../assets/logo.svg';

export default function Login() {
  const navigate = useNavigate();
  const {
    step, username, otp, setOtp, otpErr, loginApiErr,
    otpAttempts, verifying, redToast, setRedToast,
    greenToast, setGreenToast, showBlocked, setShowBlocked,
    resetToLogin, onLogin, onVerify, onUnblocked,
  } = useLoginFlow();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <>
      {redToast   && <RedToast   message={redToast}   onClose={() => setRedToast('')}   />}
      {greenToast && <GreenToast message={greenToast} onClose={() => setGreenToast('')} />}

      {showBlocked && (
        <BlockedPopup
          username={username}
          onUnblocked={onUnblocked}
          onClose={() => setShowBlocked(false)}
        />
      )}

      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', maxWidth: 1100, minHeight: 600, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: '#fff' }}>

          <LeftPanel />

          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 48px' }}>
            <div style={{ width: '100%', maxWidth: 350 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                <img src={logoSvg} alt="Nest logo" style={{ width: 200, height: 150, display: 'block' }} />
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#2A2A2B', margin: 0 }}>Welcome to Nest app</h2>
              </div>

              {step === 'login' && (
                <LoginStep
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  loginApiErr={loginApiErr}
                  onSubmit={handleSubmit(onLogin)}
                  onForgot={() => navigate('/forgot-credentials')}
                />
              )}

              {step === 'otp' && (
                <OtpStep
                  username={username}
                  otp={otp}
                  otpErr={otpErr}
                  verifying={verifying}
                  otpAttempts={otpAttempts}
                  onOtpChange={setOtp}
                  onVerify={onVerify}
                  onBack={resetToLogin}
                  onResend={() => { setOtp(''); }}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}