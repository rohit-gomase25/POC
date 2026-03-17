import { useAuthStore } from '@/store/useAuthStore';
import Login from '@/pages/Login/Login';
import logoSvg from '@/assets/logo.svg';
import './App.css';

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (isAuthenticated) {
    return (
      <main className="app-root">
        <div className="welcome-card">
          <img src={logoSvg} alt="Nest logo" style={{ width: '150px', height: '156px', display: 'block' }} />
          <h1 className="welcome-title">Welcome, {user?.firstName}!</h1>
          <p className="welcome-sub">{user?.emailId}</p>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </main>
    );
  }

  return <Login />;
}