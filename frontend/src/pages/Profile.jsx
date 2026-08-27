import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <main className="page-shell py-12">
      <div className="container max-w-3xl">
        <p className="eyebrow">Account</p>
        <h1 className="section-title">Your profile</h1>
        <p className="lead-text">Keep your SafeSphere account details close at hand while you stay ready to help your community.</p>

        <section className="info-card mt-8">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-5 dark:border-slate-700">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">{user?.username?.charAt(0).toUpperCase()}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.username}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">SafeSphere member</p>
            </div>
          </div>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="mt-1 break-words text-slate-900 dark:text-slate-100">{user?.email || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Phone</dt>
              <dd className="mt-1 text-slate-900 dark:text-slate-100">{user?.phone_number || user?.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Location</dt>
              <dd className="mt-1 text-slate-900 dark:text-slate-100">{user?.location || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Role</dt>
              <dd className="mt-1 capitalize text-slate-900 dark:text-slate-100">{user?.role || 'Citizen'}</dd>
            </div>
          </dl>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard" className="primary-btn">View my reports</Link>
          <Link to="/report" className="secondary-btn">Report an emergency</Link>
        </div>
      </div>
    </main>
  )
}
