'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import Link from 'next/link';

export default function NewTradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pair: '',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    lot_size: '',
    direction: 'buy',
    result: '',
    notes: '',
    executed_at: new Date().toISOString().substring(0, 16)
  });

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) {
      data.append('chart_image', imageFile);
    }

    try {
      // Must include Content-Type form-data for multer
      await api.post('/trades', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/trades');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create trade');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Log New Trade</h1>
        <Link href="/trades" className="btn btn-outline">Back to Trades</Link>
      </div>

      <div className="card animate-fade-in">
        {error && <div style={{ color: 'var(--danger)', padding: '1rem', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Pair (e.g. EURUSD, BTCUSD)</label>
            <input type="text" className="input-base" required value={formData.pair} onChange={e => setFormData({ ...formData, pair: e.target.value.toUpperCase() })} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Direction</label>
            <select className="input-base" value={formData.direction} onChange={e => setFormData({ ...formData, direction: e.target.value })}>
              <option value="buy">Buy (Long)</option>
              <option value="sell">Sell (Short)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Entry Price</label>
            <input type="number" step="any" className="input-base" required value={formData.entry_price} onChange={e => setFormData({ ...formData, entry_price: e.target.value })} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Lot Size / Position Size</label>
            <input type="number" step="any" className="input-base" required value={formData.lot_size} onChange={e => setFormData({ ...formData, lot_size: e.target.value })} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Stop Loss</label>
            <input type="number" step="any" className="input-base" required value={formData.stop_loss} onChange={e => setFormData({ ...formData, stop_loss: e.target.value })} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Take Profit</label>
            <input type="number" step="any" className="input-base" required value={formData.take_profit} onChange={e => setFormData({ ...formData, take_profit: e.target.value })} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Execution Time</label>
            <input type="datetime-local" className="input-base" required value={formData.executed_at} onChange={e => setFormData({ ...formData, executed_at: e.target.value })} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Result</label>
            <select className="input-base" value={formData.result} onChange={e => setFormData({ ...formData, result: e.target.value })}>
              <option value="">Pending / Open</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">Breakeven</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Chart Screenshot (Optional)</label>
            <input type="file" accept="image/*" className="input-base" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0.5rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Notes / Review</label>
            <textarea className="input-base" rows="4" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="What did you do well? What could be improved?"></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
