import React, { useState } from 'react';
import { projects } from '../data/project';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function ProjectList() {
    const { language, translate } = useLanguage();
    const [filterBudget, setFilterBudget] = useState(1000);
    const [filterClass, setFilterClass] = useState("All");

    const filteredProjects = projects.filter(p => {
        return p.budget <= filterBudget && (filterClass === "All" || p.classLevel === filterClass);
    });

    return (
        <div className="container animate-fade">
            <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Experiment Library</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Discover structured guides for hands-on learning.</p>

            <div className="glass-card" style={{ marginBottom: 40, padding: 30, display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>Max Budget: <span style={{ color: 'var(--accent)' }}>₹{filterBudget}</span></label>
                    <input
                        type="range" min="0" max="2000" step="50"
                        value={filterBudget} onChange={e => setFilterBudget(e.target.value)}
                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>Class Level</label>
                    <select
                        value={filterClass} onChange={e => setFilterClass(e.target.value)}
                        style={{ width: '100%', padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
                    >
                        <option value="All">All Classes</option>
                        <option value="6-8">Class 6 - 8</option>
                        <option value="9-10">Class 9 - 10</option>
                    </select>
                </div>

                <div style={{ flex: 0.5, textAlign: 'right' }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{filteredProjects.length} Projects Found</p>
                </div>
            </div>

            <div className="grid-auto">
                {filteredProjects.map(p => (
                    <div key={p.id} className="glass-card animate-fade" style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="badge">{p.subject}</div>
                            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>⭐ {p.rating}</span>
                        </div>
                        <h3 style={{ fontSize: '1.4rem' }}>{p.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1 }}>
                            Level: {p.classLevel}
                        </p>
                        <hr style={{ borderColor: 'var(--glass-border)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block' }}>Cost</span>
                                <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{p.budget}</span>
                            </div>
                            <Link to={`/project/${p.id}`} className="btn-primary" style={{ padding: '8px 20px' }}>View Guide</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
