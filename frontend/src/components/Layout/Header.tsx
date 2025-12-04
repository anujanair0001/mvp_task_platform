import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/tasks', label: 'Tasks', icon: '📋' },
    { path: '/activity', label: 'Activity', icon: '📊' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : [])
  ];

  return (
    <header style={{
      background: isDark ? '#2d3748' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: theme.shadow
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 
            onClick={() => navigate('/dashboard')}
            style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✨ TaskFlow
          </h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              👤 {user.name}
            </div>
            <button
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;