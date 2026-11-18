import React, { createContext, useContext, useState, useCallback } from 'react';

const BudgetWizardContext = createContext(null);

const emptyClient = {
  name: '',
  phone: '',
  document: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  complement: '',
  city: '',
  state: '',
};

export function getEmptyBudgetDraft() {
  return {
    title: '',
    client: { ...emptyClient },
    items: [],
    paymentTerms: '',
    executionTime: '',
    warranty: '',
    discount: 0,
    notes: '',
  };
}

export function BudgetWizardProvider({ children }) {
  const [draft, setDraft] = useState(getEmptyBudgetDraft);

  const resetDraft = useCallback(() => setDraft(getEmptyBudgetDraft()), []);

  const updateTitle = useCallback((title) => {
    setDraft((d) => ({ ...d, title }));
  }, []);

  const updateClient = useCallback((fields) => {
    setDraft((d) => ({ ...d, client: { ...d.client, ...fields } }));
  }, []);

  const addItem = useCallback((item) => {
    setDraft((d) => ({ ...d, items: [...d.items, { ...item, id: `item-${Date.now()}` }] }));
  }, []);

  const removeItem = useCallback((itemId) => {
    setDraft((d) => ({ ...d, items: d.items.filter((i) => i.id !== itemId) }));
  }, []);

  const updateItem = useCallback((itemId, updates) => {
    setDraft((d) => ({
      ...d,
      items: d.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
    }));
  }, []);

  const updateConditions = useCallback((fields) => {
    setDraft((d) => ({ ...d, ...fields }));
  }, []);

  const total = draft.items.reduce((sum, i) => sum + i.unitValue * i.quantity, 0);
  const discountValue = total * ((draft.discount || 0) / 100);
  const totalWithDiscount = total - discountValue;

  const value = {
    draft,
    resetDraft,
    updateTitle,
    updateClient,
    addItem,
    removeItem,
    updateItem,
    updateConditions,
    total,
    discountValue,
    totalWithDiscount,
  };

  return <BudgetWizardContext.Provider value={value}>{children}</BudgetWizardContext.Provider>;
}

export function useBudgetWizard() {
  const ctx = useContext(BudgetWizardContext);
  if (!ctx) throw new Error('useBudgetWizard deve ser usado dentro de BudgetWizardProvider');
  return ctx;
}
