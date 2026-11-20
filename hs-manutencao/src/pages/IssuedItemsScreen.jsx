import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Calendar, Clock, ShieldCheck, Search } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import DocumentPreview from '../components/DocumentPreview';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDate, STATUS_LABELS, PAYMENT_LABELS, DOC_TYPE_LABELS } from '../utils/helpers';

const TABS = [
  { key: 'orcamento', label: 'ORÇAMENTOS' },
  { key: 'ordem_servico', label: 'ORDENS DE SERVIÇO' },
  { key: 'contrato', label: 'CONTRATOS' },
  { key: 'recibo', label: 'RECIBOS' },
];

export default function IssuedItemsScreen() {
  const navigate = useNavigate();
  const { clients, documents, deleteDocument, generateFromDocument, updateDocument } = useAppData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orcamento');
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState('todos'); // 'mes' | 'todos'
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editDialog, setEditDialog] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filtered = useMemo(() => {
    const now = new Date();
    return documents
      .filter((d) => d.type === activeTab)
      .filter((d) => d.clientName?.toLowerCase().includes(search.toLowerCase()))
      .filter((d) => {
        if (periodFilter === 'todos') return true;
        const created = new Date(d.createdAt);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      });
  }, [documents, activeTab, search, periodFilter]);

  const totals = useMemo(() => {
    const total = filtered.reduce((s, d) => s + (d.total || 0), 0);
    const parciais = filtered.filter((d) => d.paymentStatus === 'parcial').reduce((s, d) => s + (d.total || 0), 0);
    const totalAprovados = filtered.filter((d) => d.status === 'aprovado' || d.paymentStatus === 'total').reduce((s, d) => s + (d.total || 0), 0);
    return { total, parciais, totalAprovados };
  }, [filtered]);

  const handleAction = (action, doc) => {
    setMenuOpenId(null);
    switch (action) {
      case 'pdf':
        setPreviewDoc(doc);
        break;
      case 'os':
        generateFromDocument(doc.id, 'ordem_servico');
        showToast('Ordem de Serviço gerada!', 'success');
        break;
      case 'contrato':
        generateFromDocument(doc.id, 'contrato');
        showToast('Contrato gerado!', 'success');
        break;
      case 'aprovar':
        updateDocument(doc.id, { status: 'aprovado' });
        showToast('Orçamento aprovado!', 'success');
        break;
      case 'editar_cliente':
        setEditForm({ clientId: doc.clientId || '', clientName: doc.clientName || '' });
        setEditDialog({ type: 'client', doc });
        break;
      case 'editar_pgto':
        setEditForm({ paymentStatus: doc.paymentStatus || '', total: String(doc.total ?? '') });
        setEditDialog({ type: 'payment', doc });
        break;
      case 'delete':
        setConfirmDeleteId(doc.id);
        break;
      default:
        showToast('Funcionalidade em desenvolvimento.', 'info');
    }
  };

  const saveEdit = () => {
    if (!editDialog) return;
    const { doc } = editDialog;

    if (editDialog.type === 'client') {
      const selectedClient = clients.find((client) => client.id === editForm.clientId);
      const clientName = (selectedClient?.name || editForm.clientName || '').trim();
      if (!clientName) {
        showToast('Informe o nome do cliente.', 'warning');
        return;
      }
      updateDocument(doc.id, {
        clientId: selectedClient?.id || doc.clientId || null,
        clientName,
      });
    } else {
      const total = Number(String(editForm.total).replace(',', '.'));
      if (!Number.isFinite(total) || total < 0) {
        showToast('Informe um valor válido (maior ou igual a zero).', 'warning');
        return;
      }
      updateDocument(doc.id, {
        paymentStatus: editForm.paymentStatus || null,
        total: Math.round(total * 100) / 100,
      });
    }

    setEditDialog(null);
    showToast(editDialog.type === 'client' ? 'Dados do cliente atualizados.' : 'Pagamento atualizado.', 'success');
  };

  const confirmDelete = () => {
    deleteDocument(confirmDeleteId);
    setConfirmDeleteId(null);
    showToast('Documento excluído.', 'success');
  };

  return (
    <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <ScreenHeader title="Itens Emitidos" onBack={() => navigate('/')} />

      {/* Tabs roláveis */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 0', overflowX: 'auto' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flexShrink: 0,
              padding: '9px 16px',
              borderRadius: 999,
              border: 'none',
              fontWeight: 700,
              fontSize: 12.5,
              whiteSpace: 'nowrap',
              background: activeTab === tab.key ? 'var(--navy-800)' : '#fff',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.key ? 'none' : 'var(--shadow-card)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-soft)',
                fontSize: 13.5,
                background: '#fff',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['mes', 'todos'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                border: periodFilter === p ? 'none' : '1.5px solid var(--border-soft)',
                background: periodFilter === p ? 'var(--mustard-500)' : '#fff',
                color: periodFilter === p ? 'var(--navy-900)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: 12.5,
              }}
            >
              {p === 'mes' ? 'Este Mês' : 'Todos'}
            </button>
          ))}
        </div>

        {/* Painel de totais */}
        <div
          style={{
            display: 'flex',
            background: 'var(--navy-900)',
            borderRadius: 'var(--radius-md)',
            padding: 14,
            marginBottom: 18,
            color: '#fff',
          }}
        >
          <TotalBlock label="Total" value={totals.total} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
          <TotalBlock label="Parciais" value={totals.parciais} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
          <TotalBlock label="Aprovados" value={totals.totalAprovados} highlight />
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, padding: '30px 0' }}>
            Nenhum documento encontrado nesta categoria.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((doc) => {
            const statusInfo = STATUS_LABELS[doc.status];
            const paymentInfo = PAYMENT_LABELS[doc.paymentStatus];
            return (
              <div
                key={doc.id}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  boxShadow: 'var(--shadow-card)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{doc.clientName}</div>
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                    aria-label="Mais opções"
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', padding: 2 }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpenId === doc.id && (
                    <ContextMenu doc={doc} onAction={handleAction} onClose={() => setMenuOpenId(null)} />
                  )}
                </div>

                <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--navy-900)', marginBottom: 10 }}>
                  {formatCurrency(doc.total)}
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  {statusInfo && <Badge color={statusInfo.color}>{statusInfo.label}</Badge>}
                  {paymentInfo && <Badge color={paymentInfo.color}>{paymentInfo.label}</Badge>}
                </div>

                <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> {formatDate(doc.createdAt)}
                  </span>
                  {doc.deadline && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {doc.deadline}
                    </span>
                  )}
                  {doc.warranty && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={12} /> {doc.warranty}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)} title="Visualizar PDF" maxWidth={520}>
        {previewDoc && <DocumentPreview doc={previewDoc} />}
        {previewDoc && (
          <button
            onClick={() => window.print()}
            style={{
              marginTop: 14,
              width: '100%',
              padding: '12px 0',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--navy-800)',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            Imprimir / Salvar PDF
          </button>
        )}
      </Modal>

      <Modal
        open={!!editDialog}
        onClose={() => setEditDialog(null)}
        title={editDialog?.type === 'client' ? 'Editar cliente' : 'Editar pagamento'}
      >
        {editDialog?.type === 'client' && (
          <>
            {clients.length > 0 && (
              <label style={{ display: 'block', marginBottom: 14, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Selecionar cliente cadastrado
                <select
                  value={editForm.clientId}
                  onChange={(e) => {
                    const client = clients.find((item) => item.id === e.target.value);
                    setEditForm((form) => ({ ...form, clientId: e.target.value, clientName: client?.name || '' }));
                  }}
                  style={{ display: 'block', width: '100%', marginTop: 6, padding: '11px 12px', border: '1.5px solid var(--border-soft)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 14 }}
                >
                  <option value="">Outro cliente / digitar nome</option>
                  {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
              </label>
            )}
            <label style={{ display: 'block', marginBottom: 16, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Nome do cliente
              <input
                value={editForm.clientName}
                onChange={(e) => setEditForm((form) => ({ ...form, clientId: '', clientName: e.target.value }))}
                placeholder="Nome do cliente"
                required
                style={{ display: 'block', width: '100%', marginTop: 6, padding: '11px 12px', border: '1.5px solid var(--border-soft)', borderRadius: 'var(--radius-sm)', fontSize: 14 }}
              />
            </label>
          </>
        )}
        {editDialog?.type === 'payment' && (
          <>
            <label style={{ display: 'block', marginBottom: 14, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Status do pagamento
              <select
                value={editForm.paymentStatus}
                onChange={(e) => setEditForm((form) => ({ ...form, paymentStatus: e.target.value }))}
                style={{ display: 'block', width: '100%', marginTop: 6, padding: '11px 12px', border: '1.5px solid var(--border-soft)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 14 }}
              >
                <option value="">Não informado</option>
                <option value="parcial">Parcial</option>
                <option value="total">Total</option>
              </select>
            </label>
            <label style={{ display: 'block', marginBottom: 18, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Valor do documento (R$)
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={editForm.total}
                onChange={(e) => setEditForm((form) => ({ ...form, total: e.target.value }))}
                style={{ display: 'block', width: '100%', marginTop: 6, padding: '11px 12px', border: '1.5px solid var(--border-soft)', borderRadius: 'var(--radius-sm)', fontSize: 14 }}
              />
            </label>
          </>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setEditDialog(null)}
            style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border-soft)', background: '#fff', fontWeight: 700, color: 'var(--text-secondary)' }}
          >
            Cancelar
          </button>
          <button
            onClick={saveEdit}
            style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--navy-800)', color: '#fff', fontWeight: 700 }}
          >
            Salvar
          </button>
        </div>
      </Modal>

      <Modal open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Excluir documento">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Essa ação não pode ser desfeita. Deseja realmente excluir este documento?
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setConfirmDeleteId(null)}
            style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border-soft)', background: '#fff', fontWeight: 700, color: 'var(--text-secondary)' }}
          >
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--danger-600)', color: '#fff', fontWeight: 700 }}
          >
            Excluir
          </button>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
}

function TotalBlock({ label, value, highlight }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 10.5, opacity: 0.75, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 14.5, fontWeight: 800, color: highlight ? 'var(--mustard-500)' : '#fff' }}>{formatCurrency(value)}</div>
    </div>
  );
}

function ContextMenu({ doc, onAction, onClose }) {
  const items = [
    { key: 'pdf', label: 'Gerar PDF' },
    { key: 'os', label: 'Gerar O.S' },
    { key: 'contrato', label: 'Gerar Contrato' },
    { key: 'aprovar', label: 'Aprovar' },
    { key: 'editar_cliente', label: 'Editar Cliente' },
    { key: 'adicionar_item', label: 'Adicionar Item' },
    { key: 'editar_item', label: 'Editar Item' },
    { key: 'editar_pgto', label: 'Editar Pgto' },
    { key: 'editar_data', label: 'Editar Data' },
    { key: 'delete', label: 'Excluir', danger: true },
  ];

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={onClose} />
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 0,
          background: '#fff',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-elevated)',
          zIndex: 100,
          minWidth: 190,
          overflow: 'hidden',
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onAction(item.key, doc)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '11px 14px',
              border: 'none',
              background: 'transparent',
              fontSize: 13.5,
              color: item.danger ? 'var(--danger-600)' : 'var(--text-primary)',
              fontWeight: item.danger ? 700 : 500,
              borderBottom: '1px solid var(--border-soft)',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
