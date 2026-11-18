import React from 'react';
import ScreenHeader from '../../components/ScreenHeader';
import { TextInput, TextareaInput } from '../../components/FormFields';
import { StickyFooter, PrimaryButton } from '../../components/Buttons';
import { useBudgetWizard } from '../../context/BudgetWizardContext';

export default function StepConditions({ onBack, onNext }) {
  const { draft, updateConditions } = useBudgetWizard();

  return (
    <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <ScreenHeader title="Novo Orçamento — Condições" onBack={onBack} />

      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Condições de Pagamento
        </h3>
        <TextInput
          placeholder="Ex: SINAL DE 50% À VISTA, RESTANTE NA ENTREGA"
          value={draft.paymentTerms}
          onChange={(e) => updateConditions({ paymentTerms: e.target.value })}
        />

        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 12px' }}>
          Prazos e Garantias
        </h3>
        <TextInput
          label="Prazo de Execução"
          placeholder="Ex: 10 dias úteis"
          value={draft.executionTime}
          onChange={(e) => updateConditions({ executionTime: e.target.value })}
        />
        <TextInput
          label="Garantia"
          placeholder="Ex: 90 dias"
          value={draft.warranty}
          onChange={(e) => updateConditions({ warranty: e.target.value })}
        />
        <TextInput
          label="Desconto (%)"
          inputMode="decimal"
          placeholder="0"
          value={draft.discount}
          onChange={(e) => updateConditions({ discount: e.target.value.replace(/[^\d.,]/g, '') })}
        />

        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 12px' }}>
          Observações Gerais
        </h3>
        <TextareaInput
          placeholder="Informações adicionais sobre o orçamento..."
          rows={5}
          value={draft.notes}
          onChange={(e) => updateConditions({ notes: e.target.value })}
        />
      </div>

      <StickyFooter>
        <PrimaryButton onClick={onNext}>Continuar →</PrimaryButton>
      </StickyFooter>
    </div>
  );
}
