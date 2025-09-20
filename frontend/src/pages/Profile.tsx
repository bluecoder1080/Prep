import { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { /* could fetch existing profile */ }, []);

  const save = async () => {
    setSaving(true);
    try {
      const sample = {
        education: { degree: 'Bachelor', field: 'Computer Science', institution: 'Sample Univ', year: 2026 },
        interests: ['ai','web'],
        skills: { technical: ['javascript','react'], soft: ['communication'], certifications: [] },
        experience: { internships: [], projects: [] },
        preferences: { careerGoals: ['software'], workLocation: 'hybrid' }
      };
      const res = await fetch('http://localhost:5000/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')||''}` },
        body: JSON.stringify(sample)
      });
      const data = await res.json();
      setProfile(data.data);
    } finally { setSaving(false); }
  };

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="card p-4">
        <div className="text-gray-300 mb-4">Create or update your profile. For demo, click save to post a sample profile.</div>
        <button className="btn" onClick={save} disabled={saving}>{saving?'Saving...':'Save Sample Profile'}</button>
      </div>
      {profile && <pre className="card p-4 text-sm text-gray-300 whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>}
    </div>
  );
}
