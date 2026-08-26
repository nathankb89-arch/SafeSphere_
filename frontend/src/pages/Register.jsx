import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirm: '', role: 'citizen', phone_number: '', location: '' })
  const [error, setError] = useState('')
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const handleSubmit = async (event) => {
    event.preventDefault(); setError('')
    try { await register(form); navigate('/dashboard') } catch (err) { setError(err.response?.data?.password?.[0] || 'Registration failed. Check your details.') }
  }
  return (
    <main className="page-shell py-12">
      <form onSubmit={handleSubmit} className="form-shell space-y-5">
        <div>
          <p className="eyebrow">Create account</p>
          <h1 className="section-title small">Join SafeSphere</h1>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        <input name="username" placeholder="Username" onChange={handleChange} required className="field" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="field" />
        <input name="phone_number" placeholder="Phone number" onChange={handleChange} className="field" />
        <input name="location" placeholder="Location" onChange={handleChange} className="field" />
        <select name="role" onChange={handleChange} value={form.role} className="select"><option value="citizen">Citizen</option><option value="volunteer">Volunteer</option><option value="ngo">NGO Staff</option></select>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="field" />
        <input name="password_confirm" type="password" placeholder="Confirm password" onChange={handleChange} required className="field" />
        <button type="submit" className="primary-btn w-full">Sign up</button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">Already have an account? <Link to="/login" className="font-semibold text-red-700 dark:text-red-400">Log in</Link></p>
      </form>
    </main>
  )
}
