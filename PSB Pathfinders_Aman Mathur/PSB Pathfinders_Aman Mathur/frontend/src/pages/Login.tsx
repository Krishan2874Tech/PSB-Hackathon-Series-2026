import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onShowRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onShowRegister }) => {
  const { login, apiFetch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: Password, 2: OTP
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password,
          device_id: window.navigator.userAgent // Using UserAgent as a simple device identifier
        })
      });
      setStep(2);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', otp); // Backend uses password field for OTP in form data

      const data = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        body: formData
      }).then(res => res.json());

      if (data.access_token) {
        login(data.access_token);
      } else {
        throw new Error(data.detail || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='glass-card' style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>{step === 1 ? 'Sign In' : 'Verify OTP'}</h2>
      {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}
      
      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <input className='input-field' type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
          <input className='input-field' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
          <button className='btn-primary' type='submit' style={{ width: '100%' }}>Get OTP</button>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Don't have an account? <span onClick={onShowRegister} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Register here</span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>OTP sent to {email}</p>
          <input className='input-field' type='text' placeholder='Enter 6-digit OTP' value={otp} onChange={e => setOtp(e.target.value)} required />
          <button className='btn-primary' type='submit' style={{ width: '100%' }}>Login</button>
          <button className='btn-primary' type='button' onClick={() => setStep(1)} style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
        </form>
      )}
    </div>
  );
};

