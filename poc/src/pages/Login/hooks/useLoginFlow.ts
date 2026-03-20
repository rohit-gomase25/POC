import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preAuthHandshake, login, validateOtp } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/useAuthStore';

const OTP_LEN = 4;

export const useLoginFlow = () => {
  const navigate = useNavigate();
  const [step, setStep]               = useState<'login' | 'otp'>('login');
  const [username, setUsername]       = useState('');
  const [otp, setOtp]                 = useState('');
  const [otpErr, setOtpErr]           = useState('');
  const [loginApiErr, setLoginApiErr] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(3);
  const [verifying, setVerifying]     = useState(false);
  const [redToast, setRedToast]       = useState('');
  const [greenToast, setGreenToast]   = useState('');
  const [showBlocked, setShowBlocked] = useState(false);

  const setHandshake = useAuthStore(s => s.setHandshake);
  const setAuth      = useAuthStore(s => s.setAuth);

  // ── Hit pre-auth handshake on page load ───────────────────────────────────
  useEffect(() => {
    const doHandshake = async () => {
      try {
        const hs = await preAuthHandshake();
        setHandshake(hs.bffPublicKey);
      } catch (error) {
        console.error('Pre-auth handshake failed:', error);
      }
    };
    doHandshake();
  }, []);

  const resetToLogin = () => {
    setStep('login'); setOtp(''); setOtpErr('');
    setOtpAttempts(3); setLoginApiErr('');
  };

  const onLogin = async (data: { email: string; password: string }) => {
    setLoginApiErr('');
    try {
      const res = await login(data.email, data.password);
      if (res.message === 'success') {
        setUsername(data.email);
        setStep('otp'); setOtp(''); setOtpErr(''); setOtpAttempts(3);
      } else {
        setLoginApiErr('Invalid Username or Password.');
      }
    } catch (error: any) {
      if (error?.response?.status === 423) {
        setUsername(data.email);
        setShowBlocked(true);
      } else {
        setLoginApiErr('Invalid Username or Password.');
      }
    }
  };

  const onVerify = async () => {
    if (!/^\d+$/.test(otp)) { setOtpErr('OTP must contain only numbers.'); return; }
    if (otp.length < OTP_LEN) { setOtpErr('Please enter all 4 digits.'); return; }
    if (otpAttempts <= 0) return;
    setOtpErr(''); setVerifying(true);
    try {
      const res = await validateOtp(username, otp);
      setAuth(res, res.jwtTokens);
    } catch {
      const remaining = otpAttempts - 1;
      setOtpAttempts(remaining);
      if (remaining > 0) {
        setOtpErr(`Wrong OTP, ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`);
      } else {
        setOtp(''); setOtpErr('');
        setRedToast('Login again');
        setTimeout(() => { setRedToast(''); resetToLogin(); }, 1500);
      }
    } finally { setVerifying(false); }
  };

  const onUnblocked = () => {
    setShowBlocked(false);
    resetToLogin();
    setGreenToast('Your account is unblocked. Please login again.');
    setTimeout(() => { setGreenToast(''); navigate('/login'); }, 2500);
  };

  return {
    step, username, otp, setOtp, otpErr, loginApiErr,
    otpAttempts, verifying, redToast, setRedToast,
    greenToast, setGreenToast, showBlocked, setShowBlocked,
    resetToLogin, onLogin, onVerify, onUnblocked,
  };
};