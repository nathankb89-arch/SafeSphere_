import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function About() {
  const [info, setInfo] = useState(null)
  useEffect(() => { api.get('/safety/about/').then((res) => setInfo(res.data)) }, [])
  if (!info) return <Spinner />
  return (
    <main className="page-shell py-12">
      <div className="container max-w-4xl">
        <p className="eyebrow">About us</p>
        <h1 className="section-title">{info.name}</h1>
        <p className="lead-text">{info.tagline}</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="info-card">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Mission</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{info.mission}</p>
          </div>

          <div className="info-card">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Contact</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Reach SafeSphere support at <a href={`mailto:${info.contact_email}`} className="font-semibold text-red-700 underline dark:text-red-400">{info.contact_email}</a>.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
