'use client';

import { useEffect, useState } from 'react';
import api from '../../services/api';
import Link from 'next/link';

export default function TradesListPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterResult, setFilterResult] = useState('all');
  const [filterPair, setFilterPair] = useState('');

  const fetchTrades = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      await api.delete(`/trades/${id}`);
      fetchTrades();
    }
  };

  const filteredTrades = trades.filter(t => {
    if (filterResult !== 'all' && t.result !== filterResult) return false;
    if (filterPair && !t.pair.toLowerCase().includes(filterPair.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Trade History</h1>
        <Link href="/trades/new" className="btn btn-primary">
          + New Trade
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Filter by Result</label>
          <select 
            className="input-base" 
            value={filterResult} 
            onChange={e => setFilterResult(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Outcomes</option>
            <option value="win">Wins</option>
            <option value="loss">Losses</option>
            <option value="breakeven">Breakeven</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Search Pair</label>
          <input 
            type="text" 
            className="input-base" 
            placeholder="e.g. EURUSD" 
            value={filterPair} 
            onChange={e => setFilterPair(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>
      </div>

      <div className="card animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading trades...</div>
        ) : filteredTrades.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No trades found matching your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Pair</th>
                  <th style={{ padding: '1rem' }}>Direction</th>
                  <th style={{ padding: '1rem' }}>Entry</th>
                  <th style={{ padding: '1rem' }}>Lots</th>
                  <th style={{ padding: '1rem' }}>Result</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }} className="animate-fade-in">
                    <td style={{ padding: '1rem' }}>{new Date(t.executed_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{t.pair}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize', color: t.direction === 'buy' ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>{t.direction}</td>
                    <td style={{ padding: '1rem' }}>{t.entry_price}</td>
                    <td style={{ padding: '1rem' }}>{t.lot_size}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: 'var(--radius-lg)', 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backgroundColor: t.result === 'win' ? 'var(--success-bg)' : t.result === 'loss' ? 'var(--danger-bg)' : 'var(--surface-hover)',
                        color: t.result === 'win' ? 'var(--success)' : t.result === 'loss' ? 'var(--danger)' : 'var(--text-secondary)'
                      }}>
                        {t.result ? t.result.toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link href={`/trades/${t.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>View</Link>
                        <button onClick={() => handleDelete(t.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>Del</button>
                      </div>
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
