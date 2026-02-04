import React, { useState, useEffect } from 'react';
import { projects as staticProjects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function ProjectList() {
    const { language, translate } = useLanguage();
    const location = useLocation();

    const [allProjects, setAllProjects] = useState(staticProjects);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'projects'));
                const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (fetched.length > 0) {
                    setAllProjects(fetched);
                } else {
                    console.log("Firestore 'projects' collection is empty, using fallback data.");
                }
            } catch (error) {
                console.log("Firestore not configured yet or error fetching, using static fallback.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Parse search from URL params
    const getQueryParam = () => {
        const params = new URLSearchParams(location.search);
        return params.get('search') || "";
    };

    const [filterBudget, setFilterBudget] = useState(1000);
    const [filterClass, setFilterClass] = useState("All");
    const [searchQuery, setSearchQuery] = useState(getQueryParam());

    // Update search if URL changes
    useEffect(() => {
        const query = getQueryParam();
        if (query) setSearchQuery(query);
    }, [location.search]);

    const filteredProjects = allProjects.filter(p => {
        const title = p.title || "";
        const subject = p.subject || "";
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBudget = (p.budget || 0) <= filterBudget;
        const matchesClass = filterClass === "All" || p.classLevel === filterClass;

        return matchesSearch && matchesBudget && matchesClass;
    });

    return (
        <div className="container animate-fade">
            <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Experiment Library</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>Discover structured guides for hands-on learning.</p>

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--primary)' }}>
                    Searching for experiments... 🔍
                </div>
            )}

            <div style={{ marginBottom: 30 }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 20, pointerEvents: 'none' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search projects (e.g. 'Magnet', 'Light', 'Physics')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '16px 16px 16px 50px',
                            borderRadius: '15px',
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            fontSize: '16px',
                            boxShadow: 'var(--card-shadow)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div className="glass-card" style={{ marginBottom: 40, padding: 30, display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>{translate('budget')}: <span style={{ color: 'var(--accent)' }}>₹{filterBudget}</span></label>
                    <input
                        type="range" min="0" max="2000" step="50"
                        value={filterBudget} onChange={e => setFilterBudget(e.target.value)}
                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>{translate('class')}</label>
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
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found</p>
                </div>
            </div>

            <div className="grid-auto">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(p => (
                        <div key={p.id} className="glass-card animate-fade" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
                                    onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                />
                                <div className="badge" style={{ position: 'absolute', top: 15, left: 15, background: 'rgba(99, 102, 241, 0.9)', color: 'white' }}>{p.subject}</div>
                            </div>
                            <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ fontSize: '1.4rem' }}>{p.title}</h3>
                                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>⭐ {p.rating}</span>
                                </div>
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
                        </div>
                    ))
                ) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 50, textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 20 }}>🔍</div>
                        <h3>No projects found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search terms or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
