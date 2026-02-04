import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser())
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = (data) => {
    if (!data) return;
    const userToSave = data.user || data; // Handle both {user, token} and raw user object
    const tokenToSave = data.token || 'mock-token';

    setToken(tokenToSave)
    setUser(userToSave)
    localStorage.setItem('token', tokenToSave)
    localStorage.setItem('user', JSON.stringify(userToSave))
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenToSave}`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
