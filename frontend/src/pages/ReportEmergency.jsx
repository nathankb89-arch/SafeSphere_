import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const TYPES = ['fire', 'flood', 'accident', 'medical', 'landslide', 'earthquake', 'outbreak', 'other']
const SEVERITIES = ['low', 'medium', 'high', 'critical']

export default function ReportEmergency() {
  const { user } = useAuth()
  const [form, setForm] = useState({ emergency_type: 'fire', severity: 'high', description: '', location: '', latitude: '', longitude: '', contact_phone: '' })
  const [image, setImage] = useState(null); const [status, setStatus] = useState('idle')
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const useMyLocation = () => navigator.geolocation?.getCurrentPosition((pos) => setForm((current) => ({ ...current, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })))
  const handleSubmit = async (event) => {
    event.preventDefault(); setStatus('submitting')
    const data = new FormData(); Object.entries(form).forEach(([key, value]) => value && data.append(key, value)); if (image) data.append('evidence_image', image)
    try { await api.post(user ? '/emergencies/' : '/emergencies/quick-report/', data, { headers: { 'Content-Type': 'multipart/form-data' } }); setStatus('success') } catch { setStatus('error') }
  }
  if (status === 'success') return <div className="mx-auto max-w-md px-6 py-16 text-center"><h1 className="mb-2 text-2xl font-bold text-green-700">Report Submitted</h1><p className="text-gray-600">Help is on the way. Stay safe.</p></div>
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold">Report an Emergency</h1>
      {!user && <p className="rounded border border-yellow-200 bg-yellow-50 p-2 text-sm">Reporting anonymously. <Link to="/login" className="underline">Log in</Link> to track this report later.</p>}
      <select name="emergency_type" value={form.emergency_type} onChange={handleChange} className="w-full rounded border p-2">{TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select>
      <select name="severity" value={form.severity} onChange={handleChange} className="w-full rounded border p-2">{SEVERITIES.map((severity) => <option key={severity} value={severity}>{severity}</option>)}</select>
      <textarea name="description" placeholder="What's happening?" required onChange={handleChange} className="w-full rounded border p-2" rows={4} />
      <input name="location" placeholder="Location (address or landmark)" required value={form.location} onChange={handleChange} className="w-full rounded border p-2" />
      <div className="flex gap-2"><input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} className="w-full rounded border p-2" /><input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} className="w-full rounded border p-2" /></div>
      <button type="button" onClick={useMyLocation} className="text-sm text-red-700 underline">Use my current location</button>
      {!user && <input name="contact_phone" placeholder="Your phone number (so responders can reach you)" value={form.contact_phone} onChange={handleChange} className="w-full rounded border p-2" />}
      <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} className="w-full" />
      {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status === 'submitting'} className="w-full rounded bg-red-700 py-3 font-semibold text-white disabled:opacity-50">{status === 'submitting' ? 'Submitting...' : 'Submit Report'}</button>
    </form>
  )
}
