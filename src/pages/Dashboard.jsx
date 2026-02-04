import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { fetchProjects } from '../data/project'
import { getRecommendations } from '../utils/recommendation'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefBudget, setPrefBudget] = useState(500);
  const [prefClass, setPrefClass] = useState("6-8");
  const [prefSubject, setPrefSubject] = useState("Physics");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects();
        setAllProjects(data);
      } catch (error) {
        console.error("Error loading projects on dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recommendations = getRecommendations(allProjects, prefBudget, prefClass, prefSubject);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading Your Recommendations... 🧬</div>;
  }

  return (
    <div className="container animate-fade">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>👋 Hello, {user?.name || "Teacher"}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your STEM classroom and discover low-cost projects.</p>
        </div>
        <button onClick={logout} className="btn-primary" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>Logout</button>
      </header>

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
          {recommendations.length > 0 ? recommendations.map(p => (
            <div key={p.id} className="glass-card animate-fade" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
                <img
                  src={p.image || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                />
              </div>
              <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
                <div className="badge" style={{ alignSelf: 'flex-start' }}>{p.subject}</div>
                <h3 style={{ fontSize: '1.4rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1 }}>
                  {p.concept ? (p.concept.length > 80 ? p.concept.substring(0, 80) + '...' : p.concept) : ''}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{p.budget || p.diyPrice}</span>
                  <span style={{ fontSize: 14 }}>⭐ {p.rating}</span>
                </div>
                <Link to={`/project/${p.id}`} className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>View Full Guide</Link>
              </div>
            </div>
          )) : (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 30, textAlign: 'center' }}>
              <p>No projects match your current filters. Try increasing your budget!</p>
            </div>
          )}
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


