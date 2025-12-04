import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        };
      case 'secondary':
        return {
          background: '#f8f9fa',
          color: '#495057',
          border: '1px solid #dee2e6'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
          color: 'white',
          border: 'none'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
          color: 'white',
          border: 'none'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.5rem 1rem', fontSize: '0.875rem' };
      case 'lg':
        return { padding: '1rem 2rem', fontSize: '1.125rem' };
      default:
        return { padding: '0.75rem 1.5rem', fontSize: '1rem' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </button>
  );
};

export default Button;