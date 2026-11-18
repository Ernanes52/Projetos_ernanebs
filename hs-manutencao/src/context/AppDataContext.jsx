import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AppDataContext = createContext(null);

const STORAGE_KEY = 'hs_manutencao_data_v1';

function loadInitialData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Falha ao ler dados salvos, iniciando com dados de exemplo.', e);
  }
  return getSeedData();
}

function getSeedData() {
  const now = new Date();
  const iso = (d) => d.toISOString();
  return {
    clients: [
      {
        id: 'cli-1',
        name: 'Marcos Andrade',
        phone: '(11) 98221-3344',
        document: '123.456.789-00',
        cep: '11320-000',
        street: 'Av. Beira Mar',
        number: '450',
        district: 'Enseada',
        complement: 'Marina Slip 12',
        city: 'Guarujá',
        state: 'SP',
      },
      {
        id: 'cli-2',
        name: 'Fernanda Lima',
        phone: '(13) 99112-2200',
        document: '987.654.321-00',
        cep: '11680-000',
        street: 'Rua das Gaivotas',
        number: '120',
        district: 'Porto',
        complement: '',
        city: 'Ubatuba',
        state: 'SP',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        type: 'orcamento',
        title: 'Revisão de motor',
        clientId: 'cli-1',
        clientName: 'Marcos Andrade',
        total: 4760,
        status: 'em_analise',
        paymentStatus: null,
        createdAt: iso(now),
        deadline: '10 dias úteis',
        warranty: '90 dias',
        items: [
          { id: 'it-1', kind: 'servico', description: 'Revisão completa do motor de popa', unitValue: 3200, quantity: 1, unit: 'UND' },
          { id: 'it-2', kind: 'material', description: 'Filtro de óleo náutico', unitValue: 1560, quantity: 1, unit: 'UND' },
        ],
        paymentTerms: 'SINAL DE 50% A VISTA, RESTANTE NA ENTREGA',
        executionTime: '10 dias úteis',
        discount: 0,
        notes: '',
      },
      {
        id: 'doc-2',
        type: 'orcamento',
        title: 'Pintura do casco',
        clientId: 'cli-2',
        clientName: 'Fernanda Lima',
        total: 8900,
        status: 'aprovado',
        paymentStatus: 'total',
        createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5)),
        deadline: '15 dias úteis',
        warranty: '180 dias',
        items: [
          { id: 'it-3', kind: 'servico', description: 'Pintura anti-incrustante do casco', unitValue: 8900, quantity: 1, unit: 'UND' },
        ],
        paymentTerms: 'PAGAMENTO INTEGRAL NA APROVAÇÃO',
        executionTime: '15 dias úteis',
        discount: 0,
        notes: '',
      },
      {
        id: 'doc-3',
        type: 'recibo',
        title: 'Recibo - Manutenção elétrica',
        clientId: 'cli-1',
        clientName: 'Marcos Andrade',
        total: 1200,
        status: 'finalizada',
        paymentStatus: 'parcial',
        createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
        referenceText: 'Manutenção do sistema elétrico de bordo',
        items: [],
      },
    ],
  };
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState(loadInitialData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Falha ao salvar dados', e);
    }
  }, [data]);

  const addClient = useCallback((client) => {
    const newClient = { ...client, id: `cli-${Date.now()}` };
    setData((d) => ({ ...d, clients: [...d.clients, newClient] }));
    return newClient;
  }, []);

  const updateClient = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      clients: d.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const findClientByDocument = useCallback((doc) => {
    return data.clients.find((c) => c.document === doc);
  }, [data.clients]);

  const addDocument = useCallback((doc) => {
    const newDoc = { ...doc, id: `doc-${Date.now()}`, createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, documents: [newDoc, ...d.documents] }));
    return newDoc;
  }, []);

  const updateDocument = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      documents: d.documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
    }));
  }, []);

  const deleteDocument = useCallback((id) => {
    setData((d) => ({ ...d, documents: d.documents.filter((doc) => doc.id !== id) }));
  }, []);

  const generateFromDocument = useCallback((sourceId, newType) => {
    const source = data.documents.find((d) => d.id === sourceId);
    if (!source) return null;
    const newDoc = {
      ...source,
      id: `doc-${Date.now()}`,
      type: newType,
      status: newType === 'recibo' ? 'finalizada' : 'em_andamento',
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, documents: [newDoc, ...d.documents] }));
    return newDoc;
  }, [data.documents]);

  const value = {
    clients: data.clients,
    documents: data.documents,
    addClient,
    updateClient,
    findClientByDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    generateFromDocument,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  return ctx;
}
