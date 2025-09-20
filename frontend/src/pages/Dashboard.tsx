import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [updates, setUpdates] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/tech-updates').then(r=>r.json()).then(d=>setUpdates(d.data||[]));
  }, []);
  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="font-semibold mb-2">Recommended Paths</div>
          <ul className="text-sm text-gray-300 list-disc pl-5">
            <li>Full-Stack Developer</li>
            <li>Data Analyst</li>
            <li>Cloud Engineer</li>
          </ul>
        </div>
        <div className="card p-4 md:col-span-2">
          <div className="font-semibold mb-2">Real-time Tech Updates</div>
          <div className="space-y-3">
            {updates.map(u => (
              <div key={u._id} className="border-b border-gray-800 pb-2">
                <a className="underline" href={u.url} target="_blank" rel="noreferrer">{u.title}</a>
                <div className="text-xs text-gray-400">{u.source}</div>
                <div className="text-sm text-gray-300">{u.summary}</div>
              </div>
            ))}
            {updates.length===0 && <div className="text-sm text-gray-400">No updates yet. Run worker to fetch.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
