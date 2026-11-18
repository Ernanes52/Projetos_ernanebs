import React from 'react';
import { Wrench } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function OperationalScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen-content" style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <ScreenHeader title="Operacional" onBack={() => navigate('/')} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 32px',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'var(--navy-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Wrench size={32} color="var(--mustard-500)" />
        </div>
        <h2 style={{ fontSize: 17, margin: 0, color: 'var(--text-primary)' }}>Painel operacional</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Aqui ficará o controle das ordens de serviço em andamento, agenda de manutenções e status das embarcações na marina.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
