import React from 'react';

export function PrimaryButton({ children, icon, fullWidth = true, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: 'var(--navy-800)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        padding: '14px 20px',
        fontSize: 15,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        opacity: props.disabled ? 0.55 : 1,
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, fullWidth = false, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: 'transparent',
        color: 'var(--navy-600)',
        border: 'none',
        padding: '14px 16px',
        fontSize: 15,
        fontWeight: 700,
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function MustardButton({ children, icon, fullWidth = true, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: 'var(--mustard-500)',
        color: 'var(--navy-900)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        padding: '14px 20px',
        fontSize: 15,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconButton({ icon, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        border: 'none',
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        ...style,
      }}
    >
      {icon}
    </button>
  );
}

export function StickyFooter({ children }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        background: '#fff',
        borderTop: '1px solid var(--border-soft)',
        padding: '14px 16px calc(14px + env(safe-area-inset-bottom, 0px))',
        zIndex: 40,
      }}
    >
      {children}
    </div>
  );
}
