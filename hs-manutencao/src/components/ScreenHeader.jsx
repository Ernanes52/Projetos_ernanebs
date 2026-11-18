import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScreenHeader({ title, onBack, rightSlot }) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div
      style={{
        background: 'var(--navy-800)',
        color: '#fff',
        padding: '18px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <button
        onClick={handleBack}
        aria-label="Voltar"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: 'none',
          borderRadius: 10,
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={19} />
      </button>
      <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>{title}</h1>
      {rightSlot}
    </div>
  );
}
