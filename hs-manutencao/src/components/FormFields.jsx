import React from 'react';
import { Search } from 'lucide-react';

export function FieldLabel({ children, required }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: 6,
      }}
    >
      {children} {required && <span style={{ color: 'var(--danger-600)' }}>*</span>}
    </label>
  );
}

const inputBaseStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--border-soft)',
  fontSize: 14.5,
  color: 'var(--text-primary)',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export function TextInput({ label, required, withSearch, onSearch, searchLoading, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
        <input
          {...props}
          style={{ ...inputBaseStyle, ...(props.style || {}) }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--navy-600)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-soft)';
            props.onBlur?.(e);
          }}
        />
        {withSearch && (
          <button
            type="button"
            onClick={onSearch}
            disabled={searchLoading}
            aria-label="Buscar"
            style={{
              flexShrink: 0,
              width: 46,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--navy-800)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: searchLoading ? 0.6 : 1,
            }}
          >
            <Search size={17} />
          </button>
        )}
      </div>
    </div>
  );
}

export function SelectInput({ label, required, options, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <select {...props} style={{ ...inputBaseStyle, appearance: 'none', background: '#fff url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8"><path d="M1 1l5 5 5-5" stroke="%235b6473" fill="none" stroke-width="1.6"/></svg>\') no-repeat right 14px center' }}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function TextareaInput({ label, required, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <textarea
        {...props}
        rows={props.rows || 4}
        style={{ ...inputBaseStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, ...(props.style || {}) }}
      />
    </div>
  );
}

export function CurrencyInput({ label, required, value, onValueChange, ...props }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^\d,.-]/g, '');
    onValueChange(raw);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            fontSize: 14.5,
            fontWeight: 600,
          }}
        >
          R$
        </span>
        <input
          {...props}
          value={value}
          onChange={handleChange}
          inputMode="decimal"
          style={{ ...inputBaseStyle, paddingLeft: 40 }}
        />
      </div>
    </div>
  );
}
