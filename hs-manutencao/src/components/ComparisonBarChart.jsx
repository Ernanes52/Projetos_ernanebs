import React from 'react';
import { formatCurrency } from '../utils/helpers';

export default function ComparisonBarChart({ label, current, previous }) {
  const max = Math.max(current, previous, 1);
  const currentPct = (current / max) * 100;
  const previousPct = (previous / max) * 100;
  const diff = previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: diff >= 0 ? 'var(--success-600)' : 'var(--danger-600)' }}>
          {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(0)}%
        </span>
      </div>

      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
          <span>Mês atual</span>
          <span>{formatCurrency(current)}</span>
        </div>
        <div style={{ height: 8, background: 'var(--border-soft)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${currentPct}%`, height: '100%', background: 'var(--navy-700)', borderRadius: 4 }} />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
          <span>Mês anterior</span>
          <span>{formatCurrency(previous)}</span>
        </div>
        <div style={{ height: 8, background: 'var(--border-soft)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${previousPct}%`, height: '100%', background: 'var(--mustard-400)', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
