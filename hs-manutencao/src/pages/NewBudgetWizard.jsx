import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { TextInput } from '../components/FormFields';
import { SecondaryButton, PrimaryButton } from '../components/Buttons';
import { BudgetWizardProvider, useBudgetWizard } from '../context/BudgetWizardContext';
import StepClientData from './budgetWizard/StepClientData';
import StepItems from './budgetWizard/StepItems';
import StepConditions from './budgetWizard/StepConditions';
import StepReview from './budgetWizard/StepReview';

function WizardInner() {
  const navigate = useNavigate();
  const { draft, updateTitle, resetDraft } = useBudgetWizard();
  const [step, setStep] = useState(0); // 0 = modal de título
  const [titleInput, setTitleInput] = useState('');

  const handleCancelTitle = () => {
    resetDraft();
    navigate('/');
  };

  const handleContinueTitle = () => {
    if (!titleInput.trim()) return;
    updateTitle(titleInput.trim());
    setStep(1);
  };

  const handleExitWizard = () => {
    resetDraft();
    navigate('/');
  };

  if (step === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--navy-900)' }}>
        <Modal open={true} onClose={handleCancelTitle} title="Novo Orçamento">
          <TextInput
            label="Título do Orçamento"
            required
            placeholder="Ex: Revisão de motor"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <SecondaryButton fullWidth onClick={handleCancelTitle}>Cancelar</SecondaryButton>
            <PrimaryButton onClick={handleContinueTitle} disabled={!titleInput.trim()}>Continuar</PrimaryButton>
          </div>
        </Modal>
      </div>
    );
  }

  if (step === 1) {
    return <StepClientData onBack={() => setStep(0)} onNext={() => setStep(2)} />;
  }
  if (step === 2) {
    return <StepItems onBack={() => setStep(1)} onNext={() => setStep(3)} />;
  }
  if (step === 3) {
    return <StepConditions onBack={() => setStep(2)} onNext={() => setStep(4)} />;
  }
  if (step === 4) {
    return <StepReview onBack={() => setStep(3)} onFinish={handleExitWizard} />;
  }

  return null;
}

export default function NewBudgetWizard() {
  return (
    <BudgetWizardProvider>
      <WizardInner />
    </BudgetWizardProvider>
  );
}
