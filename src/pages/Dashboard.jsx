import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { projects } from '../data/projects'
import { getRecommendations } from '../utils/recommendation'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  const [prefBudget, setPrefBudget] = useState(500);
  const [prefClass, setPrefClass] = useState("6-8");
  const [prefSubject, setPrefSubject] = useState("Physics");

  const recommendations = getRecommendations(projects, prefBudget, prefClass, prefSubject);

  return (
    <div className="container animate-fade">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>👋 Hello, {user?.name || "Student"}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Explore STEM projects and discover low-cost innovations.</p>
        </div>
        <button onClick={logout} className="btn-primary" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>Logout</button>
      </header>

      {/* Quick Search */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ position: 'relative', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 24, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="What experiment do you want to do today? (e.g. 'Electric Motor', 'Newton')"
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
              outline: 'none',
              transition: '0.3s'
            }}
          />
          <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 12, padding: '5px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>Press Enter</div>
        </div>
      </div>

      {/* Filters Card */}
      <section className="glass-card" style={{ padding: 30, marginBottom: 40 }}>
        <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🤖</span> Smart Recommendation Engine
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, color: 'var(--text-muted)' }}>Max Budget (₹)</label>
            <input
              type="number" value={prefBudget}
              onChange={e => setPrefBudget(Number(e.target.value))}
              style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, color: 'var(--text-muted)' }}>Student Class</label>
            <select
              value={prefClass} onChange={e => setPrefClass(e.target.value)}
              style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
            >
              <option>6-8</option>
              <option>9-10</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, color: 'var(--text-muted)' }}>Topic</label>
            <select
              value={prefSubject} onChange={e => setPrefSubject(e.target.value)}
              style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
            >
              <option>Physics</option>
              <option>Math</option>
            </select>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 25 }}>
          <h2 style={{ fontSize: '1.8rem' }}>Top Matches for You</h2>
          <Link to="/projects" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Browse All →</Link>
        </div>

        <div className="grid-auto">
          {recommendations.map(p => (
            <div key={p.id} className="glass-card animate-fade" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
                <div className="badge" style={{ alignSelf: 'flex-start' }}>{p.subject}</div>
                <h3 style={{ fontSize: '1.4rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1 }}>
                  {p.concept.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{p.budget}</span>
                  <span style={{ fontSize: 14 }}>⭐ {p.rating}</span>
                </div>
                <Link to={`/project/${p.id}`} className="btn-primary" style={{ textDecoration: 'none' }}>View Full Guide</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card" style={{ padding: 40, textAlign: 'center', background: 'linear-gradient(rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))' }}>
        <h2 style={{ marginBottom: 10 }}>Have a Low-Cost Idea?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 25 }}>Contribute to the EDUBUILD community by sharing your own waste-material experiment guide.</p>
        <Link to="/submit" className="btn-primary" style={{ textDecoration: 'none' }}>Submit Your Project</Link>
      </section>
    </div>
  )
}
