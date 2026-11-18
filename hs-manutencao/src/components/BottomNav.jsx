import React from 'react';
import { Wrench, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/operacional', icon: Wrench, label: 'Operacional' },
    { path: '/dashboard', icon: BarChart3, label: 'Relatórios' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 480,
        margin: '0 auto',
        background: '#fff',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 0px))',
        zIndex: 100,
      }}
    >
      {items.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: active ? 'var(--navy-800)' : 'var(--text-muted)',
              fontWeight: active ? 700 : 500,
              fontSize: 11.5,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
