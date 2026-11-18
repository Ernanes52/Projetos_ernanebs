import React from 'react';

const COLOR_MAP = {
  success: { bg: '#e3f7ec', fg: '#1c9c5b' },
  'success-dark': { bg: '#d4f0e0', fg: '#0e7a44' },
  warning: { bg: '#fdf0dd', fg: '#e08a1e' },
  danger: { bg: '#fbe8e6', fg: '#d8473c' },
  navy: { bg: '#e7ecf5', fg: '#15356b' },
};

export default function Badge({ children, color = 'navy' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.navy;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        background: c.bg,
        color: c.fg,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
