import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../data/project';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function ProjectList() {
    const { language, translate } = useLanguage();
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterBudget, setFilterBudget] = useState(1000);
    const [filterClass, setFilterClass] = useState("All");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProjects();
                setAllProjects(data);
            } catch (error) {
                console.error("Error loading library projects:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredProjects = allProjects.filter(p => {
        return (p.budget || p.diyPrice || 0) <= filterBudget && (filterClass === "All" || p.classLevel === filterClass);
    });

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Exploring the Experiment Library... 🔍</div>;
    }

    return (
        <div className="container animate-fade">
            <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Experiment Library</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Discover structured guides for hands-on learning from our community.</p>

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
                {filteredProjects.length > 0 ? filteredProjects.map(p => (
                    <div key={p.id} className="glass-card animate-fade" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={p.image || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"}
                                alt={p.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                            />
                            <div className="badge" style={{ position: 'absolute', top: 15, left: 15, background: 'rgba(99, 102, 241, 0.9)', color: 'white' }}>{p.subject}</div>
                        </div>
                        <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '1.4rem' }}>{p.title}</h3>
                                <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>⭐ {p.rating}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1 }}>
                                {p.concept ? (p.concept.length > 80 ? p.concept.substring(0, 80) + '...' : p.concept) : `Level: ${p.classLevel}`}
                            </p>
                            <hr style={{ borderColor: 'var(--glass-border)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block' }}>Cost</span>
                                    <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{p.budget || p.diyPrice}</span>
                                </div>
                                <Link to={`/project/${p.id}`} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>View Guide</Link>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 50, textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 20 }}>🔍</div>
                        <h3>No projects found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your budget or class filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


