import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileBarChart, ArrowUp, ArrowDown } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { BottomSheet } from '../components/Modal';
import ComparisonBarChart from '../components/ComparisonBarChart';
import { PrimaryButton } from '../components/Buttons';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/Toast';
import { formatCurrency, formatMonthYear, DOC_TYPE_LABELS } from '../utils/helpers';

const DOC_TYPES = ['orcamento', 'ordem_servico', 'contrato', 'recibo'];

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { documents } = useAppData();
  const { showToast } = useToast();
  const [monthOffset, setMonthOffset] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSelection, setReportSelection] = useState({ orcamento: true, ordem_servico: true, recibo: true, contrato: false });

  const refDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const prevDate = useMemo(() => {
    const d = new Date(refDate);
    d.setMonth(d.getMonth() - 1);
    return d;
  }, [refDate]);

  const docsInMonth = (date) =>
    documents.filter((d) => {
      const created = new Date(d.createdAt);
      return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear();
    });

  const currentDocs = docsInMonth(refDate);
  const previousDocs = docsInMonth(prevDate);

  const countByType = (docs, type) => docs.filter((d) => d.type === type).length;
  const sumByType = (docs, type) => docs.filter((d) => d.type === type).reduce((s, d) => s + (d.total || 0), 0);

  const kpis = DOC_TYPES.map((type) => {
    const curr = countByType(currentDocs, type);
    const prev = countByType(previousDocs, type);
    const diff = prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;
    return { type, label: DOC_TYPE_LABELS[type], current: curr, diff };
  });

  const statusGroups = useMemo(() => {
    const andamento = currentDocs.filter((d) => d.status === 'em_andamento' || d.status === 'em_analise').length;
    const interrompidas = currentDocs.filter((d) => d.status === 'cancelada').length;
    const finalizadas = currentDocs.filter((d) => d.status === 'finalizada' || d.status === 'aprovado').length;
    return { andamento, interrompidas, finalizadas };
  }, [currentDocs]);

  const orcamentosResumo = useMemo(() => {
    const orcamentos = currentDocs.filter((d) => d.type === 'orcamento');
    const ticketMedio = orcamentos.length > 0 ? orcamentos.reduce((s, d) => s + d.total, 0) / orcamentos.length : 0;
    const aprovados = orcamentos.filter((d) => d.status === 'aprovado').length;
    const taxaAprovacao = orcamentos.length > 0 ? (aprovados / orcamentos.length) * 100 : 0;
    return { ticketMedio, taxaAprovacao, total: orcamentos.length };
  }, [currentDocs]);

  const recebimentosResumo = useMemo(() => {
    const recibos = currentDocs.filter((d) => d.type === 'recibo');
    const totalRecebido = recibos.reduce((s, d) => s + d.total, 0);
    const parciais = recibos.filter((d) => d.paymentStatus === 'parcial').length;
    return { totalRecebido, parciais, total: recibos.length };
  }, [currentDocs]);

  const faturamentoOS = sumByType(currentDocs, 'ordem_servico') + sumByType(currentDocs, 'orcamento');

  const handleGenerateReport = () => {
    setReportOpen(false);
    showToast('Relatório consolidado gerado com sucesso!', 'success');
    window.print();
  };

  return (
    <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <ScreenHeader title="Relatórios" onBack={() => navigate('/')} />

      <div style={{ padding: 16 }}>
        {/* Seletor de período */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 18,
          }}
        >
          <button onClick={() => setMonthOffset((m) => m - 1)} aria-label="Mês anterior" style={navArrowStyle}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{formatMonthYear(refDate)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs. {formatMonthYear(prevDate)}</div>
          </div>
          <button onClick={() => setMonthOffset((m) => m + 1)} aria-label="Próximo mês" style={navArrowStyle}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Grid de KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {kpis.map((kpi) => (
            <div key={kpi.type} style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 14, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)' }}>{kpi.current}</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: kpi.diff >= 0 ? 'var(--success-600)' : 'var(--danger-600)',
                  marginTop: 4,
                }}
              >
                {kpi.diff >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(kpi.diff).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <StatusBlock label="Em Andamento" value={statusGroups.andamento} color="var(--navy-600)" bg="#e7ecf5" />
          <StatusBlock label="Interrompidas" value={statusGroups.interrompidas} color="var(--warning-600)" bg="var(--warning-bg)" />
          <StatusBlock label="Finalizadas" value={statusGroups.finalizadas} color="var(--success-600)" bg="var(--success-bg)" />
        </div>

        {/* Comparativo de valores */}
        <SectionTitle>Comparativo de Valores</SectionTitle>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 16, boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
          <ComparisonBarChart label="Orçamentos" current={sumByType(currentDocs, 'orcamento')} previous={sumByType(previousDocs, 'orcamento')} />
          <ComparisonBarChart label="Ordens de Serviço" current={sumByType(currentDocs, 'ordem_servico')} previous={sumByType(previousDocs, 'ordem_servico')} />
          <ComparisonBarChart label="Recibos" current={sumByType(currentDocs, 'recibo')} previous={sumByType(previousDocs, 'recibo')} />
        </div>

        {/* Resumo de Orçamentos */}
        <SectionTitle>Resumo de Orçamentos</SectionTitle>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 16, boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
          <KeyValueRow label="Ticket médio" value={formatCurrency(orcamentosResumo.ticketMedio)} />
          <KeyValueRow label="Taxa de aprovação" value={`${orcamentosResumo.taxaAprovacao.toFixed(0)}%`} />
          <KeyValueRow label="Total de orçamentos" value={orcamentosResumo.total} last />
        </div>

        {/* Resumo de Recebimentos */}
        <SectionTitle>Resumo de Recebimentos</SectionTitle>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 16, boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
          <KeyValueRow label="Total recebido" value={formatCurrency(recebimentosResumo.totalRecebido)} />
          <KeyValueRow label="Pagamentos parciais" value={recebimentosResumo.parciais} last />
        </div>

        {/* Faturamento destaque */}
        <div
          style={{
            background: 'var(--navy-900)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Faturamento do Mês (O.S.)
          </div>
          <div style={{ color: 'var(--mustard-500)', fontSize: 32, fontWeight: 800 }}>{formatCurrency(faturamentoOS)}</div>
        </div>

        <PrimaryButton icon={<FileBarChart size={18} />} onClick={() => setReportOpen(true)}>
          Gerar Relatório
        </PrimaryButton>
      </div>

      <BottomSheet open={reportOpen} onClose={() => setReportOpen(false)} title="Gerar Relatório">
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Selecione o que deseja incluir no relatório consolidado de {formatMonthYear(refDate)}:
        </p>
        {DOC_TYPES.map((type) => (
          <label
            key={type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 4px',
              borderBottom: '1px solid var(--border-soft)',
              fontSize: 14.5,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={reportSelection[type]}
              onChange={(e) => setReportSelection((s) => ({ ...s, [type]: e.target.checked }))}
              style={{ width: 18, height: 18 }}
            />
            {DOC_TYPE_LABELS[type]}
          </label>
        ))}
        <PrimaryButton onClick={handleGenerateReport} style={{ marginTop: 18 }}>
          Gerar Relatório PDF
        </PrimaryButton>
      </BottomSheet>

      <BottomNav />
    </div>
  );
}

const navArrowStyle = {
  border: 'none',
  background: 'var(--bg-app)',
  borderRadius: 8,
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--navy-800)',
};

function SectionTitle({ children }) {
  return (
    <h3 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>
      {children}
    </h3>
  );
}

function StatusBlock({ label, value, color, bg }) {
  return (
    <div style={{ flex: 1, background: bg, borderRadius: 'var(--radius-md)', padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function KeyValueRow({ label, value, last }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: last ? 'none' : '1px solid var(--border-soft)',
        fontSize: 13.5,
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}
