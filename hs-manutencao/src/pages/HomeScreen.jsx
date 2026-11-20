import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Receipt, Send, Users } from 'lucide-react';
import Logo from '../components/Logo';
import BottomNav from '../components/BottomNav';

const MENU_ITEMS = [
  { label: 'Novo Orçamento', icon: ClipboardList, path: '/orcamento/novo' },
  { label: 'Novo Recibo', icon: Receipt, path: '/recibo/novo' },
  { label: 'Itens Emitidos', icon: Send, path: '/itens-emitidos' },
  { label: 'Clientes', icon: Users, path: '/clientes' },
  { label: 'Dashboard', icon: ClipboardList, path: '/dashboard' },
];

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, var(--navy-900) 0%, var(--navy-700) 100%)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 88,
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ marginBottom: 56, display: 'flex', justifyContent: 'center' }}>
          <Logo color="#ffffff" size="large" />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          {MENU_ITEMS.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                background: 'var(--mustard-500)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: '26px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                aspectRatio: '1 / 0.95',
                boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                transition: 'transform 0.12s',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Icon size={32} color="var(--navy-900)" strokeWidth={2.1} />
              <span
                style={{
                  color: 'var(--navy-900)',
                  fontWeight: 700,
                  fontSize: 14.5,
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
