// ─── Shared Toast Components ──────────────────────────────────────────────────

export const RedToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#dc2626', color: '#fff', padding: '14px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, minWidth: 280 }}>
    <span>✕</span>
    <span style={{ flex: 1 }}>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
  </div>
);

export const GreenToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#16a34a', color: '#fff', padding: '14px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, minWidth: 280 }}>
    <span>✓</span>
    <span style={{ flex: 1 }}>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
  </div>
);