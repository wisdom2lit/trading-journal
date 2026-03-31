'use client';

import { useEffect, useState } from 'react';
import api from '../../services/api';
import DashboardMetrics from '../../components/DashboardMetrics';
import TradesChart from '../../components/TradesChart';
import Link from 'next/link';

export default function DashboardPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await api.get('/trades?limit=100');
        if (res.data.success) {
          setTrades(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch trades', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  if (loading) return <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <Link href="/trades/new" className="btn btn-primary">
          + New Trade
        </Link>
      </div>
      
      <DashboardMetrics trades={trades} />
      
      <div style={{ marginTop: '2rem' }}>
        <TradesChart trades={trades} />
      </div>

      <div className="card" style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>Recent Trades</h3>
        {trades.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No trades yet. Add your first trade to see activity.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0' }}>Pair</th>
                  <th style={{ padding: '1rem 0' }}>Direction</th>
                  <th style={{ padding: '1rem 0' }}>Result</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 5).map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }} className="animate-fade-in">
                    <td style={{ padding: '1.25rem 0' }}>{new Date(t.executed_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1.25rem 0', fontWeight: 'bold' }}>{t.pair}</td>
                    <td style={{ padding: '1.25rem 0', textTransform: 'capitalize', color: t.direction === 'buy' ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                      {t.direction}
                    </td>
                    <td style={{ padding: '1.25rem 0' }}>
                      <span style={{ 
                        padding: '0.35rem 0.85rem', 
                        borderRadius: 'var(--radius-lg)', 
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backgroundColor: t.result === 'win' ? 'var(--success-bg)' : t.result === 'loss' ? 'var(--danger-bg)' : 'var(--surface-hover)',
                        color: t.result === 'win' ? 'var(--success)' : t.result === 'loss' ? 'var(--danger)' : 'var(--text-secondary)'
                      }}>
                        {t.result ? t.result.toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                      <Link href={`/trades/${t.id}`} className="btn btn-outline" style={{ padding: '0.35rem 1rem', fontSize: '0.875rem' }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
