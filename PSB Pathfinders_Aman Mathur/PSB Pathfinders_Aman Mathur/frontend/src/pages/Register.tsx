import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const { apiFetch } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    mobile: '',
    dob: '',
    pan_number: '',
    income: 0,
    risk_profile: 'medium'
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'income' ? parseFloat(value) : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className='glass-card' style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Registration Successful!</h2>
        <p style={{ marginBottom: '1.5rem' }}>A welcome email with your credentials has been sent to {formData.email}.</p>
        <button className='btn-primary' onClick={onBackToLogin} style={{ width: '100%' }}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className='glass-card' style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Create Account</h2>
      {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}
      
      <form onSubmit={handleRegister}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input className='input-field' name='full_name' placeholder='Full Name' onChange={handleChange} required />
          <input className='input-field' name='email' type='email' placeholder='Email' onChange={handleChange} required />
          <input className='input-field' name='password' type='password' placeholder='Password' onChange={handleChange} required />
          <input className='input-field' name='mobile' placeholder='Mobile Number' onChange={handleChange} required />
          <input className='input-field' name='dob' type='date' placeholder='DOB' onChange={handleChange} required />
          <input className='input-field' name='pan_number' placeholder='PAN Number' onChange={handleChange} required />
          <input className='input-field' name='income' type='number' placeholder='Annual Income' onChange={handleChange} required />
          <select className='input-field' name='risk_profile' onChange={handleChange} style={{ background: '#1a1a1a' }}>
            <option value='low'>Low Risk</option>
            <option value='medium'>Medium Risk</option>
            <option value='high'>High Risk</option>
          </select>
        </div>
        
        <button className='btn-primary' type='submit' style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <span onClick={onBackToLogin} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Login here</span>
        </p>
      </form>
    </div>
  );
};
