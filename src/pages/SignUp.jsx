import React, { useState, useContext } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'admin', adminSecret: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.role === 'admin' && form.adminSecret !== 'EDU2026') {
      return setError('Invalid Teacher Secret Key')
    }

    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role }
      if (form.role === 'admin') payload.adminSecret = form.adminSecret

      const res = await api.post('/auth/register', payload)
      if (res.data && (res.data.user || res.data.token)) {
        login(res.data)
        navigate(form.role === 'admin' ? '/admin' : '/dashboard')
        return;
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      console.log('API registration failed, using mock storage...', err.message)

      let savedUsers = []
      try {
        savedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
      } catch (e) {
        console.error('Failed to parse mock_users, resetting list', e)
        savedUsers = []
      }

      if (savedUsers.find(u => u.email === form.email)) {
        return setError('Email already registered in demo mode')
      }

      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      }

      savedUsers.push(newUser)
      localStorage.setItem('mock_users', JSON.stringify(savedUsers))

      login({ user: newUser, token: 'mock-token-' + Math.random() })
      navigate(form.role === 'admin' ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '40px 20px' }}>
      <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 10 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join the community of innovative educators.</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Full Name</label>
            <input
              name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required
              style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Email Address</label>
            <input
              name="email" placeholder="teacher@school.org" type="email"
              value={form.email} onChange={handleChange} required
              style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Password</label>
              <input
                name="password" placeholder="••••••••" type="password"
                value={form.password} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Confirm</label>
              <input
                name="confirmPassword" placeholder="••••••••" type="password"
                value={form.confirmPassword} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, margin: '10px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} />
              <span>Teacher</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} />
              <span>Student</span>
            </label>
          </div>

          {form.role === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Teacher Secret Key</label>
              <input
                name="adminSecret" placeholder="Enter secret key"
                value={form.adminSecret} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ padding: 16, marginTop: 10 }}>Create Account</button>

          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: 14, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 10 }}>
            Already have an account? <Link to="/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
