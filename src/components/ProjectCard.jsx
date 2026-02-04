import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    return (
        <div className="glass-card animate-fade" style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'default'
        }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>
            <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={project.image || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                />
                <div style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(5px)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    ⭐ {project.rating}
                </div>
                <div className="badge" style={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    background: 'var(--primary)',
                    color: 'white',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)'
                }}>
                    {project.subject}
                </div>
            </div>

            <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>{project.title}</h3>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1, lineHeight: '1.6' }}>
                    {project.concept ? (project.concept.length > 90 ? project.concept.substring(0, 90) + '...' : project.concept) : `Engaging ${project.subject} project for Class ${project.classLevel}.`}
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: 11 }}>
                        Class {project.classLevel}
                    </span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: 11 }}>
                        {project.difficulty}
                    </span>
                </div>

                <hr style={{ borderColor: 'var(--glass-border)', margin: '5px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Est. Cost</span>
                        <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>₹{project.budget || project.diyPrice}</span>
                    </div>
                    <Link to={`/project/${project.id}`} className="btn-primary" style={{
                        padding: '10px 22px',
                        fontSize: 14,
                        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
                    }}>
                        View Guide
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
