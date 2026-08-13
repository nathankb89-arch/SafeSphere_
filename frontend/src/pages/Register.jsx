import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold">Create an Account</h1>{error && <p className="text-sm text-red-600">{error}</p>}
      <input name="username" placeholder="Username" onChange={handleChange} required className="w-full rounded border p-2" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full rounded border p-2" />
      <input name="phone_number" placeholder="Phone number" onChange={handleChange} className="w-full rounded border p-2" />
      <input name="location" placeholder="Location" onChange={handleChange} className="w-full rounded border p-2" />
      <select name="role" onChange={handleChange} value={form.role} className="w-full rounded border p-2"><option value="citizen">Citizen</option><option value="volunteer">Volunteer</option><option value="ngo">NGO Staff</option></select>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full rounded border p-2" />
      <input name="password_confirm" type="password" placeholder="Confirm password" onChange={handleChange} required className="w-full rounded border p-2" />
      <button type="submit" className="w-full rounded bg-red-700 py-2 font-semibold text-white">Sign Up</button>
    </form>
  )
}
