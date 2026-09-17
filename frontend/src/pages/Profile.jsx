import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ email: '', phone_number: '', location: '' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    setForm({
      email: user?.email || '',
      phone_number: user?.phone_number || user?.phone || '',
      location: user?.location || '',
    })
  }, [user])

  const filledFields = [user?.email, user?.phone_number || user?.phone, user?.location].filter(Boolean).length
  const completion = Math.round((filledFields / 3) * 100)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setFeedback({ type: '', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFeedback({ type: '', message: '' })
    try {
      await updateProfile(form)
      setFeedback({ type: 'success', message: 'Your profile was updated.' })
    } catch {
      setFeedback({ type: 'error', message: 'We could not save your changes. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page-shell py-12">
      <div className="container max-w-5xl">
        <p className="eyebrow">Account</p>
        <h1 className="section-title">Your profile</h1>
        <p className="lead-text">Keep your contact details current so SafeSphere can connect you with the right support when it matters.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="info-card">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-5 dark:border-slate-700">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">{user?.username?.charAt(0).toUpperCase()}</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.username}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.role === 'ngo' ? 'NGO staff account' : 'SafeSphere member'}</p>
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Username
                  <input value={user?.username || ''} disabled className="field mt-2 cursor-not-allowed opacity-70" />
                </label>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Role
                  <input value={user?.role || 'citizen'} disabled className="field mt-2 cursor-not-allowed capitalize opacity-70" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email address
                <input type="email" name="email" value={form.email} onChange={handleChange} className="field mt-2" placeholder="you@example.com" />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Phone number
                  <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} className="field mt-2" placeholder="+250 7xx xxx xxx" />
                </label>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Location
                  <input name="location" value={form.location} onChange={handleChange} className="field mt-2" placeholder="City or district" />
                </label>
              </div>
              {feedback.message && <p className={`text-sm font-semibold ${feedback.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`} role="status">{feedback.message}</p>}
              <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="info-card">
              <p className="eyebrow">Profile readiness</p>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{completion}%</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">{filledFields} of 3 details</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${completion}%` }} /></div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Complete your contact details so responders and support teams have reliable information.</p>
            </section>
            <section className="info-card">
              <p className="eyebrow">Quick actions</p>
              <div className="space-y-2">
                <Link to="/dashboard" className="secondary-btn w-full">View my reports</Link>
                <Link to="/report" className="secondary-btn w-full">Report an emergency</Link>
                <Link to="/safety-tips" className="secondary-btn w-full">Review safety tips</Link>
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  )
}
