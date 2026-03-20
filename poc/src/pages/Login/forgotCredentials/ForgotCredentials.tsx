import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftPanel } from '../../../shared/components/LeftPanel';
import { GreenToast } from '../../../shared/components/Toast';
import { ForgotPasswordFlow } from './components/ForgotPasswordFlow';
import { ForgotUserIdForm } from './components/ForgotUserIdForm';
import logoSvg from '../../../assets/logo.svg';

type Tab = 'password' | 'userid';

export default function ForgotCredentials() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState<Tab>('password');
  const [greenToast, setGreenToast]   = useState('');

  const handleSuccess = (msg: string) => {
    setGreenToast(msg);
    setTimeout(() => { setGreenToast(''); navigate('/login'); }, msg.includes('User ID') ? 800 : 2500);
  };

  return (
    <>
      {greenToast && <GreenToast message={greenToast} onClose={() => setGreenToast('')} />}

      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', maxWidth: 1100, minHeight: 600, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: '#fff' }}>

          <LeftPanel />

          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 48px' }}>
            <div style={{ width: '100%', maxWidth: 350 }}>

              <img src={logoSvg} alt="Nest logo" style={{ width: 200, height: 150, display: 'block', marginBottom: 8 }} />

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #ECEDEE', marginBottom: 28 }}>
                {(['password', 'userid'] as Tab[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ background: 'none', border: 'none', padding: '10px 0', marginRight: 24, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: activeTab === tab ? '#0F62FE' : '#9D9D9D', borderBottom: `2px solid ${activeTab === tab ? '#0F62FE' : 'transparent'}`, marginBottom: -1, transition: 'color 0.2s, border-color 0.2s' }}>
                    {tab === 'password' ? 'Forgot Password' : 'Forgot User ID'}
                  </button>
                ))}
              </div>

              {activeTab === 'password' && (
                <ForgotPasswordFlow onSuccess={handleSuccess} />
              )}
              {activeTab === 'userid' && (
                <ForgotUserIdForm onSuccess={handleSuccess} />
              )}

            </div>
          </section>
        </div>
      </main>
    </>
  );
}