import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import DocumentPreview from '../components/DocumentPreview';
import { TextInput, TextareaInput } from '../components/FormFields';
import { StickyFooter, MustardButton, PrimaryButton } from '../components/Buttons';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/Toast';
import { currencyToWords, formatCurrency } from '../utils/helpers';

export default function NewReceiptScreen() {
  const navigate = useNavigate();
  const { clients, addDocument, findClientByDocument, addClient } = useAppData();
  const { showToast } = useToast();

  const [clientName, setClientName] = useState('');
  const [paymentType, setPaymentType] = useState('total');
  const [value, setValue] = useState('');
  const [reference, setReference] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState(null);

  const numericValue = parseFloat(value.replace(',', '.')) || 0;

  const receiptText = useMemo(() => {
    if (!clientName || numericValue <= 0) return '';
    const partial = paymentType === 'parcial' ? 'parcial' : 'total';
    return `Recebemos de ${clientName}, a importância de ${formatCurrency(numericValue)} (${currencyToWords(numericValue)}), referente ao pagamento ${partial} de: ${reference || '[serviço prestado]'}. Para clareza, firmamos o presente recibo.`;
  }, [clientName, numericValue, paymentType, reference]);

  const handleSearchClient = () => {
    const found = clients.find((c) => c.name.toLowerCase().includes(clientName.toLowerCase()));
    if (found) {
      setClientName(found.name);
      showToast('Cliente encontrado!', 'success');
    } else {
      showToast('Nenhum cliente encontrado com esse nome.', 'warning');
    }
  };

  const handleSearchReference = () => {
    showToast('Busque um orçamento aprovado em "Itens Emitidos" para referenciar.', 'info');
  };

  const canGenerate = clientName.trim() && numericValue > 0 && reference.trim();

  const handleGenerate = () => {
    if (!canGenerate) {
      showToast('Preencha cliente, valor e referência para gerar o recibo.', 'warning');
      return;
    }
    let clientRecord = clients.find((c) => c.name.toLowerCase() === clientName.toLowerCase());
    if (!clientRecord) {
      clientRecord = addClient({ name: clientName, phone: '', document: '', cep: '', street: '', number: '', district: '', complement: '', city: '', state: '' });
    }
    const doc = addDocument({
      type: 'recibo',
      title: `Recibo - ${reference}`,
      clientId: clientRecord.id,
      clientName,
      client: clientRecord,
      total: numericValue,
      status: 'finalizada',
      paymentStatus: paymentType,
      referenceText: reference,
      referenceTextFull: receiptText,
      items: [],
    });
    setGeneratedDoc(doc);
    showToast('Recibo gerado com sucesso!', 'success');
  };

  if (generatedDoc) {
    return (
      <div className="screen-content" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        <ScreenHeader title="Recibo Gerado" onBack={() => navigate('/itens-emitidos')} />
        <div style={{ padding: 16 }}>
          <DocumentPreview doc={generatedDoc} />
        </div>
        <StickyFooter>
          <PrimaryButton onClick={() => window.print()} icon={<FileDown size={17} />}>
            Imprimir / Salvar PDF
          </PrimaryButton>
          <button
            onClick={() => navigate('/')}
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
      <ScreenHeader title="Novo Recibo" onBack={() => navigate('/')} />

      <div style={{ padding: 16 }}>
        <TextInput
          label="Cliente"
          placeholder="Nome do cliente"
          value={clientName}
          withSearch
          onSearch={handleSearchClient}
          onChange={(e) => setClientName(e.target.value)}
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Tipo de Pagamento
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['total', 'parcial'].map((type) => (
              <button
                key={type}
                onClick={() => setPaymentType(type)}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: 'var(--radius-sm)',
                  border: paymentType === type ? '2px solid var(--navy-800)' : '1.5px solid var(--border-soft)',
                  background: paymentType === type ? 'var(--navy-800)' : '#fff',
                  color: paymentType === type ? '#fff' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  textTransform: 'capitalize',
                }}
              >
                {type === 'total' ? 'Total' : 'Parcial'}
              </button>
            ))}
          </div>
        </div>

        <TextInput
          label="Valor Recebido"
          placeholder="0,00"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^\d,.-]/g, ''))}
          style={{ paddingLeft: 14 }}
        />

        <TextInput
          label="Referente a"
          placeholder="Ex: Revisão de motor"
          value={reference}
          withSearch
          onSearch={handleSearchReference}
          onChange={(e) => setReference(e.target.value)}
        />

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Texto do Recibo (gerado automaticamente)
          </label>
          <TextareaInput
            value={receiptText || 'Preencha os campos acima para gerar o texto do recibo...'}
            readOnly
            rows={6}
            style={{ background: 'var(--bg-app)', color: receiptText ? 'var(--text-primary)' : 'var(--text-muted)' }}
          />
        </div>
      </div>

      <StickyFooter>
        <MustardButton onClick={handleGenerate} icon={<FileDown size={18} />} disabled={!canGenerate}>
          Gerar PDF
        </MustardButton>
      </StickyFooter>
    </div>
  );
}
