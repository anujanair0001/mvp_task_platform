import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'priority' | 'status';
  type?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'priority', type = '' }) => {
  const getStyles = () => {
    if (variant === 'priority') {
      switch (type) {
        case 'High':
          return { background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: 'white' };
        case 'Medium':
          return { background: 'linear-gradient(135deg, #ffd93d 0%, #ff9500 100%)', color: 'white' };
        case 'Low':
          return { background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)', color: 'white' };
        default:
          return { background: '#e9ecef', color: '#495057' };
      }
    }
    
    if (variant === 'status') {
      switch (type) {
        case 'Done':
          return { background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)', color: 'white' };
        case 'In Progress':
          return { background: 'linear-gradient(135deg, #339af0 0%, #228be6 100%)', color: 'white' };
        case 'Todo':
          return { background: '#e9ecef', color: '#495057' };
        default:
          return { background: '#e9ecef', color: '#495057' };
      }
    }
    
    return { background: '#e9ecef', color: '#495057' };
  };

  return (
    <span
      style={{
        ...getStyles(),
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-block'
      }}
    >
      {children}
    </span>
  );
};

export default Badge;