import { useState } from 'react'
import { Link } from 'react-router-dom'

const PROFESSIONALS = [
  {
    name: 'Dr. Amina Otieno',
    role: 'Emergency medicine',
    category: 'Medical',
    description: 'Demonstration profile for emergency care education and community preparedness.',
    image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=500&q=80',
    accent: 'status-blue',
  },
  {
    name: 'Jordan Mwangi',
    role: 'Fire and rescue specialist',
    category: 'Fire & rescue',
    description: 'Demonstration profile for fire prevention, evacuation planning, and rescue awareness.',
    image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=500&q=80',
    accent: 'status-red',
  },
  {
    name: 'Lina Hassan',
    role: 'First-aid instructor',
    category: 'First aid',
    description: 'Demonstration profile for basic first-aid learning and community training resources.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80',
    accent: 'status-green',
  },
  {
    name: 'Samuel Kariuki',
    role: 'Search and rescue coordinator',
    category: 'Search & rescue',
    description: 'Demonstration profile for preparedness, missing-person response, and rescue coordination.',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=500&q=80',
    accent: 'status-amber',
  },
  {
    name: 'Grace Wanjiku',
    role: 'Mental health professional',
    category: 'Mental health',
    description: 'Demonstration profile for crisis support education and compassionate referral guidance.',
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=500&q=80',
    accent: 'status-purple',
  },
  {
    name: 'Peter Njoroge',
    role: 'Disaster preparedness advisor',
    category: 'Preparedness',
    description: 'Demonstration profile for household readiness, hazards, and community response planning.',
    image: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=500&q=80',
    accent: 'status-amber',
  },
]

const CATEGORIES = ['All', ...new Set(PROFESSIONALS.map((professional) => professional.category))]

export default function Professionals() {
  const [category, setCategory] = useState('All')
  const visibleProfessionals = category === 'All'
    ? PROFESSIONALS
    : PROFESSIONALS.filter((professional) => professional.category === category)

  return (
    <main className="page-shell">
      <section className="container py-12">
        <div className="max-w-4xl">
          <p className="eyebrow">Community network</p>
          <h1 className="section-title">People who help communities stay ready.</h1>
          <p className="lead-text">Explore illustrative professional profiles across medical care, fire response, first aid, rescue, and preparedness. These are demo listings, not a live dispatch directory.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter professionals by category">
          {CATEGORIES.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-red-500 dark:hover:text-red-300'}`} aria-pressed={category === item}>{item}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProfessionals.map((professional) => (
            <article key={professional.name} className="info-card overflow-hidden p-0">
              <img src={professional.image} alt="" className="h-56 w-full object-cover" />
              <div className="p-5">
                <span className={`status-badge ${professional.accent}`}>{professional.category}</span>
                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{professional.name}</h2>
                <p className="mt-1 font-semibold text-red-700 dark:text-red-400">{professional.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{professional.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Demo profile · Verify locally before contact</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="cta-banner">
          <div>
            <p className="eyebrow text-red-100">Learn first</p>
            <h2 className="section-title small text-white">Build confidence before an emergency happens.</h2>
          </div>
          <Link to="/first-aid" className="primary-btn white">Explore first aid</Link>
        </div>
      </section>
    </main>
  )
}
