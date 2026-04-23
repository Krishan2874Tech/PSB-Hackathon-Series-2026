import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import './styles/global.css';

const App: React.FC = () => {
  const { token } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

  if (token) {
    return (
      <div style={{ minHeight: '100vh', padding: '1rem' }}>
        <Dashboard />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem' }}>
      {view === 'login' ? (
        <Login onShowRegister={() => setView('register')} />
      ) : (
        <Register onBackToLogin={() => setView('login')} />
      )}
    </div>
  );
};

export const Root: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
