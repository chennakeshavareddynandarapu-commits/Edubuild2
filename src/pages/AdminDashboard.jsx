import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext)
  return (
    <div style={{padding:20}}>
      <h2>Welcome Admin {user?.name}</h2>
      <p>Admin Dashboard</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
