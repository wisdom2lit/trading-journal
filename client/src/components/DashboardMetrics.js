'use client';

import styles from './DashboardMetrics.module.css';
import { TrendingUp, Target, Activity, DollarSign } from 'lucide-react';

export default function DashboardMetrics({ trades = [] }) {
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.result === 'win').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
  
  const totalProfit = trades.reduce((acc, t) => {
    // Simplified MVP profit calc
    if (t.result === 'win') return acc + Math.abs(t.take_profit - t.entry_price) * t.lot_size;
    if (t.result === 'loss') return acc - Math.abs(t.stop_loss - t.entry_price) * t.lot_size;
    return acc;
  }, 0);

  return (
    <div className={styles.grid}>
      <MetricCard 
        title="Win Rate" 
        value={`${winRate}%`} 
        icon={<TrendingUp size={24} />} 
        color="var(--success)"
      />
      <MetricCard 
        title="Net Profit" 
        value={`$${totalProfit.toFixed(2)}`} 
        icon={<DollarSign size={24} />} 
        color={totalProfit >= 0 ? "var(--success)" : "var(--danger)"}
      />
      <MetricCard 
        title="Total Trades" 
        value={totalTrades} 
        icon={<Activity size={24} />} 
        color="var(--primary)"
      />
      <MetricCard 
        title="Risk/Reward Avg" 
        value="1:2.5" 
        icon={<Target size={24} />} 
        color="var(--primary-hover)"
      />
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20`, color: color }}>
        {icon}
      </div>
      <div className={styles.info}>
        <h3>{title}</h3>
        <p style={{ color }}>{value}</p>
      </div>
    </div>
  );
}
