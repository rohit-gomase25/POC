import { useState } from 'react';

interface ActionBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const ActionBtn = ({ children, onClick, type = 'button', disabled }: ActionBtnProps) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', height: 48, border: 'none', borderRadius: 4, fontSize: 16, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, opacity: disabled ? 0.6 : 1, transition: 'background 0.2s, color 0.2s', background: hovered && !disabled ? '#0F62FE' : '#ECEDEE', color: hovered && !disabled ? '#ffffff' : '#9D9D9D' }}>
      {children}
    </button>
  );
};