import { useState } from 'react';
import { Trophy, EyeOff } from 'lucide-react';
import { DEMO_LEADERBOARD } from '@/data/demoData';

export function Leaderboard() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [hideMe, setHideMe] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Leaderboard</h1>
        <p className="text-sm text-navy-500">See how you rank against other learners.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['weekly', 'monthly', 'alltime'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                period === p ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
              }`}>
              {p === 'alltime' ? 'All-time' : p}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-navy-500">
          <input type="checkbox" checked={hideMe} onChange={(e) => setHideMe(e.target.checked)} />
          <EyeOff size={13} /> Hide my name from public leaderboard
        </label>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr>
              <th className="px-5 py-3">Rank</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Points</th>
              <th className="px-5 py-3">Tasks completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {DEMO_LEADERBOARD.map((row) => (
              <tr key={row.rank}>
                <td className="px-5 py-3 font-mono font-semibold text-navy-700">
                  {row.rank <= 3 ? <Trophy size={15} className="inline text-brand-amber" /> : `#${row.rank}`}
                </td>
                <td className="px-5 py-3 font-medium text-navy-900">{row.name}</td>
                <td className="px-5 py-3 font-mono text-brand-green-dark">{row.points.toLocaleString()}</td>
                <td className="px-5 py-3 text-navy-600">{row.tasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
