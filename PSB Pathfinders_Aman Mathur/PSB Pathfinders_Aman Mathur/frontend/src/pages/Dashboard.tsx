import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { apiFetch, logout } = useAuth();
  const [wealthData, setWealthData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [actionAmount, setActionAmount] = useState('');
  const [actionName, setActionName] = useState('Investment');
  const [riskResult, setRiskResult] = useState<any>(null);

  const loadData = async () => {
    try {
      const wealth = await apiFetch('/wealth/predict-5-years');
      const recs = await apiFetch('/wealth/investment-recommendations');
      const analysis = await apiFetch('/transactions/analysis');
      setWealthData({ ...wealth, ...analysis });
      setRecommendations(recs.recommendations);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiFetch('/actions/execute', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(actionAmount),
          action_name: actionName
        })
      });
      setRiskResult(result);
      loadData(); // Reload stats after action
    } catch (err: any) {
      setRiskResult({ status: 'error', detail: err.message });
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <main>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Wealth Intelligence Dashboard</h1>
          <button className='btn-primary' onClick={logout} style={{ background: 'var(--error)' }}>Logout</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <section className='glass-card'>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Financial Health</h3>
            <p>Income: <strong>₹{wealthData?.total_income?.toLocaleString()}</strong></p>
            <p>Expense: <strong>₹{wealthData?.total_expense?.toLocaleString()}</strong></p>
            <p>Savings Rate: <strong>{wealthData?.savings_rate}%</strong></p>
          </section>

          <section className='glass-card'>
            <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>5-Year Target</h3>
            <p style={{ fontSize: '1.2rem' }}><strong>₹{wealthData?.predicted_wealth_5_years?.toLocaleString()}</strong></p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Based on {wealthData?.risk_profile} risk profile</p>
          </section>
        </div>

        {wealthData?.budget_tips?.length > 0 && (
          <section className='glass-card' style={{ marginBottom: '2rem', borderLeft: '4px solid var(--warning)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Personalized Budgeting Tips</h3>
            <ul style={{ paddingLeft: '1.2rem' }}>
              {wealthData.budget_tips.map((tip: string, i: number) => (
                <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        {wealthData?.category_breakdown && Object.keys(wealthData.category_breakdown).length > 0 && (
          <section className='glass-card' style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Spending by Category</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(wealthData.category_breakdown).map(([cat, amt]: [string, any]) => (
                <div key={cat} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                  {cat}: <strong>₹{amt.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3>Investment Recommendations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            {recommendations.map((rec, i) => (
              <div key={i} className='glass-card' style={{ padding: '1.5rem' }}>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside>
        <div className='glass-card' style={{ position: 'sticky', top: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Protected Wealth Action</h3>
          <form onSubmit={handleExecuteAction}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Action Name</label>
            <input className='input-field' type='text' value={actionName} onChange={e => setActionName(e.target.value)} required />
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
            <input className='input-field' type='number' value={actionAmount} onChange={e => setActionAmount(e.target.value)} required />
            <button className='btn-primary' type='submit' style={{ width: '100%' }}>Execute Securely</button>
          </form>

          {riskResult && (
            <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '8px', background: riskResult.status === 'error' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.2)' }}>
              <h4>{riskResult.decision || 'Error'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Risk Score: {riskResult.risk_score}</p>
              {riskResult.detail && <p style={{ fontSize: '0.8rem', color: 'var(--error)' }}>{riskResult.detail}</p>}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
