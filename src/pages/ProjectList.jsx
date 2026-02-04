import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../data/project';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from '../components/ProjectCard';

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
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
            <div className="animate-pulse" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Exploring the Experiment Library... 🔍</div>
        </div>;
    }

    return (
        <div className="container animate-fade">
            <header style={{ marginBottom: 50 }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 15, background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Innovation Library
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 600 }}>
                    Discover low-cost, high-impact STEM experiments synced live from our global community database.
                </p>
            </header>

            <div className="glass-card" style={{ marginBottom: 50, padding: 35, display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 250 }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, fontWeight: 600 }}>
                        <span>Max Budget</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>₹{filterBudget}</span>
                    </label>
                    <input
                        type="range" min="0" max="2000" step="50"
                        value={filterBudget} onChange={e => setFilterBudget(e.target.value)}
                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: 250 }}>
                    <label style={{ display: 'block', marginBottom: 15, fontWeight: 600 }}>Filter by Class</label>
                    <select
                        value={filterClass} onChange={e => setFilterClass(e.target.value)}
                        style={{ width: '100%', padding: '15px 20px', borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16, outline: 'none' }}
                    >
                        <option value="All">All Classes</option>
                        <option value="6-8">Middle School (6-8)</option>
                        <option value="9-10">High School (9-10)</option>
                    </select>
                </div>

                <div style={{ flex: 0.5, textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{filteredProjects.length}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Projects Found</div>
                </div>
            </div>

            <div className="grid-auto" style={{ gap: 30 }}>
                {filteredProjects.length > 0 ? filteredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                )) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 80, textAlign: 'center' }}>
                        <div style={{ fontSize: 60, marginBottom: 20 }}>🔭</div>
                        <h2 style={{ marginBottom: 10 }}>No experiments found</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Try adjusting your filters to discover more hidden gems.</p>
                        <button onClick={() => { setFilterBudget(2000); setFilterClass("All"); }} className="btn-primary" style={{ marginTop: 30 }}>Reset Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}



