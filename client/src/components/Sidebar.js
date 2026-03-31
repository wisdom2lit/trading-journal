'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  if (!user) return null;

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Trades', path: '/trades', icon: '📈' },
    { label: 'Billing', path: '/billing', icon: '💳' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>TradeSync</h2>
        <span className={styles.badge}>{user.subscription_tier.toUpperCase()}</span>
      </div>
      
      <nav className={styles.nav}>
        {links.map((link) => (
          <Link key={link.path} href={link.path} className={`${styles.link} ${pathname.startsWith(link.path) ? styles.active : ''}`}>
            <span className={styles.icon}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>{user.email}</div>
        <button onClick={logout} className="btn btn-outline" style={{width: '100%'}}>Logout</button>
      </div>
    </aside>
  );
}
