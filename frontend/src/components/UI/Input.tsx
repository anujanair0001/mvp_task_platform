import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Select from './Select';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  options
}) => {
  const { theme } = useTheme();
  
  const baseStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `2px solid ${theme.border}`,
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    position: 'relative' as const,
    zIndex: options ? 10 : 1,
    background: theme.cardBg,
    color: theme.text
  };

  const focusStyles = {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  };

  if (options) {
    return (
      <Select
        value={value}
        onChange={(newValue) => {
          const event = {
            target: { value: newValue }
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange(event);
        }}
        options={options}
      />
    );
  }

  if (multiline) {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        style={{ ...baseStyles, resize: 'vertical', minHeight: '80px' }}
        onFocus={(e) => Object.assign(e.target.style, focusStyles)}
        onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={baseStyles}
      onFocus={(e) => Object.assign(e.target.style, focusStyles)}
      onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
    />
  );
};

export default Input;