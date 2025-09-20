import { useEffect, useRef, useState } from 'react';

interface Msg { role: 'user'|'assistant'; content: string }

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('Recommend career paths for a CS undergrad interested in AI and Web.');
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef<string>('');

  useEffect(() => { if (!sessionRef.current) sessionRef.current = `local-${Date.now()}`; }, []);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')||''}` },
        body: JSON.stringify({ message: text, sessionId: sessionRef.current })
      });
      const data = await res.json();
      const reply = data?.data?.reply || 'No reply';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Error contacting server. Using local mock.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Career Chat</h1>
        <p className="text-gray-400">Get personalized career guidance powered by AI</p>
      </div>
      
      <div className="card p-6 h-96 overflow-y-auto mb-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Start a conversation about your career goals</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block p-4 rounded-2xl max-w-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center text-gray-400 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
            AI is thinking...
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <input
          className="input flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about career paths, skills, or job market..."
        />
        <button 
          onClick={send} 
          disabled={loading} 
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
