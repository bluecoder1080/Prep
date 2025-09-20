import { useState } from 'react';

export default function Resume() {
  const [file, setFile] = useState<File|null>(null);
  const [result, setResult] = useState<any>(null);

  const upload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('http://localhost:5000/api/upload/resume', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')||''}` },
      body: form
    });
    const data = await res.json();
    setResult(data.data);
  };

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Resume Editor & Upload</h2>
      <div className="card p-4 space-y-3">
        <div className="text-gray-300">Upload your resume for skill extraction and auto-profile filling.</div>
        <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={e=>setFile(e.target.files?.[0]||null)} className="input" />
        <button className="btn" onClick={upload} disabled={!file}>Upload & Extract</button>
      </div>
      {result && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Extraction Result</h3>
          <div className="text-sm text-gray-300">
            <div><strong>File:</strong> {result.title}</div>
            <div><strong>Extracted Skills:</strong> {result.skills?.join(', ') || 'None detected'}</div>
            <div className="mt-2"><strong>Text Preview:</strong></div>
            <div className="bg-[#0f141a] p-2 rounded text-xs max-h-32 overflow-y-auto">
              {result.extractedText?.substring(0, 500) || 'No text extracted'}...
            </div>
          </div>
        </div>
      )}
      
      <div className="card p-4">
        <h3 className="font-semibold mb-2">Quick Resume Builder</h3>
        <div className="text-gray-300 text-sm mb-3">Create a simple resume template (demo functionality)</div>
        <div className="grid gap-3">
          <input className="input" placeholder="Full Name" />
          <input className="input" placeholder="Email" />
          <textarea className="input" rows={3} placeholder="Professional Summary"></textarea>
          <input className="input" placeholder="Skills (comma-separated)" />
          <button className="btn">Generate PDF (Demo)</button>
        </div>
      </div>
    </div>
  );
}
