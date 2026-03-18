import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout(); // Clears state and 'auth-storage' cookie
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f5f5f5' 
    }}>
      <div style={{ 
        padding: '40px', 
        background: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
        textAlign: 'center' 
      }}>
        {/* Fix: Changed userName to username based on your error message */}
        <h1 style={{ color: '#2A2A2B', fontSize: '24px', marginBottom: '8px' }}>
          Welcome, {user?.username || "User"} 
        </h1>
        <p style={{ color: '#707071', marginBottom: '24px' }}>Successfully logged into Nest app</p>
        
        <button
          onClick={handleLogout}
          style={{
            padding: '12px 32px',
            background: '#0F62FE',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0052cc')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#0F62FE')}
        >
          Logout
        </button>
      </div>
    </div>
  );
}