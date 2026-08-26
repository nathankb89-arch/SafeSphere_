import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccessibilityToggle from './AccessibilityToggle'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-950/95 text-white backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="SafeSphere home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-600/30">S</span>
          <div>
            <p className="text-lg font-black tracking-tight">SafeSphere</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">Emergency ready</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-200 lg:flex">
          <Link to="/report" className="font-semibold text-white transition hover:text-red-300">Report</Link>
          <Link to="/education" className="transition hover:text-red-300">Education</Link>
          <Link to="/how-it-works" className="transition hover:text-red-300">How it works</Link>
          <Link to="/safety-tips" className="transition hover:text-red-300">Safety tips</Link>
          <Link to="/faq" className="transition hover:text-red-300">FAQ</Link>
          <Link to="/about" className="transition hover:text-red-300">About</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <AccessibilityToggle />
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="hidden rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:inline-flex">Dashboard</Link>
              <span className="hidden text-sm text-slate-300 sm:inline">Hi, {user.username}</span>
              <button onClick={() => { logout(); navigate('/') }} className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:inline-flex">Login</Link>
              <Link to="/register" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
