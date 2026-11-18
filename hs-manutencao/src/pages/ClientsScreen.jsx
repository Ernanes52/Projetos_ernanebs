import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, MapPin, User } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import { TextInput } from '../components/FormFields';
import { PrimaryButton, IconButton } from '../components/Buttons';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../components/Toast';
import { maskPhone, maskCpfCnpj, maskCep, fetchAddressByCep } from '../utils/helpers';

export default function ClientsScreen() {
  const navigate = useNavigate();
  const { clients, addClient } = useAppData();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', document: '', cep: '', street: '', number: '', district: '', complement: '', city: '', state: '',
  });
  const [cepLoading, setCepLoading] = useState(false);

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleCepSearch = async () => {
    if (!form.cep) return;
    setCepLoading(true);
    try {
      const address = await fetchAddressByCep(form.cep);
      setForm((f) => ({ ...f, ...address }));
      showToast('Endereço encontrado!', 'success');
    } catch (e) {
      showToast('Não foi possível consultar o CEP. ' + e.message, 'error');
    } finally {
      setCepLoading(false);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast('Informe o nome do cliente.', 'warning');
      return;
    }
    addClient(form);
    showToast('Cliente cadastrado com sucesso!', 'success');
    setModalOpen(false);
    setForm({ name: '', phone: '', document: '', cep: '', street: '', number: '', district: '', complement: '', city: '', state: '' });
  };

  return (
    <div className="screen-content" style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <ScreenHeader
        title="Clientes"
        onBack={() => navigate('/')}
        rightSlot={
          <IconButton icon={<Plus size={19} />} onClick={() => setModalOpen(true)} aria-label="Novo cliente" />
        }
      />

      <div style={{ padding: 16 }}>
        <input
          placeholder="Buscar cliente por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--border-soft)',
            fontSize: 14,
            marginBottom: 16,
            background: '#fff',
          }}
        />

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <User size={36} style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 14 }}>Nenhum cliente encontrado.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((client) => (
            <div
              key={client.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: 'var(--text-primary)' }}>
                {client.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {client.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Phone size={13} /> {client.phone}
                  </div>
                )}
                {(client.city || client.state) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <MapPin size={13} /> {[client.city, client.state].filter(Boolean).join(' - ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Cliente">
        <TextInput
          label="Nome do Cliente"
          required
          placeholder="Ex: Marcos Andrade"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <TextInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: maskPhone(e.target.value) }))}
        />
        <TextInput
          label="CPF/CNPJ"
          placeholder="000.000.000-00"
          value={form.document}
          onChange={(e) => setForm((f) => ({ ...f, document: maskCpfCnpj(e.target.value) }))}
        />
        <TextInput
          label="CEP"
          placeholder="00000-000"
          value={form.cep}
          withSearch
          searchLoading={cepLoading}
          onSearch={handleCepSearch}
          onChange={(e) => setForm((f) => ({ ...f, cep: maskCep(e.target.value) }))}
        />
        <TextInput
          label="Logradouro"
          value={form.street}
          onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <TextInput label="Número" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} />
          </div>
          <div style={{ flex: 2 }}>
            <TextInput label="Bairro" value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} />
          </div>
        </div>
        <TextInput
          label="Complemento"
          value={form.complement}
          onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 2 }}>
            <TextInput label="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
          </div>
          <div style={{ flex: 1 }}>
            <TextInput label="Estado" maxLength={2} value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase() }))} />
          </div>
        </div>
        <PrimaryButton onClick={handleSave} style={{ marginTop: 8 }}>Salvar Cliente</PrimaryButton>
      </Modal>

      <BottomNav />
    </div>
  );
}
