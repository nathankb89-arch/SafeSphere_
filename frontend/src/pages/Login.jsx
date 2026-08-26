import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' }); const [error, setError] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault(); setError('')
    try { await login(form.username, form.password); navigate('/dashboard') } catch { setError('Invalid username or password.') }
  }
  return (
    <main className="page-shell py-12">
      <form onSubmit={handleSubmit} className="form-shell space-y-5">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="section-title small">Log in</h1>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        <input placeholder="Username" required onChange={(event) => setForm({ ...form, username: event.target.value })} className="field" />
        <input type="password" placeholder="Password" required onChange={(event) => setForm({ ...form, password: event.target.value })} className="field" />
        <button type="submit" className="primary-btn w-full">Log in</button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">Need an account? <Link to="/register" className="font-semibold text-red-700 dark:text-red-400">Create one</Link></p>
      </form>
    </main>
  )
}
