'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import api from '../../services/api';
import { Check } from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('success')) {
      setMessage('Subscription successful! You are now a Pro member.');
    }
    if (searchParams.get('canceled')) {
      setMessage('Subscription checkout was canceled.');
    }
  }, [searchParams]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await api.post('/stripe/create-checkout-session');
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to initiate checkout. Please check Stripe configuration.');
    } finally {
      setLoading(false);
    }
  };

  const isPro = user?.subscription_tier === 'pro';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Subscription & Billing</h1>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

        {/* Free Tier */}
        <div className="card" style={{ border: isPro ? '1px solid var(--border)' : '2px solid var(--primary)', position: 'relative' }}>
          {!isPro && <span style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>CURRENT PLAN</span>}
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Basic</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={20} color="var(--primary)" /> Basic trade logging</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={20} color="var(--primary)" /> Simple dashboard</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>✖ No chart uploads</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>✖ No advanced metrics</li>
          </ul>

          <button className="btn btn-outline" style={{ width: '100%' }} disabled>
            {isPro ? 'Downgrade to Basic' : 'Active Plan'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className="card" style={{ border: isPro ? '2px solid var(--primary)' : '1px solid var(--border)', position: 'relative', background: 'linear-gradient(145deg, var(--surface) 0%, rgba(59,130,246,0.05) 100%)' }}>
          {isPro && <span style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>CURRENT PLAN</span>}
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Pro Trader</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>$19<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={20} color="var(--primary)" /> Everything in Basic</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={20} color="var(--primary)" /> Cloudinary chart uploads</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={20} color="var(--primary)" /> Advanced performance metrics</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={20} color="var(--primary)" /> Priority support</li>
          </ul>

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            onClick={handleUpgrade}
            disabled={loading || isPro}
          >
            {loading ? 'Processing...' : isPro ? 'Active Plan' : 'Upgrade to Pro'}
          </button>
        </div>

      </div>
    </div>
  );
}
