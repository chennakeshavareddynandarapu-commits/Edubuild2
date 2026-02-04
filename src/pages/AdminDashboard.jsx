import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { syncProjectsToFirestore } from '../firebase/sync';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncProjectsToFirestore();
    setSyncing(false);
    alert("Local projects synced to Firestore! Refresh the Library to see changes.");
  };

  return (
    <div className="container animate-fade" style={{ padding: 40 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Welcome Teacher {user?.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Teacher Management Portal</p>
        </div>
        <button onClick={logout} className="btn-primary" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>Logout</button>
      </header>

      {/* Quick Search */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ position: 'relative', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 24, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search for an experiment to teach today..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                window.location.href = `/projects?search=${encodeURIComponent(e.target.value)}`;
              }
            }}
            style={{
              width: '100%',
              padding: '20px 20px 20px 60px',
              borderRadius: '20px',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              color: 'white',
              fontSize: '18px',
              boxShadow: 'var(--card-shadow)',
              outline: 'none'
            }}
          />
          <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 12, padding: '5px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>Press Enter</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 15 }}>Ready to share a new project?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 25 }}>Your innovations help students learn STEM with minimal costs.</p>
          <a href="/submit" className="btn-primary" style={{ padding: '12px 30px', textDecoration: 'none' }}>Submit New Experiment</a>
        </div>

        <div className="glass-card" style={{ padding: 40, textAlign: 'center', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: 15 }}>Cloud Database Status</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 25 }}>Sync your local experiment library to Google Cloud Firestore.</p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary"
            style={{ padding: '12px 30px', background: syncing ? 'var(--text-muted)' : 'var(--primary)' }}
          >
            {syncing ? 'Syncing...' : 'Sync Data to Firestore'}
          </button>
        </div>
      </div>
    </div>
  )
}
