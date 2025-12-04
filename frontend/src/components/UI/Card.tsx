import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, selected = false }) => {
  const { theme } = useTheme();
  
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.cardBg,
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: selected ? '0 8px 25px rgba(102, 126, 234, 0.3)' : theme.shadow,
        border: selected ? '2px solid #667eea' : `1px solid ${theme.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: selected ? 'translateY(-2px)' : 'none',
        color: theme.text
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Card;