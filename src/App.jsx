import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import SubmitProject from './pages/SubmitProject';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const NavBar = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/dashboard" className="logo">EDUBUILD</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <Link to="/projects" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>Library</Link>
          <Link to="/submit" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>Community</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', padding: '5px 12px', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: 14 }}>🌐</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="tel">TE</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
                <Route path="/project/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
                <Route path="/submit" element={<PrivateRoute><SubmitProject /></PrivateRoute>} />
                <Route path="/" element={
                  <div className="container animate-fade" style={{ textAlign: 'center', marginTop: 100 }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 20 }}>
                      Reimagine <span style={{ color: 'var(--primary)' }}>STEM</span> Education
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 40px' }}>
                      Empowering rural teachers with budget-friendly, waste-material project guides.
                      Turn everyday trash into world-class science experiments.
                    </p>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                      <Link to="/signup" className="btn-primary" style={{ padding: '16px 40px', fontSize: 18 }}>Get Started</Link>
                      <Link to="/signin" className="btn-primary" style={{ padding: '16px 40px', fontSize: 18, background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>Login</Link>
                    </div>

                    <div className="grid-auto" style={{ marginTop: 80 }}>
                      <div className="glass-card" style={{ padding: 30 }}>
                        <h3>₹ Low Cost</h3>
                        <p>Projects under ₹100 using recycled materials.</p>
                      </div>
                      <div className="glass-card" style={{ padding: 30 }}>
                        <h3>📱 Offline First</h3>
                        <p>Download PDF guides for classroom use without internet.</p>
                      </div>
                      <div className="glass-card" style={{ padding: 30 }}>
                        <h3>🇮🇳 Regional</h3>
                        <p>Support for local languages like Hindi and Telugu.</p>
                      </div>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <footer style={{ padding: 40, textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: 80, color: 'var(--text-muted)' }}>
              <p>© 2026 EDUBUILD — Innovative STEM for All</p>
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
