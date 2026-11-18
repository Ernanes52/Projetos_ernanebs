import React from 'react';

export default function Logo({ color = '#ffffff', size = 'large' }) {
  const dims = size === 'large' ? { fontSize: 44, sub: 13, icon: 56 } : { fontSize: 26, sub: 9, icon: 34 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={dims.icon} height={dims.icon * 0.6} viewBox="0 0 64 40" fill="none" style={{ marginBottom: 2 }}>
        {/* silhueta de lancha estilizada */}
        <path
          d="M6 28 C 6 28, 20 30, 32 30 C 44 30, 56 28, 58 28 L 52 34 C 48 35.5, 18 35.5, 14 34 Z"
          fill={color}
        />
        <path d="M30 28 L30 10 L42 28 Z" fill={color} opacity="0.85" />
        <rect x="29" y="6" width="1.6" height="22" fill={color} />
        {/* pássaros */}
        <path d="M8 8 Q11 4 14 8 Q11 6 8 8 Z" stroke={color} strokeWidth="1.4" fill="none" />
        <path d="M16 4 Q19 0 22 4 Q19 2 16 4 Z" stroke={color} strokeWidth="1.4" fill="none" />
      </svg>
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontSize: dims.fontSize, fontWeight: 800, color, letterSpacing: 1 }}>HS</div>
        <div
          style={{
            fontSize: dims.sub,
            fontWeight: 600,
            color,
            letterSpacing: 2,
            marginTop: 2,
          }}
        >
          MANUTENÇÃO NÁUTICA
        </div>
      </div>
    </div>
  );
}
