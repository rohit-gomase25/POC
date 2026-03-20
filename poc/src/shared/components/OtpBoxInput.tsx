import { useRef } from 'react';

const OTP_LEN = 4;

interface OtpBoxInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export const OtpBoxInput = ({ value, onChange, error }: OtpBoxInputProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LEN }, (_, i) => value[i] ?? '');

  const update = (i: number, c: string) => { const n = [...digits]; n[i] = c; onChange(n.join('')); };
  const onCh = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.replace(/\D/g, '').slice(-1);
    update(i, c);
    if (c && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };
  const onKd = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') { if (digits[i]) update(i, ''); else if (i > 0) refs.current[i - 1]?.focus(); }
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN);
    if (p) { onChange(p.padEnd(OTP_LEN, '').slice(0, OTP_LEN)); refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {digits.map((d, i) => (
          <div key={i} style={{ position: 'relative', width: 56, height: 56, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: `1px solid ${error ? '#E24B4A' : d ? '#0F62FE' : '#ECEDEE'}` }}>
            <input ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => onCh(i, e)} onKeyDown={e => onKd(i, e)} onPaste={onPaste} autoComplete="one-time-code"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 20, fontWeight: 600, textAlign: 'center', caretColor: '#0F62FE', zIndex: 1 }} />
            {!d && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ECEDEE' }} />}
          </div>
        ))}
      </div>
      {error && <p style={{ fontSize: 11, color: '#E24B4A', marginTop: 8, lineHeight: '1.4' }}>{error}</p>}
    </div>
  );
};

export { OTP_LEN };