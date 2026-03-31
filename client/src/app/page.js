import Link from 'next/link';

export default function Home() {
  return (
    <div className="app-container animate-fade-in" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: '800' }}>TradeSync</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px' }}>
        The ultimate trading journal to track, analyze, and improve your edge. Build discipline and find profitability.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }}>Login</Link>
        <Link href="/register" className="btn btn-outline" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }}>Register</Link>
      </div>
    </div>
  );
}
