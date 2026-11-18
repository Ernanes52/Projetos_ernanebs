import React, { useState } from 'react';
import { Plus, Search, Trash2, Wrench, Package } from 'lucide-react';
import ScreenHeader from '../../components/ScreenHeader';
import { TextInput, SelectInput, CurrencyInput } from '../../components/FormFields';
import { StickyFooter, PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { useBudgetWizard } from '../../context/BudgetWizardContext';
import { useToast } from '../../components/Toast';
import { formatCurrency } from '../../utils/helpers';

const UNIT_OPTIONS = [
  { value: 'UND', label: 'UND' },
  { value: 'HR', label: 'HR' },
  { value: 'M', label: 'M' },
  { value: 'M2', label: 'M²' },
  { value: 'KG', label: 'KG' },
  { value: 'L', label: 'L' },
];

const COMMON_SERVICES = [
  'Revisão completa do motor',
  'Troca de óleo e filtros',
  'Pintura anti-incrustante',
  'Manutenção do sistema elétrico',
  'Polimento do casco',
];

export default function StepItems({ onBack, onNext }) {
  const { draft, addItem, removeItem, total } = useBudgetWizard();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('servico');
  const [showSearch, setShowSearch] = useState(false);
  const [form, setForm] = useState({ description: '', unitValue: '', quantity: '1', unit: 'UND' });

  const handleAdd = () => {
    if (!form.description.trim()) {
      showToast('Informe a descrição do item.', 'warning');
      return;
    }
    const unitValue = parseFloat(form.unitValue.replace(',', '.')) || 0;
    const quantity = parseFloat(form.quantity.replace(',', '.')) || 1;
    if (unitValue <= 0) {
      showToast('Informe um valor unitário válido.', 'warning');
      return;
    }
    addItem({ kind: activeTab, description: form.description.trim(), unitValue, quantity, unit: form.unit });
    setForm({ description: '', unitValue: '', quantity: '1', unit: 'UND' });
    showToast('Item adicionado!', 'success');
  };

  const itemsOfType = (kind) => draft.items.filter((i) => i.kind === kind);

  return (
    <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)', position: 'relative' }}>
      <ScreenHeader title="Novo Orçamento — Itens" onBack={onBack} />

      <div style={{ padding: 16, paddingBottom: 90 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setActiveTab('servico')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: 13.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: activeTab === 'servico' ? 'var(--navy-800)' : '#fff',
              color: activeTab === 'servico' ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === 'servico' ? 'none' : 'var(--shadow-card)',
            }}
          >
            <Wrench size={15} /> SERVIÇOS
          </button>
          <button
            onClick={() => setActiveTab('material')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: 13.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: activeTab === 'material' ? 'var(--navy-800)' : '#fff',
              color: activeTab === 'material' ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === 'material' ? 'none' : 'var(--shadow-card)',
            }}
          >
            <Package size={15} /> MATERIAIS
          </button>
          <button
            onClick={() => setShowSearch((s) => !s)}
            aria-label="Buscar serviço"
            style={{
              width: 44,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: showSearch ? 'var(--mustard-500)' : '#fff',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--navy-800)',
            }}
          >
            <Search size={17} />
          </button>
        </div>

        {showSearch && activeTab === 'servico' && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 10, marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>SERVIÇOS FREQUENTES</div>
            {COMMON_SERVICES.map((s) => (
              <button
                key={s}
                onClick={() => { setForm((f) => ({ ...f, description: s })); setShowSearch(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 4px',
                  fontSize: 13.5,
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Inputs de inserção */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 16, boxShadow: 'var(--shadow-card)', marginBottom: 18 }}>
          <TextInput
            label="Descrição"
            placeholder={activeTab === 'servico' ? 'Ex: Revisão do motor' : 'Ex: Filtro de óleo'}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 2 }}>
              <CurrencyInput
                label="Valor Unitário"
                value={form.unitValue}
                onValueChange={(v) => setForm((f) => ({ ...f, unitValue: v }))}
                placeholder="0,00"
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextInput
                label="Quantidade"
                inputMode="decimal"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </div>
          </div>
          <SelectInput
            label="Unidade"
            options={UNIT_OPTIONS}
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
          />
          <PrimaryButton icon={<Plus size={18} />} onClick={handleAdd} style={{ marginTop: 4 }}>
            Adicionar Item
          </PrimaryButton>
        </div>

        {/* Lista de itens do tipo ativo */}
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
          {activeTab === 'servico' ? 'Serviços adicionados' : 'Materiais adicionados'}
        </div>
        {itemsOfType(activeTab).length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Nenhum item adicionado ainda.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {itemsOfType(activeTab).map((item) => (
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
                onClick={() => removeItem(item.id)}
                aria-label="Remover item"
                style={{ border: 'none', background: 'transparent', color: 'var(--danger-600)', padding: 4 }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contador flutuante de total */}
      <div
        style={{
          position: 'fixed',
          bottom: 84,
          right: 20,
          maxWidth: 480,
          background: 'var(--navy-900)',
          color: '#fff',
          borderRadius: 999,
          padding: '10px 18px',
          fontWeight: 700,
          fontSize: 14,
          boxShadow: 'var(--shadow-elevated)',
          zIndex: 60,
        }}
      >
        Total: {formatCurrency(total)}
      </div>

      <StickyFooter>
        <PrimaryButton onClick={onNext} disabled={draft.items.length === 0}>
          Continuar →
        </PrimaryButton>
      </StickyFooter>
    </div>
  );
}
