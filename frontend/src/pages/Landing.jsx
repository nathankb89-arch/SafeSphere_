import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'
import HelpBanner from '../components/HelpBanner'

export default function Landing() {
  const [hotlines, setHotlines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/safety/')
      .then((res) => setHotlines(res.data.results ?? res.data))
      .catch(() => setHotlines([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page-shell">
      <section className="container py-10 sm:py-16 lg:py-20">
        <HelpBanner />

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">Smart emergency response</p>
            <h1 className="section-title">Protecting communities through quick, trusted action.</h1>
            <p className="lead-text">SafeSphere helps people report emergencies, find nearby help, and get immediate guidance before professional responders arrive.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/report" className="primary-btn">Report an emergency</Link>
              <Link to="/education" className="secondary-btn">Emergency education</Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="status-badge status-red">No account required</span>
              <span className="status-badge status-green">Fast guidance</span>
              <span className="status-badge status-blue">Local support</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-red-200 bg-white p-6 shadow-[0_24px_70px_rgba(127,29,29,0.12)] dark:border-slate-700 dark:bg-slate-900">
            <div className="absolute inset-x-6 top-0 h-24 rounded-b-full bg-red-500/10 blur-3xl" />
            <div className="relative space-y-5">
              <div className="rounded-2xl bg-red-50 p-5 dark:bg-red-950/20">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700 dark:text-red-300">Need help now?</p>
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">Call local emergency services immediately.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="info-card p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Emergency</p>
                  <p className="mt-2 text-2xl font-black text-red-600">Fire</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Evacuate if needed and contact emergency services.</p>
                </div>
                <div className="info-card p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Health</p>
                  <p className="mt-2 text-2xl font-black text-blue-600">Medical</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Keep the person safe and call for professional help.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/80">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">SafeSphere AI</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">"What should I do if someone is choking?"</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Get immediate safety guidance and local support steps in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <div className="section-headings mb-8">
          <div>
            <p className="eyebrow">Emergency contacts</p>
            <h2 className="section-title small">National and local support</h2>
          </div>
        </div>

        {loading && <Spinner />}
        {!loading && hotlines.length === 0 && <p className="text-slate-500 dark:text-slate-400">No hotlines have been published yet.</p>}
        <ul className="grid gap-4 md:grid-cols-2">
          {hotlines.map((hotline) => (
            <li key={hotline.id} className="info-card flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{hotline.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{hotline.region || 'National'}</p>
              </div>
              <a href={`tel:${hotline.phone_number}`} className="text-lg font-black text-red-700 dark:text-red-400">{hotline.phone_number}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
