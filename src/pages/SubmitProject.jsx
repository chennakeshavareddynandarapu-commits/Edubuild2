import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function SubmitProject() {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Physics");
    const [budget, setBudget] = useState("");
    const [materials, setMaterials] = useState("");
    const [instructions, setInstructions] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await addDoc(collection(db, 'projects'), {
                title,
                subject,
                budget: parseInt(budget),
                materials: materials.split(',').map(m => m.trim()),
                instructions: {
                    en: instructions.split('\n').filter(i => i.trim()),
                },
                classLevel: "All",
                rating: 5.0,
                difficulty: "Medium",
                image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800", // Default lab image
                concept: "Community Contribution",
                learningOutcomes: ["Research", "Innovation"],
                type: "DIY",
                timestamp: new Date()
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Failed to submit to cloud. Please check your connection.");
            // Optional: fallback to mock success if requested, but better to show error
        }
    };

    if (submitted) {
        return (
            <div className="container animate-fade" style={{ textAlign: 'center', marginTop: 100 }}>
                <div className="glass-card" style={{ padding: 60, maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
                    <h2 style={{ marginBottom: 10 }}>Idea Submitted!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
                        Thank you for contributing to the community. Our team will review your project and add it to the library soon.
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
                {error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}
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
                        <label style={{ fontWeight: 600 }}>Estimated Budget (₹)</label>
                        <input
                            type="number" placeholder="50"
                            value={budget} onChange={e => setBudget(e.target.value)} required
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        />
                    </div>
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

                <button type="submit" className="btn-primary" style={{ padding: 18, fontSize: 18, marginTop: 10 }}>Submit to Community</button>
            </form>
        </div>
    );
}
