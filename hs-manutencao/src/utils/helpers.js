export function formatCurrency(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR');
}

export function formatMonthYear(date) {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^./, (c) => c.toUpperCase());
}

const UNITS = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const TEENS = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const TENS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const HUNDREDS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

function threeDigitsToWords(n) {
  if (n === 0) return '';
  if (n === 100) return 'cem';
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let parts = [];
  if (h > 0) parts.push(HUNDREDS[h]);
  if (rest > 0) {
    if (rest < 10) parts.push(UNITS[rest]);
    else if (rest < 20) parts.push(TEENS[rest - 10]);
    else {
      const t = Math.floor(rest / 10);
      const u = rest % 10;
      parts.push(u > 0 ? `${TENS[t]} e ${UNITS[u]}` : TENS[t]);
    }
  }
  return parts.join(' e ');
}

function integerToWords(n) {
  if (n === 0) return 'zero';
  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;

  let parts = [];
  if (billions > 0) parts.push(`${threeDigitsToWords(billions)} ${billions === 1 ? 'bilhão' : 'bilhões'}`);
  if (millions > 0) parts.push(`${threeDigitsToWords(millions)} ${millions === 1 ? 'milhão' : 'milhões'}`);
  if (thousands > 0) parts.push(thousands === 1 ? 'mil' : `${threeDigitsToWords(thousands)} mil`);
  if (rest > 0) parts.push(threeDigitsToWords(rest));

  return parts.join(', ').replace(/,([^,]*)$/, ' e$1');
}

export function currencyToWords(value) {
  const num = Number(value) || 0;
  const reais = Math.floor(num);
  const centavos = Math.round((num - reais) * 100);

  let result = '';
  if (reais > 0) {
    result += `${integerToWords(reais)} ${reais === 1 ? 'real' : 'reais'}`;
  } else {
    result += 'zero reais';
  }
  if (centavos > 0) {
    result += ` e ${integerToWords(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`;
  }
  return result;
}

export async function fetchAddressByCep(cep) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido');
  }
  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  if (!response.ok) throw new Error('Erro na consulta do CEP');
  const data = await response.json();
  if (data.erro) throw new Error('CEP não encontrado');
  return {
    street: data.logradouro || '',
    district: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || '',
  };
}

export function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (m, a, b, c) => (c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : ''));
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (m, a, b, c) => (c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : ''));
}

export function maskCpfCnpj(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, d) =>
      [a, b && `.${b}`, c && `.${c}`, d && `-${d}`].filter(Boolean).join('')
    );
  }
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (m, a, b, c, d, e) =>
    [a, b && `.${b}`, c && `/${c}`, d && `-${d}`, e].filter(Boolean).join('')
  );
}

export function maskCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d{0,3})/, (m, a, b) => (b ? `${a}-${b}` : a));
}

export const STATUS_LABELS = {
  em_analise: { label: 'EM ANÁLISE', color: 'warning' },
  aprovado: { label: 'APROVADO', color: 'success' },
  em_andamento: { label: 'EM ANDAMENTO', color: 'navy' },
  finalizada: { label: 'FINALIZADA', color: 'success' },
  cancelada: { label: 'CANCELADA', color: 'danger' },
};

export const PAYMENT_LABELS = {
  total: { label: 'TOTAL', color: 'success-dark' },
  parcial: { label: 'PARCIAL', color: 'warning' },
};

export const DOC_TYPE_LABELS = {
  orcamento: 'Orçamento',
  ordem_servico: 'Ordem de Serviço',
  contrato: 'Contrato',
  recibo: 'Recibo',
};
