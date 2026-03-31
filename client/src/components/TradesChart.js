'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TradesChart({ trades = [] }) {
  // Sort trades chronologically
  const sorted = [...trades].sort((a, b) => new Date(a.executed_at) - new Date(b.executed_at));
  
  // Calculate cumulative PnL
  let cumulative = 0;
  const pnlData = sorted.map(t => {
    let profit = 0;
    if (t.result === 'win') profit = Math.abs(t.take_profit - t.entry_price) * t.lot_size;
    if (t.result === 'loss') profit = -Math.abs(t.stop_loss - t.entry_price) * t.lot_size;
    cumulative += profit;
    return cumulative;
  });

  const labels = sorted.map(t => new Date(t.executed_at).toLocaleDateString());

  const data = {
    labels: labels.length ? labels : ['No Data'],
    datasets: [
      {
        fill: true,
        label: 'Cumulative PnL ($)',
        data: pnlData.length ? pnlData : [0],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false, text: 'Account Growth' },
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    }
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Account Growth</h3>
      <Line options={options} data={data} />
    </div>
  );
}
