import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccessibilityToggle from './AccessibilityToggle'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])

  const closeAndNavigate = () => setMenuOpen(false)
  const menuLinks = user
    ? [['/profile', 'Profile'], ['/dashboard', 'Dashboard']]
    : [['/login', 'Log in'], ['/register', 'Create account']]

  return (
    <header className="sticky top-0 z-[60] border-b border-slate-200/80 bg-slate-950/95 text-white backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="SafeSphere home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-600/30">S</span>
          <div>
            <p className="text-lg font-black tracking-tight">SafeSphere</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">Emergency ready</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-200 lg:flex">
          {[
            ['/report', 'Report'],
            ['/map', 'Live map'],
            ['/command-center', 'Command center'],
            ['/responder-management', 'Responder management'],
            ['/education', 'Education'],
            ['/professionals', 'Professionals'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `relative py-2 transition hover:text-red-300 ${isActive ? 'font-semibold text-white' : ''}`}
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span aria-hidden="true" className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-red-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="relative flex items-center gap-2 sm:gap-3" ref={menuRef}>
          {user && <span className="hidden text-sm text-slate-300 xl:inline">Hi, {user.username}</span>}
          {!user && <Link to="/register" className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:inline-flex">Sign up</Link>}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open account and preferences menu"
          >
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black">{user?.username?.charAt(0).toUpperCase() || 'S'}</span>
            <span className="hidden sm:inline">{user ? 'Account' : 'Menu'}</span>
            <span aria-hidden="true" className={`text-xs transition-transform ${menuOpen ? 'rotate-180' : ''}`}>⌄</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-[1000] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" role="menu">
              <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">{user ? 'Your SafeSphere' : 'SafeSphere menu'}</p>
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{user ? user.username : 'Emergency help and preferences'}</p>
              </div>
              {menuLinks.map(([to, label]) => (
                <NavLink key={to} to={to} onClick={closeAndNavigate} className="block rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300" role="menuitem">{label}</NavLink>
              ))}
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <NavLink to="/how-it-works" onClick={closeAndNavigate} className="block rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800" role="menuitem">How it works</NavLink>
              <NavLink to="/safety-tips" onClick={closeAndNavigate} className="block rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800" role="menuitem">Safety tips</NavLink>
              <NavLink to="/faq" onClick={closeAndNavigate} className="block rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800" role="menuitem">FAQ & support</NavLink>
              <NavLink to="/about" onClick={closeAndNavigate} className="block rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800" role="menuitem">About SafeSphere</NavLink>
              <NavLink to="/first-aid" onClick={closeAndNavigate} className="block rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800" role="menuitem">First-aid education</NavLink>
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold">Appearance</span>
                <ThemeToggle compact inMenu />
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold">Text size</span>
                <AccessibilityToggle inMenu />
              </div>
              {user && <button onClick={() => { logout(); navigate('/'); closeAndNavigate() }} className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40" role="menuitem">Log out</button>}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
