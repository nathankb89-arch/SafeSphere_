import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' }); const [error, setError] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault(); setError('')
    try { await login(form.username, form.password); navigate('/dashboard') } catch { setError('Invalid username or password.') }
  }
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold">Log In</h1>{error && <p className="text-sm text-red-600">{error}</p>}
      <input placeholder="Username" required onChange={(event) => setForm({ ...form, username: event.target.value })} className="w-full rounded border p-2" />
      <input type="password" placeholder="Password" required onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded border p-2" />
      <button type="submit" className="w-full rounded bg-red-700 py-2 font-semibold text-white">Log In</button>
    </form>
  )
}
