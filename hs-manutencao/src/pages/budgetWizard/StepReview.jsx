import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, FileDown } from 'lucide-react';
import ScreenHeader from '../../components/ScreenHeader';
import Modal from '../../components/Modal';
import DocumentPreview from '../../components/DocumentPreview';
import { StickyFooter, PrimaryButton, MustardButton } from '../../components/Buttons';
import { useBudgetWizard } from '../../context/BudgetWizardContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../components/Toast';
import { formatCurrency } from '../../utils/helpers';

export default function StepReview({ onBack, onFinish }) {
  const { draft, total, totalWithDiscount } = useBudgetWizard();
  const { addDocument, addClient, findClientByDocument } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState(null);

  const handleGenerate = () => {
    let clientId = null;
    if (draft.client.document) {
      const existing = findClientByDocument(draft.client.document);
      if (existing) clientId = existing.id;
    }
    if (!clientId) {
      const newClient = addClient(draft.client);
      clientId = newClient.id;
    }

    const doc = addDocument({
      type: 'orcamento',
      title: draft.title,
      clientId,
      clientName: draft.client.name,
      client: draft.client,
      items: draft.items,
      total: totalWithDiscount,
      status: 'em_analise',
      paymentStatus: null,
      paymentTerms: draft.paymentTerms,
      executionTime: draft.executionTime,
      warranty: draft.warranty,
      discount: parseFloat(draft.discount) || 0,
      notes: draft.notes,
      deadline: draft.executionTime,
    });

    setGeneratedDoc(doc);
    setConfirmOpen(false);
    showToast('PDF gerado com sucesso!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  if (generatedDoc) {
    return (
      <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        <ScreenHeader title="Orçamento Gerado" onBack={() => navigate('/itens-emitidos')} />
        <div style={{ padding: 16 }}>
          <DocumentPreview doc={generatedDoc} />
        </div>
        <StickyFooter>
          <div style={{ display: 'flex', gap: 10 }}>
            <PrimaryButton onClick={handlePrint} icon={<FileDown size={17} />}>
              Imprimir / Salvar PDF
            </PrimaryButton>
          </div>
          <button
            onClick={onFinish}
            style={{ border: 'none', background: 'transparent', color: 'var(--navy-600)', fontWeight: 700, fontSize: 14, width: '100%', padding: '10px 0 0' }}
          >
            Voltar para o início
          </button>
        </StickyFooter>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <ScreenHeader title="Novo Orçamento — Revisão" onBack={onBack} />

      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Itens
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {draft.items.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-sm)',
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{item.description}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {item.quantity} {item.unit} × {formatCurrency(item.unitValue)}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatCurrency(item.unitValue * item.quantity)}</div>
              <button
                onClick={onBack}
                aria-label="Editar item"
                style={{ border: 'none', background: 'transparent', color: 'var(--navy-600)', padding: 4 }}
              >
                <Pencil size={15} />
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            boxShadow: 'var(--shadow-card)',
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{draft.client.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{draft.client.phone}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {[draft.client.city, draft.client.state].filter(Boolean).join(' - ')}
          </div>
        </div>

        <div
          style={{
            background: 'var(--navy-900)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 600 }}>Total do Orçamento</span>
          <span style={{ fontWeight: 800, fontSize: 19 }}>{formatCurrency(totalWithDiscount)}</span>
        </div>
      </div>

      <StickyFooter>
        <MustardButton onClick={() => setConfirmOpen(true)} icon={<FileDown size={18} />}>
          Gerar PDF
        </MustardButton>
      </StickyFooter>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={draft.title}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
          O orçamento será gerado para <strong>{draft.client.name}</strong> com o valor total de{' '}
          <strong>{formatCurrency(totalWithDiscount)}</strong>.
        </p>
        <PrimaryButton onClick={handleGenerate}>GERAR PDF</PrimaryButton>
      </Modal>
    </div>
  );
}
