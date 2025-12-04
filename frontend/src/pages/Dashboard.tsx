import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: theme.bg }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '600', color: theme.text, marginBottom: '0.5rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ fontSize: '1rem', color: theme.textSecondary, margin: 0 }}>
            Ready to tackle your tasks and collaborate with your team?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👤</div>
              <h3 style={{ margin: '0 0 1rem 0', color: theme.text }}>Profile Information</h3>
              <div style={{ textAlign: 'left', background: theme.bg, padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: theme.text }}><strong>Name:</strong> {user?.name}</p>
                <p style={{ margin: 0, color: theme.text }}><strong>Email:</strong> {user?.email}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀</div>
              <h3 style={{ margin: '0 0 1rem 0', color: theme.text }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button onClick={() => navigate('/tasks')} variant="primary">
                  Manage Tasks
                </Button>
                <Button onClick={() => navigate('/activity')} variant="success">
                  View Team Activity
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
              <h3 style={{ margin: '0 0 1rem 0', color: theme.text }}>Platform Features</h3>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: theme.text }}>
                  <span>✅</span> Create and assign tasks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: theme.text }}>
                  <span>🎯</span> Set priorities and status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: theme.text }}>
                  <span>💬</span> Collaborate with comments
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.text }}>
                  <span>📈</span> Track team activity
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1rem 0', color: theme.text }}>🎉 Ready to Get Started?</h2>
            <p style={{ margin: '0 0 2rem 0', color: theme.textSecondary, fontSize: '1.125rem' }}>
              Your task management journey begins here. Create tasks, collaborate with your team, and achieve your goals!
            </p>
            <Button onClick={() => navigate('/tasks')} variant="primary" size="lg">
              🚀 Start Managing Tasks
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;