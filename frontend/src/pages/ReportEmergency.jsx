import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const TYPES = ['fire', 'flood', 'accident', 'medical', 'landslide', 'earthquake', 'outbreak', 'other']
const SEVERITIES = ['low', 'medium', 'high', 'critical']

export default function ReportEmergency() {
  const { user } = useAuth()
  const [form, setForm] = useState({ emergency_type: 'fire', severity: 'high', description: '', location: '', latitude: '', longitude: '', contact_phone: '' })
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const useMyLocation = () => navigator.geolocation?.getCurrentPosition((pos) => setForm((current) => ({ ...current, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })))

  const handleSubmit = async (event) => {
    event.preventDefault(); setStatus('submitting')
    const data = new FormData(); Object.entries(form).forEach(([key, value]) => value && data.append(key, value)); if (image) data.append('evidence_image', image)
    try {
      await api.post(user ? '/emergencies/' : '/emergencies/quick-report/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="page-shell flex items-center justify-center py-16">
        <div className="form-shell text-center">
          <p className="eyebrow">Report submitted</p>
          <h1 className="section-title small">Help is on the way.</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Stay safe, keep your phone nearby, and follow any instructions from responders.</p>
          <Link to="/" className="primary-btn mt-6">Return home</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell py-12">
      <div className="container">
        <form onSubmit={handleSubmit} className="form-shell space-y-5">
          <div>
            <p className="eyebrow">Emergency reporting</p>
            <h1 className="section-title small">Report an emergency</h1>
          </div>

          {!user && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Reporting anonymously. <Link to="/login" className="font-semibold underline">Log in</Link> to track this report later.
            </p>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">What is happening?</label>
            <select name="emergency_type" value={form.emergency_type} onChange={handleChange} className="select">
              {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">How serious is it?</label>
            <select name="severity" value={form.severity} onChange={handleChange} className="select">
              {SEVERITIES.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">What happened?</label>
            <textarea name="description" placeholder="Describe what is happening right now." required onChange={handleChange} className="textarea" rows={4} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Where is it happening?</label>
            <input name="location" placeholder="Address, landmark, or area" required value={form.location} onChange={handleChange} className="field" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} className="field" />
            <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} className="field" />
          </div>

          <button type="button" onClick={useMyLocation} className="text-sm font-semibold text-red-700 underline dark:text-red-400">Use my current location</button>

          {!user && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Your contact number</label>
              <input name="contact_phone" placeholder="Phone number for responders" value={form.contact_phone} onChange={handleChange} className="field" />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Optional evidence</label>
            <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" />
          </div>

          {status === 'error' && <p className="text-sm font-medium text-red-600">Something went wrong. Please try again.</p>}

          <button type="submit" disabled={status === 'submitting'} className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-70">
            {status === 'submitting' ? 'Submitting...' : 'REPORT EMERGENCY'}
          </button>
        </form>
      </div>
    </main>
  )
}
