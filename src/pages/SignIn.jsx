import React, { useState, useContext } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // Try real API first
      const res = await api.post('/auth/login', { email, password })
      if (res.data && (res.data.user || res.data.token)) {
        login(res.data)
        const userRole = res.data.user?.role || res.data.role
        navigate(userRole === 'admin' ? '/admin' : '/dashboard')
        return;
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      console.log('API login failed, checking mock credentials...', err.message)

      let savedUsers = []
      try {
        savedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
      } catch (e) {
        console.error('Failed to parse mock_users', e)
      }

      const user = savedUsers.find(u => u.email === email && u.password === password)

      if (user) {
        login({ user, token: 'mock-token-' + Math.random() })
        navigate(user.role === 'admin' ? '/admin' : '/dashboard')
      } else if (email === 'admin@edubuild.com' && password === 'admin123') {
        const adminUser = { name: 'Admin User', email, role: 'admin' }
        login({ user: adminUser, token: 'mock-admin-token' })
        navigate('/admin')
      } else if (email === 'teacher@edubuild.com' && password === 'teacher123') {
        const teacherUser = { name: 'Teacher User', email, role: 'user' }
        login({ user: teacherUser, token: 'mock-teacher-token' })
        navigate('/dashboard')
      } else {
        setError(err.response?.data?.message || 'Invalid email or password. Try admin@edubuild.com / admin123 (Teacher)')
      }
    }
  }

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 450 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 10 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to access your project dashboard.</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Email Address</label>
            <input
              placeholder="teacher@school.org"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ padding: 14, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Password</label>
            <input
              placeholder="••••••••" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ padding: 14, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: 16, marginTop: 10 }}>Sign In</button>

          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: 14, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 10 }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
