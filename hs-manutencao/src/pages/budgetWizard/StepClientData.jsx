import React, { useState } from 'react';
import { Info } from 'lucide-react';
import ScreenHeader from '../../components/ScreenHeader';
import { TextInput } from '../../components/FormFields';
import { StickyFooter, PrimaryButton } from '../../components/Buttons';
import { useBudgetWizard } from '../../context/BudgetWizardContext';
import { useToast } from '../../components/Toast';
import { useAppData } from '../../context/AppDataContext';
import { maskPhone, maskCpfCnpj, maskCep, fetchAddressByCep } from '../../utils/helpers';

export default function StepClientData({ onBack, onNext }) {
  const { draft, updateClient } = useBudgetWizard();
  const { showToast } = useToast();
  const { findClientByDocument } = useAppData();
  const [cepLoading, setCepLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const client = draft.client;

  const handleField = (field) => (e) => updateClient({ [field]: e.target.value });

  const handleCnpjSearch = async () => {
    if (!client.document) return;
    setCnpjLoading(true);
    try {
      const digits = client.document.replace(/\D/g, '');
      if (digits.length !== 14) {
        throw new Error('Erro na consulta: 400');
      }
      // Simula a consulta de CNPJ via API pública (que falha conforme o comportamento original do app)
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }
      const data = await response.json();
      updateClient({
        name: data.razao_social || client.name,
        street: data.logradouro || client.street,
        district: data.bairro || client.district,
        city: data.municipio || client.city,
        state: data.uf || client.state,
        cep: data.cep || client.cep,
      });
      showToast('Dados do CNPJ encontrados!', 'success');
    } catch (e) {
      showToast(`Não foi possível consultar o CNPJ. Exception: ${e.message}`, 'error');
    } finally {
      setCnpjLoading(false);
    }
  };

  const handleCepSearch = async () => {
    if (!client.cep) return;
    setCepLoading(true);
    try {
      const address = await fetchAddressByCep(client.cep);
      updateClient(address);
      showToast('Endereço encontrado!', 'success');
    } catch (e) {
      showToast('Não foi possível consultar o CEP. ' + e.message, 'error');
    } finally {
      setCepLoading(false);
    }
  };

  const canContinue = client.name.trim().length > 0;

  return (
    <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <ScreenHeader title="Novo Orçamento — Cliente" onBack={onBack} />

      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Informações Básicas
        </h3>

        <TextInput
          label="Nome do Cliente"
          required
          placeholder="Nome completo"
          value={client.name}
          onChange={handleField('name')}
        />
        <TextInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          value={client.phone}
          onChange={(e) => updateClient({ phone: maskPhone(e.target.value) })}
        />

        <div style={{ position: 'relative' }}>
          <TextInput
            label="CPF/CNPJ"
            placeholder="000.000.000-00"
            value={client.document}
            withSearch
            searchLoading={cnpjLoading}
            onSearch={handleCnpjSearch}
            onChange={(e) => updateClient({ document: maskCpfCnpj(e.target.value) })}
            onFocus={() => setShowTip(true)}
          />
          {showTip && (
            <div
              style={{
                background: 'var(--warning-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                display: 'flex',
                gap: 8,
                fontSize: 12.5,
                color: '#7a5410',
                marginTop: -8,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span><strong>Dica Rápida:</strong> informe um CNPJ válido com 14 dígitos para preenchimento automático do endereço e razão social.</span>
            </div>
          )}
        </div>

        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 12px' }}>
          Endereço
        </h3>

        <TextInput
          label="CEP"
          placeholder="00000-000"
          value={client.cep}
          withSearch
          searchLoading={cepLoading}
          onSearch={handleCepSearch}
          onChange={(e) => updateClient({ cep: maskCep(e.target.value) })}
        />
        <TextInput label="Logradouro" value={client.street} onChange={handleField('street')} />

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <TextInput label="Número" value={client.number} onChange={handleField('number')} />
          </div>
          <div style={{ flex: 2 }}>
            <TextInput label="Bairro" value={client.district} onChange={handleField('district')} />
          </div>
        </div>

        <TextInput label="Complemento" value={client.complement} onChange={handleField('complement')} />

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 2 }}>
            <TextInput label="Cidade" value={client.city} onChange={handleField('city')} />
          </div>
          <div style={{ flex: 1 }}>
            <TextInput
              label="Estado"
              maxLength={2}
              value={client.state}
              onChange={(e) => updateClient({ state: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </div>

      <StickyFooter>
        <PrimaryButton onClick={onNext} disabled={!canContinue}>
          Continuar →
        </PrimaryButton>
      </StickyFooter>
    </div>
  );
}
