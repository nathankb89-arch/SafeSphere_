import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const EMERGENCY_TYPES = [
  { value: 'fire', label: 'Fire', icon: '🔥' },
  { value: 'medical', label: 'Medical', icon: '🩺' },
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'landslide', label: 'Landslide', icon: '⛰️' },
  { value: 'earthquake', label: 'Earthquake', icon: '🏚️' },
  { value: 'outbreak', label: 'Outbreak', icon: '⚠️' },
  { value: 'other', label: 'Other', icon: '📣' },
]

const SEVERITIES = ['low', 'medium', 'high', 'critical']

export default function ReportEmergency() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    emergency_type: 'fire',
    severity: 'high',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    contact_phone: '',
  })
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('idle')
  const [locationMessage, setLocationMessage] = useState('')

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location services are unavailable on this device. Please enter the nearest landmark or area.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((current) => ({
          ...current,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }))
        setLocationMessage('Current location added. You can still add a landmark if needed.')
      },
      () => {
        setLocationMessage('We could not access your location. Please enter the nearest landmark or area instead.')
      },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

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
          <p className="mt-4 text-slate-600 dark:text-slate-300">Stay safe, keep your phone nearby, and follow any instructions from responders. If it is still dangerous, move to a safer place if you can.</p>
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
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">You do not need perfect coordinates. A clear landmark and a short description is often enough to alert responders.</p>
          </div>

          {!user && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Reporting anonymously. <Link to="/login" className="font-semibold underline">Log in</Link> to track this report later.
            </p>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">What is happening?</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {EMERGENCY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, emergency_type: type.value }))}
                  className={`rounded-2xl border p-3 text-left transition ${form.emergency_type === type.value ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}
                >
                  <span className="block text-lg">{type.icon}</span>
                  <span className="mt-2 block text-sm font-semibold capitalize">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">How serious is it?</label>
            <div className="flex flex-wrap gap-2">
              {SEVERITIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, severity: level }))}
                  className={`rounded-full px-3 py-2 text-sm font-semibold capitalize transition ${form.severity === level ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">What happened?</label>
            <textarea name="description" placeholder="Describe what is happening right now. Include any visible danger, injuries, or blocked roads." required onChange={handleChange} className="textarea" rows={4} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Where is it happening?</label>
            <input name="location" placeholder="Nearest landmark, street, or area" required value={form.location} onChange={handleChange} className="field" />
            <p className="text-xs text-slate-500 dark:text-slate-400">If you are unsure of the exact address, enter the closest landmark or area and responders can narrow it down.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Location details</p>
              <button type="button" onClick={useMyLocation} className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Use current location</button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input name="latitude" placeholder="Latitude (optional)" value={form.latitude} onChange={handleChange} className="field" />
              <input name="longitude" placeholder="Longitude (optional)" value={form.longitude} onChange={handleChange} className="field" />
            </div>
            {locationMessage && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{locationMessage}</p>}
          </div>

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
