import { useState } from 'react';

const QUESTIONS = Array.from({ length: 10 }, (_, i) => ({ id: i+1, text: `Q${i+1}. I feel confident about tackling new challenges.` }));

export default function Psychotest() {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(3));
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = { answers: QUESTIONS.map((q, i) => ({ questionId: q.id, answer: answers[i], question: q.text })) };
      const res = await fetch('http://localhost:5000/api/psychotest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')||''}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data.data);
    } catch (e) {
      setResult({ error: 'Failed to submit' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">Psychometric Test</h2>
      <div className="card p-4">
        <div className="space-y-4">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="grid gap-2">
              <div>{q.text}</div>
              <input className="w-full" type="range" min={1} max={5} value={answers[idx]} onChange={e=>{
                const v = parseInt(e.target.value);
                setAnswers(prev=> prev.map((x,i)=> i===idx?v:x));
              }} />
              <div className="text-sm text-gray-400">Answer: {answers[idx]}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn" onClick={submit} disabled={loading}>{loading?'Submitting...':'Submit'}</button>
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Result</h3>
          <pre className="whitespace-pre-wrap text-gray-300 text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
