import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitProject } from '../services/googleSheets';

export default function SubmitProject() {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Physics");
    const [budget, setBudget] = useState("");
    const [materials, setMaterials] = useState("");
    const [level, setLevel] = useState("6-8");
    const [instructions, setInstructions] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const projectData = {
            id: Date.now(),
            title,
            subject,
            budget: Number(budget),
            classLevel: level,
            materials: materials,
            concept: "", // Can be filled by user later
            instructions: instructions
        };

        const success = await submitProject(projectData);
        setLoading(false);
        if (success) {
            setSubmitted(true);
        } else {
            alert("Submission failed. Please check your connection.");
        }
    };

    if (submitted) {
        return (
            <div className="container animate-fade" style={{ textAlign: 'center', marginTop: 100 }}>
                <div className="glass-card" style={{ padding: 60, maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
                    <h2 style={{ marginBottom: 10 }}>Idea Submitted!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
                        Thank you for contributing to the community. Your project has been sent to our database and will appear in the library shortly.
                    </p>
                    <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade" style={{ maxWidth: 700 }}>
            <header style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Share Your Innovation</h1>
                <p style={{ color: 'var(--text-muted)' }}>Upload your low-cost STEM project idea to help teachers across the country.</p>
            </header>

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 25 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Project Title</label>
                    <input
                        placeholder="e.g., Simple Magnetic Compass"
                        value={title} onChange={e => setTitle(e.target.value)} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Subject</label>
                        <select
                            value={subject} onChange={e => setSubject(e.target.value)}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        >
                            <option>Physics</option>
                            <option>Math</option>
                            <option>Chemistry</option>
                            <option>Biology</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Class Level</label>
                        <select
                            value={level} onChange={e => setLevel(e.target.value)}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        >
                            <option>6-8</option>
                            <option>9-10</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Estimated Budget (₹)</label>
                    <input
                        type="number" placeholder="50"
                        value={budget} onChange={e => setBudget(e.target.value)} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Materials Required</label>
                    <textarea
                        placeholder="List items like cardboard, bottles, pins..."
                        value={materials} onChange={e => setMaterials(e.target.value)} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 100, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Step-by-Step Instructions</label>
                    <textarea
                        placeholder="Step 1: ... Step 2: ..."
                        value={instructions} onChange={e => setInstructions(e.target.value)} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 150, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 18, fontSize: 18, marginTop: 10, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Submitting..." : "Submit to Community"}
                </button>
            </form>
        </div>
    );
}

