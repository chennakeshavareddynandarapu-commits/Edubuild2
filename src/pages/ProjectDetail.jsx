import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjects } from '../data/project';
import { useLanguage } from '../context/LanguageContext';
import FeedbackForm from '../components/FeedbackForm';
import jsPDF from 'jspdf';

export default function ProjectDetail() {
    const { id } = useParams();
    const { language } = useLanguage();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const allProjects = await fetchProjects();
                const found = allProjects.find(p => String(p.id) === String(id));
                setProject(found);
            } catch (error) {
                console.error("Error loading project detail:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [id]);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading Project Details... 🧬</div>;
    }

    if (!project) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
                <h2>Project not found</h2>
                <Link to="/projects" className="btn-primary" style={{ marginTop: 20 }}>Back to Library</Link>
            </div>
        );
    }

    const instructions = (project.instructions && project.instructions[language]) || (project.instructions && project.instructions['en']) || [];

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(project.title || 'Project Guide', 10, 10);
        doc.setFontSize(12);
        doc.text(`Subject: ${project.subject || 'N/A'}`, 10, 20);
        doc.text(`Materials: ${Array.isArray(project.materials) ? project.materials.join(', ') : 'N/A'}`, 10, 30);
        doc.text("Instructions:", 10, 40);
        instructions.forEach((line, i) => {
            doc.text(`${i + 1}. ${line}`, 10, 50 + (i * 10));
        });
        doc.save(`${project.title || 'project'}.pdf`);
    };

    return (
        <div className="container animate-fade" style={{ maxWidth: 900 }}>
            <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', marginBottom: 20 }}>← Back to Library</Link>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: 10 }}>{project.title}</h1>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <span className="badge">{project.classLevel}</span>
                        <span className="badge" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>{project.subject}</span>
                    </div>
                </div>
                <button onClick={downloadPDF} className="btn-primary" style={{ fontSize: 14 }}>⬇ Save Offline Guide</button>
            </header>

            {project.image && (
                <div style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', marginBottom: 40 }}>
                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
                <div className="glass-card" style={{ padding: 25, borderLeft: '4px solid var(--accent)' }}>
                    <h3 style={{ marginBottom: 15, fontSize: 18 }}>💰 Cost Comparison</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span>DIY Version:</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{project.budget || project.diyPrice}</span>
                    </div>
                    {project.kitPrice && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                            <span>Market Kit:</span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{project.kitPrice}</span>
                        </div>
                    )}
                    {(project.kitPrice && (project.budget || project.diyPrice)) && (
                        <div style={{ background: 'rgba(255,158,11,0.1)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Savings: ₹{project.kitPrice - (project.budget || project.diyPrice)}</span>
                        </div>
                    )}
                </div>

                <div className="glass-card" style={{ padding: 25, borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: 15, fontSize: 18 }}>🧠 Learning Outcomes</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {(project.learningOutcomes || ["STEM Learning", "Innovation"]).map((l, i) => (
                            <li key={i} style={{ marginBottom: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: 'var(--primary)' }}>✔</span> {l}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 35, marginBottom: 40 }}>
                <h3 style={{ marginBottom: 20 }}>🛠 Materials Required</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {Array.isArray(project.materials) ? project.materials.map((m, i) => (
                        <span key={i} style={{ background: 'var(--surface)', padding: '8px 16px', borderRadius: 10, border: '1px solid var(--glass-border)', fontSize: 14 }}>
                            {m}
                        </span>
                    )) : <p>No materials listed</p>}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 35, marginBottom: 40, background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginBottom: 25, display: 'flex', justifyContent: 'space-between' }}>
                    <span>📝 Step-by-Step Instructions</span>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{language.toUpperCase()}</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                    {instructions.length > 0 ? instructions.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 20 }}>
                            <div style={{
                                minWidth: 40, height: 40, borderRadius: '50%', background: 'var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                            }}>{i + 1}</div>
                            <p style={{ fontSize: '1.1rem', paddingTop: 8 }}>{step}</p>
                        </div>
                    )) : <p>No instructions available for this language.</p>}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 30, marginBottom: 40, border: '1px solid var(--accent)', background: 'rgba(245,158,11,0.05)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>💡 Science Insight</h4>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>{project.concept}</p>
            </div>

            <FeedbackForm projectId={project.id} />
        </div>
    );
}

