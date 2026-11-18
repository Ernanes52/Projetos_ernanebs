import React from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function DocumentPreview({ doc }) {
  const services = doc.items?.filter((i) => i.kind === 'servico') || [];
  const materials = doc.items?.filter((i) => i.kind === 'material') || [];
  const subtotal = (doc.items || []).reduce((s, i) => s + i.unitValue * i.quantity, 0);
  const discountValue = subtotal * ((doc.discount || 0) / 100);
  const finalTotal = subtotal - discountValue;

  return (
    <div
      id="document-preview-print"
      style={{
        background: '#fff',
        padding: '32px 28px',
        border: '1px solid #d8dde5',
        borderRadius: 4,
        fontFamily: "'Inter', sans-serif",
        color: '#182230',
        fontSize: 12.5,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #0a1f3d', paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0a1f3d', lineHeight: 1 }}>HS</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#0a1f3d', letterSpacing: 1.5 }}>MANUTENÇÃO NÁUTICA</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0a1f3d', textTransform: 'uppercase' }}>
            {doc.type === 'recibo' ? 'Recibo' : 'Orçamento'}
          </div>
          <div style={{ fontSize: 11, color: '#5b6473' }}>Nº {doc.id?.toString().slice(-6).toUpperCase()}</div>
          <div style={{ fontSize: 11, color: '#5b6473' }}>{formatDate(doc.createdAt)}</div>
        </div>
      </div>

      <div style={{ fontWeight: 700, marginBottom: 4 }}>{doc.title}</div>

      {/* Dados do cliente */}
      <div style={{ background: '#f5f6f8', borderRadius: 6, padding: 12, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#0a1f3d' }}>CLIENTE</div>
        <div>{doc.clientName}</div>
        {doc.client?.phone && <div style={{ color: '#5b6473' }}>{doc.client.phone}</div>}
        {doc.client?.street && (
          <div style={{ color: '#5b6473' }}>
            {doc.client.street}, {doc.client.number} — {doc.client.district}, {doc.client.city}/{doc.client.state}
          </div>
        )}
      </div>

      {doc.type !== 'recibo' && (
        <>
          {services.length > 0 && (
            <ItemsTable title="SERVIÇOS" items={services} />
          )}
          {materials.length > 0 && (
            <ItemsTable title="MATERIAIS" items={materials} />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <div style={{ width: 220 }}>
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              {doc.discount > 0 && <Row label={`Desconto (${doc.discount}%)`} value={`- ${formatCurrency(discountValue)}`} />}
              <div style={{ borderTop: '2px solid #0a1f3d', marginTop: 6, paddingTop: 6 }}>
                <Row label="TOTAL" value={formatCurrency(finalTotal)} bold />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InfoBlock label="Condições de Pagamento" value={doc.paymentTerms || '—'} />
            <InfoBlock label="Prazo de Execução" value={doc.executionTime || '—'} />
            <InfoBlock label="Garantia" value={doc.warranty || '—'} />
          </div>

          {doc.notes && <InfoBlock label="Observações" value={doc.notes} style={{ marginTop: 12 }} />}
        </>
      )}

      {doc.type === 'recibo' && (
        <div style={{ background: '#f5f6f8', borderRadius: 6, padding: 16, lineHeight: 1.7, marginBottom: 16 }}>
          {doc.referenceTextFull}
        </div>
      )}

      {/* Assinaturas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 16 }}>
        <div style={{ textAlign: 'center', width: '45%' }}>
          <div style={{ borderTop: '1px solid #182230', paddingTop: 6 }}>HS Manutenção Náutica</div>
        </div>
        <div style={{ textAlign: 'center', width: '45%' }}>
          <div style={{ borderTop: '1px solid #182230', paddingTop: 6 }}>{doc.clientName}</div>
        </div>
      </div>
    </div>
  );
}

function ItemsTable({ title, items }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, color: '#0a1f3d', marginBottom: 6, fontSize: 11.5 }}>{title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
        <thead>
          <tr style={{ background: '#0a1f3d', color: '#fff' }}>
            <th style={thStyle}>Descrição</th>
            <th style={thStyle}>Qtd</th>
            <th style={thStyle}>Unit.</th>
            <th style={thStyle}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #e3e6ec' }}>
              <td style={tdStyle}>{item.description}</td>
              <td style={tdStyle}>{item.quantity} {item.unit}</td>
              <td style={tdStyle}>{formatCurrency(item.unitValue)}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{formatCurrency(item.unitValue * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '6px 8px', fontWeight: 600 };
const tdStyle = { padding: '6px 8px' };

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontWeight: bold ? 700 : 400, fontSize: bold ? 13 : 12 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoBlock({ label, value, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#5b6473', marginBottom: 3, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 12 }}>{value}</div>
    </div>
  );
}
